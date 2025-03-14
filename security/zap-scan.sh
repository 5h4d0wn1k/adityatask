#!/bin/bash

# OWASP ZAP Security Scan Script
# This script runs automated security scans using OWASP ZAP

# Configuration
TARGET_URL="http://localhost:3000"
REPORT_DIR="security/reports"
DATE=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/zap_report_$DATE"

# Create reports directory if it doesn't exist
mkdir -p $REPORT_DIR

echo "Starting OWASP ZAP security scan..."

# Run ZAP in daemon mode
docker run -d --name zap \
  -v $(pwd)/$REPORT_DIR:/zap/wrk/:rw \
  -t owasp/zap2docker-stable zap.sh \
  -daemon \
  -host 0.0.0.0 \
  -port 2375 \
  -config api.key=12345

# Wait for ZAP to start
sleep 10

# Run Spider scan
echo "Running Spider scan..."
docker exec zap zap-cli --api-key 12345 quick-scan \
  --spider \
  --start-options "-config api.key=12345" \
  $TARGET_URL

# Run Active scan
echo "Running Active scan..."
docker exec zap zap-cli --api-key 12345 active-scan \
  --recursive \
  --scanners all \
  $TARGET_URL

# Generate reports
echo "Generating reports..."
docker exec zap zap-cli --api-key 12345 report \
  -o /zap/wrk/zap_report_${DATE}.html \
  -f html

docker exec zap zap-cli --api-key 12345 report \
  -o /zap/wrk/zap_report_${DATE}.json \
  -f json

# Stop and remove ZAP container
docker stop zap
docker rm zap

echo "Security scan completed. Reports saved in $REPORT_DIR" 