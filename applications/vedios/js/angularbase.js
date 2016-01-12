/**
 * @author venkat
 */
var serviceModule=angular.module('serviceModule',[]).factory('vedioSearchList',['$http',function($http){
	return function (searchtext,callback,prevpagetoken,nextpagetoken) {
		var reqquery=[];
		reqquery.push('searchtext='+searchtext);
		if(prevpagetoken!=null && prevpagetoken!=''){
			reqquery.push('prevpagetoken='+prevpagetoken);
		}
		if(nextpagetoken!=null && nextpagetoken!=''){
			reqquery.push('nextpagetoken='+nextpagetoken);
		}
	  $http({method:'GET',url:'/rest/v1/YouTubeDataService/searchList?'+reqquery.join('&')}).
	  success(callback).
	  error(callback);
	  
	}
}]).factory('authorizePage',['$http','$window',function($http,$window){
	return function (callback) {
	  $window.location.href='https://accounts.google.com/o/oauth2/auth?'+
		  'client_id=822100932166.apps.googleusercontent.com&'+
		  'redirect_uri=http%3A%2F%2Flocalhost:3000%2Foauth2callback&'+
		  'scope=https://www.googleapis.com/auth/youtube&'+
		  'response_type=code&'+
		 ' access_type=offline';
		 callback();
	}
}]).factory('getAccessToken',['$http',function($http){
	return function (requestToken,callback) {
		var reqquery=[];
		reqquery.push('code='+requestToken);
		
	  $http({method:'GET',url:'/rest/v1/YouTubeOauthService/getAccessToken?'+reqquery.join('&')}).
	  success(callback).
	  error(callback);
	  
	}
}]).factory('getPlayList',['$http',function($http){
	return function (access_token,callback) {
		var reqquery=[];
		reqquery.push('access_token='+access_token);
		
	  $http({method:'GET',url:'/rest/v1/YouTubeDataService/userPlayList?'+reqquery.join('&')}).
	  success(callback).
	  error(callback);
	  
	}
}]).factory('getPlayListItems',['$http',function($http){
	return function (access_token,playlistId,callback) {
		var reqquery=[];
		reqquery.push('access_token='+access_token);
		reqquery.push('playlistId='+playlistId);
		
	  $http({method:'GET',url:'/rest/v1/YouTubeDataService/userPlayListItem?'+reqquery.join('&')}).
	  success(callback).
	  error(callback);
	  
	}
}])

var app1Module=angular.module('app1Module',['ui.bootstrap','serviceModule']);

