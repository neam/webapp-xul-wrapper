# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""
This script generates the complete snippet for a given locale or en-US
Most of the parameters received are to generate the MAR's download URL
and determine the MAR's filename
"""
import sys, os, platform, hashlib
from optparse import OptionParser
from ConfigParser import ConfigParser
from stat import ST_SIZE

def main():
    error = False
    parser = OptionParser(
        usage="%prog [options]")
    parser.add_option("--mar-path",
                      action="store",
                      dest="marPath",
                      help="[Required] Specify the absolute path where the MAR file is found.")
    parser.add_option("--application-ini-file",
                      action="store",
                      dest="applicationIniFile",
                      help="[Required] Specify the absolute path to the application.ini file.")
    parser.add_option("-p",
                      "--product",
                      action="store",
                      dest="product",
                      help="[Required] This option is used to generate the URL to download the MAR file.")
    parser.add_option("--platform",
                      action="store",
                      dest="platform",
                      help="[Required] This option is used to indicate which target platform.")
    parser.add_option("--channel",
                      action="store",
                      dest="channel",
                      help="This option is used to indicate which update channel is used.")
    parser.add_option("--from-version",
                      action="store",
                      dest="fromVersion",
                      help="This is used for a partial update package to indicate from what version it will update from.")
    parser.add_option("--download-base-URL",
                      action="store",
                      dest="downloadBaseURL",
                      help="This option indicates under which.")
    parser.add_option("-v",
                      "--verbose",
                      action="store_true",
                      dest="verbose",
                      default=False,
                      help="This option increases the output of the script.")
    (options, args) = parser.parse_args()
    for req, msg in (('marPath', "the absolute path to the where the MAR file is"),
                     ('applicationIniFile', "the absolute path to the application.ini file."),
                     ('product', "specify a product."),
                     ('platform', "specify the platform.")):
        if not hasattr(options, req):
            parser.error('You must specify %s' % msg)

    if not options.channel or options.channel == '':
        options.channel = None

    for marType in ('complete', 'partial'):
        snippet, marFileName = generateSnippet(options.marPath,
                                  options.applicationIniFile,
                                  marType,
                                  options.downloadBaseURL,
                                  options.product,
                                  options.platform,
                                  options.channel,
                                  options.fromVersion)
        f = open(os.path.join(options.marPath, marFileName+'.update.snippet'), 'wb')
        f.write(snippet)
        f.close()

        if options.verbose:
            # Show in our logs what the contents of the snippet are
            print snippet

def getMarFileName(product,appVersion,fromVersion,marType,platform):
    if marType == 'partial':
        version = '%s-to-%s' % (fromVersion,appVersion)
    else:
        version = appVersion
    marFileName = '%s-%s-%s-%s.mar' % (
        product,
        version,
        marType,
        platform)
    return marFileName

def generateSnippet(abstDistDir, applicationIniFile, marType,
                    downloadBaseURL, product, platform, channel, fromVersion):
    # Let's extract information from application.ini
    c = ConfigParser()
    try:
        c.readfp(open(applicationIniFile))
    except IOError, (stderror):
       sys.exit(stderror)
    buildid = c.get("App", "BuildID")
    appVersion = c.get("App", "Version")

    marFileName = getMarFileName(
        product,
        appVersion,
        fromVersion,
        marType,
        platform)
    # Let's determine the hash and the size of the MAR file
    # This function exits the script if the file does not exist
    (completeMarHash, completeMarSize) = getFileHashAndSize(
        os.path.join(abstDistDir, marFileName))
    # Construct the URL to where the MAR file will exist
    marDownloadURL = "%s/%s/%s/%s" % (downloadBaseURL,
                                     channel,
                                     appVersion,
                                     marFileName)

    snippet = """
type=%(marType)s
url=%(marDownloadURL)s
hashFunction=sha512
hashValue=%(completeMarHash)s
size=%(completeMarSize)s
build=%(buildid)s
appv=%(appVersion)s
extv=%(appVersion)s
""" % dict( marType=marType,
            marDownloadURL=marDownloadURL,
            completeMarHash=completeMarHash,
            completeMarSize=completeMarSize,
            buildid=buildid,
            appVersion=appVersion)

    return snippet, marFileName

def getFileHashAndSize(filepath):
    sha1Hash = 'UNKNOWN'
    size = 'UNKNOWN'

    try:
        # open in binary mode to make sure we get consistent results
        # across all platforms
        f = open(filepath, "rb")
        shaObj = hashlib.sha512(f.read())
        sha1Hash = shaObj.hexdigest()
        size = os.stat(filepath)[ST_SIZE]
    except IOError, (stderror):
       sys.exit(stderror)

    return (sha1Hash, size)

if __name__ == '__main__':
    main()