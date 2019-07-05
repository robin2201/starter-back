FROM node:latest

COPY ./ ./

RUN npm run build

ENV port 8080

CMD [ "node", "dist/server.js" ]
