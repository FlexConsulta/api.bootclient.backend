const Motoristas = require("../../../src/controller/coleta.dados.estatisticos/motoristas.js");
const Proprietarios = require("../../../src/controller/coleta.dados.estatisticos/proprietarios.js");
const Veiculos = require("../../../src/controller/coleta.dados.estatisticos/veiculos.js");
const Viagens = require("../../../src/controller/coleta.dados.estatisticos/viagens.js");
const { dbObjectConnection } = require("../../mocks/dbObjectConnection.js");
const {
  sql_motoristas,
  sql_proprietarios,
  sql_veiculos,
  sql_viagens,
} = require("../../mocks/sqls.js");

describe("coleta de dados estatisticos", () => {
  let sut;

  beforeEach(() => {
    sut = null;
  });

  // motoristas
  test("coleta de dados estatisticos to motoristas table", async () => {
    sut = new Motoristas({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_motoristas,
    });
    expect(await sut).toBe(true);
  });

  // proprietarios
  test("coleta de dados estatisticos to proprietarios table", async () => {
    sut = new Proprietarios({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_proprietarios,
    });
    expect(await sut).toBe(true);
  });

  // veiculos
  test("coleta de dados estatisticos to veiculos table", async () => {
    sut = new Veiculos({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_veiculos,
    });
    expect(await sut).toBe(true);
  });

  // viagens
  test("coleta de dados estatisticos to viagens table", async () => {
    sut = new Viagens({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_viagens,
    });
    expect(await sut).toBe(true);
  }, 35000);
});