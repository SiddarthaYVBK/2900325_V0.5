# Simple Terraform configuration for DevOps assignment
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    # Add http provider if not already implicitly included by Terraform
    # This is usually automatic for standard data sources like http, but good to be explicit
    http = {
      source = "hashicorp/http"
    }
  }
  required_version = ">= 1.0.0"
}

provider "aws" {
  region = "ap-south-1"
}

# Get current public IP using the http data source
data "http" "my_public_ip" {
  url = "https://api.ipify.org?format=json"
  # This makes Terraform treat the JSON output as a map
  # We will then access 'ip' key from this map
  request_headers = {
    Accept = "application/json"
  }
}

# Get default VPC
data "aws_vpc" "default" {
  default = true
}

# Get Ubuntu 22.04 AMI
data "aws_ami" "ubuntu_2204" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"]
}

# Get default subnet with IPv6 (ensure one exists in your default VPC)
data "aws_subnet" "default_ipv6" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "ipv6-cidr-block-association.ipv6-cidr-block"
    values = ["*"]
  }
}

# Security group for Ansible Controller and Worker
resource "aws_security_group" "ansible_sg" {
  name        = "ansible-sg-terraform"
  description = "Allow SSH from specific IP, HTTP/S from anywhere, and all from within SG"
  vpc_id      = data.aws_vpc.default.id

  # Ingress: Allow SSH from the IP where Terraform is run (e.g., Jenkins server)
  ingress {
    description = "SSH from my IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    # Parse the JSON response to get the 'ip' key
    cidr_blocks = ["${jsondecode(data.http.my_public_ip.response_body).ip}/32"]
  }

  # Ingress: Allow all traffic within this security group (Controller to Worker, Worker to Controller)
  ingress {
    description = "Allow all traffic within SG"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  # Ingress: Allow HTTP access from anywhere (for the web application)
  ingress {
    description = "HTTP access (publicly accessible)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Changed to allow public access
  }

  # Egress: Allow all outbound traffic
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "ansible-sg-terraform"
  }
}

# Ansible Controller instance
resource "aws_instance" "ansible_controller" {
  ami                   = data.aws_ami.ubuntu_2204.id
  instance_type         = "t2.micro"
  key_name              = "AnsibleController" # Ensure this EC2 Key Pair exists in ap-south-1

  vpc_security_group_ids      = [aws_security_group.ansible_sg.id]
  subnet_id                   = data.aws_subnet.default_ipv6.id
  associate_public_ip_address = true
  ipv6_address_count          = 1

  tags = {
    Name = "AnsibleControllerTerraform"
  }
}

# Ansible Worker instance
resource "aws_instance" "ansible_worker" {
  ami                   = data.aws_ami.ubuntu_2204.id
  instance_type         = "t2.micro"
  key_name              = "AnsibleController" # Ensure this EC2 Key Pair exists in ap-south-1

  vpc_security_group_ids      = [aws_security_group.ansible_sg.id]
  subnet_id                   = data.aws_subnet.default_ipv6.id
  associate_public_ip_address = true
  ipv6_address_count          = 1

  # Removed the user_data block for injecting authorized_keys.
  # The 'key_name' attribute handles public key injection automatically.

  tags = {
    Name = "AnsibleWorkerTerraform"
  }
}

# Outputs for Jenkinsfile (Ansible inventory creation)
output "ansible_controller_details" {
  description = "Ansible Controller instance details"
  value = {
    id                = aws_instance.ansible_controller.id
    name              = aws_instance.ansible_controller.tags.Name
    instance_type     = aws_instance.ansible_controller.instance_type
    public_ipv4       = aws_instance.ansible_controller.public_ip
    private_ipv4      = aws_instance.ansible_controller.private_ip
    public_dns        = aws_instance.ansible_controller.public_dns
    private_dns       = aws_instance.ansible_controller.private_dns
    public_ipv6       = length(aws_instance.ansible_controller.ipv6_addresses) > 0 ? aws_instance.ansible_controller.ipv6_addresses[0] : null
    availability_zone = aws_instance.ansible_controller.availability_zone
    subnet_id         = aws_instance.ansible_controller.subnet_id
  }
}

output "ansible_worker_details" {
  description = "Ansible Worker instance details"
  value = {
    id                = aws_instance.ansible_worker.id
    name              = aws_instance.ansible_worker.tags.Name
    instance_type     = aws_instance.ansible_worker.instance_type
    public_ipv4       = aws_instance.ansible_worker.public_ip
    private_ipv4      = aws_instance.ansible_worker.private_ip
    public_dns        = aws_instance.ansible_worker.public_dns
    private_dns       = aws_instance.ansible_worker.private_dns
    public_ipv6       = length(aws_instance.ansible_worker.ipv6_addresses) > 0 ? aws_instance.ansible_worker.ipv6_addresses[0] : null
    availability_zone = aws_instance.ansible_worker.availability_zone
    subnet_id         = aws_instance.ansible_worker.subnet_id
  }
}