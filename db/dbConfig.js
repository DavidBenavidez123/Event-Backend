// knex
const dbEngine = process.env.DB || 'development';
const knex = require('../knexfile.js')[dbEngine];

module.exports = require('knex')(knex);
