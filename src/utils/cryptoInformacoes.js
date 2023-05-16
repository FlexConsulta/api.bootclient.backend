const crypto = require("crypto")
const CryptoJS = require("crypto-js");
const { KEY_CRIPT_LOCAL, IV_CRIPT } = process.env;
const key = crypto.createHash('sha256').update(String(KEY_CRIPT_LOCAL)).digest('base64').substr(0, 32);

const encryptLocal = (data) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return encrypted;
};

const decryptLocal = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};


module.exports = { encryptLocal, decryptLocal };