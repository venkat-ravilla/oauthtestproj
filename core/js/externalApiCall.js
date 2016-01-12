/**
 * @author venkat
 */

var url=require('url');
function externalCall(url,method,params,callback){
	this.url=url;
	this.method=method;
	this.params=params;
	this.responceCallBack=callback;
}

externalCall.prototype={
	
	responce:function(responce,dataxml){
		var xml2js=require('xml2js'),xml2jsparser,self=this;
		if(responce.headers['content-type'].indexOf('json')!=-1){
			self.responceCallBack(require('./wrappers/responceobject.js').responceobject(JSON.parse(dataxml)))
		}else{
			xml2jsparser=new xml2js.Parser();
			xml2jsparser.parseString(dataxml,function(err,data){
				if (!data) {
					self.responceCallBack(require('./wrappers/responceobject.js').responceobject({errormessage:dataxml}));
					return;
				};
				if (data.Error) {
					self.responceCallBack(require('./wrappers/responceobject.js').responceobject({errormessage:dataxml}));
					return;
				};
				self.responceCallBack(require('./wrappers/responceobject.js').responceobject(data))
			})
			xml2jsparser.parse(dataxml);	
		}
		
	},
	
	apicall:function(){
		var urlobject=url.parse(this.url),options={},http=require(urlobject.protocol.split(':').join('')),self=this;
		if(Object.keys(this.params).length>0){
			var queryarr=[];
			for (var key in this.params) {
			  queryarr.push(key+'='+encodeURIComponent(this.params[key]));
			};
			if(this.method=='GET'){
				urlobject.path=urlobject.path.split('?')[0]+'?'+queryarr.join('&')+'&'+urlobject.path.split('?')[1];				
			}
			
		}
		options={
			host:urlobject.hostname,
			port:urlobject.port,
			path:urlobject.path,
			method:this.method
			
		}
		
		if(this.method=='POST'){
			options.headers= {
		          'Content-Type': 'application/x-www-form-urlencoded',
		          'Content-Length': decodeURIComponent(queryarr.join('&')).length
		      }
		}
		var request=http.request(options),
		data='';
		request.on('socket',function(socket){
			socket.on('connect',function(){
				socket.setKeepAlive(true,500);
			})
			socket.setTimeout(60000);
			socket.on('timeout',function(){
				request.abort();
			})
			
		})
		request.on('response',function(response){
			
			response.on('data',function(chunk){
				data+=chunk;
			})
			response.on('end',function(){
				self.responce(response,data);
			})
			response.on('close',function(){
				self.responce(response,data);
			})
			
		})
		request.on('error',function(error){
				self.responce(error,data);		
		})
		
		if(this.method=='POST'){
			request.write(decodeURIComponent(queryarr.join('&')));
		}
		request.end();
	}
}

exports.externalCall=function(url,method,params,callback){
	var externalcall=new externalCall(url,method,params,callback);
	externalcall.apicall();
}

