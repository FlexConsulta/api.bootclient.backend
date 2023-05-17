const dbLocal = require("db-local");
const { Schema } = new dbLocal({ path: "./databases" });

const tabInformacoes = Schema("tabInformacoes", {
  _id: { type: Number, required: true },
  data_empresa: { type: String, required: true },
  data: { type: String, required: true },
});

module.exports = { tabInformacoes };
