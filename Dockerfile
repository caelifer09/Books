FROM node:18

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

RUN npm install bcrypt

RUN npm install -g typescript

COPY . .

EXPOSE 8000

#Build to project
RUN tsc

# Run node server
CMD ["npm", "start"]