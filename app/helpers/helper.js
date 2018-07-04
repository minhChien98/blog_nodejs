var bcrypt = require("bcrypt");
var config = require("config");

function hash_password(pass){
    var slatRounds = config.get("salt");
    var salt = bcrypt.genSaltSync(slatRounds);
    var hash = bcrypt.hashSync(pass,salt);

    return hash;
}

function compare_password(password,hash){
    return bcrypt.compare(password,hash);
}

module.exports = {
    hash_password: hash_password,
    compare_password: compare_password
}