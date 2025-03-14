# PowerShell script to install Docker Desktop and configure Kubernetes

# Check if Docker Desktop is installed
$dockerPath = "${env:ProgramFiles}\Docker\Docker\Docker Desktop.exe"
if (-not (Test-Path $dockerPath)) {
    Write-Host "Docker Desktop is not installed. Downloading Docker Desktop..."
    
    # Create temp directory
    $tempDir = "$env:TEMP\docker_install"
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
    
    # Download Docker Desktop Installer
    $dockerUrl = "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe"
    $installerPath = "$tempDir\DockerDesktopInstaller.exe"
    Invoke-WebRequest -Uri $dockerUrl -OutFile $installerPath
    
    # Install Docker Desktop
    Write-Host "Installing Docker Desktop..."
    Start-Process -Wait -FilePath $installerPath -ArgumentList "install --quiet"
    
    # Clean up
    Remove-Item -Path $tempDir -Recurse -Force
    
    Write-Host "Docker Desktop installation completed!"
    Write-Host "Please restart your computer before continuing."
    Write-Host ""
    Write-Host "After restart:"
    Write-Host "1. Start Docker Desktop"
    Write-Host "2. Go to Settings > Kubernetes"
    Write-Host "3. Check 'Enable Kubernetes'"
    Write-Host "4. Click 'Apply & Restart'"
    exit 0
}

# Check if Docker is running
$dockerProcess = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
if (-not $dockerProcess) {
    Write-Host "Docker Desktop is not running. Please start Docker Desktop and try again."
    Write-Host "After starting Docker Desktop:"
    Write-Host "1. Go to Settings > Kubernetes"
    Write-Host "2. Check 'Enable Kubernetes'"
    Write-Host "3. Click 'Apply & Restart'"
    exit 1
}

# Check kubectl installation
$kubectlPath = "$env:ProgramFiles\Docker\Docker\resources\bin\kubectl.exe"
if (-not (Test-Path $kubectlPath)) {
    Write-Host "kubectl not found. Please ensure Docker Desktop is properly installed with Kubernetes enabled."
    exit 1
}

# Test kubectl connection
Write-Host "Testing Kubernetes connection..."
kubectl version --client
if ($LASTEXITCODE -eq 0) {
    Write-Host "kubectl is properly installed."
} else {
    Write-Host "Error: kubectl is not properly configured."
    exit 1
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Ensure Docker Desktop is running"
Write-Host "2. Enable Kubernetes in Docker Desktop settings"
Write-Host "3. Wait for Kubernetes to be ready (green light in Docker Desktop)"
Write-Host "4. Run: kubectl get nodes"
Write-Host "   This should show your local Kubernetes node" 