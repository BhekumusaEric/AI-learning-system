#!/bin/bash

# SAAIO Training Grounds - Master Deployment Guide
# A professional orchestrator for the AWS EC2 handover

echo "--------------------------------------------------------"
echo "SAAIO Training Grounds: Master Deployment Orchestrator"
echo "--------------------------------------------------------"
echo "This tool will guide you through the setup and deployment of your platform."

# 1. Environment Setup
read -p "Step 1: Setup Environment Keys? (y/n) [y]: " SETUP_ENV
SETUP_ENV="${SETUP_ENV:-y}"

if [[ "$SETUP_ENV" =~ ^[Yy]$ ]]; then
    bash scripts/deploy/setup_env.sh
fi

# 2. EC2 Deployment
echo ""
read -p "Step 2: Deploy to AWS EC2? (y/n) [y]: " DEPLOY_EC2
DEPLOY_EC2="${DEPLOY_EC2:-y}"

if [[ "$DEPLOY_EC2" =~ ^[Yy]$ ]]; then
    bash scripts/deploy/deploy_ec2.sh
fi

echo ""
echo "--------------------------------------------------------"
echo "SAAIO Training Grounds: Deployment Session Complete."
echo "For manual troubleshooting, see: docs/ec2_api_setup.md"
echo "--------------------------------------------------------"
