const fs = require('fs');
const moment = require('moment');

class GerarArquivo {

      constructor() { }

      async fnGeradorArquivos(arr, tipo, CNPJ, pasta) {
            CNPJ = CNPJ.replace(/\D/g, "");
            const nomeArquivo = `${tipo}_${CNPJ}_${moment().valueOf()}`;
            this.fnGeradorArquivo(pasta, nomeArquivo, arr)
      }

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