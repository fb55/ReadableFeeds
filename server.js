var procFeedReq = require("./"),
	url = require("url"),
	indexPage = require("fs").readFileSync(__dirname + "/templates/index.html"),
	port = (!module.parent && process.argv[2]) || process.env.PORT || 3e3;

require("http").createServer(function(req, resp){
	var link = url.parse(req.url, true);
	if(link.pathname === "/feed") procFeedReq(link.query, resp);
	else if(link.pathname === "/"){
		resp.writeHead(200, { "Content-Type": "text/html" });
		resp.end(indexPage);
	}
	else{
		resp.writeHead(404);
		resp.end();
	}
}).listen(port);

console.log("listening at http://localhost:" + port);