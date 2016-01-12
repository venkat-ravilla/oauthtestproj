/**
 * @author venkat
 */

var app1Module=angular.module('app1Module',['ui.bootstrap']);

app1Module.controller('Navctrl',['$scope',function($scope){
	$scope.navobj = [{name:'Home',type:'link',link:'#',status:'active'},{name:'Developer Tools',type:'link',link:'/app/devtools',status:''},
	{name:'Vedios',type:'link',link:'/app/vedios',status:''}];
	
}]).controller('Mainctrl',['$scope',function($scope){
	$scope.blocks = [{title:'Home',description:'This page gives an overview of all the tools provided by this site.'},
	{title:'Developer Tools',description:'This page provides you with all the Developer Tools.'},
	{title:'Vedios',description:'This page gives you access to all the vedios.'}];
	
}])

app1Module.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/',{templateUrl:'/app/home/partials/main',controller:'Mainctrl'});
	$routeProvider.otherwise({ redirectTo: '/'});
}])
