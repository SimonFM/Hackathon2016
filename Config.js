var Simplify = require('simplify-commerce');

// constructor
function config() {
}

module.exports = config;

config.mongoUri = 'insert URL';


config.SimplifyPay = Simplify.getClient({
    publicKey: 'simplify key',
    privateKey: 'simplify key'
});;
