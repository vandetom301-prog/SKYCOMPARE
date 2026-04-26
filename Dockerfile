FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install express axios
COPY . .
EXPOSE 10000
CMD ["node", "server.js"]
