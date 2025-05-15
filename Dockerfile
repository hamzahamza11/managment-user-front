FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies including Material UI
RUN npm install 

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "start"] 