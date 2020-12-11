FROM ubuntu
MAINTAINER Donggonlee <rocky2010aaa@naver.com>
ADD ken-linux-amd64/ /root 
ENV PATH /root/bin:$PATH
WORKDIR /root
ENTRYPOINT ["ken","--datadir","~/ken_home","--cypress", "--rpc", "--rpcport", "9889", "--rpcaddr", "0.0.0.0"]

