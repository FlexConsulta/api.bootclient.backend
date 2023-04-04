const crypto = require('crypto');


const encryptedData = async (data) => {
      return new Promise(resolve => {
            try {

                  data = JSON.stringify(data)
                  data = Buffer.from(data, 'base64').toString()
                  resolve(data);

            } catch (error) {
                  console.log('Não foi possivel decriptar os dados!');
            }
      })

}

module.exports = { encryptedData }