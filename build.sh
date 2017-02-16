#!/bin/bash

# clear log files
rm -rf var/logs/*.log

# copy app config
cp -R src/app/config dist/app/config
