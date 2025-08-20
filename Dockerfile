FROM node:23-slim

RUN apt-get update && apt-get install -y
RUN apt-get install build-essential

WORKDIR /app/

COPY package*.json /app/
RUN npm install --production

COPY index.js /app/
COPY ./minishell /usr/local/bin/minishell
RUN chmod +x /usr/local/bin/minishell

RUN mkdir /home/demo
RUN useradd -ms /bin/bash bob
USER bob


CMD [ "node", "/app/index.js" ]