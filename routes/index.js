// routes/index.js
var Q = require('q');
var request = require('request');

var exist = function(){
    for(var i=0; i<=arguments.length - 1; i++){
        var needle = arguments[i];
        
        if(needle === undefined) return false;
    }
    return true;
}

module.exports = function (app, mazi) {
    app.get('/', function (req, res) {
        res.redirect("/admin");
    });
    app.get('/api', function (req, res) {
        res.type('application/json');
        
        //在这里判断Get的类型
        var type = -1;
        //公共处理部分
        var key = req.param("key");
        var gType = req.param("type");
        
        //随笔部分
        var content = req.param("content");
        var title = req.param("title");
        
        //用户处理部分
        var uid = req.param("uid");
        
        //登录处理部分
        var uname = req.param("uname");
        var passauth = req.param("passauth");
        //var timestamp = req.param("timestamp");
        
        //超级权限部分
        var superkey = req.param("superkey");
        
        
        //type判断部分
        if(exist(gType)){
            type = gType;
        }
        else if(exist(uname, passauth)){
            type = 2;
        }
        //超级用户处理
        else if(exist(superkey, uid)){
            type = 11;
        }
        //文章写入处理
        else if(exist(key, content, uid, title)){
            type = 51;
        }
        else if(exist(key)){
            type = 1;
        }
        
        if(type == 1){
             mazi.authcodeExist(key, function(err, rows){
                var exist = false;
                rows.forEach(function(row){
                    if(row.AUTHCODE == key){
                        exist = true;
                    }
                });
                
                if(exist){
                    res.json({authcode: key, message: 'True'});
                }
                else{
                    res.json({error: 1, message: 'Invalid Authcode.'});
                }
            });
        }
        else if(type == 2){
            mazi.getUserData(function(err, rows){
                var data = false;
                rows.forEach(function(row){
                    if(row.USERNAME == uname && row.PASSWORD == passauth){
                        data = row;
                    }
                });
                
                if(data == false){
                    res.json({error: 2, message: 'Invalid Try.'});
                }
                else{
                    res.json({reply: 2, uid: data.UID, message: 'Successful!'});
                }
            });
        }
        else if(type == 11){
            mazi.getUserData(function(err, rows){
                var data = false;
                rows.forEach(function(row){
                    if(row.UID == uid){
                        data = row;
                    }
                });
                
                if(data == false){
                    res.json({error: 11, message: 'Invalid Visit.'});
                }
                else{
                    res.json(JSON.stringify(data));
                }
            });
        }
        else if(type == 51){
            mazi.authcodeExist(key, function(err, rows){
                var exist = false;
                rows.forEach(function(row){
                    if(row.AUTHCODE == key){
                        exist = true;
                    }
                });
                
                if(exist){
                    mazi.writeEssayToDB(uid, title, content);
                    res.json({return: 1, message: 'Written successfully!'});
                }
                else{
                    res.json({error: 51, message: 'Invalid Authcode.'});
                }
            });
            
        }
        else if(type == 100){
            //语言教程
            mazi.getLanguageTutorial(function(err, rows){
                var reply = {};
                
                rows.forEach(function(row){
                    if(row.NAME == "Tutorial"){
                        reply.update = row.TIME;
                        reply.content = row.CONTENT;
                    }
                });
                res.json(reply);
            });
            
            //Debug
            //res.json({update: "2016.9.29", content: "Test."})
        }
        else if(type == 101){
            //通知公告
            mazi.getAnnounceData(function(err, rows){
                var reply = new Array();
                var i = 0;
                rows.forEach(function(row){
                    //增加内容
                    reply[i] = {};
                    reply[i].user = row.UID;
                    reply[i].user_page = "#";
                    reply[i].title = row.TITLE;
                    reply[i].time = row.TIME;
                    reply[i].by = row.UID;
                    reply[i].content = row.CONTENT;
                    reply[i].more = row.MORE;
                    
                    i++;
                });

                res.json(reply);
            });
            
            /*
            //Debug
            res.json([{"user":"System","user_page":"#","title":"初次运行","time":"刚刚","by":"昨日的十七号","content":"世界真好！","more":"#"},{"user":"Yesterday17","user_page":"http://www.yesterday17.cn/","title":"运转良好测试","time":"刚刚","by":"昨日的十七号","content":"对于这个IWE能够好好跑起来我也是满激动的ww","more":"http://www.google.com.hk/"}]);
            */
        }
        else if(type == 102 && exist(uid)){
            //用户公共信息
            mazi.getPublicUserData(function(err, rows){
                var data = false;
                rows.forEach(function(row){
                    if(row.UID == uid){
                        data = row;
                    }
                });
                
                if(data == false){
                    res.json({error: 102, message: 'Unknown UID.'});
                }
                else{
                    res.json({reply: 102, uid: data.UID, username: data.USERNAME});
                }
            });
        }
        else{
            res.json({error: -1, message: 'Unknown API Instruction.'});
        }
    });
};