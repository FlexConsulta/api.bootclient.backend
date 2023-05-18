const { encryptLocal, decryptLocal } = require("../../src/utils/cryptoInformacoes");

describe('Encrypt e decrypt local', () => {
    test("the decryptLocal should be able to decript a mensager encipted by encryptLocal", () => {
        const msg = 'hello world';
        const dataEncrypted = encryptLocal(msg);
        const dataDecrypted = decryptLocal(dataEncrypted);
        expect(dataDecrypted).toEqual(msg);
    });
})