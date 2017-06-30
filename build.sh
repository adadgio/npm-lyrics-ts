#!/bin/bash

# clear log and cache files
rm -rf var/logs/*.log
rm -rf var/cache/*.log

mkdir -p dist/var/logs
mkdir -p dist/var/cache
mkdir -p dist/src/app/config
mkdir -p dist/src/app/public
mkdir -p dist/src/app/views

# copy app config
cp -R src/app/config dist/src/app
cp -R src/app/public dist/src/app
cp -R src/app/views dist/src/app
