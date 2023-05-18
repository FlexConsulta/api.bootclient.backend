const Motoristas = require("../../../src/controller/verificar.entidades/motoristas.controller.js");
const Proprietarios = require("../../../src/controller/verificar.entidades/proprietarios.controller.js");
const Veiculos = require("../../../src/controller/verificar.entidades/veiculos.controller.js");
const Viagens = require("../../../src/controller/verificar.entidades/viagens.controller.js");
const { dbObjectConnection } = require("../../mocks/dbObjectConnection.js");
const { sql_motoristas, sql_proprietarios, sql_veiculos, sql_viagens } = require("../../mocks/sqls.js");

describe("verificar entidades functions", () => {

  // motoristas
  test("verificar entidades from motoristas table", async () => {
    const sut = await new Motoristas({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_motoristas,
    });
    expect(sut).toBe(true);
  });

  // proprietarios
  test("verificar entidades from proprietarios table", async () => {
    const sut = await new Proprietarios({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_proprietarios,
    });
    expect(sut).toBe(true);
  });

  // veiculos
  test("verificar entidades from veiculos table", async () => {
    const sut = await new Veiculos({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_veiculos,
    });
    expect(sut).toBe(true);
  });

  // viagens
  test("verificar entidades from viagens table", async () => {
    const sut = await new Viagens({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_viagens,
    });
    expect(sut).toBe(true);
  });
});
