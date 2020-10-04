const axios = require('axios');

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  Accept: 'application/json',
  auth: {
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD,
  },
});

const getRepo = (owner, repo) => (
  githubAPI.get(`/repos/${owner}/${repo}`)
);

const getIssuesCount = async (owner, repo) => {
  const repoRes = await getRepo(owner, repo);
  const { open_issues_count: issuesCount } = repoRes.data;
  return issuesCount;
};

const getIssues = (owner, repo, pagesToFetch) => {
  const params = { state: 'open', per_page: 100, page: pagesToFetch };

  if (pagesToFetch > 0) {
    const url = `/repos/${owner}/${repo}/issues`;
    return getIssues(owner, repo, pagesToFetch - 1).concat(githubAPI.get(url, { params }));
  }

  return [];
};

const getLifetimesInDays = async (owner, repo, pagesToFetch) => {
  const githubAPICalls = getIssues(owner, repo, pagesToFetch);
  const issues = (await Promise.all(githubAPICalls)).map((githubRes) => githubRes.data).flat();
  return issues.map((issue) => (
    (new Date() - new Date(issue.created_at)) / 1000 / 60 / 60 / 24
  ));
};

const getIssuesAvgLifetime = async (issuesLifetimesInDays, issuesCount) => {
  const lifetimesSum = await issuesLifetimesInDays.reduce((a, b) => a + b, 0);
  return lifetimesSum / issuesCount;
};

const getIssuesStdLifetime = (issuesLifetimesInDays, averageLifetime, issuesCount) => {
  const variance = issuesLifetimesInDays
    .map((lifetime) => (lifetime - averageLifetime) ** 2)
    .reduce((a, b) => a + b, 0) / issuesCount;

  return Math.sqrt(variance);
};

module.exports = {
  getRepo,
  getIssuesCount,
  getLifetimesInDays,
  getIssuesAvgLifetime,
  getIssuesStdLifetime,
};
