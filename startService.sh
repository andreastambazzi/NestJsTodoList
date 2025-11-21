#!/bin/bash

cd /opt/app
export NODE_ENV="production" && npm install --production && node ./dist/main.js