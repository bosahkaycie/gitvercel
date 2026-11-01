import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlPath = path.resolve(__dirname, '../index.html');

const html = fs.readFileSync(htmlPath, 'utf8');
const scriptRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;

let match;
let count = 0;
let errors = 0;

console.log('--- Validating Structured Data (JSON-LD) in index.html ---');

while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  const rawJson = match[1].trim();
  try {
    const parsed = JSON.parse(rawJson);
    console.log(`\nBlock #${count}: Type: ${JSON.stringify(parsed['@type'])} | @id: ${parsed['@id'] || 'N/A'}`);
    console.log(`  Context: ${parsed['@context']}`);
    console.log(`  Name: ${parsed['name'] || 'N/A'}`);
    if (parsed['@type'] === 'Corporation') {
      console.log(`  Official Address: ${parsed.address?.streetAddress}, ${parsed.address?.addressLocality}`);
      console.log(`  Credentials: ${parsed.hasCredential?.map(c => c.name).join('; ')}`);
    } else if (Array.isArray(parsed['@type']) && parsed['@type'].includes('LocalBusiness')) {
      console.log(`  Geo Coordinates: lat ${parsed.geo?.latitude}, lon ${parsed.geo?.longitude}`);
      console.log(`  Offers Catalog: ${parsed.hasOfferCatalog?.name} (${parsed.hasOfferCatalog?.itemListElement?.length} offers)`);
    } else if (parsed['@type'] === 'FAQPage') {
      console.log(`  FAQ Entities Count: ${parsed.mainEntity?.length}`);
    } else if (parsed['@type'] === 'WebSite') {
      console.log(`  Site URL: ${parsed.url}`);
    }
    console.log(`  Status: VALID JSON-LD`);
  } catch (err) {
    errors++;
    console.error(`  Block #${count} JSON Parse Error:`, err.message);
  }
}

console.log(`\n========================================`);
console.log(`Total Structured Data Blocks: ${count}`);
console.log(`Total Validation Errors: ${errors}`);
console.log(`========================================`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('All JSON-LD schemas validated successfully!');
}

