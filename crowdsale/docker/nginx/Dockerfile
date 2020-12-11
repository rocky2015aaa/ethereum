FROM nginx:latest
MAINTAINER Donggon Lee <dg.lee@mycreditchain.io>

RUN rm -v /etc/nginx/conf.d/default.conf
ADD ./default.conf /etc/nginx/conf.d/
ADD static static