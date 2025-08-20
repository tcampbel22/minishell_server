FROM node:23-slim

RUN apt-get update && apt-get install -y \
	python3 \
	make \
	g++ \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app/

COPY package*.json /app/
RUN npm install --omit=dev

COPY index.js /app/
COPY ./minishell /app/
RUN chmod +x /app/minishell

RUN mkdir /home/demo
RUN useradd -ms /bin/bash bob
USER bob


CMD [ "node", "/app/index.js" ]