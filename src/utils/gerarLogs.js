const { apiFlex } = require("../API/api");

const fnGerarLogs = async (dadosLogs) => {
  try {
    const d = await apiFlex.post(`/bootclient/log`, dadosLogs);
    return d.data
  } catch (error) {
    console.log({ error: error?.toJSON() || error, where: "fnGerarLogs" });
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