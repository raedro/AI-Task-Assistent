const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, 'server.js'), 'utf8');

assert.match(source, /POST.*\/api\/agent\/propose|\/api\/agent\/propose/);
assert.match(source, /needsApproval:true/);
assert.match(source, /OPENAI_API_KEY/);
assert.match(source, /output_text/);
assert.match(source, /Invalid proposal title/);
assert.match(source, /Invalid proposal priority/);
assert.match(source, /Invalid proposal due date/);

console.log('My Boy backend static checks: PASS');
