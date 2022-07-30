

// const DB_USERNAME = 'lenteral_jobfairadmin';
// const DB_PASSWORD = 'Cgq4sLWge(~l';
// const DB_NAME = 'lenteral_jobfair';
// const DB_HOST = '103.150.60.234';
// const DB_DIALECT = 'mysql';

const DB_USERNAME = 'root';
const DB_PASSWORD = '';
const DB_NAME = 'jobfair';
const DB_HOST = 'localhost';
const DB_DIALECT = 'mysql';


module.exports = {
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect":  DB_DIALECT
  },
  "test": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect":  DB_DIALECT
  },
  "production": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect":  DB_DIALECT
  }
}
