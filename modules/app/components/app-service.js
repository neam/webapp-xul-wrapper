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

const Cc = Components.classes;
const Ci = Components.interfaces;

/** Modules to load **/
const modulesAll = [
'httpServer'
];

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

var zContext = null;

AppContext = function() {}
AppContext.prototype = {
	
	"Cc":Cc,
	"Ci":Ci
	
};

/**
 * The class from which the App global XPCOM context is constructed
 *
 * @constructor
 * This runs when AppService is first requested to load all applicable scripts and initialize
 * App. Calls to other XPCOM components must be in here rather than in top-level code, as other
 * components may not have yet been initialized.
 */
function makeAppContext() {
	if(zContext) {
		// Swap out old zContext
		var oldzContext = zContext;
		// Create new zContext
		zContext = new AppContext();
		// Swap in old App object, so that references don't break, but empty it
		zContext.App = oldzContext.App;
		for(var key in zContext.App) delete zContext.App[key];
	} else {
		zContext = new AppContext();
		zContext.App = function() {};
	}
	
	// Load zotero.js first
	Cc["@mozilla.org/moz/jssubscript-loader;1"]
	.getService(Ci.mozIJSSubScriptLoader)
	.loadSubScript("chrome://app/content/app.js", zContext);
	
	// Load modules
	for (var i=0; i<modulesAll.length; i++) {
		try {
			Cc["@mozilla.org/moz/jssubscript-loader;1"]
			.getService(Ci.mozIJSSubScriptLoader)
			.loadSubScript("chrome://app/content/modules/" + modulesAll[i] + ".js", zContext);
		}
		catch (e) {
			Components.utils.reportError("Error loading " + modulesAll[i] + ".js", zContext);
			throw (e);
		}
	}
};

/**
 * The class representing the App service, and affiliated XPCOM goop
 */
function AppService() {
	try {
		var start = Date.now();
		
		if(isFirstLoadThisSession) {
			makeAppContext(false);
			try {
				zContext.App.init();
			} catch(e) {
				dump(e.toSource());
				Components.utils.reportError(e);
				throw e;
			}
		}
		this.wrappedJSObject = zContext.App;
		
		zContext.App.debug("Initialized in "+(Date.now() - start)+" ms");
	} catch(e) {
		var msg = typeof e == 'string' ? e : e.name;
		dump(e + "\n\n");
		Components.utils.reportError(e);
		throw e;
	}
}

AppService.prototype = {
	contractID: '@webapp-xul-wrapper/App;1',
	classDescription: 'App',
	classID: Components.ID('{d1931d9e-be49-4130-a386-a654314a973a}'),
	QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsISupports,
		Components.interfaces.nsIProtocolHandler])
}

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.2 (Firefox 3.6).
*/
if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([AppService]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([AppService]);
}