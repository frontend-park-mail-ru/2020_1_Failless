'use strict';

/** Saves blocks in a bundle that can be used for rendering in browser
 * @param {string} 1 - path to the directory where the bundles will be saved
 * @param {string} 2 - path to directory 'blocks' with the following structure:
 * blocks
 * ├── block1
 * │   ├── <some other files>
 * │   └── template.hbs
 * ├── block2
 * │   ├── <some other files>
 * │   └── template.hbs
 * ├── <other blocks>
 * note: template.hbs files must be encoded UTF-8 and should not conflict
 * with each other (i.e. only affect their own block)
 */

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const process = require('process');

// checking the arguments
if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.log(
        'Usage: node bundle-all path/to/bundle.bemhtml.js path/to/blocks-dir');
    process.exit(1);
}

/**
 * Checks is directory exists and is file is directory
 * @param {string} dirPath - path to dir
 * @returns {boolean}
 */
const checkDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        console.log(`blocks path does not exist: ${blocksPath}`);
        return false;
    }

    if (!fs.statSync(dirPath).isDirectory()) {
        console.log(`blocks path is not a directory: ${blocksPath}`);
        return false;
    }
    return true;
};

/**
 * Extract templates and fill context variable `output`
 * @param {string[]} files - string array with file's names from directory
 * @param {string} filesPath - path to the directory with templates folders
 */
const readDirCallback = (files, filesPath) => {
    files.forEach((file) => {
        const blockDir = path.resolve(filesPath, file);
        if (fs.statSync(blockDir).isDirectory()) {
            let template = '';
            const templateFile = path.resolve(blockDir, 'template.hbs');
            if (fs.existsSync(templateFile)) {
                console.log(`adding ${path.basename(blockDir)}`);
                template = fs.readFileSync(
                    templateFile, {'encoding': 'utf8'}) + '\n';
                let precomp = handlebars.precompile(template);
                output += `templates['${file}'] = template(${precomp});\n`;
            } else {
                console.log(
                    `skipping ${path.basename(blockDir)}: template.hbs not found`);
            }
        }
    });
};

const blocksPath = path.resolve(process.cwd(), process.argv[3]);

let bundlePath = path.resolve(process.cwd(), process.argv[2]);
let componentsPath = '';
let hasComponents = false;

if (process.argv.length === 5) {
    componentsPath = path.resolve(process.cwd(), process.argv[4]);
    hasComponents = checkDir(componentsPath);
}

if (!(checkDir(blocksPath) && checkDir(bundlePath))) {
    process.exit(1);
}

// options
const BUNDLE_NAME = 'bundle.handlebars.js';
bundlePath = path.resolve(bundlePath, BUNDLE_NAME);

let output =
    'let templates = Handlebars.templates = Handlebars.templates || {};\n' +
    'const template = Handlebars.template;\n';
fs.readdir(blocksPath, (err, files) => {
    // extracting templates
    readDirCallback(files, blocksPath);

    if (hasComponents) {
        console.log('Components were found at ' + componentsPath);
        fs.readdir(componentsPath, (err, files) => {
            readDirCallback(files, componentsPath);
            output += '\nHandlebars.partials = Handlebars.templates;\n';
            fs.writeFile(bundlePath, output, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`HTML bundle written to ${bundlePath}`);
                }
            });
        });
    } else {
        output += '\nHandlebars.partials = Handlebars.templates;\n';
        fs.writeFile(bundlePath, output, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`HTML bundle written to ${bundlePath}`);
            }
        });
    }
});
