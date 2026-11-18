#!/bin/bash
set -euo pipefail

# Delete the entire CloudFormation stack and all its resources.

CONFIG="$(dirname "$0")/config.json"
STACK_NAME=$(jq -r .stackName "$CONFIG")
REGION=$(jq -r .region "$CONFIG")
TABLE_NAME=$(jq -r .tableName "$CONFIG")

echo "Stack:  $STACK_NAME"
echo "Region: $REGION"
echo "This deletes the entire stack (Lambda, Function URL, IAM role, DynamoDB table, and SSM password parameter)."
read -p "Delete everything? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

aws cloudformation delete-stack \
  --stack-name "$STACK_NAME" \
  --region "$REGION"

echo "Waiting for stack deletion..."
aws cloudformation wait stack-delete-complete \
  --stack-name "$STACK_NAME" \
  --region "$REGION"

echo "Stack and all resources deleted."
