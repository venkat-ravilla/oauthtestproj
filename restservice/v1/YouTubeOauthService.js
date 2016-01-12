/**
 * @author venkat
 */
exports.YouTubeOauthService={
	getAccessToken:function(callback){
		var code=decodeURIComponent(this.param('code','')),
		client_id='822100932166.apps.googleusercontent.com',
		client_secret='64MT8Xp-_mBSoehZdYCZefDh',
		redirect_uri='http%3A%2F%2Flocalhost:3000%2Foauth2callback';
		grant_type='authorization_code',
		requestobj={};
		requestobj.code=code;
		requestobj.client_id=client_id;
		requestobj.client_secret=client_secret;
		requestobj.redirect_uri=redirect_uri;
		requestobj.grant_type=grant_type;
		
		
		this.externalApiCall('https://accounts.google.com/o/oauth2/token','POST',
		requestobj,
		function(result){
			callback(result)
		})
	},
	getAccessTokenWithRefresh:function(callback){
		var refresh_token=this.param('refresh_token',''),
		client_id='822100932166.apps.googleusercontent.com',
		client_secret='64MT8Xp-_mBSoehZdYCZefDh',
		redirect_uri='http%3A%2F%2Flocalhost:3000%2Foauth2callback';
		grant_type='refresh_token';
		requestobj.refresh_token=refresh_token;
		requestobj.client_id=client_id;
		requestobj.client_secret=client_secret;
		requestobj.grant_type=grant_type;
		
		
		this.externalApiCall('https://accounts.google.com/o/oauth2/token','POST',
		requestobj,
		function(result){
			callback(result)
		})
	}
	
}
