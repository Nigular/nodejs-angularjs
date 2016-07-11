var express = require('express');
var url = require('url'); //解析操作url
var superagent = require('superagent'); //这三个外部依赖不要忘记npm install
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');

exports.getInfo=function(option,callback){
	//console.log(option.wapurl);		//通过爬虫的方式获取网站标题
	superagent.get(option.wapurl)
	.end(function (err, res) {
        var $ = cheerio.load(res.text);
		//通过CSS selector来筛选数据
		//匹配网站标题
		var title = $('head>title').text();
		//匹配favicon
		var favicon="";
		$('head link').each(function (idx, element) {
		    var str = $(element).attr("href");
		    var t = str.indexOf('.ico');	
		    if(t>=0){	// 如果大于等于零就表示存在favicon
		    	favicon=str;
		    }
		});
		
		// 如果没有匹配到favicon,则拼凑一个
		if(favicon==""){
			var url = option.wapurl;
	    	var term = url.split("/");
			var newUrl=term[0]+"//"+term[2];
			favicon = newUrl+"/favicon.ico";
		}
		var arr={
    		title:title,
    		icon:favicon
    	}
    	callback(arr);
    });
}

