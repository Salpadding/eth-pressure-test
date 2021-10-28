FROM node:14-alpine

ADD . /app
WORKDIR /app
RUN npm i

ENTRYPOINT ["node"]
CMD ["index.js"]


