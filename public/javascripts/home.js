
function isURL(str_url){
			if (str_url==''){
				alert('URL 地址不能为空');
				return false;
			}
	       var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
			var objExp=new RegExp(Expression);
			if(objExp.test(str_url)==true){
	        	console.log(str_url+"正确");
	            return true;
	        }else{
	        	alert("URL地址格式不正确");
	            return false;
	        }
}

var app = angular.module("myapp",[]);
	app.controller("myctrl",function($scope,$http){
		$scope.stepShow=false;
		$scope.typeShow=false;
		$scope.addLink="";
		$scope.newType="";		// 新标签
		$scope.initData={};	// 个人数据
		
		$scope.check=function(){
			//console.log($scope.addLink);
			if(!isURL($scope.addLink)) return false;
			$http.post('/checkUrl',{check_url:$scope.addLink})
			.success(function(data){
				if(data.code==0){
					alert("你还没登录");
				}else{
					$scope.stepShow=true;
					$scope.markName=data.title;
			   	 	$scope.favicon=data.icon;
				}
			});
		}
		
		$scope.addOne = function(){
			if($scope.markName==""){
				alert("请填写名称");
				return false;
			}
			$http.post('/addMark',{
				favicon:$scope.favicon,
				wap:$scope.addLink,
				mark:$scope.markName,
				selt_type:$scope.seltType.name
			})
			.success(function(data){
				$scope.stepShow=false;
				$scope.addLink="";
			    if(data.code==1){
			    	alert("添加成功");
			    	window.location.reload();
			    }else{
			    	alert("系统错误,请稍后重试");
			    }
			});
		}
		
		$scope.login = function(){
			$http.post('/login',{
				email:$scope.signinEmai,
				password:$scope.signinPassword
			})
			.success(function(data){
				if(data.code==1){
					alert("登录成功");
			    	window.location.reload();
				}else{
					alert("登录失败，用户名或密码错误");
				}
			});
		}
		
		$scope.loginout = function(){
			$http.get("/loginout").success(function(){
				alert("退出成功");
				window.location.reload();
			});
		}
		
		$scope.reg = function(){
			$http.post('/register',{
				username:$scope.signupUsername,
				email:$scope.signupEmail,
				password:$scope.signupPassword
			})
			.success(function(data){
			    alert("注册成功");
			    window.location.reload();
			});
		}
		
		$scope.showT=function(){
			$scope.typeShow=!$scope.typeShow;
		}
		
		$scope.cancleT=function(){
			$scope.stepShow=false;
			$scope.markName="";
			$scope.favicon="";
			$scope.addLink="";
		}
		
		// 新建一个分类
		$scope.addT=function(){
			if($scope.newType==""){
				alert("分类名不能为空");
			}else{
				$http.post('/addNewType',{
					name:$scope.newType
				})
				.success(function(data){
					if(data.code==1){
						 alert("添加成功");
						 $scope.typeShow=false;
						 window.location.reload();
					}else{
						alert("添加失败,请稍后重试");
						$scope.typeShow=false;
						window.location.reload();
					}
				});
			}
		}
		
		// 查询当前用户的所有数据
		$scope.findall=function(){
			$http.post('/findall',{})
			.success(function(data){
				if(data.code==1){
					$scope.initData=data.data;
					$scope.seltType = $scope.initData.types[0];
					for(let j in data.data.types){			//es6 var 改成let ,把异步强制换成同步，一个高手指点的
						var tid = data.data.types[j]._id;
						$http.post('/getTypeData',{id:tid})
						.success(function(data){
							if(data.code==1){
								//console.log(j)
								$scope.initData.types[j].waps=data.data;
							}else{
								alert(data.msg);
							}
						})
					}
				}else{
					alert(data.msg);
				};
			});
		}
		$scope.findall();
});