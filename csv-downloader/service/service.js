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
  async addData(heading, content) {
    await this.knex('articles').insert({ heading: heading, content: content })
  }
  async createConnection() {
    try {
      await this.knex.schema.hasTable('articles').then(exists => {
        if (!exists) {
          return this.knex.schema.createTable('articles', (table) => {
            table.increments('id').primary()
            table.text('heading').notNullable()
            table.text('content').notNullable()
          }).then(res => {
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
  async getAllData(res) {
    try {
      const data = await this.knex.select('id', 'heading', 'content').from('articles');
      res.render('pages/blogs', { data: data });
    } catch (e) {
      res.sendStatus(500);
    }
  }
  async streamData(id, response) {
    try {
      const query = this.knex('articles').where('id', id).select('*')
      const filename = await this.knex('articles')
        .where('id', id)
        .select('heading')
        .then(val => val[0].heading);

      const headers = {
        'Content-Type': 'text/csv',
        'filename': filename
      };
      response.writeHead(200, headers);
      const stream = query.stream();
      let heading="";
      stream
        .on('data', async row => {
          if (heading == "") {
            heading = Object.keys(row).join(',');
            heading= heading + "\n"
            response.write(heading)
          }
          let csvValue = "";
          let firstkey = false;
         
          for (const key in row) {
            csvValue = csvValue + (firstkey) && `,`  + String(row[key]) 
            firstkey = true;
          }
          if (csvValue.length > 0) {
            csvValue = csvValue.trimEnd()
          }
          csvValue = csvValue + "\n";
          response.write(csvValue);
        })
      stream
        .on('end', () => {
          console.log('CSV data streamed successfully');
          response.end();
        })
      stream
        .on('error', err => {
          console.error('Error streaming CSV:', err);
          response.statusCode = 500;
          response.end('Internal Server Error');
        });
        
    } catch (e) {
      response.status('catching error', e);
      response.end();
    }
    return;
  }

}

module.exports = {
  database: database
}