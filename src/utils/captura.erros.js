module.exports = error => {

      process.on('uncaughtException', (error, origin) => {
            console.log(`Lançou uma uncaughtException: ${error}`);
            console.log(`Origem: ${origin}`);
            process.exit(1)
      });

      process.on('warning', (warning) => {
            console.warn('O processo lançou um aviso: ', warning.message);
      });

      process.on('unhandledRejection', (error, promise) => {
            console.log(`Um Promise.reject não tratado: ${promise}. Error: ${error}`);
      });

      if (error.syscall !== 'listen') throw error;

      const address = server.address();
      const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + PORT

      switch (error.code) {
            case 'EACCES':
                  console.error(`${bind} Requer altos privilêgios.`);
                  process.exit(1);
                  break;

            case 'EADDRINUSE':
                  console.error(`${bind} já em uso.`);
                  process.exit(1);
                  break;

            default:
                  throw error
      }


}
