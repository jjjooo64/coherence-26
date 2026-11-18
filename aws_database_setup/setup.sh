#!/bin/bash
set -euo pipefail

# Deploy from config.json
# Usage: ./setup.sh [optional-password]

CONFIG="$(dirname "$0")/config.json"
STACK_NAME=$(jq -r .stackName "$CONFIG")
TABLE_NAME=$(jq -r .tableName "$CONFIG")
FUNCTION_NAME=$(jq -r .functionName "$CONFIG")
ROLE_NAME=$(jq -r .roleName "$CONFIG")
PARAMETER_NAME=$(jq -r .parameterName "$CONFIG")
REGION=$(jq -r .region "$CONFIG")
PASSWORD="${1:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)}"

echo "Stack:       $STACK_NAME"
echo "Table:       $TABLE_NAME"
echo "Function:    $FUNCTION_NAME"
echo "Role:        $ROLE_NAME"
echo "Parameter:   $PARAMETER_NAME"
echo "Region:      $REGION"
echo "Password:    $PASSWORD"
echo

aws cloudformation deploy \
  --template-file "$(dirname "$0")/template.yaml" \
  --stack-name "$STACK_NAME" \
  --parameter-overrides \
    AdminPassword="$PASSWORD" \
    TableName="$TABLE_NAME" \
    FunctionName="$FUNCTION_NAME" \
    RoleName="$ROLE_NAME" \
    ParameterName="$PARAMETER_NAME" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$REGION"

echo
echo "Uploading Lambda code..."
cd "$(dirname "$0")"
zip -q -r /tmp/secret-code-lambda.zip index.js

aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb:///tmp/secret-code-lambda.zip \
  --region "$REGION" >/dev/null

aws lambda wait function-updated \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION"

echo
echo "========================================"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query 'Stacks[0].Outputs' \
  --output table
echo "========================================"
