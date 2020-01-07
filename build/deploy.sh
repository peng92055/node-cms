#!/usr/bin/env sh

set -e

npm run build

cd docs/.vuepress/dist

git init
git config user.name 'pengyajun'
git config user.email 'pyj92055@163.com'
git add -A
git commit -m 'deploy'

git push -f git@github.com:peng92055/node-cms.git master:gh-pages

cd -