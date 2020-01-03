FROM node:latest
WORKDIR /app

RUN npm i -g nodemon
RUN apt update -y > /dev/null 2>&1
# RUN apt install software-properties-common -y > /dev/null 2>&1
# RUN add-apt-repository ppa:jonathonf/ffmpeg-4 -y > /dev/null 2>&1
RUN apt install ffmpeg -y > /dev/null 2>&1

CMD npm i && npm start
