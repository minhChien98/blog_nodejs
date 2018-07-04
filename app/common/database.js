var config = require("config");
var mysql = require("mysql");

var connetion = mysql.createConnection({
    host : config.get("mysql.host"),
    user : config.get("mysql.user"),
    password : config.get("mysql.password"),
    database : config.get("mysql.database"),
    port: config.get("mysql.port"),    
});

connetion.connect();

function getConnetion(){
    if(!connetion)
        connetion.connect();
    return connetion;
}
module.exports = {
    getConnetion: getConnetion
}