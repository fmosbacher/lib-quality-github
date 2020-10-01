const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

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

const getIssues = (owner, repo, pagesToFetch) => {
  const params = { state: 'open', per_page: 100, page: pagesToFetch };

  if (pagesToFetch > 0) {
    const url = `/repos/${owner}/${repo}/issues`;
    return getIssues(owner, repo, pagesToFetch - 1).concat(githubAPI.get(url, { params }));
  }

  return [];
};

module.exports = {
  getRepo,
  getIssues,
};
