#!/bin/bash
set -e
ssh a.prokopenko@163.172.133.90 -v exit
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/public/static/dist a.prokopenko@163.172.133.90:/home/a.prokopenko/eventum/deploy
#git config --global push.default simple # we only want to push one branch — master
# specify the repo on the live server as a remote repo, and name it 'production'
# <user> here is the separate user you created for deploying
#git remote add production ssh://a.prokopenko@163.172.133.90/home/a.prokopenko/eventum/deploy
#git pull --rebase
#git push production feature/travis-ci # push our updates
#npm install
#npx webpack