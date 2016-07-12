var mongoose = require("mongoose");
var db = mongoose.createConnection("localhost","mongoose-mark");	//连接数据表
db.on("error",console.error.bind(console,"连接错误"));
db.once("open",function(){
	console.log("打开成功");
})

/*
Schema  ：  一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
Model   ：  由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
Entity  ：  由Model创建的实体，他的操作也会影响数据库
*/

//定义一个User表的骨架Schema
var MainSchema = new mongoose.Schema({
    username : {type : String, default : '匿名用户'},	//用户名
    email: {type:String}, //邮箱
    password : {type : String},		//暂定由数字和字母组成
    headimg  : {type : String},	//头像
    root 	 : {type : Number, default: 1},	// 用户权限。暂定最高权限99。默认1，普通权限
    regtime  : {type : String, default: parseInt(new Date().getTime())},	//注册时间
    lasttime : {type : String, default: parseInt(new Date().getTime())},	//最近登陆时间
    comments : {}		// 该用户收藏的网址集合
});

//将该Schema发布为Model,创建collection连接user表
var MainModel = db.model('main',MainSchema);

// 插入一个新用户
exports.adduser = function(option,callback) {
   MainModel.create(option, function (err, docs) {
		if (err){
			return console.error(err);
        }else{
        	//console.log(docs);
            callback(docs);
        }
    });
}

exports.checkuser = function(option,callback) {
    MainModel.find(option,function (err, docs) {
		if (err){
			return console.error(err);
		}else{
			//console.log(docs);
            callback(docs);
        }
	});
}

// 插入一个分类
exports.addtype = function(condition,option,callback) {
   MainModel.update(condition,option, function (err, docs) {
		if (err){
			return console.error(err);
        }else{
        	console.log(docs);
            callback(docs);
        }
    });
}

exports.mainmodel = MainModel;// 作为一个模块被引用，要用exports把变量暴露出去