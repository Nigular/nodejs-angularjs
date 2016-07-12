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
	    password : req.body.password
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
	var arr={
		user:"long", //req.session.user.username
		wap:req.body.wap,
		mark:req.body.mark,
		type:req.body.selt_type,
		icon:favicon
	}
	var resData={};
	wapmodel.add(arr,function(docs){
		resData = {code:1,msg:"成功"};
		res.send(resData);
	});
});

module.exports = router;
