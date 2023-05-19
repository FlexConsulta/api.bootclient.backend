const fs = require('fs');
const util = require('util');

const unlinkPromise = util.promisify(fs.unlink);

class GerarArquivo {

      constructor() { }

      async fnGeradorArquivo(dir, file, data) {

            if (!fs.existsSync(dir)) await fs.mkdirSync(dir);
            await fs.writeFileSync(`${dir}${file}.txt`, data, (err) => {
                  if (err) throw err;
                  console.log(`Arquivo [${file}] gerado com sucesso.`);
            });
      }


      async fnRemoverArquivo(caminho) {
            try {
                  await unlinkPromise(caminho);
                  console.log('O arquivo foi excluído com sucesso.');
            } catch (error) {
                  console.log('Ocorreu um erro ao excluir o arquivo:', error);
            }
      }
}


module.exports = GerarArquivo




