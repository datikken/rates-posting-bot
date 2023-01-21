FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
EXPOSE 8080
CMD [ "pm2-runtime", "start", "index.js", "--watch" ]
