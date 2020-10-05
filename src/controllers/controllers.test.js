const request = require('supertest');
const app = require('..');

describe('GET /history?owner=<owner>&repo=<repo>', () => {
  it('get the metrics history', (done) => {
    request(app)
      .get('/history?owner=fmosbacher&repo=lib-quality-github')
      .expect(200, done);
  });

  it('warn about query params', (done) => {
    request(app)
      .get('/history?repo=lib-quality-github')
      .expect(400, done);
  });
});

describe('POST /history/repo', () => {
  it('insert new repo to history', (done) => {
    request(app)
      .post('/history/repo')
      .send({ owner: 'fmosbacher', repo: 'lib-quality-github' })
      .expect(201, done);
  });

  it('warn about body content', (done) => {
    request(app)
      .post('/history/repo')
      .send({ owner: 'fmosbacher' })
      .expect(400, done);
  });

  it('warn about duplicate insertion', (done) => {
    request(app)
      .post('/history/repo')
      .send({ owner: 'fmosbacher', repo: 'lib-quality-github' })
      .expect(409, done);
  });
});

describe('DELETE /history/repo', () => {
  it('delete repo from history', (done) => {
    request(app)
      .delete('/history/repo')
      .send({ owner: 'fmosbacher', repo: 'lib-quality-github' })
      .expect(204, done);
  });

  it('warn about body content', (done) => {
    request(app)
      .delete('/history/repo')
      .send({ owner: 'fmosbacher' })
      .expect(400, done);
  });
});

describe('GET /issues?owner=<owner>&repo=<repo>&user=<user>', () => {
  it('get the metrics', (done) => {
    request(app)
      .get('/issues?owner=fmosbacher&repo=lib-quality-github&user=fernando')
      .expect(200, done);
  });

  it('warn about query params', (done) => {
    request(app)
      .get('/issues?repo=lib-quality-github&user=fernando')
      .expect(400, done);
  });
});
