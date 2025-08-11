# Use Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port (Next.js default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
