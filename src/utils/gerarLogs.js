const { apiFlex } = require("../API/api");

const fnGerarLogs = async (cnpj_cliente, nome_arquivo, entidade) => {
  try {
    const dadosLogs = {
      cnpj_cliente,
      error: false,
      nome_arquivo,
      entidade,
    };

    await apiFlex.post(`/bootclient/log?cnpj=${cnpj_cliente}`, dadosLogs);
  } catch (error) {
    console.log({ error, where: "fnGerarLogs" });
  }
};

module.exports = { fnGerarLogs };