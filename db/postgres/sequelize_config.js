module.exports = {
  development: {
    username: process.env.PGUSER || 'postgres',
    password: '123456',
    database: 'new_spotlight',
    host: '192.168.1.101',
    dialect: 'postgres'
  },
  test: {
    username: process.env.PGUSER || 'postgres',
    password: '123456',
    database: 'new_spotlight',
   //database: 'spoptlight_dev',
    host: '192.168.1.101',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'POSTGRES_DB_URL',
    username: process.env.PGUSER || 'postgres',
    password: '123456',
    database: 'new_spotlight',
   // database: 'spoptlight_dev',
    host: '192.168.1.101',
    dialect: 'postgres'
  }
};
