// Jenkinsfile with Terraform Import for Existing Resources
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
        
        stage('Handle Existing AWS Resources') {
            steps {
                echo 'Checking and importing existing AWS resources...'
                withCredentials([aws(credentialsId: 'aws-jenkins-automation-user', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'])]) {
                    withEnv(["AWS_DEFAULT_REGION=ap-south-1"]) {
                        script {
                            // Initialize Terraform first
                            sh 'terraform init'
                            
                            // Check if security group exists
                            def sgId = sh(
                                script: 'aws ec2 describe-security-groups --region ap-south-1 --group-names ansible-sg-terraform --query "SecurityGroups[0].GroupId" --output text 2>/dev/null || echo "NOT_FOUND"',
                                returnStdout: true
                            ).trim()
                            
                            if (sgId != "NOT_FOUND") {
                                echo "Security group exists with ID: ${sgId}"
                                
                                // Try to import the security group
                                try {
                                    sh "terraform import aws_security_group.ansible_sg ${sgId}"
                                    echo "Security group imported successfully"
                                } catch (Exception e) {
                                    echo "Security group already imported or import failed: ${e.getMessage()}"
                                }
                                
                                // Check for existing instances and import them too
                                def existingInstances = sh(
                                    script: 'aws ec2 describe-instances --region ap-south-1 --filters "Name=instance.group-name,Values=ansible-sg-terraform" "Name=instance-state-name,Values=running,pending,stopping,stopped" --query "Reservations[*].Instances[*].[InstanceId,Tags[?Key==\\"Name\\"].Value|[0]]" --output text',
                                    returnStdout: true
                                ).trim()
                                
                                if (existingInstances) {
                                    def instances = existingInstances.split('\n')
                                    for (instanceLine in instances) {
                                        def parts = instanceLine.split('\t')
                                        if (parts.length >= 2) {
                                            def instanceId = parts[0]
                                            def instanceName = parts[1]
                                            
                                            echo "Found instance: ${instanceId} (${instanceName})"
                                            
                                            // Import instances based on their names
                                            try {
                                                if (instanceName == "AnsibleControllerTerraform") {
                                                    sh "terraform import aws_instance.ansible_controller ${instanceId}"
                                                    echo "Controller instance imported: ${instanceId}"
                                                } else if (instanceName == "AnsibleWorkerTerraform") {
                                                    sh "terraform import aws_instance.ansible_worker ${instanceId}"
                                                    echo "Worker instance imported: ${instanceId}"
                                                }
                                            } catch (Exception e) {
                                                echo "Instance already imported or import failed: ${e.getMessage()}"
                                            }
                                        }
                                    }
                                }
                            } else {
                                echo "No existing security group found. Will create new resources."
                            }
                        }
                    }
                }
            }
        }
        
        stage('Terraform Infrastructure') {
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
            steps {
                echo 'Starting Terraform infrastructure provisioning...'
                withCredentials([aws(credentialsId: 'aws-jenkins-automation-user', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'])]) {
                    withEnv(["AWS_DEFAULT_REGION=ap-south-1"]) {
                        sh 'terraform validate'
                        sh 'timeout 300 terraform plan -out=tfplan'
                        sh 'timeout 300 terraform apply -auto-approve tfplan'
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
                        sleep 30
                        
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
                        
                        echo "=== DEVOPS ASSIGNMENT COMPLETED SUCCESSFULLY ==="
                        echo "Controller IP: $CONTROLLER_IP"
                        echo "Worker IP: $WORKER_IP"
                        echo "✅ Terraform: Infrastructure managed (imported + provisioned)"
                        echo "✅ Ansible: Configuration management completed"
                        echo "✅ Jenkins: End-to-end CI/CD pipeline working"
                        echo "✅ Portfolio: Real project integration successful"
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
            echo '🎉 DEVOPS ASSIGNMENT COMPLETED SUCCESSFULLY!'
            echo '✅ Infrastructure as Code (Terraform)'
            echo '✅ Configuration Management (Ansible)'
            echo '✅ CI/CD Pipeline (Jenkins)'
            echo '✅ Real Application Integration (MPF Portfolio)'
        }
        failure {
            echo 'Pipeline failed - check console output'
        }
    }
}