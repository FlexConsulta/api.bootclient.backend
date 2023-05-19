// process.env = { ...process.env, ...require('../.env.js') }
require('dotenv').config({path: './.env'})
const moment = require('moment')
moment.suppressDeprecationWarnings = true;

const http = require('http')
const app = require('./app')

const normalizePort = val => {

    const port = parseInt(val, 10);
    if (isNaN(port)) return val
    if (port >= 0) return port
    return false

}

const HOST = '0.0.0.0'

const PORT = normalizePort('4001')
app.set('port', PORT)



const server = http.createServer(app)


const errorHandler = (error) => {
    if (error.syscall !== 'listen') throw error;

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + PORT

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} Requer altos privilêgios.`);
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(`${bind} já em uso.`);
            process.exit(1);
            break;

        default:
            throw error
    }

}

server.on('error', errorHandler);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + PORT
    console.log(`[:] Servidor Online porta: ${bind}`);
})

server.listen(PORT, HOST)