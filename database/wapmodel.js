var mongoose = require("mongoose");
var db = mongoose.createConnection("localhost","mongoose-mark");	//连接mark数据表
db.on("error",console.error.bind(console,"连接错误"));
db.once("open",function(){
	console.log("打开成功");
})

var wapSchema = new mongoose.Schema({
    user  : {type : String},	//所属用户
    wap   : {type : String},	//网址
    mark  : {type : String},	//标记
    type  : {type : String},	//所属分类
    icon  : {type : String},	//网站logo
    insertTime : {type : Date, default: Date.now}
});
//将该Schema发布为Model
var WapModel = db.model('wap',wapSchema);

// 插入方法
exports.add = function(option,callback) {
   WapModel.create(option, function (err, docs) {
		if (err){
			return console.error(err);
        }else{
        	//console.log(docs);
            callback(docs);
        }
    });
}

// 查找方法
exports.find = function(option,callback) {
    WapModel.find(option,function (err, docs) {
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
	WapModel.remove(option, function (err,docs) {
		if (err){
			return console.error(err);
		}else{
        	//console.log(docs);
            callback(docs);
        }
	});
}

// 删除单个链接
exports.removeOne = function(option,callback) {
	WapModel.remove(option, function (err,docs) {
		if (err){
			return console.error(err);
		}else{
        	//console.log(docs);
            callback(docs);
        }
	});
}

//更新方法:Model.update(conditions, update, options, callback)
// conditions 更新的条件字段，update要更新的内容
exports.update = function(conditions,update,callback){
	WapModel.update(conditions, {$set:update}, callback);
}

exports.wapmodel = WapModel;