/*
    ***** BEGIN LICENSE BLOCK *****

	Copyright © 2012 Webapp XUL Wrapper contributors
    Copyright © 2009 Center for History and New Media
                     George Mason University, Fairfax, Virginia, USA
                     http://zotero.org

    This file is part of Webapp XUL Wrapper.

    Webapp XUL Wrapper is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Webapp XUL Wrapper is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with Webapp XUL Wrapper.  If not, see <http://www.gnu.org/licenses/>.

    ***** END LICENSE BLOCK *****
*/

/*
 * Common functions
 */
(function(){

	// Privileged (public) methods
	this.init = init;
	this.getWebAppDirectory = getWebAppDirectory;
	this.getRootPrefBranch = getRootPrefBranch;
	this.debug = debug;
	
	// Public properties
	this.initialized = false;
	
	/**
	 * Initialize the wrapper
	 */
	function init() {
		if (this.initialized) {
			return false;
		}
		
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].
		getService(Components.interfaces.nsIXULAppInfo),
		platformVersion = appInfo.platformVersion;

		this.version = appInfo.version;
		
		if(!_initModules()) return false;
		this.initComplete();
		
		return true;
	}
	
	/**
	 * Triggers events when initialization finishes
	 */
	this.initComplete = function() {
		if(this.initialized) return;
		this.initialized = true;
	}
	
	/**
	 * Initialize modules
	 */
	function _initModules() {
		if(getRootPrefBranch().getBoolPref("app.httpServer.enabled")) {
			App.HttpServer.init();
		}
		return true;
	}

	function getWebAppDirectory() {

		var file = Components.classes["@mozilla.org/file/directory_service;1"].
		getService(Components.interfaces.nsIProperties).
		get("AChrom", Components.interfaces.nsIFile);
		file.append("webapp");
		return file;

	}

	var gRootPrefBranch = null;
	function getRootPrefBranch()
	{
		if (!gRootPrefBranch)
		{
			gRootPrefBranch = Cc["@mozilla.org/preferences-service;1"]
			.getService(Ci.nsIPrefBranch);
		}
		return gRootPrefBranch;
	}

	function debug(msg) {
		dump(msg + "\n");
	}

}).call(App);



