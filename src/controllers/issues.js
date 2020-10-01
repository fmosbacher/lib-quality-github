const githubService = require('../services/githubService');

const getStdLifetime = (lifeTimesInDays, averageLifetime, issuesCount) => {
  const variance = lifeTimesInDays
    .map((lifetime) => (lifetime - averageLifetime) ** 2)
    .reduce((a, b) => a + b) / issuesCount;

  return Math.sqrt(variance);
};

const getMetrics = async (req, res) => {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res
      .status(400)
      .json({ message: 'Route requires \'owner\' and \'repo\' in query params' });
  }

  try {
    const repoRes = await githubService.getRepo(owner, repo);
    const { open_issues_count: issuesCount } = repoRes.data;
    const pagesToFetch = Math.ceil(issuesCount / 100);
    const githubAPICalls = githubService.getIssues(owner, repo, pagesToFetch);
    const issues = (await Promise.all(githubAPICalls)).map((githubRes) => githubRes.data).flat();
    const lifeTimesInDays = issues.map((issue) => (
      (new Date() - new Date(issue.created_at)) / 1000 / 60 / 60 / 24
    ));
    const lifetimesSum = lifeTimesInDays.reduce((a, b) => a + b, 0);
    const avgLifetimeInDays = lifetimesSum / issues.length;
    const stdLifetimeInDays = getStdLifetime(lifeTimesInDays, avgLifetimeInDays, issuesCount);

    return res.json({
      issuesCount,
      avgLifetimeInDays,
      stdLifetimeInDays,
    });
  } catch (err) {
    const { response } = err;
    const { status, statusText } = response;
    return res.status(status).json({ message: statusText });
  }
};

module.exports = {
  getMetrics,
};
