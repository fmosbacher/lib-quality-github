const knex = require('knex');
const dbConfigs = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const envOptions = dbConfigs[env];

module.exports = knex(envOptions);
