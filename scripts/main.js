'use strict';

/** Saves blocks in a bundle that can be used for rendering in browser
 * @param {string} 1 - path to the directory where the bundles will be saved
 * @param {string} 2 - path to directory 'blocks' with the following structure:
 * blocks
 * ├── block1
 * │   ├── <some other files>
 *     ├── animation.js
 * │   └── template.hbs
 * ├── block2
 * │   ├── <some other files>
 *     ├── animation.js
 * │   └── template.hbs
 * ├── <other blocks>
 * @param {string} 3 - path to directory 'components' with the following structure:
 * components
 * ├── page1
 * │   ├── <some other files>
 * │   └── template.hbs
 * ├── page2
 * │   ├── <some other files>
 * │   └── template.hbs
 * ├── <other pages>
 * note: template.hbs files must be encoded UTF-8. A component can include only
 * blocks and it is forbidden for components to include each other.
 */

const fs = require('fs');
const fsAsync = require('fs').promises;
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
 * Read content from file and append it to context variables `output` and `customJS`.
 * If animate variable is set then content are appended to `customJS` else to `output`
 * @param {string} blockDir - full path to target directory
 * @param {string} blockName - name of block (for template alias in bundle.js)
 * @param {string} fileName - name of file into blockDir which we wanna read
 * @param {boolean} animate - is animate (default false)
 */
const readFromFile = (blockDir, blockName, fileName, animate = false) => {
    const templateFile = path.resolve(blockDir, fileName);
    if (fs.existsSync(templateFile)) {
        console.log(`adding ${path.basename(blockDir)}`);
        let content = fs.readFileSync(
            templateFile, {'encoding': 'utf8'}) + '\n';
        if (!animate) {
            let precomp = handlebars.precompile(content);
            output += `templates['${blockName}'] = template(${precomp});\n`;
        } else {
            customJS += `${content}\n`;
        }
    } else {
        console.log(
            `skipping ${path.basename(blockDir)}: ${fileName} not found`);
    }
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
            readFromFile(blockDir, file, 'template.hbs');
            readFromFile(blockDir, file, 'animation.js', true);
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
let customJS = '\n\n////////////////////////////// CUSTOM JS ANIMATION STARTS HERE //////////////////////////////\n\n';
fs.readdir(blocksPath, (err, files) => {
    // extracting templates
    readDirCallback(files, blocksPath);

    if (hasComponents) {
        console.log('Components were found at ' + componentsPath);
        fs.readdir(componentsPath, (err, files) => {
            readDirCallback(files, componentsPath);
            output += '\nHandlebars.partials = Handlebars.templates;\n';
            (async () => {
                await fsAsync.writeFile(bundlePath, output, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`HTML bundle written to ${bundlePath}`);
                    }
                }).then(() => {
                    fsAsync.appendFile(bundlePath, customJS, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`JS bundle written to ${bundlePath}`);
                        }
                    });
                }).then(() => {
                    console.log('success');
                });
            })();
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
