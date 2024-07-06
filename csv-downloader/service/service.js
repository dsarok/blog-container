class database {

  constructor() {
  this.knex = require('knex')({
      client: 'mysql2',
      connection: {
        host: 'mysql',
        port: 3306,
        user: 'root',
        password: 'root_password',
        database: 'my_database',
      },
    });
   
  }
  async addData(heading,content){
    await this.knex('articles').insert({heading:heading,content:content})
  }
  async createConnection() {
    try {
      await this.knex.schema.hasTable('articles').then(exists => {
        if (!exists) {
         return this.knex.schema.createTable('articles',(table) => {
            table.increments('id').primary()
            table.text('heading').notNullable()
            table.text('content').notNullable()
          }).then(res=>{
            console.log('table articles created successfully')
          })
        }
        else {
          console.log('table already exists!!')
        }
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
    return this.knex.select('id', 'heading', 'content').from('articles');
  }
  async streamData(id, response) {
    const query =  this.knex.select('*').from('articles');
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"'
    };

    response.writeHead(200, headers);
    query.stream()
    .on('data', row => {
      // Process each row from the database query
      setTimeout(()=>{
        const csvRow = `${row.id},${row.heading},${row.content}\n`; // Adjust fields based on your schema
        response.write(csvRow);
      },1000)
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
    response.status(400);
  }

}

module.exports = {
  database: database
}