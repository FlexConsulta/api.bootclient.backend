<<<<<<< HEAD
const fs = require('fs');

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
            fs.unlink(caminho, (err) => {
                  if (err) throw err
            })

      }
}


module.exports = GerarArquivo
=======
const fs = require('fs');
const util = require('util');

const unlinkPromise = util.promisify(fs.unlink);

class GerarArquivo {

      constructor() { }

      async fnGeradorArquivo(dir, file, data) {

            if (!fs.existsSync(dir)) await fs.mkdir(dir);
            return await fs.writeFile(`${dir}${file}.txt`, data, (err) => {
                  if (err) throw err;
                 return true
            });
      }


      async fnRemoverArquivo(caminho) {
            try {
                  return await unlinkPromise(caminho);
            } catch (error) {
                  console.log('Ocorreu um erro ao excluir o arquivo:', error);
                 return true
            }
      }
}


module.exports = GerarArquivo




>>>>>>> joey.flex
