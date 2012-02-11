"use strict";

function BasicApplication() {
	
	
};

/**
 * Called when all dependencies are loaded. Initializes the basic objects 
 * like API, RPC.
 */
BasicApplication.prototype.bootstrap = function() {
	$('<div></div>').attr('id', 'widgets').appendTo($('body'));

	// Show a reload dialog, when an RPC error occurs
	var rpcOperations = 0;
	BUS.on('rpc.queue.length', function(length) {
		rpcOperations = length;
	});

	BUS.on('rpc.error', function(err) {
		this.onRPCError(err);
	}, this);
	BUS.on('rpc.connectionerror', function(err) {
		this.onRPCError(err);
	}, this);

	var that = this;
	$(window).bind('beforeunload', function() {
		// We ignore 1 operation, because there is always a notification fetcher working
		if (rpcOperations > 1) { 
			return 'There are operations pending. Are you sure you want to close now?'
		}
		that.unload();
	});

	// Initialize the API and app, when user data is loaded
	
	window.RPC = new JSONRPC('./api/endpoint.php');
	window.API = new WobbleAPI(
		window.RPC,
		function(user) {
			that.preinit(user);
		}
	);
	
}
BasicApplication.prototype.preinit = function(user) {
	this.notificationFetcher = new NotificationHandler();
	

	$('body').empty().append('<div id=widgets></div>');

	this.init(user);
};
BasicApplication.prototype.init = function(user) {
	// Overwrite in Implementation 
};
BasicApplication.prototype.unload = function(user) {
	console.log('Unload detected. Marking backend object as destroyed.');
	// Overwrite in Implementation 
	if (this.notificationFetcher) this.notificationFetcher.destroy();
	if(window.RPC) window.RPC.destroy();
	if(window.API) window.API.destroy();
};

BasicApplication.prototype.onRPCError = function(err) {
	
};

