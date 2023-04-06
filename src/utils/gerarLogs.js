const { apiFlex } = require("../API/api");

const fnGerarLogs = async (cnpj_cliente, nome_arquivo, error, entidade, quantidade) => {
  try {
    const dadosLogs = {
      cnpj_cliente,
      error,
      nome_arquivo,
      entidade,
      categoria: "sync concluida",
      mensagem: "Tudo certo!",
      quantidade: String(quantidade),
    };

    await apiFlex.post(`/bootclient/log`, dadosLogs);
    console.log({dadosLogs});
  } catch (error) {
    console.log({ error, where: "fnGerarLogs" });
  }
};

module.exports = { fnGerarLogs };