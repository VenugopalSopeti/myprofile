import { Code2, GitBranch, Trophy } from 'lucide-react';

type Props = {
  github: { username: string; url?: string; repos: number; followers: number; stars: number };
  leetcode: { username: string; url?: string; totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number };
  hackerrank: { username: string; url?: string; badges: string[] };
};

export default function CodingStats({ github, leetcode, hackerrank }: Props) {
  const chartData = [
    { name: 'Easy', solved: leetcode.easySolved },
    { name: 'Medium', solved: leetcode.mediumSolved },
    { name: 'Hard', solved: leetcode.hardSolved }
  ];
  const maxSolved = Math.max(...chartData.map((item) => item.solved), 1);

  return (
    <section id="coding" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="terminal-line font-mono text-sm text-emerald-300">live stats</p>
      <h2 className="mt-2 text-3xl font-bold text-emerald-50">Coding Profiles</h2>
      <p className="mt-2 text-zinc-400">Stats are designed to come from the Cloudflare Worker cache.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <a
          href={github.url}
          target="_blank"
          rel="noreferrer"
          className="code-panel rounded-2xl p-6 transition hover:-translate-y-1 hover:border-emerald-300/50"
        >
          <GitBranch className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-4 text-xl font-bold text-emerald-50">GitHub</h3>
          <p className="font-mono text-zinc-400">@{github.username}</p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg border border-emerald-400/15 bg-black/50 p-3"><strong className="block text-emerald-50">{github.repos}</strong><span className="text-zinc-500">Repos</span></div>
            <div className="rounded-lg border border-emerald-400/15 bg-black/50 p-3"><strong className="block text-emerald-50">{github.followers}</strong><span className="text-zinc-500">Followers</span></div>
            <div className="rounded-lg border border-emerald-400/15 bg-black/50 p-3"><strong className="block text-emerald-50">{github.stars}</strong><span className="text-zinc-500">Stars</span></div>
          </div>
        </a>

        <a
          href={leetcode.url}
          target="_blank"
          rel="noreferrer"
          className="code-panel rounded-2xl p-6 transition hover:-translate-y-1 hover:border-emerald-300/50 md:col-span-2"
        >
          <Code2 className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-4 text-xl font-bold text-emerald-50">LeetCode</h3>
          <p className="font-mono text-zinc-400">@{leetcode.username} - {leetcode.totalSolved} solved</p>
          <div className="mt-5 flex h-56 items-end gap-3 rounded-lg border border-emerald-400/15 bg-black/50 p-4 sm:gap-5 sm:p-5">
            {chartData.map((item) => (
              <div key={item.name} className="flex h-full flex-1 flex-col justify-end">
                <div className="mb-3 text-center font-mono text-sm font-semibold text-emerald-50">{item.solved}</div>
                <div
                  className="min-h-3 rounded-t-lg bg-emerald-400 shadow-lg shadow-emerald-400/20"
                  style={{ height: `${(item.solved / maxSolved) * 100}%` }}
                  aria-label={`${item.name}: ${item.solved} solved`}
                  role="img"
                />
                <div className="mt-3 text-center text-xs text-zinc-400 sm:text-sm">{item.name}</div>
              </div>
            ))}
          </div>
        </a>

        <a
          href={hackerrank.url}
          target="_blank"
          rel="noreferrer"
          className="code-panel rounded-2xl p-6 transition hover:-translate-y-1 hover:border-emerald-300/50 md:col-span-3"
        >
          <Trophy className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-4 text-xl font-bold text-emerald-50">HackerRank</h3>
          <p className="font-mono text-zinc-400">@{hackerrank.username}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {hackerrank.badges.map((badge) => (
              <span key={badge} className="rounded-lg border border-emerald-400/15 bg-black/50 px-4 py-2 font-mono text-sm text-emerald-100">{badge}</span>
            ))}
          </div>
        </a>
      </div>
    </section>
  );
}
