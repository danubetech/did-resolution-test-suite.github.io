#!/bin/sh

cho "#### Driver Status for a Universal Resolver Deployment ####"

echo "Running with parameters:"
sh -c "echo $*"

echo "host: $INPUT_HOST"

echo "Running tests"
cd /opt/did-resolution-test-suite || exit
npm run test

echo "Save tests to folder"
DATE_WITH_TIME=$(TZ=UTC date "+%Y-%m-%d_%H:%M:%S")
REPORTS_FOLDER="$DATE_WITH_TIME"

mkdir "$REPORTS_FOLDER"

echo "Push result file to repo"
git config --global user.email "admin@danubetech.com"
git config --global user.name "Did Resolution tests"
git add "$REPORTS_FOLDER"
git commit -m "$DATE_WITH_TIME Did Resolution test report"
git push origin main:gh-pages


echo "Send message to Slack"
