/* eslint-disable  */
const fs = require('fs');
const walk = require('walk');
const path = require('path');

const rootPath = './typings/';

const walker = walk.walk(rootPath);

walker.on('file', (root, fileStats, next) => {
    const file = path.resolve(root, fileStats.name);
    if (file.match(/\.tsx?$/g)) {
        replaceAbsoluteImport(file);
    }
    next();
});

const replaceAbsoluteImport = (filepath) => {
    const content = fs.readFileSync(filepath).toString('utf8');
    replaceFileContent(filepath, content);
};
function replaceFileContent(filepath, content) {
    content = content.replace(/@\/[^']+/gm, (value) => {
        let importPath = path
            .resolve(rootPath, value.replace('@/', ''))
            .replace("'", '');
        let relativePath = path
            .relative(path.resolve(filepath, '../'), importPath)
            .replace(/\.tsx?$/g, '');
        if (!/\./g.test(relativePath)) {
            relativePath = './' + relativePath;
        }

        return relativePath;
    });
    fs.writeFileSync(filepath, content);
}
