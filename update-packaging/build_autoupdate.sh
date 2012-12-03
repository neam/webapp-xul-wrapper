#!/bin/bash
FROM=0.0.1
TO=0.0.2
USE_LOCAL_TO=0
CALLDIR=`pwd`
DISTDIR=$CALLDIR/../dist
STAGEDIR=$CALLDIR/staging

# Import configuration
. "$CALLDIR/../config.sh"

mkdir -p "$DISTDIR"

for version in "$FROM" "$TO"; do
	versiondir=$STAGEDIR/$version
	
	if [ -d $versiondir ]; then
		continue
	fi
	
	if [[ $version == $TO && $USE_LOCAL_TO == "1" ]]; then
		ln -s $CALLDIR/../staging $versiondir
		continue
	fi
	
	echo "Getting $APPNAME $version..."
	mkdir -p $versiondir
	cd $versiondir
	
	# Download archives
	MAC_ARCHIVE="${PACKAGENAME}-${version}.dmg"
	WIN_ARCHIVE="${PACKAGENAME}-${version}-win32.zip"
	LINUX_X86_ARCHIVE="${PACKAGENAME}-${version}-linux-i686.tar.bz2"
	LINUX_X86_64_ARCHIVE="${PACKAGENAME}-${version}-linux-x86_64.tar.bz2"
	
	for archive in "$MAC_ARCHIVE" "$WIN_ARCHIVE" "$LINUX_X86_ARCHIVE" "$LINUX_X86_64_ARCHIVE"; do
		rm -f $archive
		wget -nv "$PACKAGESURL/$version/$archive"

		# Only continue if we retrieved the package
		if [ ! -f $archive ]; then
			echo "Could not fetch $archive from server, and no local package found in $versiondir. Aborting"
			rmdir $versiondir
			exit 1
		fi

	done

	# Unpack $APPNAME.app
	hdiutil detach -quiet "/Volumes/$APPNAME" 2>/dev/null
	hdiutil attach -quiet "$MAC_ARCHIVE"
	cp -R "/Volumes/$APPNAME/$APPNAME.app" $versiondir
	rm "$MAC_ARCHIVE"
	hdiutil detach -quiet "/Volumes/$APPNAME"
	
	# Unpack Win32 zip
	unzip -q "$WIN_ARCHIVE"
	rm "$WIN_ARCHIVE"
	
	# Unpack Linux tarballs
	for build in "$LINUX_X86_ARCHIVE" "$LINUX_X86_64_ARCHIVE"; do
		tar -xjf "$build"
		rm "$build"
	done
done

for build in "mac" "win32" "linux-i686" "linux-x86_64"; do
	if [[ $build == "mac" ]]; then
		dir="$APPNAME.app"
	else
		dir="${PACKAGENAME}-$build"
	fi
	cp "$CALLDIR/removed-files_$build" "$STAGEDIR/$TO/$dir/removed-files"
	touch "$STAGEDIR/$TO/$dir/precomplete"
	"$CALLDIR/make_incremental_update.sh" "$DISTDIR/$PACKAGENAME-${TO}-${FROM}-$build.mar" "$STAGEDIR/$FROM/$dir" "$STAGEDIR/$TO/$dir"
	"$CALLDIR/make_full_update.sh" "$DISTDIR/$PACKAGENAME-${TO}-full-$build.mar" "$STAGEDIR/$TO/$dir"
done

cd "$DISTDIR"
shasum -a 512 * > sha512sums
ls -la > files