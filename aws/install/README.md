# Static multi-domain site (S3 + CloudFront)

Place these files in `nosecret/aws/install/`.

Higher-level files expected:
- `../../../porkbun.json` — Porkbun API credentials (`api_key`, `secret_key`)
- `../../../rootdomains.json` — optional, same format as before (array of multi-part roots)
- `../../../cert-arns.json` — created by the cert script

Config and site files:
- `../config.json` — stack name, bucket name, domains array
- `../index.html` — barebones HTML (upload this to the bucket)

## One-time setup
1. Copy `config.json.example` to `../config.json` and edit domains + unique bucket name.
2. Request certificate:
   ```bash
   chmod +x *.sh *.py
   ./create-certs.sh
   ./get-cert-validation-records.sh   # or use your existing Porkbun ACM validation script
   ```
3. After the certificate is ISSUED, deploy:
   ```bash
   ./deploy-stack.sh
   ```
4. Point DNS (uses your existing `porkbun_utils.py`):
   ```bash
   ./set-dns-porkbun.py
   ```
5. Upload site content (example):
   ```bash
   aws s3 cp ../index.html s3://$(jq -r .bucket_name ../config.json)/index.html
   ```

## Behavior
- All domains in the `domains` array become CloudFront aliases.
- Missing objects (S3 returns 403) and true 404s are rewritten to `/index.html` with status **200**.
- No redirect is issued; the browser URL stays exactly as the user typed it.
