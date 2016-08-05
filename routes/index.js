var express = require('express');
var router = express.Router();

// 引入model模块
var mainmodel = require("../database/mainmodel.js");
var crawler = require("../database/crawler.js");

// 注册
router.post("/register",function(req,res){
	var addData={
		username:req.body.username,
	    email: req.body.email,
	    password : req.body.password,
	    types:{name:"默认书签栏"}
	}
	mainmodel.adduser(addData,function(data){
		//console.log(data);
		//res.redirect("/home");
		req.session.user = addData;
		res.send({code:1});
	});
	
	
});

router.get("/test",function(req,res){
	res.render('test', { title: 'test'});
});

router.get("/home",function(req,res){
	if (!req.session.user) {
		res.render('home', { title: '主页',username:""});
	}else{
		//console.log(req.session.user);
		res.render('home', { title: '主页',username:req.session.user.username});
	}
});

router.post("/login",function(req,res){
	var user = {email:req.body.email,password:req.body.password};
	mainmodel.checkuser(user,function(docs){
		//console.log(docs);
		if(docs.length>0){
			req.session.user = docs[0];  //登录成功，记录到session里
			res.send({code:1});
		}else{
			req.session.error='用户名或密码不正确';
	    	res.send({code:0});
		}
	});
});

router.get("/loginout",function(req,res){
	req.session.user = null;  //退出后，清空session里的值
	res.send({code:1});
});


//ajax获取url的title和图标
router.route("/checkUrl").post(function(req,res){
	//1.做登陆验证，先跳过
	if (!req.session.user) {
		res.send({code:0});	
		return false;
	}
	var wap = req.body.check_url;	//接收传过来的wap参数
	crawler.getInfo({wapurl:wap},function(backarr){
		//返回前必须先把数据组装成json
		var ajaxTest=backarr;
		res.send(ajaxTest);	
	});
});

// 添加一个网址
router.post("/addMark",function(req,res){
	//1.做登陆验证，先跳过
	
	var favicon = req.body.favicon==""?"/images/default_wap.jpg":req.body.favicon;
	var condition={
		email:req.session.user.email,
		type:req.body.selt_type
	}
	var option={
		wap:req.body.wap,
		mark:req.body.mark,
		icon:favicon
	}
	var resData={};
	mainmodel.addMark(condition,option,function(backarr){
		res.send(backarr);
	});
});

// 新建一个标签
router.post("/addNewType",function(req,res){
	//1.做登陆验证，先跳过
	var condition={
		email:req.session.user.email
	};
	var arr={
		name:req.body.name
	};
	var resData={};
	mainmodel.addNewType(condition,arr,function(docs){
		if(docs.nModified==1){
			resData = {code:1,msg:"添加成功"};
			res.send(resData);
		}else{
			resData = {code:0,msg:"添加失败"};
			res.send(resData);
		}
	});
});

// 查询所有分类
router.post("/findall",function(req,res){
	var option={
		email:req.session.user.email
	};
	mainmodel.findAll(option,function(docs){
		var resData={};
		//console.log(docs.code);
		if(docs.code==0){
			resData={code:0,msg:docs.err};
		}else{
			resData = {code:1,data:docs};
		}
		res.send(resData);
	});
});

// 查询单个分类的数据
router.post("/getTypeData",function(req,res){
	var option={
		type_id:req.body.id
	};
	mainmodel.getOneType(option,function(docs){
		if(docs.code==0){
			resData={code:0,msg:docs.err};
		}else{
			resData = {code:1,data:docs};
		}
		res.send(resData);
	});
})

module.exports = router;
