#!/bin/bash

# SAAIO Training Grounds - Environment Setup Script
# Automatically generates a .env file from .env.example with user prompts

# Professional Header
echo "--------------------------------------------------------"
echo "SAAIO Training Grounds: Environment Configuration Tool"
echo "--------------------------------------------------------"
echo "This tool will walk you through the required environment keys."
echo "Press ENTER to keep the [Default Value] if provided."
echo ""

# Input and Output Files
EXAMPLE_FILE=".env.example"
OUTPUT_FILE=".env"

# Check if .env.example exists
if [ ! -f "$EXAMPLE_FILE" ]; then
    echo "[ERROR] .env.example not found in the root directory."
    exit 1
fi

# Initialize or Clear the .env file
echo "# SAAIO Training Grounds - Generated Environment Variables" > "$OUTPUT_FILE"
echo "# Generation Date: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Parse .env.example and prompt for each key
while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ "$line" =~ ^# ]] || [[ -z "$line" ]]; then
        # Forward direct comments to the output file for context
        echo "$line" >> "$OUTPUT_FILE"
        continue
    fi

    # Extract Key and Default Value (if any)
    key=$(echo "$line" | cut -d'=' -f1)
    default_val=$(echo "$line" | cut -d'=' -f2-)

    # Professional Prompt
    read -p "Enter value for $key [$default_val]: " user_val

    # If user hits ENTER, use the default value from .env.example
    final_val="${user_val:-$default_val}"

    # Write to the new .env file
    echo "$key=$final_val" >> "$OUTPUT_FILE"

done < "$EXAMPLE_FILE"

echo ""
echo "--------------------------------------------------------"
echo "[SUCCESS] .env file has been generated successfully."
echo "You can now proceed with your production deployment."
echo "--------------------------------------------------------"
