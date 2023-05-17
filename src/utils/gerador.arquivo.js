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