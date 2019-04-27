FROM node

ADD package*.json ./
RUN npm install

ADD src src

ENTRYPOINT ["node", "./src/index.js"]
