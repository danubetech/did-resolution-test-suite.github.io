#!/bin/sh

echo "Created following report:"
ls -l "$PWD/reports/mochareports/"

echo "Save tests to folder"
DATE_WITH_TIME=$(TZ=UTC date "+%Y-%m-%d_%H:%M:%S")
REPORT_FOLDER="$PWD/gh-pages/$DATE_WITH_TIME"

mkdir "$REPORT_FOLDER"
cp -r "$PWD/reports/." "$REPORT_FOLDER"
echo "gh-pages folder"
ls -l "$PWD/gh-pages/"
echo "reports folder"
ls -l "$REPORT_FOLDER"

echo "Push result file to repo"
git config --global user.email "admin@danubetech.com"
git config --global user.name "Did Resolution tests"
git add "$REPORT_FOLDER"
git commit -m "$DATE_WITH_TIME Did Resolution test report"
git push origin main:gh-pages