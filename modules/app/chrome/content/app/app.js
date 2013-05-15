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
	this.safeDebug = safeDebug;
	this.getString = getString;
	
	// Public properties
	this.initialized = false;
	this.version = null;
	this.build = null;
	
	// Private properties
	var _localizedStringBundle;

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
		this.build = appInfo.appBuildID;
		
		// Load in the localization stringbundle for use by getString(name)
		var stringBundleService =
			Components.classes["@mozilla.org/intl/stringbundle;1"]
			.getService(Components.interfaces.nsIStringBundleService);
		var localeService = Components.classes['@mozilla.org/intl/nslocaleservice;1'].
							getService(Components.interfaces.nsILocaleService);
		var appLocale = localeService.getApplicationLocale();

		_localizedStringBundle = stringBundleService.createBundle(
			"chrome://app/locale/app.properties", appLocale);

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

	function safeDebug(obj){
		for (var i in obj){
			try {
				App.debug(i + ': ' + obj[i]);
			}
			catch (e){
				try {
					App.debug(i + ': ERROR');
				}
				catch (e){}
			}
		}
	}
	
	function getString(name, params){
		try {
			if (params != undefined){
				if (typeof params != 'object'){
					params = [params];
				}
				var l10n = _localizedStringBundle.formatStringFromName(name, params, params.length);
			}
			else {
				var l10n = _localizedStringBundle.GetStringFromName(name);
			}
		}
		catch (e){
			throw ('Localized string not available for ' + name);
		}
		return l10n;
	}

}).call(App);



