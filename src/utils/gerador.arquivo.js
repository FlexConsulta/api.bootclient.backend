const fs = require('fs');
const moment = require('moment');
const { pegarUmaEmpresa } = require('../models/empresa');

class GerarArquivo {

      constructor() { }

      async fnGeradorArquivos(arr, tipo, pasta) {
            let resultado = await pegarUmaEmpresa({})
            if (resultado) resultado = resultado.cnpj.replace(/\D/g, "");
            const nomeArquivo = `${tipo}_${resultado}_${moment().valueOf()}`
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