# DNS Setup for crimsonlanternstudios.com

Instructions for configuring DNS at your domain registrar to point to GitHub Pages.

## A Records

Add the following A records for the apex domain (`crimsonlanternstudios.com`), pointing to GitHub Pages IPs:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

## CNAME Record

Add a CNAME record for the `www` subdomain:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | CrimsonLanternStudios.github.io |

## GitHub Pages Settings

1. Go to the repository **Settings → Pages**
2. **Source:** GitHub Actions
3. **Custom domain:** crimsonlanternstudios.com
4. **Enforce HTTPS:** ✅ Enabled

## Verification

After DNS propagation (may take up to 48 hours):

1. Confirm the site loads at https://crimsonlanternstudios.com
2. Confirm https://www.crimsonlanternstudios.com redirects to the apex domain
3. Confirm HTTPS is working with a valid certificate
