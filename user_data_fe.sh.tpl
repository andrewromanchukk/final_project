#!/bin/bash
sudo apt-get update;
sudo apt-get install awscli -y;
#echo "------------add awscli configure file-------------"
sudo mkdir /home/ubuntu/.aws;
sudo chmod 0666 /home/ubuntu/aws/*
sudo touch /home/ubuntu/.aws/credentials /home/ubuntu/.aws/config;
export AWS_ACCESS_KEY_ID=${access}
export AWS_SECRET_ACCESS_KEY=${secret}
export AWS_DEFAULT_REGION=${region}
#echo "------------------install docker---------------------"
sudo apt-get update;
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y;
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -;
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs)  stable";
sudo apt-get install docker-ce -y;
#echo "-----------------set docker us root--------------------"
sudo chown root:docker /var/run/docker.sock;
sudo chown -R root:docker /var/run/docker;
sudo chmod 666 /var/run/docker.sock;
#echo "-------------register to ecr and docker pull image--------------------"
aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin 634612353979.dkr.ecr.${region}.amazonaws.com;
docker pull 634612353979.dkr.ecr.${region}.amazonaws.com/eschool-frontend:latest;
docker run -d -p 80:80 634612353979.dkr.ecr.${region}.amazonaws.com/eschool-frontend:latest;
