// Update with your config settings.
const pg = require('pg');

const dbConnection = process.env.DATABASE_URL;

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/dev.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
      tableName: 'dbmigrations'
    }
  },
  production: {
    client: 'pg',
    connection: {
      dbConnection
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'dbmigrations'
    }
  }
};
