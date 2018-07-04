var q = require("q");
var db = require("../common/database");

var conn = db.getConnetion();

// function addUser(user){    
    
//     return new Promise((resolve, reject) => {
//        conn.query('insert into users set ?', user, function(err, result){
//             if(err)
//                 reject(err);
//             else
//                 resolve(result);
//         });
//     })
// }

function addUser(user){
    if(user){
        var defer = q.defer();
        conn.query('insert into users set ?', user, function(err, result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getUserByEmail(email){
    if(email){
        var defer = q.defer();
        var query = conn.query('select * from users where ?', {email: email}, function(err, result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getAllUser(){
    var defer = q.defer();
        var query = conn.query('select * from users ',function(err, posts){
            if(err)
                defer.reject(err);
            else
                defer.resolve(posts);
        });
        return defer.promise;
}


module.exports = {
    addUser : addUser,
    getUserByEmail: getUserByEmail,
    getAllUser: getAllUser
}