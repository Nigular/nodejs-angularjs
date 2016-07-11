var mongoose = require("mongoose");
var db = mongoose.createConnection("localhost","mongoose-test");	//连接数据表
db.on("error",console.error.bind(console,"连接错误"));
db.once("open",function(){
	console.log("打开成功");
})

var typeSchema = new mongoose.Schema({
    user : {type : String},	//用户名
	type : {type : String},
	insertTime:{type : Date, default: Date.now}
});
//将该Schema发布为Model
var TypeModel = db.model('type',typeSchema);

// 插入方法
exports.add = function(option,callback) {
   TypeModel.create(option, function (err, docs) {
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
    TypeModel.find(option,function (err, docs) {
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
	TypeModel.remove(option, function (err,docs) {
		if (err){
			return console.error(err);
		}else{
			console.log(docs);
            callback(docs);
        }
	});
}

//更新方法:Model.update(conditions, update, options, callback)
// conditions 更新的条件字段，update要更新的内容
exports.update = function(conditions,update,callback){
	TypeModel.update(conditions, {$set:update}, callback);
}

exports.typemodel = TypeModel;