var readability = require("readabilitySAX"),
	FeedHandler = require("htmlparser2/lib/FeedHandler.js"),
	Parser = require("htmlparser2/lib/Parser.js"),
	simplequeue = require("SimpleQueue"),
	parserOpts = {xmlMode:true};

var parseFeed = function(feed){
	var handler = new FeedHandler,
		parser = new Parser(handler, parserOpts);
	
	parser.write(feed);
	parser.end();
	
	return handler.dom;
};

var process = function(element, cb){
	readability.get(element.link || element.id, function(data){
		if(data.error) cb(Error(data.text));
		else cb(null, data);
	});
};

var processFeed = function(feed, itemCB, end, limit){
	if(!feed || !feed.items){
		if(end) end();
		return;
	}

	var queue = new simplequeue(process, itemCB, end);

	var itemNum = feed.items.length;
	if(!limit) limit = itemNum;
	else if(limit > itemNum) limit = itemNum;

	for(var i = 0; i < limit; i++){
		queue.push(feed.items[i]);
	}
};

module.exports = function(data, itemCB, end, limit){
	processFeed(parseFeed(data), itemCB, end, limit);
};

module.exports.parseFeed = parseFeed;
module.exports.processFeed = processFeed;