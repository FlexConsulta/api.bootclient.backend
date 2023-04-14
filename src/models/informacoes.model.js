const { tabInformacoes } = require("../config/db.local")
const moment = require("moment");
const { encryptLocal, decryptLocal } = require("../utils/cryptoInformacoes");

const createInfo = async (data_empresa) => {
  if (data_empresa) removeInfo(1);
  data_empresa = await encryptLocal(data_empresa);
  const newInfo = await tabInformacoes
    .create({
      _id: 1,
      data: `Registrado em: ${moment().format("LLL")}`,
      data_empresa,
    })
    .save();
  return newInfo;
};

const getInfo = async () => {
  const data = await tabInformacoes.findOne({_id: 1});
  if (!data || data?.length == 0) return null;
  data.data_empresa = await decryptLocal(data.data_empresa);
  return data;
};

const removeInfo = async (_id) => {
  return await tabInformacoes.remove({ _id });
};

module.exports = { createInfo, getInfo };
