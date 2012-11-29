Webapp XUL Wrapper
-----------------------------
Webapp XUL Wrapper is a collection of build scripts for packaging a webapp into distributable bundles for Mac, Windows, and Linux.

The end result is a standalone and offline version of your web application.

Included in the distribution package:

* A minimal XUL application with a main browser window and an about dialog
* A bundled [HTTP server](https://developer.mozilla.org/en-US/docs/Httpd.js/HTTP_server_for_unit_tests)
* XULRunner 17 (Gecko 17)

Benefits
-----------------------------

* Latest HTML5 support (Same as Firefox 17, and easy to use new Gecko versions as they are released)
* Browser plugin support (Firefox plug-ins and extensions may be bundled with the application)
* [Application Updates](https://developer.mozilla.org/en-US/docs/XULRunner/Application_Update)
* Bundled HTTP server (No local content restrictions like when using file:// protocol etc)
* Not only acting as a native desktop application, it **is** a native desktop application
* Working on the most widely used desktop operating systems, as well as 32- and 64-bit Linux (Wherever Firefox 17 runs, this runs)
* Installable from USB Stick / CD, Offline
* Offline usage
* Proven and well tested (indirectly through projects like Zotero and Firefox)
* Not dependent on third party services for packaging and/or distribution

For a more in-depth overview of current Standalone Web App Cross-Platform Desktop Distribution Solutions, [check this out](http://blog.neamlabs.com/post/36584972328/2012-11-26-web-app-cross-platform-desktop-distribution).

Get started
-----------------------------
Instructions for building and packaging are mostly the same as for Zotero Standalone and are available on the [Zotero wiki](http://www.zotero.org/support/dev/client_coding/building_the_standalone_client).
It is recommended that you follow those in order to build a standalone version of the sample webapp that is bundled with the project.

When that is working for you, you can package your own webapp:

1. Fork this project
2. Add your webapp as a git submodule in the modules directory
3. Change the WEBAPPMODULE variable in config.sh to point to your webapp directory
4. If necessary, update the url for the browser tag in modules/app/chrome/content/app/ui/main.xul
5. Customize branding and metadata to your liking

Tips
-----------------------------
### Debugging the XUL application
Check out [the official docs](https://developer.mozilla.org/en/docs/Debugging_a_XULRunner_Application), stackoverflow etc. On OSX, parameters to xulrunner (such as -jsconsole -P etc) can be put in the mac/app script, as such:

     "$CALLDIR/app-bin" "$CALLDIR/../Resources/application.ini" -P -jsconsole

### Debugging your webapp
This is best done in some other browser, since the browser-view included in the app doesn't offer much development aid.

### Debugging the build process
Add `set -x` near the top of config.sh before building to see everything that the build process does.

### Generating icons
Use [http://iconverticons.com/](http://iconverticons.com/) to generate app icons for all platforms. Put your source image in icons/default/source folder and the generated images in the icons/default folder.

Credits
-----------------------------
The project is based on [Zotero Standalone build utility](https://github.com/zotero/zotero-standalone-build).

License
-----------------------------
The XUL Wrapper application and build scripts are licensed under the [GNU Affero General Public License, version 3](http://www.gnu.org/licenses/agpl-3.0.html). See COPYING for more details.

### Do I need to license my web application under AGPL if I distribute it together with this wrapper?

*"Inclusion of a covered work in an aggregate **does not** cause this License to apply to the other parts of the aggregate"*

Read more: [http://stackoverflow.com/questions/9779643/calling-software-under-agpl-and-gpl](http://stackoverflow.com/questions/9779643/calling-software-under-agpl-and-gpl)
