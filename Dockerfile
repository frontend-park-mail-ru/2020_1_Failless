# TODO: REWRITE ASAP

FROM nginx

RUN apt-get upgrade -y
RUN apt-get update -y

# update 
RUN apt-get update -y
# install curl 
RUN apt-get install curl -y
# get install script and pass it to execute: 
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
# and install node 
RUN apt-get install nodejs -y
# confirm that it was successful 
RUN node -v
# npm installs automatically 
RUN npm -v

# RUN apt-get install npm -y

ADD ./nginx/nginx.conf /etc/nginx/conf.d/

RUN mkdir -p /static

ADD ./public /static/
ADD ./scripts /static/
ADD ./package.json /static/

WORKDIR /static

RUN npm install