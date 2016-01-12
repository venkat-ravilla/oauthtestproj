/**
 * @author venkat
 */
var http=require('http'),
	express=require('express'),
	cluster=require('cluster'),
	numcpus=require('os').cpus().length,
	path=require('path'),
	url=require('url'),
	fs=require('fs'),
	_=require('underscore'),
	domain=require('domain'),
	log4js=require('log4js'),
	app,
	logger;
	
	//Default config
	global.config={
		port:3000,
		protocol:'http',
	};

	if(fs.existsSync(__dirname + '/config.js')){
		var overrideobj = require(__dirname + '/config.js').config;
		for (var key in overrideobj) {
		  global.config[key]= overrideobj[key];
		};
	}
	
	if(global.config.protocol === 'http'){
		app=express();
	}else{
		app=express();
	}
	
	app.configure(function(){
		app.use(log4js.connectLogger(log4js.getLogger('access'),{level:log4js.levels.INFO}));
	});

if(cluster.isMaster){
	for (var cpu=0; cpu < numcpus; cpu++) {
	  cluster.fork();
	};
	
	log4js.configure("config_files/server-log-config-master.json",{});
	logger=log4js.getLogger("app");
		
	cluster.on('exit',function(deadworker){
		var worker=cluster.fork();
		
	})
}else{
	app.use(function(req,res,next){
	  var domaininstance=domain.create();
	  res.removeHeader('X-Powered-By')
	  domaininstance.on('error',function(error){
	  	
	  	res.statusCode=500;
	  	res.setHeader('content-type','text/plain');
	  	res.end('Service unavilable');
	  })
	  domaininstance.add(req)
	  domaininstance.add(res)
	  next();
	})
	
	app.configure(function(){
		app.use(express.cookieParser())
		app.use(express.bodyParser())
	})
	
	var developmentConfiguration=function(){
		global.developmentMode=true
	}
	,configureLogging=function(){
		
		log4js.configure("config_files/server-log-config-worker.json",{})
		logger=log4js.getLogger("app");
		
		global.logger=logger
	};
	
	// development only
	app.configure('development', function(){
	  developmentConfiguration();
	  configureLogging();
	})
	
	// production only
	app.configure('production', function(){
	  
	})
	
	/* serving static files */
	app.configure(function(){
		app.use('/static', express.static(__dirname + '/public/static'));
	})
	
	var context=require(__dirname+'/core/js/context.js').context
	/* Interceptor */
	app.use(function(req,res,next){
	  next();
	})
	
	app.get('/oauth2callback', function(req, res){
	  var contextinst=new context(req,res,oauthcallback);
	  
	});
	
	app.get('/rest/:version/:service/:method', function(req, res){
	  var contextinst=new context(req,res,function(){
	  	
	  });
	  
	});
	
	app.get('/app/:app', function(req, res){
		
	  var contextinst=new context(req,res,appcallback);
	  	  
	});
	
	app.get('/app/:app/partials/:template', function(req, res){
		
	  var contextinst=new context(req,res,apppartialcallback);
	  	  
	});
	
	app.get('/combo/:app/:filetype/:file', function(req, res){
	  var contextinst=new context(req,res,combofilecallback);
	  
	});
	
	app.get('/', function(req, res){
	  var contextinst=new context(req,res,function(){
	  	
	  });
	  res.end('req.test')
	});
	
	function combofilecallback(self){
		fs.exists("./applications/"+self.req.param('app')+"/"+self.req.param('filetype')+"/"+self.req.param('file'),function(exists){
			try{
				if(exists){
					var filestream=fs.createReadStream("./applications/"+self.req.param('app')+"/"+self.req.param('filetype')+"/"+self.req.param('file'))
						if(self.req.param('filetype')=='css'){
							self.res.writeHead(200, {'Content-Type': 'text/css'});
						}else if(self.req.param('filetype')=='js'){
							self.res.writeHead(200, {'Content-Type': 'text/js'});
						}
				  		
				        
			  			filestream.pipe(self.res);
				}else{
					throw new Error('file Not Found')
				}
				
			}catch(error){
				logger.error(error);
				self.error();
			}
		})
	}
	
	function authcallback(self){
		fs.exists("./applications/"+self.req.param('app')+"/html/index.html",function(exists){
			try{
				if(exists){
					var filestream=fs.createReadStream("./applications/"+self.req.param('app')+"/html/index.html");
				  		self.res.writeHead(200, {'Content-Type': 'text/html'});
				        
			  			filestream.pipe(self.res);
				}else{
					throw new Error('file Not Found')
				}
				
			}catch(error){
				logger.error(error);
				self.error();
			}
		})
	}
	
	function appcallback(self){
		fs.exists("./applications/"+self.req.param('app')+"/html/index.html",function(exists){
			try{
				if(exists){
					var filestream=fs.createReadStream("./applications/"+self.req.param('app')+"/html/index.html");
				  		self.res.writeHead(200, {'Content-Type': 'text/html'});
				        
			  			filestream.pipe(self.res);
				}else{
					throw new Error('file Not Found')
				}
				
			}catch(error){
				logger.error(error);
				self.error();
			}
		})
	}
	
	function oauthcallback(self){
		fs.exists("./applications/oauth/html/index.html",function(exists){
			try{
				if(exists){
					var filestream=fs.createReadStream("./applications/oauth/html/index.html");
				  		self.res.writeHead(200, {'Content-Type': 'text/html'});
				        
			  			filestream.pipe(self.res);
				}else{
					throw new Error('file Not Found')
				}
				
			}catch(error){
				logger.error(error);
				self.error();
			}
		})
	}
	
	function apppartialcallback(self){
		fs.exists("./applications/"+self.req.param('app')+"/partials/"+self.req.param('template')+".html",function(exists){
			try{
				if(exists){
					var filestream=fs.createReadStream("./applications/"+self.req.param('app')+"/partials/"+self.req.param('template')+".html");
				  		self.res.writeHead(200, {'Content-Type': 'text/html'});
				        
			  			filestream.pipe(self.res);
				}else{
					throw new Error('file Not Found')
				}
				
			}catch(error){
				logger.error(error);
				self.error();
			}
		})
	}
	
	app.listen(3000);
}

process.on("uncaughtException",function(error){
	console.log(error)
});

