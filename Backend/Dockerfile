FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy rest of backend
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
