/**
 * @author venkat
 */
exports.YouTubeDataService={
	searchList:function(callback){
		var searchtext=this.param('searchtext','angular'),
		nextpagetoken=this.param('nextpagetoken',''),
		prevpagetoken=this.param('prevpagetoken',''),
		requestobj={};
		requestobj.part='snippet';
		requestobj.q=searchtext;
		requestobj.type='video';
		requestobj.videoCaption='closedCaption';
		requestobj.order='viewCount';
		requestobj.key='AIzaSyB6uK34OT41RddADmeIWp2v_21cv7kI7JY';
		if(nextpagetoken!=''){
			requestobj.pageToken=nextpagetoken;
		}else if (prevpagetoken!='') {
			requestobj.pageToken=prevpagetoken;
		};
		
		this.externalApiCall('https://www.googleapis.com/youtube/v3/search','GET',
		requestobj,
		function(result){
			callback(result)
		})
	},
	userPlayList:function(callback){
		var access_token=this.param('access_token','')
		requestobj={};
		requestobj.part='snippet';
		requestobj.mine='true';
		requestobj.access_token=access_token;
				
		this.externalApiCall('https://www.googleapis.com/youtube/v3/playlists','GET',
		requestobj,
		function(result){
			callback(result)
		})
	},
	userPlayListItem:function(callback){
		var access_token=this.param('access_token',''),
		playlistId=this.param('playlistId','')
		requestobj={};
		requestobj.part='snippet';
		requestobj.playlistId=playlistId;
		requestobj.access_token=access_token;
				
		this.externalApiCall('https://www.googleapis.com/youtube/v3/playlistItems','GET',
		requestobj,
		function(result){
			callback(result)
		})
	}
	
}