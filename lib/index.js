var minreq = require("minreq"),
	url = require("url"),
	proc = require("./process.js"),
	mote = require("mote"),
	readFileSync = require("fs").readFileSync,
	feedStart = mote.compile(readFileSync(__dirname+"/../templates/01-info.xml")+""),
	feedItem  = mote.compile(readFileSync(__dirname+"/../templates/02-item.xml")+""),
	feedEnd = "</channel></rss>";

module.exports = function(options, response){
	minreq({
		uri: url.parse(options.url),
		only2xx: true
	}, function(err, resp, data){
	
		if(err){
			response.writeHead(503);
			response.end(err.toString());
			return;
		}
		
		var feed = proc.parseFeed(data);
		
		response.writeHead(200, {"Content-Type": "application/rss+xml"});
		response.write(feedStart(feed));
		
		proc.processFeed(feed, function(err, result, item){
			if(err) return; //just skip the element
			
			response.write(feedItem({
				title: options.replace_title === "on" && result.title
					? result.title : item.title,
				link: result.link,
				description: options.append_result === "on" && item.description
					? item.description + "<br/><hr/><br/>" + result.html : result.html,
				pubdate: item.pubDate,
				guid: item.id || item.link
			}));
		}, function(){ response.end(feedEnd); }, parseInt(options.item_num, 10));
	});
};

module.exports.process = proc;