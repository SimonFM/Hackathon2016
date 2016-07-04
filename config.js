var Simplify = require('simplify-commerce');
// constructor
function config() {
}

module.exports = config;

config.mongoUri = 'mongodb://localhost:27017/test';

config.SimplifyPay = Simplify.getClient({
    publicKey: 'sbpb_NWVkNzAxMDctYmI4MS00N2Y5LThkYzAtYTU5NjgzZjI3ZTA5',
    privateKey: 'XzPJNTgI8l12CzmrpS9EFGf85MJtiDejlN2JwGfw45h5YFFQL0ODSXAOkNtXTToq'
});
