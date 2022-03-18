FROM node:16-buster

LABEL "com.github.actions.name"="Run did-resolution-test-suite"
LABEL "com.github.actions.description"="Run did-resolution-test-suite"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="blue"
LABEL "version"="1.0.0"
LABEL "repository"="https://github.com/danubetech/did-resolution-test-suite"
LABEL "maintainer"="Bernhard Fuchs <bernhard.fuchs@danubetech.com>"

RUN apt-get update && apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

ADD .. /opt/did-resolution-test-suite
RUN ls -l /
RUN ls -l /opt
RUN ls -l /opt/did-resolution-test-suite
RUN cd /opt/did-resolution-test-suite && npm install
RUN cd /opt/did-resolution-test-suite && node_modules/cypress/bin/cypress install

WORKDIR /ci/

RUN chmod +x /opt/did-resolution-test-suite/ci/entrypoint.sh
ENTRYPOINT ["/opt/did-resolution-test-suite/ci/entrypoint.sh"]