# 🖥️ EC2 Setup Guide: Mobile API Server

This guide details how to host the `mobile-api-server.js` (Express-based API) on an **AWS EC2** instance for high availability and persistence.

## 1. Instance Configuration

- **AMI**: Amazon Linux 2023 or Ubuntu 22.04 LTS.
- **Instance Type**: `t3.micro` (sufficient for most training ground traffic) or `t3.small` if usage increases.
- **Storage**: 20GB gp3 EBS volume.
- **Public IP**: Assign an **Elastic IP** so the server address doesn't change after reboots.

## 2. Security Group Settings

Configure the Security Group to allow traffic on the following ports:

| Protocol | Port | Source | Description |
|---|---|---|---|
| SSH | 22 | Your IP / Office CIDR | Admin access |
| HTTP | 80 | 0.0.0.0/0 | For Nginx redirect |
| HTTPS | 443 | 0.0.0.0/0 | Main API traffic |
| Custom TCP | 3001 | 0.0.0.0/0 | Internal API port (if needed) |

## 3. Server Initialization

Run these commands once the instance is launched:

```bash
# Update system
sudo dnf update -y  # Amazon Linux
# sudo apt update && sudo apt upgrade -y # Ubuntu

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

## 4. Deploying the API

1. **Clone the Repo**: 
   ```bash
   git clone https://github.com/BhekumusaEric/AI-learning-system.git
   cd AI-learning-system
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory with the Supabase and DB credentials listed in the [Deployment Checklist](./deployment_checklist.md).

4. **Start the Server with PM2**:
   ```bash
   pm2 start mobile-api-server.js --name "saaio-api"
   pm2 save
   pm2 startup # Follow the instructions to enable auto-start on boot
   ```

## 5. Nginx Reverse Proxy (Recommended)

Nginx handles SSL termination and redirects traffic from port 80/443 to the Node.js process.

1. **Install Nginx**:
   ```bash
   sudo dnf install -y nginx
   sudo systemctl enable --now nginx
   ```

2. **Basic Configuration**:
   Edit `/etc/nginx/conf.d/api.conf`:
   ```nginx
   server {
       listen 80;
       server_name api.saaio.wethinkcode.co.za;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **SSL**: Run `certbot` to automatically upgrade to HTTPS.
   ```bash
   sudo certbot --nginx -d api.saaio.wethinkcode.co.za
   ```

## 6. Monitoring

- Check logs: `pm2 logs saaio-api`
- Monitor resource usage: `pm2 monit`
