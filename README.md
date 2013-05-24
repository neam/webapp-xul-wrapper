Webapp XUL Wrapper
-----------------------------
Webapp XUL Wrapper is a collection of build scripts for packaging a webapp into distributable bundles for Mac, Windows, and Linux.

The end result is a standalone offline version of your web application.

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
It is recommended that you follow those in order to build a standalone version of the Kitchen Sink webapp that is bundled with the project:

![Screenshot of the Kitchen Sink](https://raw.github.com/neam/webapp-xul-wrapper-kitchensink/develop/misc/screen.png "Screenshot of the Kitchen Sink")

If your system is properly configured and you are using OSX, you should be able to get the Kitchen Sink running as per above by executing:

     ./run-kitchensink.sh

When that is working for you, you can package your own webapp:

1. Fork this project
2. Add your webapp as a git submodule in the modules directory
3. Change the WEBAPPMODULE variable in config.sh to point to your webapp directory
4. If necessary, update the url for the browser tag in modules/app/chrome/content/app/ui/main.xul
5. Customize branding and metadata to your liking

The Kitchen Sink acts as a reference implementation for how to send messages between the webapp and the wrapper XUL application. (Hint: Check the scripts under the folder indicated by the BRIDGESCRIPTS variable in config.sh)

Tips
-----------------------------
### Debugging the XUL application
Check out [the official docs](https://developer.mozilla.org/en/docs/Debugging_a_XULRunner_Application), stackoverflow etc. On OSX, parameters to xulrunner (such as -jsconsole -P -purgecache etc) can be appended to the Contents/MacOS/app script, as such:

     Contents/MacOS/app -P -jsconsole -purgecache

On Windows, create a shortcut to app.exe and add the parameters in that shortcut's properties.

Zotero has some [relevant documentation](http://www.zotero.org/support/dev/client_coding/javascript_api) on how to set up a debug environment.

### Debugging your webapp
This is best done in some other browser, since the browser-view included in the app doesn't offer much development aid. While the standalone app is running, you can access the bundled webapp on [http://localhost:57187](http://localhost:57187).

### Debugging the build scripts
Add `set -x` near the top of config.sh before building to see everything that the build process does.

### Generating icons
Use [http://iconverticons.com/](http://iconverticons.com/) to generate app icons for all platforms. Put your source image in icons/default/source folder and the generated images in the icons/default folder.

### Generate packages for a specific version
Example where versions 0.0.1, 0.0.2, 0.0.3 and 0.0.4 have been released previously, and version 0.0.5 is to be packaged:

On OSX or Linux in the project directory, run:

     ./build-mac-and-linux-packages.sh 0.0.5

In Windows (Cygwin) in the project directory, run:

     ./build-windows-installer-package.sh 0.0.5

This will produce the relevant download packages for Mac, Linux and Windows in the "dist/0.0.5" directory. These should be offered to end users on a product download page or similar.

Now on to the application update packages. These can be generated fully from within any single development environment (OSX, Linux or Windows). Read [the official docs](https://developer.mozilla.org/en-US/docs/XULRunner/Application_Update) for general information. Enhanced versions of the utility scripts are included in this project, but you need to make sure [mar and mbsdiff](https://wiki.mozilla.org/UpdateGeneration#What_the_Makefiles_do.2C_or_How_to_make_your_own_updates) are available in your PATH. You also need to keep previous versions' download packages available under PACKAGEURL set in config.sh. Then, run:

     cd update-packaging/

     # Reset from earlier update packagings
     rm -rf dist/ # Clears dist directory
     if [ -h "staging/0.0.4" ]; then rm staging/0.0.4; fi # Clears previous symbolic link in staging directory

     # Build update packages
     ./build_autoupdate.sh 0.0.1 0.0.5
     ./build_autoupdate.sh 0.0.2 0.0.5
     ./build_autoupdate.sh 0.0.3 0.0.5
     ./build_autoupdate.sh 0.0.4 0.0.5

This will produce the relevant application update packages for Mac, Linux and Windows in the "update-packaging/dist" directory. These packages are served by an application update server in accordance to [official XULRunner documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Setting_up_an_update_server).

Changelog
-----------------------------

1.1.0 (2013-01-11)

 - Easier generation of update packages for partial application updates
 - Make sure that all staging and dist directories are created (Fixes #1)
 - Disabled browser disk cache (app updates immediately effective)
 - Links with target="_blank" opens in a new window

1.0.0 (2012-12-04)

 - First release

Credits
-----------------------------
The project is based on [Zotero Standalone build utility](https://github.com/zotero/zotero-standalone-build).

License
-----------------------------
The XUL Wrapper application and build scripts are licensed under the [GNU Affero General Public License, version 3](http://www.gnu.org/licenses/agpl-3.0.html). See COPYING for more details.

### Do I need to license my web application under AGPL if I distribute it together with this wrapper?

*"Inclusion of a covered work in an aggregate **does not** cause this License to apply to the other parts of the aggregate"*

Read more: [http://stackoverflow.com/questions/9779643/calling-software-under-agpl-and-gpl](http://stackoverflow.com/questions/9779643/calling-software-under-agpl-and-gpl)
