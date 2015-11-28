FROM node:4.2

EXPOSE 4020

WORKDIR /src

COPY . /src

RUN npm install

CMD npm start