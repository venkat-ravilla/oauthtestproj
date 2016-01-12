/**
 * @author venkat
 */
var eventemmitter=require('events').EventEmitter;
var util = require('util');
function context(req,res,callback){
	this.req=req;
	this.res=res;
	this.params={};
	
	for(var key in req.query){
		this.params[key]=req.query[key];
	}
	if(req.path.indexOf('rest')>-1){
		this.restcall();
	}
	//this.on('error',errorHandler,this)
	callback(this);
}
//util.inherits(context, eventemmitter);
context.prototype={
	
	restcall:function(){
		var self=this,
		exitresponse=function(responceresult){
			self.res.end(JSON.stringify(responceresult));
		},
		service=require('./../../restservice/'+this.req.param('version')+'/'+this.req.param('service'));
		service[this.req.param('service')][this.req.param('method')].call(this,exitresponse)
	},
	
	externalApiCall:function(url,method,params,callback){
		 require('./externalApiCall.js').externalCall(url,method,params,callback);
	},
	
	error:function(){
		this.res.statusCode=500;
	  	this.res.setHeader('content-type','text/plain');
	  	this.res.end('Service unavilable');
	},
	param:function(paramkey,defaultvalue){
		if(this.params[paramkey]!=null && this.params[paramkey]!=''){
			return this.params[paramkey];
		}else{
			return defaultvalue;
		}
	}
}


exports.context=context;