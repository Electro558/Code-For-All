// build.js (updated)
import fs from "fs";
import path from "path";
import nunjucks from "nunjucks";

// Directories
const srcDir = path.resolve("src");
const distDir = path.resolve("dist");

// Configure Nunjucks to read from src/
const env = nunjucks.configure(srcDir, { autoescape: true });

/* This filter replaces newline with break tags */

env.addFilter(
    "autoline",
    (text) => new nunjucks.runtime.SafeString(text.replace(/\n/g, "<br/>")),
);


/**
 * Read all .json files in `dir` and return an object where each key is the
 * filename (without .json) and the value is the parsed JSON.
 *
 * Example: team_members.json -> { team_members: [...] }
 */
function loadJsonContextForDir(dir) {
    const context = {};
    if (!fs.existsSync(dir)) return context;

    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        if (f.isFile() && f.name.endsWith(".json")) {
            const p = path.join(dir, f.name);
            try {
                const raw = fs.readFileSync(p, "utf8");
                const parsed = JSON.parse(raw);
                const key = path.basename(f.name, ".json");
                context[key] = parsed;
            } catch (err) {
                console.warn(
                    `Warning: failed to parse JSON ${p}: ${err.message}`,
                );
            }
        }
    }

    return context;
}

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
                // Build render context: load any .json files in the same folder as the template
                const templateDir = path.dirname(srcPath);
                const folderContext = loadJsonContextForDir(templateDir);

                // Also allow same-basename JSON (e.g. index.json next to index.html) to override / add
                const basenameJsonPath = path.join(
                    templateDir,
                    `${path.basename(item.name, ".html")}.json`,
                );
                if (fs.existsSync(basenameJsonPath)) {
                    try {
                        const raw = fs.readFileSync(basenameJsonPath, "utf8");
                        const parsed = JSON.parse(raw);
                        // merge in and allow same-basename to override keys if it contains named keys
                        Object.assign(folderContext, parsed);
                    } catch (err) {
                        console.warn(
                            `Warning: failed to parse JSON ${basenameJsonPath}: ${err.message}`,
                        );
                    }
                }

                // Template path relative to srcDir (nunjucks.render expects template name relative to configured paths)
                const templateName = path
                    .relative(srcDir, srcPath)
                    .replace(/\\/g, "/");

                try {
                    const rendered = env.render(templateName, folderContext);
                    fs.writeFileSync(destPath, rendered);
                    console.log(`Rendered: ${templateName}`);
                } catch (err) {
                    console.error(`Error rendering ${srcPath}:`, err.message);
                }
            } else if (!item.name.endsWith(".json")) {
                // Copy other assets (CSS, JS, images, etc.)
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

// Clean dist first (optional)
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Run build
buildDir(srcDir, distDir);
console.log("Build complete! Files written to dist/");
