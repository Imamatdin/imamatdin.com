import figlet from 'figlet';
import fs from 'fs';
import path from 'path';

const text = 'IMAMATDIN';

// Generate ASCII art
figlet.text(text, {
  font: 'ANSI Shadow',
  horizontalLayout: 'default',
  verticalLayout: 'default',
}, function(err, data) {
  if (err) {
    // Try fallback font
    figlet.text(text, {
      font: 'Slant',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    }, function(err2, data2) {
      if (err2) {
        console.error('Could not generate ASCII art:', err2);
        process.exit(1);
      }
      writeAsciiFile(data2);
    });
    return;
  }
  writeAsciiFile(data);
});

function writeAsciiFile(asciiArt) {
  const publicDir = path.join(process.cwd(), 'public');
  const outputPath = path.join(publicDir, 'ascii-header.txt');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, asciiArt);
  console.log('Generated ASCII header at:', outputPath);
  console.log(asciiArt);
}
