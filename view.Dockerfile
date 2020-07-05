FROM node:12.2

WORKDIR /home/node/public

RUN npm install http-server --g

VOLUME /home/node/public

EXPOSE 8080

CMD [ "http-server" ]
