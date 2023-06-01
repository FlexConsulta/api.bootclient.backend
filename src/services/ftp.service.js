'use strict';

const ftp = require('basic-ftp');
const fs = require('fs');

class FTPClient {
    constructor({ FTP_HOST, FTP_PORT, FTP_USER, FTP_PASSWORD, FTP_DIR }) {
        this.client = new ftp.Client(0);

        this.settings = {
            host: FTP_HOST,
            port: FTP_PORT,
            user: FTP_USER,
            password: FTP_PASSWORD,
            remote_dir: FTP_DIR
        };

        this.ObjectOnError = {}
    }

    upload(sourcePath, remotePath) {
        let self = this;

        return new Promise((resolve, reject) => {

            (async () => {

                try {


                    
                    
                    
                    console.log('==>  ',  `${this.settings.remote_dir}/${remotePath}`);
                    
                    const arquivo = fs.statSync(sourcePath)
                    const tamanhoArquivo = arquivo.size
                    
                    const porcentagem = (info) => ((info.bytes * 100) / tamanhoArquivo).toFixed(0)
                    
                    self.client.trackProgress(info => {
                        const contagem = porcentagem(info)
                    });
                    
                    
                    // self.client.ftp.verbose = true
                    
                    let access = await self.client.access(self.settings);
                    const dataStream = fs.createReadStream(sourcePath);
                    dataStream.on('error', (err) => {
                        reject(err);
                    });

                    let upload = await self.client.uploadFrom(dataStream, `${this.settings.remote_dir}/${remotePath}`);
                    self.client.close();
                    resolve(upload);


                } catch (err) {

                    console.log(err);
                }

            })();

        })
    }


    close() {
        this.client.close();
    }

    changePermissions(perms, filepath) {
        let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
        return this.client.send(cmd, false);
    }

}

module.exports = FTPClient;


