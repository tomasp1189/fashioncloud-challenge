#!/usr/bin/env sh
npm -q install nodemon -g
npm -q install bower -g
bower install
rm -rf README.md LICENSE
npm -q install
chmod u+x ./bin/start.sh
chmod u+x ./bin/stop.sh
chmod u+x ./bin/dev_start.sh
