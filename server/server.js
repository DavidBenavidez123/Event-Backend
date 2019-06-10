const express = require("express");
const cors = require("cors");

const configureRoutes = require("../routes/routes");

const server = express();

server.use(express.json());
server.use(cors());

configureRoutes(server);

module.exports = {
  server
};
