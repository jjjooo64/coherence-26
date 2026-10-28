#!/bin/bash
set -euo pipefail

# Run from nosecret/aws/install/
# Expects ../config.json and ../../../cert-arns.json

if [ ! -f ../config.json ]; then
  echo "Error: ../config.json not found." >&2
  exit 1
fi

if [ ! -f ../../../cert-arns.json ]; then
  echo "Error: ../../../cert-arns.json not found. Create the certificate first." >&2
  exit 1
fi

STACK_NAME=$(jq -r '.stack_name' ../config.json)
BUCKET_NAME=$(jq -r '.bucket_name' ../config.json)
CERT_ARN=$(jq -r '.all_domains' ../../../cert-arns.json)
REGION="us-east-1"

# Build comma-separated DomainNames for CloudFormation
DOMAIN_NAMES=$(jq -r '.domains | join(",")' ../config.json)

if [ -z "$STACK_NAME" ] || [ "$STACK_NAME" = "null" ]; then
  echo "Error: stack_name missing in ../config.json" >&2
  exit 1
fi
if [ -z "$BUCKET_NAME" ] || [ "$BUCKET_NAME" = "null" ]; then
  echo "Error: bucket_name missing in ../config.json" >&2
  exit 1
fi
if [ -z "$CERT_ARN" ] || [ "$CERT_ARN" = "null" ]; then
  echo "Error: Certificate ARN missing in ../../../cert-arns.json" >&2
  exit 1
fi
if [ -z "$DOMAIN_NAMES" ] || [ "$DOMAIN_NAMES" = "null" ]; then
  echo "Error: domains array missing or empty in ../config.json" >&2
  exit 1
fi

echo "Deploying stack: $STACK_NAME"
echo "Bucket: $BUCKET_NAME"
echo "Domains: $DOMAIN_NAMES"
echo "Certificate: $CERT_ARN"

aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --parameter-overrides \
    StackName="$STACK_NAME" \
    BucketName="$BUCKET_NAME" \
    CertificateArn="$CERT_ARN" \
    DomainNames="$DOMAIN_NAMES"

echo
echo "Stack deployed."
echo
echo "CloudFront domain (point your DNS records here):"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text

echo
echo "CloudFront Distribution ID:"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text

echo
echo "Next: run the Porkbun DNS script (or add the CNAME/ALIAS records manually)."
