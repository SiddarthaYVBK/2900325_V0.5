//mpf/jenkinsfile


pipeline 
{
    agent any

    environment {
        // AWS credentials added in jenkins
        AWS_CREDENTIALS = credentials('aws-jenkins-automation-user')
    }

    stages {
        stage('Checkout Code') 
		{
            steps 
			{
                // This step is often implicitly handled by Jenkins for SCM-driven pipelines,
                // but explicitly defining it ensures clarity and can be useful for submodules etc.
                // If your repo is public, no credentials needed here.
                git url: 'https://github.com/SiddarthaYVBK/2900325_V0.5.git'
            }
        }

        stage('Verify Terraform and AWS CLI') 
		{
            steps {
                withEnv(["AWS_ACCESS_KEY_ID=${AWS_CREDENTIALS.accessKey}", "AWS_SECRET_ACCESS_KEY=${AWS_CREDENTIALS.secretKey}", "AWS_DEFAULT_REGION=ap-south-1"]) 
				{
                    sh 'terraform --version'
                    sh 'aws --version'
                    sh 'aws s3 ls' // Test AWS CLI access to S3 (requires S3 permissions from your IAM user)
                }
            }
        }

        stage('Verify Ansible') {
            steps {
                sh 'ansible --version'
                // Example: Check connection to a dummy host (optional, can be removed)
                // sh 'ansible all -i "localhost," -c local -m ping'
            }
        }

        stage('Dummy Terraform Plan (Optional)') {
            steps {
                script {
                    // Create a temporary directory for Terraform files within the workspace
                    sh 'mkdir -p terraform_test'
                    sh 'echo \'resource "aws_s3_bucket" "example_bucket" { bucket = "your-unique-jenkins-test-bucket-name-${UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8)}" tags = { Name = "JenkinsTestBucket" } } \' > terraform_test/main.tf'

                    withEnv(["AWS_ACCESS_KEY_ID=${AWS_CREDENTIALS.accessKey}", "AWS_SECRET_ACCESS_KEY=${AWS_CREDENTIALS.secretKey}", "AWS_DEFAULT_REGION=ap-south-1"]) {
                        sh 'cd terraform_test && terraform init'
                        sh 'cd terraform_test && terraform plan -out=tfplan' // Plan to a file
                    }
                }
            }
        }
        
    }
}