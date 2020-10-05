const { githubService } = require('../services');
const db = require('../database');

const getMetrics = async (req, res) => {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ message: 'Route requires \'owner\' and \'repo\' in query params' });
  }

  try {
    const repos = await db.select('id').from('history_repos').where({ owner, name: repo });
    if (repos.length === 0) {
      return res.json([]);
    }

    const metrics = await db.select('*').from('history').where({ id_repo: repos[0].id });

    return res.json(metrics.map((metric) => ({
      createdAt: metric.created_at,
      count: metric.open_issues_count,
      avgLifetimeInDays: metric.avg_issues_lifetime,
      stdLifetimeInDays: metric.std_issues_lifetime,
    })));
  } catch (err) {
    return res.status(500).json({ message: 'Could not reach database' });
  }
};

const addRepoToHistory = async (req, res) => {
  const { owner, repo } = req.body;

  if (!owner || !repo) {
    return res.status(400).json({ message: 'Route requires \'owner\' and \'repo\' in body' });
  }

  try {
    // Check if repo exists
    await githubService.getRepo(owner, repo);
  } catch (err) {
    return res.status(err.response.status).json({ message: err.response.data.message });
  }

  try {
    const historyRepos = await db.select('id').from('history_repos').where({ owner, name: repo });

    if (historyRepos.length > 0) {
      return res.status(409).json({ message: 'Resource already exists' });
    }

    const [newRepo] = await db.insert({ owner, name: repo }).into('history_repos').returning('*');

    return res.status(201).json(newRepo);
  } catch (err) {
    return res.status(500).json({ message: 'Could not reach database' });
  }
};

const removeRepoFromHistory = async (req, res) => {
  const { owner, repo } = req.body;

  if (!owner || !repo) {
    return res.status(400).json({ message: 'Route requires \'owner\' and \'repo\' in body' });
  }

  try {
    await db.delete().from('history_repos').where({ owner, name: repo });
    return res.status(204).json();
  } catch (err) {
    return res.status(500).json({ message: 'Could not reach databse' });
  }
};

module.exports = {
  getMetrics,
  addRepoToHistory,
  removeRepoFromHistory,
};
