# TODO: REWRITE ASAP
FROM nginx

# update 
RUN apt-get update -y
# install curl 
RUN apt-get install curl -y
# get install script and pass it to execute: 
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
# and install node 
RUN apt-get install nodejs -y

ADD ./nginx/nginx.conf /etc/nginx/conf.d/
RUN [ ! -e file ] || rm /etc/nginx/conf.d/default.conf

RUN mkdir -p /static
WORKDIR /static

COPY public public/
COPY scripts scripts/
ADD package.json ./

RUN npm install
RUN npm run build:all