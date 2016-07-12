var mongoose = require("mongoose");
var db = mongoose.createConnection("localhost","mongoose-test");	//连接数据表
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
var UserSchema = new mongoose.Schema({
    username : {type : String, default : '匿名用户'},	//用户名
    password : {type : String},		//暂定由数字和字母组成
    headimg  : {type : String},	//头像
    root 	 : {type : Number, default: 1},	// 用户权限。暂定最高权限99。默认1，普通权限
    regtime  : {type : Date, default: Date.now},	//注册时间
    lasttime : {type : Date, default: Date.now},	//最近登陆时间
    comments :{}
});
//将该Schema发布为Model,创建collection连接user表
var UserModel = db.model('user',UserSchema);

// 插入方法
exports.add = function(option,callback) {
   UserModel.create(option, function (err, docs) {
		if (err){
			return console.error(err);
			
        }else{
        	console.log(docs);
            //callback(docs);
        }
    });
}

// 查找方法
exports.find = function(option,callback) {
    UserModel.find(option,function (err, docs) {
		if (err){
			return console.error(err);
		}else{
			//console.log(docs);
            callback(docs);
        }
	});
}

// 删除方法
exports.remove = function(option,callback) {
	UserModel.remove(option, function (err) {
		if (err)
			return console.error(err);
	});
}

//更新方法:Model.update(conditions, update, options, callback)
// conditions 更新的条件字段，update要更新的内容
exports.update = function(conditions,update,callback){
	UserModel.update(conditions, {$set:update}, callback);
}


// personEntity 一个model的实体(实例化)
//var personEntity = new PersonModel({name:'Krouky2'});
//
//// 实体可以通过save()来保存到数据库
//personEntity.save(function (err, fluffy) {
//if (err) return console.error(err);
//personEntity.speak();		//我的名字叫Krouky
//});

// Model可以用create方法批量插入
//var array = [{ name: 'jelly bean' }, { name: 'snickers' }];
//PersonModel.create(array, function (err, docs) {
//if (err) return console.error(err);
////console.log(docs);
//});

// Model可以用remove方法执行删除操作
// 也可以通过[{ name: 'jelly bean' }, { name: 'snickers' }]数组形式，批量删除
//PersonModel.remove({name:'snickers'}, function (err) {
//});

// Model可以直接做查询操作
//PersonModel.find(function (err, kittens) {
//if (err) return console.error(err);
//console.log(kittens);
//});

exports.usermodel = UserModel;// 作为一个模块被引用，要用exports把变量暴露出去