const axios = require("axios");
const { API } = process.env

const apiURLs = {
  development: "http://127.0.0.1:3333/_api",
  production: API,
};

// const apiFlex = axios.create({baseURL: apiURLs.development});
const apiFlex = axios.create({ baseURL: apiURLs.production });

module.exports = { apiFlex };
