# syntax=docker/dockerfile:1
   
FROM node:18-alpine
WORKDIR /bootclient.sat.default
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6000

CMD ["npm", "start"]