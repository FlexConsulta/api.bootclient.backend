const NODE_ENV = process.env.NODE_ENV.trim()

module.exports = () => {
    switch (NODE_ENV) {
        case 'production': return require('../../.env.prod.js');
        case 'development': return require('../../.env.dev.js');
        case 'testing': return require('../../.env.homolog.js');
    }
}
