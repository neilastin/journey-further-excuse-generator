# Test Fixtures

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
   ```bash
   convert -size 500x500 xc:#4a90e2 test-headshot.jpg
   convert -size 500x500 xc:#9b59b6 test-headshot.png
   convert -size 8000x8000 xc:#e74c3c large-file.jpg
   ```

## Download Test Images

Use these commands to download test images:

```bash
# Download test-headshot.jpg (blue square)
curl -o tests/fixtures/test-headshot.jpg "https://dummyimage.com/500x500/4a90e2/fff.jpg"

# Download test-headshot.png (purple square)
curl -o tests/fixtures/test-headshot.png "https://dummyimage.com/500x500/9b59b6/fff.png"

# Download large-file.jpg (red square, > 5MB)
curl -o tests/fixtures/large-file.jpg "https://dummyimage.com/8000x8000/e74c3c/fff.jpg"
```

## Notes

- The tests will use these fixtures to validate:
  - File upload functionality
  - File type validation (JPG/PNG only)
  - File size validation (< 5MB)
  - Preview generation
  - Headshot removal
