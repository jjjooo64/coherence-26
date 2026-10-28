import json
import subprocess
import requests
import os

def run_aws_command(command):
    """Run an AWS CLI command and return JSON output."""
    print(f"[DEBUG] Running AWS command: {command}")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        print(f"[DEBUG] AWS command output: {result.stdout}")
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] AWS command failed: {e.stderr}")
        exit(1)
    except json.JSONDecodeError as e:
        print(f"[ERROR] Parsing JSON output: {e}")
        exit(1)

def load_porkbun_credentials():
    """Load Porkbun API credentials from ../../../porkbun.json."""
    print("[DEBUG] Loading Porkbun credentials from ../../../porkbun.json")
    try:
        with open('../../../porkbun.json', 'r') as f:
            creds = json.load(f)
            print("[DEBUG] Credentials loaded successfully")
            return creds
    except FileNotFoundError:
        print("[ERROR] ../../../porkbun.json not found")
        exit(1)
    except json.JSONDecodeError:
        print("[ERROR] Invalid JSON in ../../../porkbun.json")
        exit(1)

def load_root_domains():
    """Load root domains from ../../../rootdomains.json if it exists."""
    root_domains_file = '../../../rootdomains.json'
    print(f"[DEBUG] Attempting to load root domains from {root_domains_file}")
    if not os.path.exists(root_domains_file):
        print(f"[DEBUG] {root_domains_file} not found, returning empty list")
        return []
    try:
        with open(root_domains_file, 'r') as f:
            root_domains = json.load(f)
            if not isinstance(root_domains, list):
                print(f"[ERROR] {root_domains_file} must contain a JSON array")
                exit(1)
            print(f"[DEBUG] Loaded root domains: {root_domains}")
            return root_domains
    except json.JSONDecodeError:
        print(f"[ERROR] Invalid JSON in {root_domains_file}")
        exit(1)

def normalize_record_name(record_name, domain):
    """Normalize the record name from Porkbun's API response."""
    if record_name == domain:
        normalized_name = ''
    elif record_name.endswith(f".{domain}"):
        normalized_name = record_name[:-len(f".{domain}")]
    else:
        normalized_name = record_name
    print(f"[DEBUG] Normalized record name: {record_name} -> {normalized_name} for domain {domain}")
    return normalized_name

def get_existing_records(creds, domain):
    """Retrieve existing DNS records for the domain using Porkbun API."""
    payload = {
        "apikey": creds['api_key'],
        "secretapikey": creds['secret_key']
    }
    url = f"https://api.porkbun.com/api/json/v3/dns/retrieve/{domain}"
    print(f"[DEBUG] Retrieving existing records for {domain}: {url}")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        if result.get('status') == 'SUCCESS':
            print(f"[DEBUG] Retrieved {len(result.get('records', []))} records for {domain}: {json.dumps(result.get('records', []), indent=2)}")
            return result.get('records', [])
        else:
            print(f"[ERROR] Failed to retrieve records for {domain}: {result.get('message', 'Unknown error')}")
            return []
    except requests.RequestException as e:
        print(f"[ERROR] Retrieving records for {domain}: {e}")
        return []

def delete_porkbun_dns_record(creds, domain, record_id):
    """Delete a DNS record using the Porkbun API."""
    payload = {
        "apikey": creds['api_key'],
        "secretapikey": creds['secret_key']
    }
    url = f"https://api.porkbun.com/api/json/v3/dns/delete/{domain}/{record_id}"
    print(f"[DEBUG] Deleting record ID {record_id} for {domain}: {url}")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        if result.get('status') == 'SUCCESS':
            print(f"[DEBUG] Successfully deleted record ID {record_id} for {domain}")
            return True
        else:
            print(f"[ERROR] Failed to delete record ID {record_id} for {domain}: {result.get('message', 'Unknown error')}")
            return False
    except requests.RequestException as e:
        print(f"[ERROR] Deleting record ID {record_id} for {domain}: {e}")
        return False

def create_porkbun_dns_record(creds, domain, record_type, name, content, ttl="3600"):
    """Create a DNS record using the Porkbun API."""
    payload = {
        "apikey": creds['api_key'],
        "secretapikey": creds['secret_key'],
        "name": name,
        "type": record_type,
        "content": content,
        "ttl": ttl
    }
    url = f"https://api.porkbun.com/api/json/v3/dns/create/{domain}"
    print(f"[DEBUG] Creating {record_type} record for {name}.{domain} with content {content}: {url}")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        if result.get('status') == 'SUCCESS':
            print(f"[DEBUG] Successfully created {record_type} record for {name}.{domain}")
            return True
        else:
            print(f"[ERROR] Failed to create {record_type} record for {name}.{domain}: {result.get('message', 'Unknown error')}")
            return False
    except requests.RequestException as e:
        print(f"[ERROR] Creating {record_type} record for {name}.{domain}: {e}")
        try:
            error_message = response.json().get('message', str(e))
            print(f"[DEBUG] API error response: {error_message}")
        except (ValueError, AttributeError):
            print(f"[DEBUG] No additional API error response available")
        return False

def get_domain_and_record_name(record_name, root_domains):
    """Determine the root domain and record name based on rootdomains.json."""
    record_name = record_name.rstrip('.')
    print(f"[DEBUG] Processing record name: {record_name}")
    parts = record_name.split('.')
    if len(parts) < 2:
        print(f"[ERROR] Invalid record name format: {record_name}")
        exit(1)
    ending = '.'.join(parts[-2:])
    print(f"[DEBUG] Default ending: {ending}")
    for root_domain in root_domains:
        if root_domain.endswith(ending) and record_name.endswith(root_domain):
            root = root_domain
            record = record_name[:-len(root_domain)].rstrip('.')
            print(f"[DEBUG] Matched root domain {root_domain} from rootdomains, record name: {record}")
            return root, record
    root = ending
    record = record_name[:-len(ending)].rstrip('.')
    print(f"[DEBUG] Using default root domain: {root}, record name: {record}")
    return root, record
