const db = require('../database');
const { githubService } = require('../services');

const saveHistory = async () => {
  try {
    const repos = await db.select(['id', 'owner', 'name']).from('history_repos');

    const historyInsertions = repos.map(async ({ id: idRepo, owner, name: repo }) => {
      const count = await githubService.getIssuesCount(owner, repo);
      const pagesToFetch = Math.ceil(count / 100);
      const lifetimes = await githubService.getLifetimesInDays(owner, repo, pagesToFetch);
      const avgLifetime = await githubService.getIssuesAvgLifetime(lifetimes, count);
      const stdLifetime = githubService.getIssuesStdLifetime(lifetimes, avgLifetime, count);

      const newHistory = {
        id_repo: idRepo,
        open_issues_count: count,
        avg_issues_lifetime: avgLifetime,
        std_issues_lifetime: stdLifetime,
      };

      return db.insert(newHistory).into('history');
    });

    await Promise.all(historyInsertions);
  } catch (err) {
    console.log('Cron schedule save history error');
  }
};

module.exports = {
  saveHistory,
};
