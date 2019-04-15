
ARG ubuntu_version=latest
ARG node_version=latest

FROM ubuntu:$ubuntu_version
FROM node:$node_version

LABEL name="express-docker" version="1.0.0"

ENV project_dir=/home/www/express-locallibrary
RUN mkdir -p $project_dir

WORKDIR $project_dir
COPY package*.json $project_dir

RUN apt-get update \
    # && apt-get install -y nodejs \
    && npm install -g nodemon \
    && npm install \
    && rm -rf /var/lib/apt/lists/*
    

COPY . $project_dir

# RUN npm uninstall node-sass && npm install node-sass --sass-binary-name=linux-x64-57
# RUN npm rebuild node-sass

# 安装 dumb-init
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 \
    && chmod +x /usr/local/bin/dumb-init

EXPOSE 4000


# ENTRYPOINT ["npm", "run"]
# CMD ["start"]

# 模拟初始化系统
# ENTRYPOINT ["/bin/sh"]

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD [ "bash"]