import profileSource from './profile-source.json';

export interface Env {
  PROFILE_CACHE: KVNamespace;
}

const cacheKey = 'profile:latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/refresh') {
      const data = await buildProfile(env);
      await env.PROFILE_CACHE.put(cacheKey, JSON.stringify(data));
      return json(data);
    }

    if (url.pathname === '/profile') {
      const cached = await env.PROFILE_CACHE.get(cacheKey, 'json');
      if (cached) return json(cached);

      const data = await buildProfile(env);
      await env.PROFILE_CACHE.put(cacheKey, JSON.stringify(data));
      return json(data);
    }

    if (url.pathname === '/source') {
      return json(profileSource);
    }

    return json({ error: 'Use /profile, /refresh, or /source' }, 404);
  },

  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const data = await buildProfile(env);
    await env.PROFILE_CACHE.put(cacheKey, JSON.stringify(data));
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

async function buildProfile(env: Env) {
  const source = profileSource;
  const githubProfile = source.profiles.github;
  const leetcodeProfile = source.profiles.leetcode;
  const hackerrankProfile = source.profiles.hackerrank;

  const [github, leetcode] = await Promise.all([
    fetchGithub(githubProfile.username, githubProfile.url),
    fetchLeetCode(leetcodeProfile.username, leetcodeProfile.url)
  ]);

  return {
    name: source.name,
    role: source.role,
    location: source.location,
    summary: source.summary,
    headline: source.headline,
    stats: source.stats,
    skills: source.skills,
    github,
    leetcode,
    hackerrank: {
      username: hackerrankProfile.username,
      url: hackerrankProfile.url,
      badges: ['Java', 'Problem Solving', 'SQL']
    },
    linkedin: source.profiles.linkedin,
    experience: source.experience,
    education: source.education,
    projects: source.projects,
    links: source.links,
    lastUpdated: new Date().toISOString()
  };
}

async function fetchGithub(username: string, url: string) {
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'profile-data-worker' }
    });
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: { 'User-Agent': 'profile-data-worker' }
    });

    if (!userResponse.ok || !reposResponse.ok) throw new Error('GitHub request failed');

    const user: any = await userResponse.json();
    const repos: any[] = await reposResponse.json();

    return {
      username,
      url,
      repos: user.public_repos ?? repos.length,
      followers: user.followers ?? 0,
      stars: repos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0)
    };
  } catch {
    return { username, url, repos: 0, followers: 0, stars: 0 };
  }
}

async function fetchLeetCode(username: string, url: string) {
  try {
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
    if (!response.ok) throw new Error('LeetCode request failed');
    const data: any = await response.json();

    return {
      username,
      url,
      totalSolved: data.solvedProblem ?? data.totalSolved ?? 0,
      easySolved: data.easySolved ?? 0,
      mediumSolved: data.mediumSolved ?? 0,
      hardSolved: data.hardSolved ?? 0
    };
  } catch {
    return { username, url, totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
  }
}
