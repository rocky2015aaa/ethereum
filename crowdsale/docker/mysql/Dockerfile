FROM mysql:latest
MAINTAINER Donggon Lee <dg.lee@mycreditchain.io>

ENV MYSQL_ROOT_PASSWORD qawsedrf
RUN mkdir scripts
ADD ./user.sql scripts/
ADD ./data.sql scripts/

EXPOSE 3306