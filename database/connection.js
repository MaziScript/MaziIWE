var sqlite3 = require('sqlite3');  

var maziDB = function(){
    var dbPath = "./db/maziIWE.sqlite3";
    
    this.install = function(){
        try{
            var db = new sqlite3.Database(dbPath);
            //创建验证码表
            db.run("CREATE TABLE IF NOT EXISTS MaziIWE_ADMIN_AUTH (UID VARCHAR(5) PRIMARY KEY, AUTHCODE VARCHAR(10), CREATE_DATE DATE)");
            //创建用户表
            db.run("CREATE TABLE IF NOT EXISTS MaziIWE_USER_DATA (UID VARCHAR(5) PRIMARY KEY, USERNAME VARCHAR(15), PASSWORD VARCHAR(15), BIRTH_DATE DATE, SEX BLOB)");
            //创建用户文章表
            db.run("CREATE TABLE IF NOT EXISTS MaziIWE_USER_PASSAGE (UID VARCHAR(5), TITLE VARCHAR(100), CONTENT TEXT)");
            //创建系统公告表
            db.run("CREATE TABLE IF NOT EXISTS MaziIWE_SYSTEM_Announcement (UID VARCHAR(5) PRIMARY KEY, TITLE VARCHAR(100), CONTENT TEXT, TIME DATE, MORE TEXT)");
            //创建语言教程更新数据表
            db.run("CREATE TABLE IF NOT EXISTS MaziIWE_SYSTEM (NAME VARCHAR(20), DETAILS TEXT, TIME DATE, CONTENT TEXT)");            
            db.close();
            
            return true;
        }
        catch(e){
            return e.toString();
        }
    }
    
    this.authcodeExist = function(authcode, callback){
        this.install();
        var db = new sqlite3.Database(dbPath);

        db.all("SELECT AUTHCODE FROM MaziIWE_ADMIN_AUTH", callback);
        db.close();
    }
    
    this.getUserData = function(callback){
        this.install();
        var db = new sqlite3.Database(dbPath);
        
        db.all("SELECT * FROM MaziIWE_USER_DATA", callback);
        db.close();
    }
    
    this.getAnnounceData = function(callback){
        this.install();
        var db = new sqlite3.Database(dbPath);
        
        db.all("SELECT * FROM MaziIWE_SYSTEM_Announcement", callback);
        db.close();
    }
    this.getPublicUserData = function(callback){
        this.install();
        var db = new sqlite3.Database(dbPath);
        
        db.all("SELECT UID,USERNAME FROM MaziIWE_USER_DATA", callback);
        db.close();
    }
    this.getLanguageTutorial = function(callback){
        this.install();
        var db = new sqlite3.Database(dbPath);
        
        db.all("SELECT * FROM MaziIWE_SYSTEM", callback);
        db.close();
    }
    
    
    
    
    
    
    this.writeEssayToDB = function(uid, title, content){
        this.install();
        var db = new sqlite3.Database(dbPath);
        
        db.all("INSERT INTO MaziIWE_USER_PASSAGE (UID, TITLE, CONTENT) VALUES(\"" + uid + "\",\"" + title + "\",\"" + content + "\")");
        db.close();
    }
}

module.exports = maziDB;