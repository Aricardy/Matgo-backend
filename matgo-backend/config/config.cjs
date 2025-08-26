require('dotenv').config();

module.exports = {
  development: {
    username: "root",
    password: "yDSljXERVwpjcGQTDtZccWciNosoooyU",
    database: "railway",
    host: "crossover.proxy.rlwy.net",
    port: 10392,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
};