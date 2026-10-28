#!/bin/bash
set -euo pipefail

# Run from nosecret/aws/install/
# Creates (or reuses) an ACM certificate covering all domains in ../config.json
# Writes ARN to ../../../cert-arns.json

if [ ! -f ../config.json ]; then
  echo "Error: ../config.json not found." >&2
  exit 1
fi

DOMAINS=$(jq -r '.domains[]' ../config.json)
PRIMARY=$(jq -r '.domains[0]' ../config.json)
SANS=$(jq -r '.domains[1:] | join(" ")' ../config.json)

if [ -z "$PRIMARY" ] || [ "$PRIMARY" = "null" ]; then
  echo "Error: At least one domain required in ../config.json domains array" >&2
  exit 1
fi

echo "Requesting certificate for primary: $PRIMARY"
echo "SANs: $SANS"

# Request certificate (DNS validation)
CERT_ARN=$(aws acm request-certificate \
  --domain-name "$PRIMARY" \
  --subject-alternative-names $SANS \
  --validation-method DNS \
  --region us-east-1 \
  --query CertificateArn \
  --output text)

echo "{\"all_domains\": \"$CERT_ARN\"}" > ../../../cert-arns.json
echo "Wrote certificate ARN to ../../../cert-arns.json"
echo "ARN: $CERT_ARN"
echo
echo "Wait for the certificate to become ISSUED after you add the DNS validation records."
echo "You can fetch the records with: ./get-cert-validation-records.sh"
echo "Or set them automatically with the Porkbun script."
