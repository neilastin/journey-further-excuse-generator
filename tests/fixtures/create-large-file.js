/**
 * Creates a large test file (> 5MB) for file size validation testing
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a 6MB file by copying the small JPEG multiple times
const sourceFile = path.join(__dirname, 'test-headshot.jpg');
const targetFile = path.join(__dirname, 'large-file.jpg');

if (!fs.existsSync(sourceFile)) {
  console.error('Error: test-headshot.jpg not found. Please download it first.');
  process.exit(1);
}

const sourceBuffer = fs.readFileSync(sourceFile);
const targetSize = 6 * 1024 * 1024; // 6MB
const copies = Math.ceil(targetSize / sourceBuffer.length);

// Create a buffer large enough
const largeBuffer = Buffer.concat(
  Array(copies).fill(sourceBuffer)
).slice(0, targetSize);

fs.writeFileSync(targetFile, largeBuffer);

const stats = fs.statSync(targetFile);
console.log(`Created large-file.jpg: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
