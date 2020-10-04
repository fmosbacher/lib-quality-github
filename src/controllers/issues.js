const { githubService } = require('../services');
const db = require('../database');

const getMetrics = async (req, res, next) => {
  const { owner, repo, user } = req.query;

  if (!owner || !repo || !user) {
    return res
      .status(400)
      .json({ message: 'Route requires \'owner\', \'repo\' and \'user\' in query params' });
  }

  try {
    const count = await githubService.getIssuesCount(owner, repo);

    if (count === 0) {
      return res.json({
        count,
        avgLifetimeInDays: 0,
        stdLifetimeInDays: 0,
      });
    }

    const pagesToFetch = Math.ceil(count / 100);
    const lifetimesInDays = await githubService.getLifetimesInDays(owner, repo, pagesToFetch);
    const avgLifetimeInDays = await githubService.getIssuesAvgLifetime(lifetimesInDays, count);
    const stdLifetimeInDays = githubService
      .getIssuesStdLifetime(lifetimesInDays, avgLifetimeInDays, count);

    res.json({
      count,
      avgLifetimeInDays,
      stdLifetimeInDays,
    });

    return next();
  } catch (err) {
    return res.status(err.response.status).json({ message: err.response.data.message });
  }
};

const saveUserVisit = async (req) => {
  try {
    const { owner, repo, user } = req.query;
    let idUser;
    let idRepo;

    const users = await db.select('id').from('users').where({ name: user });

    if (users.length === 0) {
      const [newUser] = await db.insert({ name: user }).into('users').returning(['id']);
      idUser = newUser.id;
    } else {
      idUser = users[0].id;
    }

    const repos = await db.select('id').from('repos').where({ owner, name: repo });

    if (repos.length === 0) {
      const [newRepo] = await db.insert({ owner, name: repo }).into('repos').returning(['id']);
      idRepo = newRepo.id;
    } else {
      idRepo = repos[0].id;
    }

    await db.insert({ id_user: idUser, id_repo: idRepo }).into('searches');
  } catch (err) {
    console.log('Save user visit error');
  }
};

module.exports = {
  getMetrics,
  saveUserVisit,
};
