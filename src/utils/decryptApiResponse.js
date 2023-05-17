const crypto = require("crypto");
const { KEY_CRIPT, IV_CRIPT } = process.env;

const decryptApiResponse = (data) => {
    const iv = Buffer.from(IV_CRIPT, "hex");
    const decipher = crypto.createDecipheriv( "aes-256-cbc", Buffer.from(KEY_CRIPT), iv );
    let decrypted = decipher.update(Buffer.from(data, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const decryptedJson = JSON.parse(decrypted.toString());
    return decryptedJson;
};

module.exports = { decryptApiResponse };
