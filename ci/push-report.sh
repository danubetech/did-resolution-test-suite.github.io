#!/bin/sh

echo "Created following report:"
ls -l /home/runner/work/did-resolution-test-suite/did-resolution-test-suite/reports/mochareports/

echo "Save tests to folder"
DATE_WITH_TIME=$(TZ=UTC date "+%Y-%m-%d_%H:%M:%S")
REPORTS_FOLDER="/home/runner/work/did-resolution-test-suite/did-resolution-test-suite/gh-pages/$DATE_WITH_TIME-api-tests"

mkdir "$REPORTS_FOLDER"
cp -r /home/runner/work/did-resolution-test-suite/did-resolution-test-suite/reports/mochareports/ "$REPORTS_FOLDER"
echo "gh-pages folder"
ls -l /home/runner/work/did-resolution-test-suite/did-resolution-test-suite/gh-pages/
echo "reports folder"
ls -l "$REPORTS_FOLDER"

#echo "Push result file to repo"
#git config --global user.email "admin@danubetech.com"
#git config --global user.name "Did Resolution tests"
#git add "$REPORTS_FOLDER"
#git commit -m "$DATE_WITH_TIME Did Resolution test report"
#git push origin main:gh-pages