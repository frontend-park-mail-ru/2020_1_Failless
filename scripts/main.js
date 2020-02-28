'use strict';

/** Saves blocks in a bundle that can be used for rendering in browser
 * @param {string} 1 - path to the directory where the bundles will be saved
 * @param {string} 2 - path to directory 'blocks' with the following structure:
 * blocks
 * ├── block1
 * │   ├── <some other files>
 * │   └── template.js
 * ├── block2
 * │   ├── <some other files>
 * │   └── template.js
 * ├── <other blocks>
 * note: template.js files must be encoded UTF-8 and should not conflict
 * with each other (i.e. only affect their own block)
 */

const fs = require('fs');
const path = require('path');
const bemxjst = require('bem-xjst');


// checking the arguments
if (process.argv.length !== 4) {
    console.log(
        'Usage: node bundle-all path/to/bundle.bemhtml.js path/to/blocks-dir');
    process.exit(1);
}

const bundlePath = path.resolve(process.cwd(), process.argv[2]);
const blocksPath = path.resolve(process.cwd(), process.argv[3]);

if (!fs.existsSync(blocksPath)) {
    console.log(`blocks path does not exist: ${blocksPath}`);
    process.exit(1);
}

if (!fs.statSync(blocksPath).isDirectory()) {
    console.log(`blocks path is not a directory: ${blocksPath}`);
    process.exit(1);
}

if (!fs.existsSync(bundlePath)) {
    console.log(`cannot write bundle: directory does not exist: ${bundlePath}`);
    process.exit(1);
}

if (!fs.statSync(bundlePath).isDirectory()) {
    console.log(
        `cannot write bundle: bundle path is not a directory: ${bundlePath}`);
    process.exit(1);
}

// options
const BEMHTML_BUNDLE_NAME = 'bundle.bemhtml.js';
const BEMHTML_OPTIONS = {exportName: 'bemhtml', escapeContent: true};
const bemhtmlBundlePath = path.resolve(bundlePath, BEMHTML_BUNDLE_NAME);

const BEMTREE_BUNDLE_NAME = 'bundle.bemtree.js';
const BEMTREE_OPTIONS = {exportName: 'bemtree', runtimeLinting: true};
const bemtreeBundlePath = path.resolve(bundlePath, BEMTREE_BUNDLE_NAME);


let templates = '';
fs.readdir(blocksPath, (err, files) => {
    // extracting templates
    files.forEach((file) => {
        const blockDir = path.resolve(blocksPath, file);

        if (fs.statSync(blockDir).isDirectory()) {
            const templateFile = path.resolve(blockDir, 'template.js');

            if (fs.existsSync(templateFile)) {
                console.log(`adding ${path.basename(blockDir)}`);
                // \n is needed for the one line comments
                templates += fs.readFileSync(
                    templateFile, {'encoding': 'utf8'}) + '\n';
            } else {
                console.log(
                    `skipping ${path.basename(blockDir)}: template.js not found`);
            }
        }
    });

    // creating & saving bundles
    const htmlBundle = eval(`bemxjst.bemhtml.generate(() => {
    ${templates}
  }, ${JSON.stringify(BEMHTML_OPTIONS)});`);

    const treeBundle = eval(`bemxjst.bemtree.generate(() => {
    ${templates}
  }, ${JSON.stringify(BEMTREE_OPTIONS)});`);

    fs.writeFile(bemhtmlBundlePath, htmlBundle, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`HTML bundle written to ${bemhtmlBundlePath}`);
        }
    });

    fs.writeFile(bemtreeBundlePath, treeBundle, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Tree bundle written to ${bemtreeBundlePath}`);
        }
    });
});
