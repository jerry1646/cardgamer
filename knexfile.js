require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME,
      port     : process.env.DB_PORT,
      ssl      : process.env.DB_SSL
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: "postgres: //wgxoswdulxcatc:7974edde130775862bf7757fed1bc9d4d9db90748405d400ceee706e4253ca70@ec2-54-204-14-96.compute-1.amazonaws.com:5432/d65aipjv695b7v" + '?ssl=true',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    }
  }

};
