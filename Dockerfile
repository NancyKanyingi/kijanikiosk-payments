FROM node:18-alpine

WORKDIR /app

# Copy dependency files first (enables layer caching)
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Document the application port
EXPOSE 3001

# Start the application directly
CMD ["node", "dist/index.js"]