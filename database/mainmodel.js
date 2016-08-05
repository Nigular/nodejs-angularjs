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
var wapSchema = new mongoose.Schema({
	type_id:{type : String},	// 对应唯一分类的ID
    wap   : {type : String},	//网址
    mark  : {type : String},	//标记
    icon  : {type : String},	//网站logo
    insertTime : {type : Date, default: Date.now}
});

var typeSchema = new mongoose.Schema({
	name : {type : String},
	waps:[],
	insertTime:{type : Date, default: Date.now}
});

var MainSchema = new mongoose.Schema({
    username : {type : String, default : '匿名用户'},	//用户名
    email: {type:String}, //邮箱
    password : {type : String},		//暂定由数字和字母组成
    headimg  : {type : String},	//头像
    root 	 : {type : Number, default: 1},	// 用户权限。暂定最高权限99。默认1，普通权限
    regtime  : {type : String, default: parseInt(new Date().getTime())},	//注册时间
    lasttime : {type : String, default: parseInt(new Date().getTime())},	//最近登陆时间
    types : [typeSchema]			// 用户下的子文档分类
});

//将该Schema发布为Model,创建collection连接user表
var MainModel = db.model('main',MainSchema);
var wapModel = db.model('waps',wapSchema);

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

// 插入一条网址
exports.addMark = function(condition,option,callback) {
    MainModel.findOne({"email":condition.email},function (err, docs) {
    		var ind;
	    	for(var t in docs.types){
	    		if(docs.types[t].name==condition.type){		//循环对比找出tpye的id
					ind=docs.types[t].id;
					//console.log(ind);
	    		}
	    	}
	    	option.type_id=ind;
	    	 wapModel.create(option, function (err, item) {
				if (err){
					callback({code:0});
					return console.error(err);
		      	}else{
		            callback({code:1});
		        }
		   });
    });
}


// 插入一个分类
// condition查询条件
exports.addNewType = function(condition,option,callback) {
	//‘$set’ 指定一个键的值,这个键不存在就创建它.可以是任何MondoDB支持的类型.
	//'$push' 新增数组
   MainModel.update(condition,{'$push':{'types':option}}, function (err, docs) {
		if (err){
			return console.error(err);
      	}else{
            callback(docs);
        }
   });
}

exports.findAll = function(option,callback) {
	MainModel.findOne(option,function(err,data){
		 //如果err==null，则person就能取到数据
		 	if (err){
				callback({code:0,err:err});
	     }else{
	      		callback(data);
	        }
	});
}

// 查询一个分类下的记录
exports.getOneType=function(option,callback){
	wapModel.find(option,function(err,data){
		  if (err){
				callback({code:0,err:err});
	      }else{
	      		callback(data);
	      }
	});
}

exports.mainmodel = MainModel;// 作为一个模块被引用，要用exports把变量暴露出去