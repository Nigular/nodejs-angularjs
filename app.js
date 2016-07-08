var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// 路由分配
var routes = require('./routes/index');	//设置路由入口

var app = express();

// app.set 设置当前views的路径(模板路径)
// path.join 将多个参数组合成一个 path(简单来说就是几个参数组合成路径)
app.set('views', path.join(__dirname, 'views'));

// 让ejs模板文件使用扩展名为html的文件
app.engine("html",require("ejs").renderFile);

//注册模板引擎的 callback 用来处理ext扩展名的文件默认情况下, 根据文件扩展名require() 对应的模板引擎。
app.set("view engine","html");

//路由分发语句前加入
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 设置静态文件路径为常量
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制：所有请求的路径都通过routes里的index去分发
app.use('/', routes);   

// 当请求没有对应的路由时，增加404提示
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
  console.log(err);
});

//渲染404错误页面
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(8100,function(){  console.log("Server Start!");});

module.exports = app;