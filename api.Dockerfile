FROM node:12.2

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

VOLUME /home/node/app/src

EXPOSE 5000

CMD [ "npm", "start" ]
