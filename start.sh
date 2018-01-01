#!/bin/sh

cd /home/ec2-user/src/onlinehomilies.node

./node_modules/.bin/forever start app.js
