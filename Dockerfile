FROM node:18

WORKDIR /usr/src/api

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --force

# Copy the rest of the application
COPY . .

# Expose application port
EXPOSE 80

# Start the app
CMD ["npm", "run", "start"]
