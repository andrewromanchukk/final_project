provider "aws" {
  region = var.region
}
#==============DATA==============
data "terraform_remote_state" "network"{
    backend = "s3"
    config = {
        bucket = "terraform-ar-state"
        key = "dev/network/terraform.tfstate"
        region = "eu-west-1"
    }
}
data "terraform_remote_state" "alb" {
  backend = "s3"
  config = {
        bucket = "terraform-ar-state"
        key = "dev/alb/terraform.tfstate"
        region = "eu-west-1"
  }
}  //wwwwwwwwww
#==============DATA==============

terraform {
  backend "s3"{
    bucket = "terraform-ar-state"
    key = "dev/asg/terraform.tfstate"
    region = "eu-west-1"
  } 
}
resource "aws_launch_configuration" "as_frontend" {
  name_prefix   = "terraform-lc-front-"
  image_id      = "ami-08bac620dc84221eb"
  instance_type = "t2.micro"
  key_name = "ireland_st"
  security_groups = [data.terraform_remote_state.network.outputs.security_group_cluster]
  user_data = templatefile("user_data_fe.sh.tpl", 
  {
    access = var.access,
    secret = var.secret,
    region = var.region,
  })
  associate_public_ip_address = true
  
  connection {
        user        = "ubuntu"
        private_key = file("/home/andrii/keys/ireland_st.pem")
    }
  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_autoscaling_group" "asg_frontend" {
  launch_configuration = aws_launch_configuration.as_frontend.name
 vpc_zone_identifier = [
  data.terraform_remote_state.network.outputs.pub_sub_1a, 
  # data.terraform_remote_state.network.outputs.pub_sub_1b
  ]
  target_group_arns = [data.terraform_remote_state.alb.outputs.target_group_fe]
  health_check_type = "ELB"
  min_size = 1
  max_size = 10

 tag {
    key = "Name"
    value = "Frontend"
    propagate_at_launch = true
 }
 lifecycle {
   create_before_destroy = true
 }
}


resource "aws_launch_configuration" "as_backend" {
  name_prefix   = "terraform-lc-back-"
  image_id      = "ami-08bac620dc84221eb"
  instance_type = "t2.micro"
  key_name = "ireland_st"
  security_groups = [data.terraform_remote_state.network.outputs.security_group_cluster]
  user_data = templatefile("user_data_be.sh.tpl",
  {
    access = var.access,
    secret = var.secret,
    region = var.region,
  })
  associate_public_ip_address = true

  connection {
        user        = "ubuntu"
        private_key = file("/home/andrii/keys/ireland_st.pem")
    }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "asg_backend" {
  launch_configuration = aws_launch_configuration.as_backend.name
 vpc_zone_identifier = [
  # data.terraform_remote_state.network.outputs.pr_sub_1a, 
  data.terraform_remote_state.network.outputs.pr_sub_1b
  ]
  target_group_arns = [data.terraform_remote_state.alb.outputs.target_group_be]
 health_check_type = "ELB"
 min_size = 1
 max_size = 10

 tag {
    key = "Name"
    value = "Backend"
    propagate_at_launch = true
 }
 lifecycle {
   create_before_destroy = true
 }
}






# resource "aws_launch_template" "my_templ" {
#   name_prefix   = "my_templ"
#   image_id      = "ami-08bac620dc84221eb"
#   instance_type = "t2.micro"
#   key_name = "ireland_st"
#   user_data = filebase64("user_data.sh")
#     network_interfaces {
#       security_groups = [data.terraform_remote_state.network.outputs.security_group_cluster]
#       associate_public_ip_address = true
#   }
# launch_template {
  #   id      = aws_launch_template.my_templ.id
  #   version = "$Latest"
  # }