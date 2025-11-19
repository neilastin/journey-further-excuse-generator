# Test Fixtures

Test images for Playwright E2E tests.

## Files

- **test-headshot.jpg** - Valid JPEG (<1MB) for headshot upload
- **test-headshot.png** - Valid PNG (<1MB) for headshot upload
- **invalid-file.txt** - Invalid file type
- **large-file.jpg** - Oversized (>5MB) for size validation

## Creating Test Images

Download from dummyimage.com:
```bash
curl -o tests/fixtures/test-headshot.jpg "https://dummyimage.com/500x500/4a90e2/fff.jpg"
curl -o tests/fixtures/test-headshot.png "https://dummyimage.com/500x500/9b59b6/fff.png"
curl -o tests/fixtures/large-file.jpg "https://dummyimage.com/8000x8000/e74c3c/fff.jpg"
```

Or use ImageMagick:
```bash
convert -size 500x500 xc:#4a90e2 test-headshot.jpg
convert -size 500x500 xc:#9b59b6 test-headshot.png
```
