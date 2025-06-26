// Jenkinsfile with AWS Resource Cleanup Verification
pipeline {
    agent any
    
    environment {
        PATH = "/usr/local/bin:$PATH"
        ANSIBLE_HOST_KEY_CHECKING = "False"
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out repository...'
                git url: 'https://github.com/SiddarthaYVBK/2900325_V0.5.git'
                sh 'ls -la'
            }
        }
        
        stage('Verify Tools') {
            steps {
                echo 'Verifying Terraform installation...'
                sh 'terraform --version'
                
                echo 'Verifying AWS CLI installation...'
                withCredentials([aws(credentialsId: 'aws-jenkins-automation-user', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'])]) {
                    withEnv(["AWS_DEFAULT_REGION=ap-south-1"]) {
                        sh 'aws --version'
                        sh 'aws s3 ls'
                        
                        echo 'Checking if AnsibleController key pair exists...'
                        sh 'aws ec2 describe-key-pairs --region ap-south-1 --query "KeyPairs[?KeyName==\'AnsibleController\'].KeyName" --output text || echo "AnsibleController key pair not found"'
                    }
                }
                
                echo 'Verifying Ansible installation...'
                sh 'ansible --version'
                sh 'ansible all -i "localhost," -c local -m ping'
            }
        }
        
        stage('Check and Cleanup AWS Resources') {
            steps {
                echo 'Checking existing AWS resources...'
                withCredentials([aws(credentialsId: 'aws-jenkins-automation-user', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'])]) {
                    withEnv(["AWS_DEFAULT_REGION=ap-south-1"]) {
                        script {
                            // Check if security group exists
                            def sgExists = sh(
                                script: 'aws ec2 describe-security-groups --region ap-south-1 --group-names ansible-sg-terraform --query "SecurityGroups[0].GroupId" --output text 2>/dev/null || echo "NOT_FOUND"',
                                returnStdout: true
                            ).trim()
                            
                            if (sgExists != "NOT_FOUND") {
                                echo "Security group 'ansible-sg-terraform' exists"
                                
                                // Check if any instances are using it
                                def instancesUsingGroup = sh(
                                    script: 'aws ec2 describe-instances --region ap-south-1 --filters "Name=instance.group-name,Values=ansible-sg-terraform" --query "Reservations[*].Instances[?State.Name!=\'terminated\'][].InstanceId" --output text',
                                    returnStdout: true
                                ).trim()
                                
                                if (instancesUsingGroup == "") {
                                    echo "No instances using the security group. Safe to delete."
                                    sh 'aws ec2 delete-security-group --group-name ansible-sg-terraform --region ap-south-1'
                                    echo "Security group deleted successfully"
                                } else {
                                    echo "WARNING: Instances are using the security group: ${instancesUsingGroup}"
                                    echo "Will skip deletion to avoid disruption"
                                }
                            } else {
                                echo "Security group does not exist. Ready to proceed."
                            }
                        }
                    }
                }
            }
        }
        
        stage('Terraform Infrastructure') {
            steps {
                echo 'Starting Terraform infrastructure provisioning...'
                withCredentials([aws(credentialsId: 'aws-jenkins-automation-user', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'])]) {
                    withEnv(["AWS_DEFAULT_REGION=ap-south-1"]) {
                        sh 'terraform init'
                        sh 'terraform validate'
                        sh 'terraform plan -out=tfplan'
                        sh 'terraform apply -auto-approve tfplan'
                        sh 'terraform output -json > terraform_outputs.json'
                        sh 'terraform output'
                    }
                }
                echo 'Terraform infrastructure provisioning completed'
            }
        }
        
        stage('Ansible Configuration') {
            steps {
                echo 'Starting Ansible configuration management...'
                script {
                    sh '''
                        echo "Creating Ansible inventory..."
                        CONTROLLER_IP=$(cat terraform_outputs.json | python3 -c "import sys, json; print(json.load(sys.stdin)['ansible_controller_details']['value']['public_ipv4'])")
                        WORKER_IP=$(cat terraform_outputs.json | python3 -c "import sys, json; print(json.load(sys.stdin)['ansible_worker_details']['value']['public_ipv4'])")
                        
                        cat > inventory.ini << EOF
[servers]
controller ansible_host=$CONTROLLER_IP ansible_user=ubuntu
worker ansible_host=$WORKER_IP ansible_user=ubuntu

[servers:vars]
ansible_ssh_private_key_file=/tmp/ansible_key.pem
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
EOF
                        
                        echo "Inventory created:"
                        cat inventory.ini
                        
                        echo "Preparing SSH key..."
                        # FIXED: Use the correct SSH key path with fallback
                        if [ -f /var/lib/jenkins/.ssh/AnsibleController.pem ]; then
                            sudo cp /var/lib/jenkins/.ssh/AnsibleController.pem /tmp/ansible_key.pem
                        elif [ -f /home/ubuntu/.ssh/AnsibleController.pem ]; then
                            sudo cp /home/ubuntu/.ssh/AnsibleController.pem /tmp/ansible_key.pem
                        else
                            echo "AnsibleController.pem not found. Using Jenkins default key."
                            sudo cp /var/lib/jenkins/.ssh/id_rsa /tmp/ansible_key.pem
                        fi
                        
                        sudo chmod 600 /tmp/ansible_key.pem
                        sudo chown jenkins:jenkins /tmp/ansible_key.pem
                        
                        echo "Waiting for instances to be ready..."
                        sleep 60
                        
                        echo "Running Ansible playbook..."
                        ansible-playbook -i inventory.ini playbook.yml
                    '''
                }
                echo 'Ansible configuration management completed'
            }
        }
        
        stage('Verify Setup') {
            steps {
                echo 'Verifying configuration...'
                script {
                    sh '''
                        CONTROLLER_IP=$(cat terraform_outputs.json | python3 -c "import sys, json; print(json.load(sys.stdin)['ansible_controller_details']['value']['public_ipv4'])")
                        WORKER_IP=$(cat terraform_outputs.json | python3 -c "import sys, json; print(json.load(sys.stdin)['ansible_worker_details']['value']['public_ipv4'])")
                        
                        echo "=== ASSIGNMENT COMPLETED SUCCESSFULLY ==="
                        echo "Controller IP: $CONTROLLER_IP"
                        echo "Worker IP: $WORKER_IP"
                        echo "✅ Terraform: Infrastructure provisioned"
                        echo "✅ Ansible: Configuration management completed"
                        echo "✅ DevOps Pipeline: End-to-end automation working"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'rm -f tfplan /tmp/ansible_key.pem'
        }
        success {
            echo '🎉 DevOps Assignment COMPLETED SUCCESSFULLY!'
            echo 'Infrastructure + Configuration Management + CI/CD = ✅'
        }
        failure {
            echo 'Pipeline failed - check console output'
        }
    }
}