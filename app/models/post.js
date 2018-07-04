var q = require("q");
var db = require("../common/database");

var conn = db.getConnetion();
function getAllPost(){
    var defer = q.defer();
        var query = conn.query('select * from posts ',function(err, posts){
            if(err)
                defer.reject(err);
            else
                defer.resolve(posts);
        });
        return defer.promise;
}

function addPost(params){
    if(params){
        
        var defer = q.defer();
        var query = conn.query('insert into posts set  ?', params, function(err, result){
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
}

function getPostById(id){
    var defer = q.defer();
    var query = conn.query('select * from posts where ?',{id:id},function(err, posts){
        if(err)
            defer.reject(err);
        else
            defer.resolve(posts);
    });
    return defer.promise;
}

function updatePost(params){
    if(params){
        
        var defer = q.defer();
        var query = conn.query('update posts set title = ?, content = ?, author = ?, updated_at = ?  where id=?', [params.title,params.content,params.author,new Date(), params.id], function(err, result){
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
}

function deletePost(post_id){
    if(post_id){
        
        var defer = q.defer();
        var query = conn.query('delete from posts where id=?', [post_id], function(err, result){
            if(err)
                defer.reject(err);
            else
                defer.resolve(result);
        });
        return defer.promise;
    }
    return false;
}

module.exports = {
    getAllPost: getAllPost,
    addPost: addPost,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePost: deletePost
}