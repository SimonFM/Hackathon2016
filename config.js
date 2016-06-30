var Simplify = require('simplify-commerce');
// constructor
function config() {
}

module.exports = config;

config.mongoUri = 'mongodb://mchackathon:pass123@ds041150.mlab.com:41150/mchackathon2016';

config.SimplifyPay = Simplify.getClient({
    publicKey: 'sbpb_NWVkNzAxMDctYmI4MS00N2Y5LThkYzAtYTU5NjgzZjI3ZTA5',
    privateKey: 'XzPJNTgI8l12CzmrpS9EFGf85MJtiDejlN2JwGfw45h5YFFQL0ODSXAOkNtXTToq'
});
