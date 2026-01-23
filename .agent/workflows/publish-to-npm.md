---
description: How to publish the react-lite-translation package to NPM
---

# 🚀 Publishing to NPM

Follow these steps to publish your package to the NPM registry.

### 0. Commit your changes
`npm version` requires a clean Git working directory because it automatically creates a commit and a tag for the new version.

```bash
git add .
git commit -m "feat: implement recommendations and enhance TSX support"
```

### 1. Prepare your `package.json`
Ensure your `package.json` has the correct metadata. Open [package.json](file:///home/yacine/projects/react-lite-translation/package.json) and update:
- **`name`**: Ensure this is unique (or use a scope like `@your-username/react-lite-translation`).
- **`version`**: Start with `1.0.0` (it will be updated by the `npm version` command below).
- **`author`**: Replace the placeholder with your name and email.

### 2. Login to NPM
If you haven't already, log in to your NPM account via the terminal:
```bash
npm login
```
This will open a browser window for authentication.

### 3. Build the Project
Ensure the `dist` folder is up to date with the latest changes:
// turbo
```bash
npm run build
```

### 4. Versioning
Automatically increment the version and create a git tag:
```bash
npm version major
# or npm version minor / npm version patch
```

### 5. Dry Run (Optional but Recommended)
Test what will be uploaded without actually publishing:
```bash
npm publish --dry-run
```
Check the output to ensure only the `dist`, `README.md`, and `LICENSE` files are included.

### 6. Publish
Finally, push your package to the registry:
```bash
npm publish --access public
```
