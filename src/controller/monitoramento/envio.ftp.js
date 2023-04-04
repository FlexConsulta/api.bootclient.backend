const ftp = require('../../services/ftp.service');
const { pegarUmaEmpresa } = require('../../models/empresa');

function envioFtp(value) {
      return new Promise(async (resolve, reject) => {

            try {

                  const infoEmpresa = await pegarUmaEmpresa()

                  if (!infoEmpresa) return;

                  const data_ftp = {
                        FTP_HOST: infoEmpresa.hostftp,
                        FTP_PORT: infoEmpresa.portaftp,
                        FTP_USER: infoEmpresa.usuarioftp,
                        FTP_PASSWORD: infoEmpresa.senhaftp,
                        FTP_DIR: infoEmpresa.dirftp,
                  }

                  if (!data_ftp?.FTP_HOST || !data_ftp?.FTP_PORT || !data_ftp?.FTP_USER || !data_ftp?.FTP_PASSWORD) throw new Error("Os parâmetros FTP estão incompletos!")

                  const client = new ftp(data_ftp);
                  const fileName = value.split('/')[1]
                  value = './' + String(value).replace(/\\/g, "/");
                  const data = await client.upload(value, fileName, 755);
                  resolve({ data, client });

            } catch (error) {
                  console.log(error?.message || error);
            }

      })
}


module.exports = envioFtp