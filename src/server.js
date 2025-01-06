const http = require("http");
//env config
const dotenv = require('dotenv');
dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, console.log(`[-]server started on port [${PORT}]`));


//dotenv here is used to configure the .env file so the we can access the variable which are present in .env