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
const BEMHTML_BUNDLE_NAME = 'bundle.handlebars.js';
const BEMHTML_OPTIONS = {exportName: 'handlebars', escapeContent: true};
const bemhtmlBundlePath = path.resolve(bundlePath, BEMHTML_BUNDLE_NAME);

let output = 'let templates = Handlebars.templates = Handlebars.templates || {};\n' +
    'const template = Handlebars.template;\n';
fs.readdir(blocksPath, (err, files) => {
    // extracting templates
    files.forEach((file) => {
        const blockDir = path.resolve(blocksPath, file);

        if (fs.statSync(blockDir).isDirectory()) {
            let template = '';
            const templateFile = path.resolve(blockDir, 'template.hbs');

            if (fs.existsSync(templateFile)) {
                console.log(`adding ${path.basename(blockDir)}`);
                // \n is needed for the one line comments
                // templates += fs.readFileSync(
                //     templateFile, {'encoding': 'utf8'}) + '\n';
                template = fs.readFileSync(
                    templateFile, {'encoding': 'utf8'}) + '\n';
                let precomp = handlebars.precompile(template);
                output +=
                    'templates[\'' + file + '\'] = template(';
                output += precomp + ');\n';
                // output += 'Handlebars.registerPartial( \''+ file +'\' ';
            } else {
                console.log(
                    `skipping ${path.basename(blockDir)}: template.hbs not found`);
            }

        }
    });
    output += '\nHandlebars.partials = Handlebars.templates;\n';

    fs.writeFile(bemhtmlBundlePath, output, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`HTML bundle written to ${bemhtmlBundlePath}`);
        }
    });
});
