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

/**
 * This object contains the various functions for the interface
 */
const MainUI = new function() {
	
	/**
	 * Opens the about dialog
	 */
	this.openAboutDialog = function() {
		window.openDialog('chrome://app/content/ui/about.xul', 'about', 'chrome');
	}

	/**
	 * Checks for updates
	 */
	this.checkForUpdates = function() {
		window.open('chrome://mozapps/content/update/updates.xul', 'updateChecker', 'chrome,centerscreen');
	}

	/**
	 * Run when standalone window first opens
	 */
	this.onLoad = function() {
		if(!App || !App.initialized) {
			window.close();
			return;
		}

		// Load bridge.js - Javascript included from the webapp module
		// todo - check if dir exists - and only import if so
		Components.utils.import("chrome://app/content/bridge/main.js");

		// Run the bridge code (note: window.content = the main browser[type=content-primary] window object)
		Bridge.init(window, App, MainUI);
	}

	/**
	 * Called before standalone window is closed
	 */
	this.onUnload = function() {
		//MainPane.destroy();
	}
	
}

window.addEventListener("load", function(e) { MainUI.onLoad(e); }, false);
window.addEventListener("unload", function(e) { MainUI.onUnload(e); }, false);