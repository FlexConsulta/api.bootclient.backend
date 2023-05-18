const Motoristas = require("../../../src/controller/sincronizacao/motoristas.controller.js");
const Proprietarios = require("../../../src/controller/sincronizacao/proprietarios.controller.js");
const Veiculos = require("../../../src/controller/sincronizacao/veiculos.controller.js");
const Viagens = require("../../../src/controller/sincronizacao/viagens.controller.js");
const { dbObjectConnection } = require("../../mocks/dbObjectConnection.js");
const {
  sql_motoristas,
  sql_proprietarios,
  sql_veiculos,
  sql_viagens,
} = require("../../mocks/sqls.js");

describe("sync functions", () => {
  let sut;

  beforeEach(() => {
    sut = null;
  });

  // motoristas
  test("should be get news data from motoristas table when have no logs", async () => {
    sut = new Motoristas({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_motoristas,
      lastSyncDate: null,
    });
    expect(await sut).toBe(true);
  });

  test("should be get news data from motoristas table", async () => {
    sut = new Motoristas({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_motoristas,
      lastSyncDate: "2023-05-15 00:00",
    });
    expect(await sut).toBe(true);
  });

  // proprietarios
  test("should be get news data from proprietarios table when have no logs", async () => {
    sut = new Proprietarios({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_proprietarios,
      lastSyncDate: null,
    });
    expect(await sut).toBe(true);
  });

  test("should be get news data from proprietarios table", async () => {
    sut = new Proprietarios({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_proprietarios,
      lastSyncDate: "2023-05-15 00:00",
    });
    expect(await sut).toBe(true);
  });

  // veiculos
  test("should be get news data from veiculos table when have no logs", async () => {
    sut = new Veiculos({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_veiculos,
      lastSyncDate: null,
    });
    expect(await sut).toBe(true);
  });

  test("should be get news data from veiculos table", async () => {
    sut = new Veiculos({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_veiculos,
      lastSyncDate: "2023-05-15 00:00",
    });
    expect(await sut).toBe(true);
  });

  // viagens
  test("should be get news data from viagens table when have no logs", async () => {
    sut = new Viagens({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_viagens,
      lastSyncDate: null,
    });
    expect(await sut).toBe(true);
  });

  test("should be get news data from viagens table", async () => {
    sut = new Viagens({
      dbObjectConnection,
      cnpj_empresa: "22.686.175/0001-37",
      dbSQL: sql_viagens,
      lastSyncDate: "2023-05-15 00:00",
    });
    expect(await sut).toBe(true);
  });
});