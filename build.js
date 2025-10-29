// build.js
import fs from "fs";
import path from "path";
import nunjucks from "nunjucks";

// Directories
const srcDir = path.resolve("src");
const distDir = path.resolve("dist");

// Configure Nunjucks to read from src/
nunjucks.configure(srcDir, { autoescape: true });

// Recursively copy & render files
function buildDir(src, dest) {
  // Ensure destination folder exists
  fs.mkdirSync(dest, { recursive: true });

  // Loop through all files/folders
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      // Recurse into subdirectories
      buildDir(srcPath, destPath);
    } else {
      if (item.name.endsWith(".html")) {
        // Render Nunjucks template
        try {
          const rendered = nunjucks.render(path.relative(srcDir, srcPath));
          fs.writeFileSync(destPath, rendered);
          console.log(`Rendered: ${path.relative(srcDir, srcPath)}`);
        } catch (err) {
          console.error(`Error rendering ${srcPath}:`, err.message);
        }
      } else {
        // Copy other assets (CSS, JS, images, etc.)
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Clean dist first (optional)
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// Run build
buildDir(srcDir, distDir);
console.log("Build complete! Files written to dist/");
