/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

App.HttpServer = new function() {

	/**
	 * initializes a very rudimentary web server
	 */
	this.init = function(port, bindAllAddr) {

		// import httpd.js local web server
		Components.utils.import("chrome://app/content/modules/httpServer/httpd.js");
		var server = new HttpServer();

		// serve webapp directory
		server.registerDirectory("/", App.getWebAppDirectory());

		// httpd.js gets worried when there is no stop callback
		server._stopCallback = function() {
			App.debug("HTTP server stopped");
		}

		var prefs = App.getRootPrefBranch();

		try {
			// bind to a random port on loopback only
			server.start(port ? port : prefs.getIntPref("app.httpServer.port"), (bindAllAddr ? "0.0.0.0": " 127.0.0.1"));
			App.debug("HTTP server listening on "+(bindAllAddr ? "*": "127.0.0.1")+":"+server._port);
		} catch(e) {
			App.debug("Not initializing HTTP server");
		}
		
	}

}