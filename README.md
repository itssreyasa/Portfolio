# Sreyas.exe — Interactive Portfolio
Static site: HTML + CSS + vanilla JS. No build step, no backend.

## Structure
index.html · css/style.css · js/main.js · assets/images/ (sreyas-1..6.jpg)

## Edit content
Quiz questions, result messages and boot lines are at the top of `js/main.js`. Text and links are in `index.html`.

## Run locally
Open `index.html`, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.

## Deploy to Amazon S3
1. Create a bucket (e.g. `sreyas-portfolio`).
2. Upload the folder contents (index.html, css, js, assets) keeping the structure:
   `aws s3 sync . s3://YOUR-BUCKET --exclude "README.md"`
3. Static website option: bucket > Properties > Static website hosting > Enable, index document `index.html`. This needs public read access (turn off Block Public Access and add a public `s3:GetObject` bucket policy).
   Recommended instead: keep the bucket private and use CloudFront (below).

## CloudFront (recommended, gives HTTPS)
1. Create a distribution with the S3 bucket as origin, using Origin Access Control (OAC). Let CloudFront add the bucket policy it suggests.
2. Set Default root object to `index.html`.
3. Enable compression. Images are cacheable for a long time; after updates, invalidate `/*`.

## Custom domain
1. Request a certificate in AWS Certificate Manager (region us-east-1) for your domain.
2. Add the domain as an Alternate domain name (CNAME) on the distribution and attach the certificate.
3. In Route 53 (or your DNS provider) create an A/ALIAS record pointing to the CloudFront distribution domain.

## Notes
- Fonts load from Google Fonts; the site falls back to system fonts if offline.
- Quiz best score uses localStorage on the visitor's device only.
