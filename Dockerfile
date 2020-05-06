FROM brennoa/ezops:latest
MAINTAINER Brenno
COPY . /var/www
WORKDIR /var/www
RUN npm install
ENTRYPOINT npm start
EXPOSE 3000
