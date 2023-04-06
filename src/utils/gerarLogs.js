const { apiFlex } = require("../API/api");

const fnGerarLogs = async (dadosLogs) => {
  try {
    await apiFlex.post(`/bootclient/log`, dadosLogs);
    console.log({ dadosLogs });
  } catch (error) {
    console.log({ error: error?.toJSON() || error, where: "fnGerarLogs" });
  }
};

module.exports = { fnGerarLogs };