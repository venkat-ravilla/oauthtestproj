/**
 * @author venkat
 */
var serviceModule=angular.module('serviceModule',[]).factory('redirectplaylist',['$http',function($http){
	return function (searchtext,callback,prevpagetoken,nextpagetoken) {
	  $http({method:'GET',url:'http://localhost:3000/app/vedios#/playlist'}).
	  success(callback).
	  error(callback);
	  
	}
}])

var app1Module=angular.module('app1Module',['ui.bootstrap','serviceModule']);

app1Module.controller('Navctrl',['$scope',function($scope){
	$scope.navobj = [{name:'Home',type:'link',link:'#',status:'active'},{name:'Developer Tools',type:'link',link:'/app/devtools',status:''},
	{name:'Vedios',type:'link',link:'/app/vedios',status:''}];
	
}]).controller('Mainctrl',['$scope','$window','$location',function($scope,$window,$location){
	var  requestToken=$window.location.search.split('?')[1];
	$window.localStorage.requesttoken=requestToken.substr(requestToken.indexOf('=')+1);
	$window.location.href='http://localhost:3000/app/vedios#/playlist';
	
}])
