#!/usr/bin/env python3
"""
Set CloudFront DNS records in Porkbun for all domains listed in ../config.json.
Run from nosecret/aws/install/
Expects ../../../porkbun.json and (optionally) ../../../rootdomains.json
"""
import json
import subprocess
import sys
import os

# Reuse helpers if present, otherwise minimal inline versions
sys.path.insert(0, os.path.dirname(__file__))

try:
    from porkbun_utils import (
        load_porkbun_credentials,
        load_root_domains,
        get_domain_and_record_name,
        create_porkbun_dns_record,
        get_existing_records,
        delete_porkbun_dns_record,
        normalize_record_name,
    )
except ImportError:
    print("porkbun_utils.py not found next to this script. Copy it from your previous project.", file=sys.stderr)
    sys.exit(1)

def run_aws(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True)
    return json.loads(result.stdout)

def main():
    creds = load_porkbun_credentials()  # loads ../../../porkbun.json
    root_domains = load_root_domains()

    with open('../config.json') as f:
        config = json.load(f)
    stack_name = config['stack_name']
    domains = config['domains']

    # Get CloudFront domain name from stack outputs
    cmd = (
        f"aws cloudformation describe-stacks --stack-name {stack_name} "
        f"--region us-east-1 "
        f"--query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' "
        f"--output text"
    )
    cf_domain = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True).stdout.strip()
    if not cf_domain:
        print("Error: Could not retrieve CloudFront domain name from stack outputs", file=sys.stderr)
        sys.exit(1)
    print(f"CloudFront domain: {cf_domain}")

    for host in domains:
        domain, name = get_domain_and_record_name(host, root_domains)
        record_type = "ALIAS" if name == "" else "CNAME"
        print(f"Processing {host} -> {record_type} {cf_domain} (root={domain}, name={name!r})")

        existing = get_existing_records(creds, domain)
        conflict = None
        for rec in existing:
            rec_name = normalize_record_name(rec.get('name', ''), domain)
            if rec_name == name and rec.get('type') == record_type:
                conflict = rec
                break

        if conflict:
            if conflict.get('content') == cf_domain:
                print(f"  Already correct, skipping")
                continue
            else:
                print(f"  Deleting conflicting record id={conflict.get('id')}")
                delete_porkbun_dns_record(creds, domain, conflict.get('id'))

        ok = create_porkbun_dns_record(creds, domain, record_type, name, cf_domain)
        print(f"  {'Created' if ok else 'FAILED'}")

if __name__ == "__main__":
    main()
