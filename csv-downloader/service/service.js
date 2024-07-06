const mysql = require('mysql2')
const knexsql = require('./knexsql').default
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
    this.knex1 = new knexsql();
  }

  async createConnection() {
    try {
      await this.knex1.knex.schema.hasTable('articles', (exits) => {
        if (!exits) {
          this.knex1.knex.schema.createTable((table) => {
            table.increments('id').primary()
            table.text('heading').notNullable()
            table.text('content').notNullable()
          })
        }
        else {
          console.log('table already exists!!')
        }
      })
      await this.knex1.knex.schema.hasTable('articles').then(res => {
        console.log('successfully connected by knex')
      })
    } catch (e) {
      console.log("reconnecting to the mysql database ...", e);
      setTimeout(async () => {
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
          throw "error " + e;
      })
  }
  getAllData() {
    return this.knex1.knex.select('id', 'heading', 'content').from('articles');
  }
  async streamData(id, response) {
    const query =  this.knex1.knex.select('*').from('articles');
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"'
    };

    response.writeHead(200, headers);
    query.stream()
    .on('data', row => {
      // Process each row from the database query
      const csvRow = `${row.id},${row.heading},${row.content}\n`; // Adjust fields based on your schema
      response.write(csvRow);
    })
    .on('end', () => {
      console.log('CSV data streamed successfully');
      response.end();
    })
    .on('error', err => {
      console.error('Error streaming CSV:', err);
      response.statusCode = 500;
      response.end('Internal Server Error');
    });
    response.status(400)
  }

}

module.exports = {
  database: database
}