 class knexsql{
    constructor(){
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
}
module.exports = {
  default :knexsql
}