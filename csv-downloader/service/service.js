const mysql = require('mysql2')

class database {

  constructor() {
    this.pool = mysql.createPool({
      host: "mysql",
      user: "root",
      password: "root_password",
      port: 3306,
      database: "my_database",
      waitForConnections: true,
      connectionLimit: 4
    });
    this.pool = this.pool.promise();
  }

  async createConnection() {
    try {
      await this.runQuery(
        "CREATE TABLE IF NOT EXISTS articles (id INT AUTO_INCREMENT PRIMARY KEY, heading TEXT NOT NULL, content TEXT NOT NULL)",
        (e)=>{
          throw e;
        }
      )
      console.log('successfully created database')
    } catch (e) {
      console.log("reconnecting to the mysql database ...",e );
      setTimeout(async ()=>{
       await this.createConnection()
      }, 5000);
    }
  }

  runQuery(query, errorHandler, successHandler) {
    return this.pool
      .query(query)
      .then(e => {
        console.log("query returned", e);
        typeof (successHandler) === 'function' && successHandler();
        return e;
      }).catch(e => {
        console.log('this is the error caused ' + e)
        if ((errorHandler) === 'function') errorHandler(e);
        else
        throw "error "+e;
      })
     }
  }

module.exports = {
  database: database
}