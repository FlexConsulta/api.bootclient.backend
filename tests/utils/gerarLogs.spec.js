const { fnGerarLogs, gerarLogsArquivos } = require("../../src/utils/gerarLogs");
const { apiFlex } = require("../../src/API/api");

describe("gerar logs funtions", () => {
  let apiPostSpy;

  beforeEach(() => {
    apiPostSpy = jest.spyOn(apiFlex, "post");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deve chamar corretamente a função fnGerarLogs", async () => {
    const dadosLogs = {
      cnpj_cliente: "123456789",
      nome_arquivo: null,
      error: false,
      entidade: null,
      quantidade: null,
      categoria: "TESTE_fnGerarLogs",
      data: "2023-05-16 10:30:00",
      mensagem: "O TESTE OCORREU NORMAL",
    };

    await fnGerarLogs(dadosLogs);
    expect(apiPostSpy).toHaveBeenCalledTimes(1);
  });

  test("deve chamar corretamente a função gerarLogsArquivos", async () => {
    const dadosArquivos = {
      cnpj_cliente: "123456789",
      quantidade_arquivos: 0,
      nomes_arquivos: "",
      data: "2023-05-16 10:30:00",
    };

    await gerarLogsArquivos(dadosArquivos);
    expect(apiPostSpy).toHaveBeenCalledTimes(1);
  });
});