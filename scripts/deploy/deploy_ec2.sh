#!/bin/bash

# SAAIO Training Grounds - AWS EC2 Deployment Script
# Automatically deploys the project using rsync and restarts the Node process

echo "--------------------------------------------------------"
echo "SAAIO Training Grounds: Automated EC2 Deployer"
echo "--------------------------------------------------------"

# 1. Prompt for Server Details
read -p "Enter EC2 Public IP: " SERVER_IP
read -p "Enter Path to SSH Key (.pem) [~/.ssh/id_rsa]: " KEY_PATH
KEY_PATH="${KEY_PATH:-~/.ssh/id_rsa}"

# 2. Define Deployment Path
DEPLOY_DIR="~/AI-learning-system"
EXCLUDE_FILE=".deploy_exclude"

# Create a temporary exclude file for rsync
echo ".git" > "$EXCLUDE_FILE"
echo "node_modules" >> "$EXCLUDE_FILE"
echo ".next" >> "$EXCLUDE_FILE"
echo ".env" >> "$EXCLUDE_FILE" # We handle .env separately or manually on server

# 3. Synchronize Code to EC2
echo ""
echo "[INFO] Synchronizing files to $SERVER_IP..."
rsync -avz -e "ssh -i $KEY_PATH" --exclude-from="$EXCLUDE_FILE" ./ ubuntu@$SERVER_IP:$DEPLOY_DIR

# 4. Remote Execution (Install & Restart)
echo ""
echo "[INFO] Running remote setup on EC2..."
ssh -i "$KEY_PATH" ubuntu@$SERVER_IP << EOF
    cd $DEPLOY_DIR
    
    # 1. Install Dependencies
    echo "[REMOTE] Installing dependencies..."
    npm install --production

    # 2. Restart PM2 Process
    echo "[REMOTE] Restarting the platform..."
    if pm2 list | grep -q "saaio-grounds"; then
        pm2 restart saaio-grounds
    else
        pm2 start npm --name "saaio-grounds" -- start
    fi
    
    pm2 save
    echo "[REMOTE] SUCCESS: Platform is updated."
EOF

# Cleanup
rm "$EXCLUDE_FILE"

echo ""
echo "--------------------------------------------------------"
echo "[SUCCESS] Deployment to EC2 is complete."
echo "Check your platform at: http://$SERVER_IP"
echo "--------------------------------------------------------"
