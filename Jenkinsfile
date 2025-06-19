// mpf/Jenkinsfile
pipeline 
{
    agent any

    stages 
	{
        stage('Checkout Code') 
		{
            steps {
                git url: 'https://github.com/SiddarthaYVBK/2900325_V0.5.git' // Replace with your actual repo URL
            }
        }

        stage('Verify Terraform and AWS CLI') 
		{
            steps 
			{
                // Use withCredentials to get AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
                withCredentials([aws(credentialsId: 'aws-jenkins-automation-user', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'])]) 
				{
                    withEnv(["AWS_DEFAULT_REGION=ap-south-1"]) {
                        sh 'terraform --version'
                        sh 'aws --version'
                        sh 'aws s3 ls' // Test AWS CLI access to S3
                    }
                }
            }
        }

        stage('Verify Ansible') 
		{
            steps 
			{
                sh 'ansible --version'
                sh 'ansible all -i "localhost," -c local -m ping'
            }
        }

        stage('Dummy Terraform Plan (Optional)') {
            steps {
                script {
                    sh 'mkdir -p terraform_test'

                    def uniqueNamePart = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8)

                    // This is the corrected way to write the multi-line Terraform content
                    // to main.tf using a heredoc.
                    sh """
                        cat > terraform_test/main.tf <<EOF
resource "aws_s3_bucket" "example_bucket" {
  bucket = "your-unique-jenkins-test-bucket-name-${uniqueNamePart}"
  tags = {
    Name = "JenkinsTestBucket"
  }
}
EOF
                    """

                    withCredentials([aws(credentialsId: 'aws-jenkins-automation-user', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'])]) {
                        withEnv(["AWS_DEFAULT_REGION=ap-south-1"]) {
                            sh 'cd terraform_test && terraform init'
                            sh 'cd terraform_test && terraform plan -out=tfplan'
                        }
                    }
                }
            }
        }
    }
}