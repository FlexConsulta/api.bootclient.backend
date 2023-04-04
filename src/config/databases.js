const { AsyncNedb } = require('nedb-async')
const Datastore = AsyncNedb

try {
      
      const Login = new Datastore({ filename: './settings/Setting.00.db', autoload: true });
      const BancoDados = new Datastore({ filename: './settings/Setting.01.db', autoload: true });
      const LogSincronizacao = new Datastore({ filename: './settings/Setting.02.db', autoload: true });
      const LogSincRemoto = new Datastore({ filename: './settings/Setting.03.db', autoload: true });
      const Company = new Datastore({ filename: './settings/Setting.04.db', autoload: true });
      
      module.exports = { BancoDados, LogSincronizacao, LogSincRemoto, Login, Company }
      
} catch (error) {
      console.log(error);
}

