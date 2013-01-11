#!/bin/bash

if [ -z "$1" ]; then
	echo "Usage: script VERSION"
	exit 1
fi

./build.sh -p w -v $1
