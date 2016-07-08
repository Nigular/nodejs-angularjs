var express = require('express');
var router = express.Router();

router.get("/test",function(req,res){
	res.render('test', { title: 'test'});
});

router.get("/citydata",function(req,res){
	var ajaxData = {
		"records": [{
			"Name": "Alfreds Futterkiste",
			"City": "Berlin",
			"Country": "Germany"
		}, {
			"Name": "Berglunds snabbköp",
			"City": "Luleå",
			"Country": "Sweden"
		}, {
			"Name": "Centro comercial Moctezuma",
			"City": "México D.F.",
			"Country": "Mexico"
		}, {
			"Name": "Ernst Handel",
			"City": "Graz",
			"Country": "Austria"
		}, {
			"Name": "FISSA Fabrica Inter. Salchichas S.A.",
			"City": "Madrid",
			"Country": "Spain"
		}, {
			"Name": "Galería del gastrónomo",
			"City": "Barcelona",
			"Country": "Spain"
		}, {
			"Name": "Island Trading",
			"City": "Cowes",
			"Country": "UK"
		}, {
			"Name": "Königlich Essen",
			"City": "Brandenburg",
			"Country": "Germany"
		}, {
			"Name": "Laughing Bacchus Wine Cellars",
			"City": "Vancouver",
			"Country": "Canada"
		}, {
			"Name": "Magazzini Alimentari Riuniti",
			"City": "Bergamo",
			"Country": "Italy"
		}, {
			"Name": "North/South",
			"City": "London",
			"Country": "UK"
		}, {
			"Name": "Paris spécialités",
			"City": "Paris",
			"Country": "France"
		}, {
			"Name": "Rattlesnake Canyon Grocery",
			"City": "Albuquerque",
			"Country": "USA"
		}, {
			"Name": "Simons bistro",
			"City": "København",
			"Country": "Denmark"
		}, {
			"Name": "The Big Cheese",
			"City": "Portland",
			"Country": "USA"
		}, {
			"Name": "Vaffeljernet",
			"City": "Århus",
			"Country": "Denmark"
		}, {
			"Name": "Wolski Zajazd",
			"City": "Warszawa",
			"Country": "Poland"
		}]
	};
	res.send(ajaxData);		//用send返回数据,json通讯
});

router.post("/postData",function(req,res){
	// 接受数据，用了body-parser的第三方控件
	var user = {username:req.body.username,password:req.body.password};
	if(user.username=="root" && user.password=="root"){
		resData = {code:1,msg:"成功"}
	}else{
		resData = {code:0,msg:"验证失败"}
	}
	res.send(resData);
});

module.exports = router;
