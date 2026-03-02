import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (
        file !== "node_modules" &&
        file !== ".git" &&
        file !== "prisma" &&
        file !== "database"
      ) {
        filelist = walkSync(fullPath, filelist);
      }
    } else {
      if (fullPath.endsWith(".js") && file !== "migrate.js") {
        filelist.push(fullPath);
      }
    }
  });
  return filelist;
}

const files = walkSync(__dirname);
console.log(`Processing ${files.length} files...`);

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");

  // Remove "use strict";
  content = content.replace(/"use strict";\n+/g, "");

  content = content.replace(
    /require\("dotenv"\)\.config\(\)/g,
    `import "dotenv/config.js"`,
  );

  // Simple require statements with assignments
  // const X = require("Y") -> import X from "Y.js" (if local)
  content = content.replace(
    /const\s+([A-Za-z0-9_]+)\s*=\s*require\((['"])(.*?)\2\);?/g,
    (match, p1, quote, p3) => {
      let importPath = p3;
      if (importPath.startsWith(".")) {
        importPath =
          importPath.endsWith(".js") || importPath.endsWith(".json")
            ? importPath
            : importPath + ".js";
      }
      return `import ${p1} from "${importPath}";`;
    },
  );

  // Destructuring require statements
  // const { X, Y } = require("Z") -> import { X, Y } from "Z.js"
  content = content.replace(
    /const\s+\{([^}]+)\}\s*=\s*require\((['"])(.*?)\2\);?/g,
    (match, p1, quote, p3) => {
      let importPath = p3;
      if (importPath.startsWith(".")) {
        importPath =
          importPath.endsWith(".js") || importPath.endsWith(".json")
            ? importPath
            : importPath + ".js";
      }
      return `import { ${p1.trim()} } from "${importPath}";`;
    },
  );

  // Bare require (e.g. require("../../config/prisma"))
  content = content.replace(
    /require\((['"])(.*?)\2\);?/g,
    (match, quote, p2) => {
      if (match.includes("dotenv")) return match; // already handled
      let importPath = p2;
      if (importPath.startsWith(".")) {
        importPath =
          importPath.endsWith(".js") || importPath.endsWith(".json")
            ? importPath
            : importPath + ".js";
      }
      return `import "${importPath}";`;
    },
  );

  // module.exports = { X, Y } -> export { X, Y };
  content = content.replace(
    /module\.exports\s*=\s*\{([^}]+)\};?/g,
    (match, p1) => {
      return `export { ${p1.trim()} };`;
    },
  );

  // module.exports = function/async/Object -> export default ...
  content = content.replace(/module\.exports\s*=\s*(.+?);?$/gm, (match, p1) => {
    return `export default ${p1};`;
  });

  // Fix routes/x/index.js handlers.foo() to use named imports if they use handlers.foo
  // Wait, if it's imported as `import handlers from "./handler.js"`, it might need to be `import * as handlers ...`
  // But wait, our export in handler.js is `export { X, Y };`.
  // When doing `import handlers from "./handler.js";`, it will fail because there's no default export!
  // So we should replace `import handlers from "./handler.js"` with `import * as handlers from "./handler.js"`
  content = content.replace(
    /import\s+handlers\s+from\s+"([^"]+handler\.js)"/g,
    'import * as handlers from "$1"',
  );

  fs.writeFileSync(file, content, "utf8");
}

console.log("Migration complete!");
