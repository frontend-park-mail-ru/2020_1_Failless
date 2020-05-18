#!/bin/bash
set -e
ssh a.prokopenko@163.172.133.90 -v exit
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/public/static/dist a.prokopenko@163.172.133.90:/home/a.prokopenko/eventum/deploy
