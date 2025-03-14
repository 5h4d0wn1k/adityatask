# PowerShell script to download and install AWS CLI

# Create a temporary directory
$tempDir = "$env:TEMP\awscli_install"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Download AWS CLI installer
$awsCliUrl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$installerPath = "$tempDir\AWSCLIV2.msi"
Write-Host "Downloading AWS CLI..."
Invoke-WebRequest -Uri $awsCliUrl -OutFile $installerPath

# Install AWS CLI
Write-Host "Installing AWS CLI..."
Start-Process msiexec.exe -Wait -ArgumentList "/i $installerPath /quiet"

# Clean up
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "AWS CLI installation completed!"
Write-Host "Please close and reopen your terminal to use AWS CLI."
Write-Host "You can verify the installation by running: aws --version"
Write-Host ""
Write-Host "After installation, configure AWS credentials by running:"
Write-Host "aws configure"
Write-Host ""
Write-Host "You will need:"
Write-Host "1. AWS Access Key ID"
Write-Host "2. AWS Secret Access Key"
Write-Host "3. Default region name (e.g., us-east-1)"
Write-Host "4. Default output format (json)" 