# PowerShell script to set up and run Terraform

# Check if Terraform is installed
$terraformInstalled = $null
try {
    $terraformInstalled = Get-Command terraform -ErrorAction Stop
    Write-Host "Terraform is already installed at: $($terraformInstalled.Source)"
} catch {
    Write-Host "Terraform is not installed. Please install it first."
    Write-Host "Download URL: https://developer.hashicorp.com/terraform/downloads"
    exit 1
}

# Check if AWS CLI is installed
$awsInstalled = $null
try {
    $awsInstalled = Get-Command aws -ErrorAction Stop
    Write-Host "AWS CLI is already installed at: $($awsInstalled.Source)"
} catch {
    Write-Host "AWS CLI is not installed. Please install it first."
    Write-Host "Download URL: https://aws.amazon.com/cli/"
    exit 1
}

# Check AWS credentials
Write-Host "Checking AWS credentials..."
$awsCredentials = $false
try {
    aws sts get-caller-identity | Out-Null
    $awsCredentials = $true
    Write-Host "AWS credentials are configured correctly."
} catch {
    Write-Host "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
}

# Initialize Terraform
Write-Host "Initializing Terraform..."
terraform init

if ($LASTEXITCODE -eq 0) {
    Write-Host "Terraform initialized successfully."
    
    # Create terraform.tfvars if it doesn't exist
    if (-not (Test-Path "terraform.tfvars")) {
        Write-Host "Creating terraform.tfvars file..."
        @"
aws_region = "us-east-1"
mongodb_atlas_project_id = "your-project-id"
environment = "production"
"@ | Out-File -FilePath "terraform.tfvars" -Encoding UTF8
        Write-Host "Please edit terraform.tfvars with your values before continuing."
        exit 0
    }

    # Ask for confirmation before applying
    $confirmation = Read-Host "Do you want to run terraform apply? (yes/no)"
    if ($confirmation -eq 'yes') {
        Write-Host "Running terraform apply..."
        terraform apply
    } else {
        Write-Host "Terraform apply cancelled."
    }
} else {
    Write-Host "Terraform initialization failed."
    exit 1
} 