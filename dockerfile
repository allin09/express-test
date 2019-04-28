
# ARG ubuntu_version=latest
# ARG node_version=latest

FROM ubuntu
# FROM node:$node_version

LABEL name="express-docker" version="1.0.0"
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV LANG C.UTF-8
ENV project_dir=/home/www/express-locallibrary/ mongo_db=/tmp/mongodb/data

RUN mkdir -p $project_dir

RUN apt-get update \
    # && apt-get upgrade \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y \
    # apt-utils \
    nano \
    tree \
    sudo \
    nodejs \
    # nodejs-npm \
    dumb-init \
    && apt-get clean \
    && apt-get autoclean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
    
    

# RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo
# USER root

# RUN mkdir -m 777 -vp /tmp/mongodb/{data,log}
RUN mkdir -m 777 -vp /tmp/mongodb/data
RUN mkdir -m 777 -vp /tmp/mongodb/log
RUN touch /tmp/mongodb/log/mongo.log
RUN chmod -R go+w /tmp/mongodb/log/mongo.log
RUN chmod 755 /tmp/mongodb/log/mongo.log
# RUN chown -R mongodb:mongodb /tmp/mongodb/log/mongo.log
# && sudo chown -R $USER $mongo_db


WORKDIR $project_dir
COPY package*.json $project_dir
RUN npm install -g nodemon \
    && npm install

COPY . $project_dir
COPY ./config3/mongodb/mongod.conf /etc/mongod.conf

# RUN ls -al .
# USER root
# RUN chmod +x ${project_dir}run.sh
# RUN npm uninstall node-sass && npm install node-sass --sass-binary-name=linux-x64-57
# RUN npm rebuild node-sass

# 安装 dumb-init
# RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 \
#     && chmod +x /usr/local/bin/dumb-init

EXPOSE 4000


# ENTRYPOINT ["npm", "run"]
# CMD ["start"]

# 模拟初始化系统
# ENTRYPOINT ["/bin/sh"]

ENTRYPOINT ["/usr/bin/dumb-init"]
# CMD ["bash"]
CMD npm run dev