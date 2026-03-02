import fs from "fs";
import path from "path";

const dirs = fs.readdirSync("./routes");
for (const dir of dirs) {
  const p = path.join("./routes", dir, "index.js");
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, "utf8");
    content = content.replace(
      /import\s+handler\s+from\s+["']\.\/handler\.js["'];/g,
      'import * as handler from "./handler.js";',
    );
    fs.writeFileSync(p, content);
  }
}
console.log("Fixed handlers!");
