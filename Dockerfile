# Node image
FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN yarn

# App initialization
EXPOSE 5000
ENV NODE_ENV=production
CMD [ "node", "-r", "dotenv/config", "src/index.js" ]
