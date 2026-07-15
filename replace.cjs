const fs = require('fs');
const files = [
  'c:/laragon/www/ARCHIVE/portofolio-yovan-v3/hypebox/src/pages/index.astro',
  'c:/laragon/www/ARCHIVE/portofolio-yovan-v3/hypebox/src/components/Navbar.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/ px-6 /g, ' px-4 ')
                     .replace(/\"px-6 /g, '\"px-4 ')
                     .replace(/ px-6\"/g, ' px-4\"');
    fs.writeFileSync(file, content);
  }
});
