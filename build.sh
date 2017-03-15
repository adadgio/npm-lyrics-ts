#!/bin/bash

# clear log and cache files
rm -rf var/logs/*.log
rm -rf var/cache/*.log

# copy app config
cp -R src/app/config dist/app/config
