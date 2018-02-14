#!/usr/bin/env node
const fs = require('fs');
const path = require("path");

const source = process.argv[2];
const dest = process.argv[3];

const mkdirp = (srcPath) => {
    const parts = srcPath.split(path.sep);
    parts.slice(1).reduce(
        (full, next) => {
            full = `${full}${path.sep}${next}`;
            if (fs.existsSync(full) === false) {
                fs.mkdirSync(full);
            }
            return full;
        },
        parts[0]
    );
};

const x_copy = (source, dest) => new Promise(
    (resolve, reject) => {
        try {
            mkdirp(path.dirname(path.resolve(dest)));
            const srceStrim = fs.createReadStream(source);
            const destStrim = fs.createWriteStream(dest);
            destStrim.on('close', () => resolve());
            srceStrim.pipe(destStrim);
        }
        catch (err) {
            reject(err);
        }
    }
);

(async () => {
    console.log(`Copying ${source} to ${dest}`);
    await x_copy(source, dest);
    console.log('Done');
})();
