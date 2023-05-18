const moment = require("moment");
require("moment-timezone");
const fnGerarLogs = require("../../../src/utils/gerarLogs.js");
const getInfoCompany = require("../../../src/utils/get.info.company.js");
const sequelizePostgres = require("../../../src/services/sequelize.service.js");
const ConexaoDbCliente = require("../../../src/controller/coletar.informacoes/conexaoDbCliente.js");

jest.mock("../../../src/utils/get.info.company.js");
jest.mock("../../../src/utils/gerarLogs.js");
jest.mock("../../../src/services/sequelize.service.js");

describe("ConexaoDbCliente", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve chamar getInfoCompany", async () => {
    const conexaoDbCliente = new ConexaoDbCliente();
    await conexaoDbCliente.start();

    expect(getInfoCompany).toHaveBeenCalled();
  });

test("deve chamar fnGerarLogs", async () => {
  const spyFnGerarLogs = jest.spyOn(fnGerarLogs, "fnGerarLogs");

  const conexaoDbCliente = new ConexaoDbCliente();
  await conexaoDbCliente.start();

  expect(spyFnGerarLogs).toHaveBeenCalled();

});
});