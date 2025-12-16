FROM node:18

WORKDIR /usr/src/api

# Copy package files and install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy rest of the code
COPY . .

# Expose application port
EXPOSE 80

# Start the app
CMD ["npm", "run", "start"]
