#!/bin/bash

# A bash script to run decktape with fixed arguments for Quarto/Reveal.js output.
# Usage: ./<script_name> <input_dir_or_name> <output_pdf_name>

# Check if both arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Error: Two arguments are required."
    echo "Usage: $0 <input_dir_or_name> <output_pdf_name>"
    exit 1
fi

# Assign arguments to meaningful variable names
INPUT_PATH="$1"
OUTPUT_NAME="$2"

# Define fixed arguments
CHROME_PATH=$(which google-chrome)
SIZE="1920x1080"
CHROME_ARG="--force-color-profile=srgb"

# Construct the full command
COMMAND="decktape reveal ${INPUT_PATH}/index.html ${OUTPUT_NAME} --chrome-path ${CHROME_PATH} --size ${SIZE} --chrome-arg=${CHROME_ARG}"

echo "Starting Decktape conversion for: ${INPUT_PATH}/index.html"
echo "Output file: ${OUTPUT_NAME}"
echo "--------------------------------------------------------"

# Execute the command
eval "$COMMAND"

# Check the exit status of the decktape command
if [ $? -eq 0 ]; then
    echo "--------------------------------------------------------"
    echo "✅ Success: Presentation converted to ${OUTPUT_NAME}"
else
    echo "--------------------------------------------------------"
    echo "❌ Error: Decktape failed to convert the presentation."
    exit 1
fi
