FROM node:22-alpine
WORKDIR /src
RUN apk update && apk add --no-cache ffmpeg
COPY package*.json ./
COPY . .
RUN yarn install --production
CMD ["node", "app.js"]
EXPOSE 3000