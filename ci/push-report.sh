#!/bin/sh

echo "Created following report:"
ls -l "$PWD/reports/mochareports/"

echo "Switch to gh-pages branch"
git fetch
git switch gh-pages
git status

echo "Save tests to folder"
DATE_WITH_TIME=$(TZ=UTC date "+%Y-%m-%d_%H:%M:%S")
REPORT_FOLDER="$PWD/gh-pages/$DATE_WITH_TIME"
mkdir "$REPORT_FOLDER"
cp -r "$PWD/reports/." "$REPORT_FOLDER"

echo "Add Link to main page"
sed -i "1s|^|[$DATE_WITH_TIME](https://danubetech.github.io/did-resolution-test-suite/gh-pages/$DATE_WITH_TIME/mochareports/reports.html)  \n|" "$PWD/index.md"

echo "Push result file to repo"
git config --global user.email "admin@danubetech.com"
git config --global user.name "Did Resolution tests"
git add "$REPORT_FOLDER"
git add "$PWD/index.md"
git commit -m "$DATE_WITH_TIME Did Resolution test report"
git push origin gh-pages:gh-pages