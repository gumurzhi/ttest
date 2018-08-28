FROM node:9
ADD init.sh /opt/init.sh
RUN chmod 777 /opt/init.sh
WORKDIR /opt/ttest

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 3000
CMD []
ENTRYPOINT ["/opt/init.sh"]