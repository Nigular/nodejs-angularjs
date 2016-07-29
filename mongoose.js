// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

mongoose.set('debug', true);

/*############# 基础部分 #################*/

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
   console.log("数据库连接成功");
});

var kittySchema = mongoose.Schema({
    name: String
});

//var Kitten = mongoose.model('Kitten', kittySchema);
//var silence = new Kitten({ name: 'Silence' });

//console.log(silence.name) // 'Silence'

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name"
  // console.log(greeting);
};

var Kitten = mongoose.model('Kitten', kittySchema);

// 实例化一个kitten，并传入属性值
var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak();   //调用模型的方法 "Meow name is fluffy"

// 存入数据库
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});

// 查找
/*Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens)
});*/

//如果我们想通过名字过滤我们的模型，mongodbs支持丰富的查询语法
Kitten.find({ name: /^fluff/ }, function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens)
});



/*############# schema部分 #################*/
var Schema = mongoose.Schema;
var blogSchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});

var Blog = mongoose.model('Blog', blogSchema);

var animalSchema = new Schema({ name: String, type: String });

// 给我们的animalSchema实例指定一个函数
animalSchema.methods.findSimilarTypes = function (cb) {
  return this.model('Animal').find({ type: this.type }, cb);
}

//var Animal = mongoose.model('Animal', animalSchema);
// 重写默认的Schema的方法可能会导致得不到结果
/*var dog = new Animal({ type: 'dog' });
dog.findSimilarTypes(function (err, dogs) {
  console.log(dogs); // woof
});*/

//给模型添加一个静态方法的是简单的。继续我们的animalSchema：
animalSchema.statics.findByName = function (name, cb) {
  this.find({ name: new RegExp(name, 'i') }, cb);
}
var Animal = mongoose.model('Animal', animalSchema);
Animal.findByName('fido', function (err, animals) {
  console.log(animals);
});

var animalSchema = new Schema({
  name: String,
  type: String,
  tags: { type: [String], index: true } // field level
});
animalSchema.index({ name: 1, type: -1 }); // schema level

/*######## Models 方法 #########*/

var yourSchema = new mongoose.Schema({ name: 'string', size: 'string' });

var Tank = mongoose.model('Tank', yourSchema);
var small = new Tank({ size: 'small' });
small.save(function (err) {
  if (err) return handleError(err);
  // saved!
})
// or
Tank.create({ size: 'small' }, function (err, small) {
  if (err) return handleError(err);
  // saved!
})

/*Tank.remove({ size: 'large' }, function (err) {
  if (err) return handleError(err);
  });
  */
Tank.findById("579afed26c76c79c257bcfdb", function (err, tank) {
	  if (err) return handleError(err);
	  
	  tank.size = 'large';
	  tank.save(function (err) {
	    if (err) return handleError(err);
	    //console.log(tank);
	  });
});

/*###### 子文档  #######*/
var childSchema = new Schema({ name: 'string' });
var parentSchema = new Schema({
  children: [childSchema]
});
/*var Parent = mongoose.model('Parent', parentSchema);
var parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })
parent.children[0].name = 'Matthew';		//在存入数据库前就改变了
parent.save(function (err,res) {
	    if (err) return handleError(err);
	    console.log(res);
});*/

var Parent = mongoose.model('Parent', parentSchema);
var parent = new Parent;
// create a comment
parent.children.push({ name: 'Liesl' });
var subdoc = parent.children[0];
console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
subdoc.isNew; // true
parent.save(function (err) {
  if (err) return handleError(err)
  console.log('Success!');
});