app1Module.controller('Navctrl',['$scope',function($scope){
	$scope.navobj = [{name:'Home',type:'link',link:'/app/home',status:''},{name:'Developer Tools',type:'link',link:'/app/devtools',status:''},
	{name:'Vedios',type:'link',link:'#',status:'active'}];
		
}]).controller('Mainctrl',['$scope',function($scope){
	$scope.obj = [{name:'Watch Vedios',link:'vedios',state:'active'},
	{name:'Topics',link:'topics',state:''},
	{name:'User Playlist',link:'playlist',state:''}];
	$scope.statechange=function(item){
		for (var i=0; i < $scope.obj.length; i++) {
			if(item.name==$scope.obj[i].name){
				$scope.obj[i].state='active';
			}else{
				$scope.obj[i].state='';
			}
		  
		};
	}
}]).controller('VedioCntl',['$scope','vedioSearchList','$window',function($scope,vedioSearchList,$window){
	$scope.search = 'angular';
	$scope.targetvedio = 'http://www.youtube.com/embed/';
	$scope.vediolist = [];
	$scope.allvediolist = [];
	$scope.listindex=0;
	$scope.prevbuttonenable ='disabled';
	$scope.nextbuttonenable = 'disabled';
	$scope.nextPageToken = '';
	$scope.previousPageToken = '';
	$scope.vediotitle='';
	$scope.vediodescription='';
	$scope.totalResults='';
	$scope.resultsPerPage=0;
	$scope.from=0;
	$scope.to=0 ;
	var setvediolist=function(data,status){
		$scope.vediolist=data.data.items;
		$scope.allvediolist=[]
		$scope.allvediolist.push(data.data);
		$scope.listindex=0;
		$scope.targetvedio='http://www.youtube.com/embed/'+$scope.vediolist[0].id.videoId+'?autoplay=0&origin=http://localhost:3000';
		$scope.vediotitle=$scope.vediolist[0].snippet.title;
		$scope.vediodescription=$scope.vediolist[0].snippet.description;
		$scope.totalResults=data.data.pageInfo.totalResults;
		$scope.resultsPerPage=data.data.pageInfo.resultsPerPage;
		$scope.from=1;
		$scope.to=$scope.resultsPerPage ;
		$scope.nextPageToken =data.data.tokenPagination.nextPageToken;
		$scope.previousPageToken=data.data.tokenPagination.previousPageToken;
		if($scope.previousPageToken!=null && $scope.previousPageToken!=''){
			$scope.prevbuttonenable='';
		}else{
			$scope.prevbuttonenable='disabled';
		}
		if($scope.nextPageToken!=null && $scope.nextPageToken!=''){
			$scope.nextbuttonenable='';
		}else{
			$scope.nextbuttonenable='disabled';
		}
	}
	var prevvediolist=function(data,status){
		$scope.vediolist=data.data.items;
		//$scope.allvediolist.push(data.data.items);
		$scope.targetvedio='http://www.youtube.com/embed/'+$scope.vediolist[0].id.videoId+'?autoplay=0&origin=http://localhost:3000';
		$scope.vediotitle=$scope.vediolist[0].snippet.title;
		$scope.vediodescription=$scope.vediolist[0].snippet.description;
		//$scope.totalResults=data.data.pageInfo.totalResults;
		$scope.to=$scope.to - $scope.resultsPerPage ;
		$scope.resultsPerPage=data.data.pageInfo.resultsPerPage;
		$scope.from=$scope.from - $scope.resultsPerPage;
		$scope.nextPageToken =data.data.tokenPagination.nextPageToken;
		$scope.previousPageToken=data.data.tokenPagination.previousPageToken;
		if($scope.previousPageToken!=null && $scope.previousPageToken!=''){
			$scope.prevbuttonenable='';
		}else{
			$scope.prevbuttonenable='disabled';
		}
		if($scope.nextPageToken!=null && $scope.nextPageToken!=''){
			$scope.nextbuttonenable='';
		}else{
			$scope.nextbuttonenable='disabled';
		}
	}
	var nextvediolist=function(data,status){
		$scope.vediolist=data.data.items;
		$scope.allvediolist.push(data.data);
		$scope.listindex=$scope.listindex + 1;
		$scope.targetvedio='http://www.youtube.com/embed/'+$scope.vediolist[0].id.videoId+'?autoplay=0&origin=http://localhost:3000';
		$scope.vediotitle=$scope.vediolist[0].snippet.title;
		$scope.vediodescription=$scope.vediolist[0].snippet.description;
		//$scope.totalResults=data.data.pageInfo.totalResults;
		$scope.from=$scope.from + $scope.resultsPerPage;
		$scope.resultsPerPage=data.data.pageInfo.resultsPerPage;
		$scope.to=$scope.to + $scope.resultsPerPage ;
		$scope.nextPageToken =data.data.tokenPagination.nextPageToken;
		$scope.previousPageToken=data.data.tokenPagination.previousPageToken;
		if($scope.previousPageToken!=null && $scope.previousPageToken!=''){
			$scope.prevbuttonenable='';
		}else{
			$scope.prevbuttonenable='disabled';
		}
		if($scope.nextPageToken!=null && $scope.nextPageToken!=''){
			$scope.nextbuttonenable='';
		}else{
			$scope.nextbuttonenable='disabled';
		}
	}
	$scope.getVedioList=function(){
		vedioSearchList(encodeURIComponent($scope.search),setvediolist,'','')
	}
	$scope.getPrevList=function(){
		if($scope.allvediolist[$scope.listindex - 1]!=null){
			$scope.listindex=$scope.listindex - 1;
			$scope.vediolist=$scope.allvediolist[$scope.listindex].items;
			$scope.targetvedio='http://www.youtube.com/embed/'+$scope.vediolist[0].id.videoId+'?autoplay=0&origin=http://localhost:3000';
			$scope.vediotitle=$scope.vediolist[0].snippet.title;
			$scope.vediodescription=$scope.vediolist[0].snippet.description;
			$scope.to=$scope.to - $scope.resultsPerPage ;
			$scope.resultsPerPage=$scope.allvediolist[$scope.listindex].pageInfo.resultsPerPage;
			$scope.from=$scope.from - $scope.resultsPerPage;
			$scope.nextPageToken =$scope.allvediolist[$scope.listindex].tokenPagination.nextPageToken;
			$scope.previousPageToken=$scope.allvediolist[$scope.listindex].tokenPagination.previousPageToken;
			if($scope.previousPageToken!=null && $scope.previousPageToken!=''){
				$scope.prevbuttonenable='';
			}else{
				$scope.prevbuttonenable='disabled';
			}
			if($scope.nextPageToken!=null && $scope.nextPageToken!=''){
				$scope.nextbuttonenable='';
			}else{
				$scope.nextbuttonenable='disabled';
			}
		}else{
			vedioSearchList(encodeURIComponent($scope.search),prevvediolist,$scope.previousPageToken ,'')
		}
		
	}
	$scope.getNextList=function(){
		if($scope.allvediolist[$scope.listindex + 1]!=null){
			$scope.listindex=$scope.listindex + 1;
			$scope.vediolist=$scope.allvediolist[$scope.listindex].items;
			$scope.targetvedio='http://www.youtube.com/embed/'+$scope.vediolist[0].id.videoId+'?autoplay=0&origin=http://localhost:3000';
			$scope.vediotitle=$scope.vediolist[0].snippet.title;
			$scope.vediodescription=$scope.vediolist[0].snippet.description;
			$scope.from=$scope.from + $scope.resultsPerPage;
			$scope.resultsPerPage=$scope.allvediolist[$scope.listindex].pageInfo.resultsPerPage;
			$scope.to=$scope.to + $scope.resultsPerPage ;
			$scope.nextPageToken =$scope.allvediolist[$scope.listindex].tokenPagination.nextPageToken;
			$scope.previousPageToken=$scope.allvediolist[$scope.listindex].tokenPagination.previousPageToken;
			if($scope.previousPageToken!=null && $scope.previousPageToken!=''){
				$scope.prevbuttonenable='';
			}else{
				$scope.prevbuttonenable='disabled';
			}
			if($scope.nextPageToken!=null && $scope.nextPageToken!=''){
				$scope.nextbuttonenable='';
			}else{
				$scope.nextbuttonenable='disabled';
			}
		}else{
			vedioSearchList(encodeURIComponent($scope.search),nextvediolist,'',$scope.nextPageToken)
		}
		
	}
	$scope.playvedio=function(clickedvedio){
		$scope.targetvedio='http://www.youtube.com/embed/'+clickedvedio.id.videoId+'?autoplay=0&origin=http://localhost:3000';
		$scope.vediotitle=clickedvedio.snippet.title;
		$scope.vediodescription=clickedvedio.snippet.description;
	}
	vedioSearchList(encodeURIComponent($scope.search),setvediolist,'','');
}]).controller('TopicCntl',['$scope',function($scope){
	$scope.link ='http://oauth.googlecode.com/svn/code/javascript/example/signature.html';
}]).controller('PlaylistCntl',['$scope','$window','$location','authorizePage','getAccessToken','getPlayList','getPlayListItems',function($scope,$window,$location,authorizePage,getAccessToken,getPlayList,getPlayListItems){
	$scope.username='';
	$scope.playlists=[];
	$scope.playlistItems=[];
	$scope.selectedPlayList='';
	$scope.videosource='';
	if($window.localStorage.username!=null && $window.localStorage.username!=''){
		$scope.username=$window.localStorage.username
	}
	
	var oauthpagecallback = function(data,status){
		
	}
	var accesstokencallback = function(data,status){
		if(data.data.error!=null && data.data.error!=''){
			$window.localStorage.requesttoken=''
			authorizePage(oauthpagecallback)
		}else{
			$window.localStorage.accesstoken=data.data.access_token;
			getPlayList($window.localStorage.accesstoken,playlistcallback)
		}
		
	}
	
	var playlistcallback = function(data,status){
		console.log(data)
		if(data.data.error!=null && data.data.error.code=="401"){
			$window.localStorage.requesttoken='';
			$window.localStorage.accesstoken='';
			authorizePage(oauthpagecallback);
		}else{
			$scope.playlists=data.data.items;
		}
		
	}
	var playlistitemcallback = function(data,status){
		console.log(data)
		if(data.data.error!=null && data.data.error.code=="401"){
			$window.localStorage.requesttoken='';
			$window.localStorage.accesstoken='';
			authorizePage(oauthpagecallback);
		}else{
			$scope.playlistItems=data.data.items;
		}
		
	}
	
	if($window.localStorage.accesstoken!=null && $window.localStorage.accesstoken!=''){
		getPlayList($window.localStorage.accesstoken,playlistcallback)
	}else if ($window.localStorage.requesttoken!=null && $window.localStorage.requesttoken!=''){
		getAccessToken($window.localStorage.requesttoken,accesstokencallback);
	}else{
		authorizePage(oauthpagecallback)
		
	}
	
	 $scope.open = function () {
	    $scope.shouldBeOpen = true;
	  };
	
	  $scope.close = function () {
	    $scope.closeMsg = 'I was closed at: ' + new Date();
	    $scope.shouldBeOpen = false;
	  };
	  
	 $scope.authorize = function(){
	 	$window.localStorage.username=$scope.username;
	 	$scope.shouldBeOpen=false;
	 }
	 
	 $scope.getplaylistvedio=function(playlist){
	 	$scope.selectedPlayList=playlist;
		getPlayListItems($window.localStorage.accesstoken,playlist.id,playlistitemcallback)
	 }
	 
	 $scope.playvedio=function(playlistitem){
		$scope.videosource='http://www.youtube.com/embed/'+playlistitem.snippet.resourceId.videoId+'?autoplay=0&origin=http://localhost:3000';
	 }
	
	  $scope.opts = {
	    backdropFade: true,
	    dialogFade:true
	  };
}])

app1Module.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/vedios',{templateUrl:'/app/vedios/partials/vedios',controller:'VedioCntl'});
	$routeProvider.when('/topics',{templateUrl:'/app/vedios/partials/topics',controller:'TopicCntl'});
	$routeProvider.when('/playlist',{templateUrl:'/app/vedios/partials/playlist',controller:'PlaylistCntl'});
	$routeProvider.otherwise({ redirectTo: '/vedios'});
}])
