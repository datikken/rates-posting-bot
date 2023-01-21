docker build . --tag ratesbot &&

docker run \
--env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
--env=NODE_VERSION=16.19.0 \
--env=YARN_VERSION=1.22.19 \
--volume=$(pwd):/usr/src/app \
--workdir=/usr/src/app \
--runtime=runc \
-d ratesbot:latest
