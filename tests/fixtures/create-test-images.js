/**
 * Creates test fixture images for Playwright tests
 * Run with: node tests/fixtures/create-test-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple 500x500 PNG image (solid color)
function createPNGImage(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Simplified approach: create a data URL and convert to buffer
  // For testing purposes, we'll create a minimal valid PNG
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="rgb(${r},${g},${b})"/>
    </svg>
  `;

  // For actual image creation, we need a proper image library
  // Instead, let's create a valid minimal PNG using base64
  const minimalPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  return minimalPNG;
}

// Create test image files
const fixtures = {
  'test-headshot.jpg': {
    type: 'jpeg',
    size: 'small', // < 1MB
    description: 'Valid JPEG headshot for testing',
  },
  'test-headshot.png': {
    type: 'png',
    size: 'small', // < 1MB
    description: 'Valid PNG headshot for testing',
  },
  'invalid-file.txt': {
    type: 'text',
    content: 'This is not an image file',
    description: 'Invalid file type for error testing',
  },
  'large-file.jpg': {
    type: 'jpeg',
    size: 'large', // > 5MB
    description: 'Oversized JPEG for size validation testing',
  },
};

console.log('Creating test fixture images...\n');

// Create invalid text file
fs.writeFileSync(
  path.join(__dirname, 'invalid-file.txt'),
  'This is a text file, not an image. Used for testing file type validation.'
);
console.log('✓ Created invalid-file.txt');

// Create README for fixtures
const readmeContent = `# Test Fixtures

This directory contains test images used by Playwright E2E tests.

## Files

### Valid Test Images
- **test-headshot.jpg** - Valid JPEG image (< 1MB) for headshot upload testing
- **test-headshot.png** - Valid PNG image (< 1MB) for headshot upload testing

### Invalid Test Files
- **invalid-file.txt** - Text file for testing invalid file type validation
- **large-file.jpg** - Oversized JPEG (> 5MB) for file size validation testing

## Creating Real Test Images

To create actual test images, you can:

1. **Manual approach**: Add your own small image files (500x500px, < 1MB)
2. **Using online tools**: Generate solid color images at https://dummyimage.com/
   - test-headshot.jpg: https://dummyimage.com/500x500/4a90e2/fff.jpg
   - test-headshot.png: https://dummyimage.com/500x500/9b59b6/fff.png
3. **Using ImageMagick** (if installed):
   \`\`\`bash
   convert -size 500x500 xc:#4a90e2 test-headshot.jpg
   convert -size 500x500 xc:#9b59b6 test-headshot.png
   convert -size 8000x8000 xc:#e74c3c large-file.jpg
   \`\`\`

## Download Test Images

Use these commands to download test images:

\`\`\`bash
# Download test-headshot.jpg (blue square)
curl -o tests/fixtures/test-headshot.jpg "https://dummyimage.com/500x500/4a90e2/fff.jpg"

# Download test-headshot.png (purple square)
curl -o tests/fixtures/test-headshot.png "https://dummyimage.com/500x500/9b59b6/fff.png"

# Download large-file.jpg (red square, > 5MB)
curl -o tests/fixtures/large-file.jpg "https://dummyimage.com/8000x8000/e74c3c/fff.jpg"
\`\`\`

## Notes

- The tests will use these fixtures to validate:
  - File upload functionality
  - File type validation (JPG/PNG only)
  - File size validation (< 5MB)
  - Preview generation
  - Headshot removal
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readmeContent);
console.log('✓ Created README.md');

console.log('\n⚠️  IMPORTANT: You need to download actual test images!');
console.log('Run these commands from the project root:\n');
console.log('curl -o tests/fixtures/test-headshot.jpg "https://dummyimage.com/500x500/4a90e2/fff.jpg"');
console.log('curl -o tests/fixtures/test-headshot.png "https://dummyimage.com/500x500/9b59b6/fff.png"');
console.log('curl -o tests/fixtures/large-file.jpg "https://dummyimage.com/8000x8000/e74c3c/fff.jpg"');
console.log('\nOr see tests/fixtures/README.md for alternative methods.');
