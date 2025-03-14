# PowerShell script to download and install Terraform

# Create a temporary directory
$tempDir = "$env:TEMP\terraform_install"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Download Terraform
$terraformUrl = "https://releases.hashicorp.com/terraform/1.7.4/terraform_1.7.4_windows_amd64.zip"
$zipFile = "$tempDir\terraform.zip"
Write-Host "Downloading Terraform..."
Invoke-WebRequest -Uri $terraformUrl -OutFile $zipFile

# Create installation directory
$installDir = "$env:USERPROFILE\terraform"
New-Item -ItemType Directory -Force -Path $installDir | Out-Null

# Extract Terraform
Write-Host "Extracting Terraform..."
Expand-Archive -Path $zipFile -DestinationPath $installDir -Force

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$currentPath;$installDir",
        "User"
    )
    Write-Host "Added Terraform to PATH"
}

# Clean up
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Terraform installation completed!"
Write-Host "Please close and reopen your terminal to use Terraform."
Write-Host "You can verify the installation by running: terraform --version" 