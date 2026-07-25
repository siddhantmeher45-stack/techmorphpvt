const fs = require('fs');
const https = require('https');

https.get('https://siddhantmeher45-stack.github.io/TechMorph/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('c:/Portfolio/techmorph_full.html', data);
    console.log('Saved techmorph_full.html with length:', data.length);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
