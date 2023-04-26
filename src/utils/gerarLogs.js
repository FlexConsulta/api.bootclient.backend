const { apiFlex } = require("../API/api");
const { formatarData } = require("./tratamento.dados");

const fnGerarLogs = async (dadosLogs) => {
  try {
    const d = await apiFlex.post(`/bootclient/log`, dadosLogs);
    d.data.data = await formatarData(d.data.data);
    return d.data
  } catch (error) {
    console.log({ erro: error && error.message ? JSON.stringify({ error: error.message }) : null, where: "fnGerarLogs" });
  }
};


const gerarLogsArquivos = async (data) => {
  try {
    const d = await apiFlex.post(`/bootclient/log/arquivos`, data);
    return d.data
  } catch (error) {
    console.log({ error: error?.toJSON() || error, where: "gerarLogsArquivos" });
  }
};

module.exports = { fnGerarLogs, gerarLogsArquivos };