// addComponents.js
// "docs:build": "vuepress build docs --clean-cache --clean-temp",
import * as fs from 'fs';
// 或者如果你只需要某些特定的方法，可以这样做：
// import { readFileSync, writeFileSync } from 'fs';
import findMarkdown from './findMarkdown.js';
const rootDir = "./docs";

findMarkdown(rootDir, writeComponents);

function writeComponents(dir) {
    if (!/README/.test(dir)) {
        fs.appendFile(dir, `\n \n <comment/> \n `, err => {
            if (err) throw err;
            console.log(`add components to ${dir}`);
        });
    }
}
