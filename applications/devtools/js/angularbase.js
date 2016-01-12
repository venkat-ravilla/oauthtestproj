/**
 * @author venkat
 */
var serviceModule=angular.module('serviceModule',[]).factory('currencyrate',['$http',function($http){
	return function (from,to,callback) {
	  $http({method:'GET',url:'/rest/v1/CurrencyExchangeService/currencyRate?from='+from+'&to='+to}).
	  success(callback).
	  error(callback);
	  
	}
}])
var app1Module=angular.module('app1Module',['ui.bootstrap','serviceModule']);

app1Module.controller('Navctrl',['$scope',function($scope){
	$scope.navobj = [{name:'Home',type:'link',link:'/app/home',status:''},{name:'Developer Tools',type:'link',link:'#',status:'active'},
	{name:'Vedios',type:'link',link:'/app/vedios',status:''}];
	
}]).controller('Mainctrl',['$scope',function($scope){
	$scope.obj = [{name:'Epoch Converter',link:'epochconv',state:'active'},
	{name:'Oauth',link:'oauth',state:''},
	{name:'Currency Exchange',link:'currencyexchange',state:''},
	{name:'XML to JSON converter',link:'xmltojson',state:''}];
	$scope.statechange=function(item){
		for (var i=0; i < $scope.obj.length; i++) {
			if(item.name==$scope.obj[i].name){
				$scope.obj[i].state='active';
			}else{
				$scope.obj[i].state='';
			}
		  
		};
	}
}]).controller('EpochCntl',['$scope',function($scope){
	$scope.epochinput = new Date().getTime();
	$scope.date = new Date();
	$scope.convert=function(){
		$scope.date=new Date($scope.epochinput)
	}
}]).controller('OauthCntl',['$scope',function($scope){
	$scope.link ='http://oauth.googlecode.com/svn/code/javascript/example/signature.html';
}]).controller('CurrencyexchangeCntl',['$scope','currencyrate',function($scope,currencyrate){
	$scope.currencies =[{currencyName:'American Dollar(USD)',currencyCode:'USD'},
						{currencyName:'Indian Rupee(INR)',currencyCode:'INR'},
						{currencyName:'Britain Pound(GBP)',currencyCode:'GBP'},
						{currencyName:'Australian Dollar(AUD)',currencyCode:'AUD'},
						{currencyName:'Euro(EUR)',currencyCode:'EUR'},
						{currencyName:'Canadian Dollar(CAD)',currencyCode:'CAD'},
						{currencyName:'HongKong Dollar(HKD)',currencyCode:'HKD'},
						{currencyName:'Indonesian Rupee(IDR)',currencyCode:'IDR'},
						{currencyName:'Japanese Yen(JPY)',currencyCode:'JPY'},
						{currencyName:'Mexican peso(MXN)',currencyCode:'MXN'},
						{currencyName:'NewZealand Dollar(NZD)',currencyCode:'NZD'},
						{currencyName:'South african Rand(ZAR)',currencyCode:'ZAR'},
						{currencyName:'Swiss Franc(CHF)',currencyCode:'CHF'}];
	$scope.fromcurrency ='USD';
	$scope.tocurrency ='INR';
	$scope.fromcurrencyvalue ='';
	$scope.tocurrencyvalue ='';
	$scope.rate ='';
	$scope.selectFromCurrency=function(item){
		$scope.fromcurrency=item.currencyCode
	};
	$scope.selectToCurrency=function(item){
		$scope.tocurrency=item.currencyCode
	};
	var setcurrencyobj=function(data,status){
		$scope.rate=data.data.rate;
		$scope.tocurrencyvalue =$scope.fromcurrencyvalue * $scope.rate;
	}
	$scope.convert=function(){
		currencyrate($scope.fromcurrency,$scope.tocurrency,setcurrencyobj)
	}
}]).controller('XmltoJSONCntl',['$scope',function($scope){
	$scope.xmlinput =' test';
}])

app1Module.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/epochconv',{templateUrl:'/app/devtools/partials/epochconv',controller:'EpochCntl'});
	$routeProvider.when('/oauth',{templateUrl:'/app/devtools/partials/oauth',controller:'OauthCntl'});
	$routeProvider.when('/currencyexchange',{templateUrl:'/app/devtools/partials/currencyexchange',controller:'CurrencyexchangeCntl'});
	$routeProvider.when('/xmltojson',{templateUrl:'/app/devtools/partials/xmltojson',controller:'XmltoJSONCntl'});
	$routeProvider.otherwise({ redirectTo: '/epochconv'});
}])
