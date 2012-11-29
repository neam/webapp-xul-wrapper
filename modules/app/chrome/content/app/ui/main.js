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
		window.openDialog('chrome://app/content/about.xul', 'about', 'chrome');
	}

	/**
	 * Checks for updates
	 */
	this.checkForUpdates = function() {
		window.open('chrome://mozapps/content/update/updates.xul', 'updateChecker', 'chrome,centerscreen');
	}
	
}