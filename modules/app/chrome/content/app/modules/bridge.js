/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

App.Bridge = new function() {

	/**
	 * initializes a very rudimentary web server
	 */
	this.init = function(App) {

		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
		var mainWindow = wm.getMostRecentWindow("navigator:browser");

		// Load bridge.js - Javascript included from the webapp module
		Components.utils.import("chrome://app/content/bridge/main.js");

		// Initialize the bridge code
		Bridge.init(mainWindow, App);

	}

};
