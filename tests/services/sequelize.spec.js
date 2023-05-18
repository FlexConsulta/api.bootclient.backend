const SequelizeFunctions = require("../../src/services/sequelize.service");
const { dbObjectConnection } = require("../mocks/dbObjectConnection.js");

describe("Sequelize functions", () => {
  const sequelizeDbConnection = new SequelizeFunctions(dbObjectConnection);

  test("should be true when a connection is established with the database", async () => {
    const sut = await sequelizeDbConnection.testarConexao();
    expect(sut).toBe(true);
  });

  test("Must get data from SQL query", async () => {
    const sql = "SELECT * FROM conhecimento LIMIT 2";
    const dados = await sequelizeDbConnection.obterDados(sql);

    expect(Array.isArray(dados)).toBe(true);
    expect(dados.length).toBeGreaterThan(0);
  });
});