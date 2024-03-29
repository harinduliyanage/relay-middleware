FROM node:18.18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build


EXPOSE 3001
CMD ["npm", "start"]
