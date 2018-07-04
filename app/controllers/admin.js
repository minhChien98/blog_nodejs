var express = require("express");

var router = express.Router();

var user_md =require("../models/user");
var helper = require("../helpers/helper");
var post_md = require("../models/post");

router.get("/", function(req,res){
    //res.json({"messenge": "This is Admin Page"});
    if(req.session.user){

        var data = post_md.getAllPost();
        data.then(function(posts){
            var data = {
                posts: posts,
                error: false
            };
            res.render("admin/dashboard", {data: data});
        })
        .catch(function(err){
            res.render("admin/dashboard", {data: {error : "Lỗi tải bài đăng"}});
        });
    }else{
        res.redirect("/admin/signin"); 
    }
});

router.get("/signup", function(req,res){
    res.render("signup", {data: {}});
});

router.post("/signup",   function(req, res){
    var user = req.body;

    if(user.email.trim().length == 0)
        res.render("signup", {data: {error: "Mời nhập Email!"}});

    if(user.passwd != user.repasswd && user.passwd.trim().length != 0)
        res.render("signup", {data: {error: "Mật khẩu không trùng nhau!"}});   

    //insert db
    var password = helper.hash_password(user.passwd);
    var now = new Date;
    
    user={
        email: user.email,
        password: password,
        first_name: user.firstname,
        last_name: user.lastname
    };
    user.created_at = now;
    user.updated_at = now;
    var result = user_md.addUser(user);

    result.then(function(data){
        res.redirect("/admin/signin");
    }).catch(function(err){
        console.log('run here');
        console.log(err);
            res.render("signup", {data: {error: "Không thêm được user"}});
        });


});

router.get("/signin", function(req,res){
    res.render("signin", {data:{}});
});

router.post("/signin", function(req,res){
    var params = req.body;

    if(params.email.trim().length==0)
        res.render("signin", {data:{error:"Vui lòng nhập email!"}});
    else{
        var data = user_md.getUserByEmail(params.email);
        if(data){
            data.then(function(users){
                var user = users[0];
                var status = helper.compare_password(params.password,user.password);
                if(!status){
                    res.render("signin", {data:{error:"Bạn đã nhập sai mật khẩu!"}});
                }else{
                    req.session.user = user;
                    res.redirect("/admin");
                }
            })
        }else{
            res.render("signin", {data:{error:"Tài khoản không tồn tại!"}});
        }
    }
})

router.get("/post/new", function(req,res){
    if(req.session.user){
        res.render("admin/post/new", {data:{error:false}});
    }else{
        res.redirect("/admin/signin"); 
    }
    
});

router.post("/post/new", function(req,res){
    if(req.session.user){
            var params = req.body;

        if(params.title.trim().length == 0){
            var data = {
                error : "Mời nhập tiêu đề!"
            };
            res.render("admin/post/new",{data:data} );
        }else{
            var now = new Date;
            params.created_at = now;
            params.updated_at = now;
        
            var data = post_md.addPost(params);
            data.then(function(result){
                res.redirect("/admin");
            })
            .catch(function(err){
                var data = {
                    error: "Thêm không thành công!"
                };
                res.render("admin/post/new", {data:data});
            });
    }
    }else{
        res.redirect("/admin/signin"); 
    }
    
});

router.get("/post/edit/:id",function(req,res){
    if(req.session.user){
            var params = req.params;
        var id = params.id;
        var data = post_md.getPostById(id);
        if(data){
            data.then(function(posts){
                var post = posts[0];
                var data = {
                    post: post,
                    error: false
                };
                res.render("admin/post/edit",{data:data});
            }).catch(function(err){
                console.log(err);
                var data = {
                    error : "Không thể lấy post bằng ID"
                }
                res.render("admin/post/edit",{data:data});
            });
        }else{
            var data = {
                error : "Không thể lấy post bằng ID"
            };
            res.render("admin/post/edit",{data:data});
        }
    }else{
        res.redirect("/admin/signin"); 
    }
    
});


router.put("/post/edit", function(req,res){
    if(req.session.user){
        var params= req.body;
        var data = post_md.updatePost(params);
        if(!data){
            res.json({status_code: 500});
        }else{
            data.then(function(result){
                res.json({status_code: 200});
            }).catch(function(err){
                res.json({status_code: 500});
        });
    }
    }else{
        res.redirect("/admin/signin"); 
    }
    
});

router.delete("/post/delete", function(req,res){
    if(req.session.user){
        var post_id = req.body.id;
        var data = post_md.deletePost(post_id);
        if(!data){
            res.json({status_code: 500});
        }else{
            data.then(function(result){
                res.json({status_code: 200});
            }).catch(function(err){
                res.json({status_code: 500});
            });
    }
    }else{
        res.redirect("/admin/signin"); 
    }
    
});

router.get("/post", function(req,res){
    if(req.session.user){
        res.redirect("/admin");
    }else{
        res.redirect("/admin/signin"); 
    }
    
})

router.get("/user", function(req,res){
    if(req.session.user){
        var data = user_md.getAllUser();
        data.then(function(users){
            var data={
                users: users,
                error: false
                
            };

            res.render("admin/user/user", {data:data});
        }).catch(function(err){
            var data ={
                error: "Không thể load được users"
            };
            res.render("admin/user/user", {data:data});
        });
    }else{
        res.redirect("/admin/signin"); 
    }
    
})

module.exports = router;