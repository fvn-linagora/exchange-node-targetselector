FROM mhart/alpine-node:6

WORKDIR /src
ADD . .
RUN npm install
RUN mkdir -p /src/config

VOLUME ['/src/config']

ENTRYPOINT ["node", "index.js"]
