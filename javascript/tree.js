const fs = require('fs');
const util = require('util');

const fsReadDir = util.promisify(fs.readdir);
const fsStat = util.promisify(fs.lstat);


const tree =  (path) => {
    const files = [];
    const dirs = [path];
    return new Promise(async (resolve, reject) => {

        const data = await Promise.resolve(fsReader(path));
        if (data.length === 0) {
            resolve({
                files,
                dirs
            })
        }
        const result = await Promise.resolve(forLoop(path, data));
        if (result.files.length !== 0) {
            files.push(...result.files);
        }
        if (result.dirs.length !== 0) {
            for (let i = 0; i < result.dirs.length; i++) {
                const cont = await Promise.resolve(tree(result.dirs[i]));
                files.push(...cont.files);
                dirs.push(...cont.dirs);
            }
        }
        resolve({
            files,
            dirs
        })
    })
};

const fsReader = (path) => {
    return new Promise(async (resolve, reject) => {
        resolve( await fsReadDir(path));
    })
};


const run = async (path) => {
    const result = await Promise.resolve(tree(path));
    console.log(result);
};
run('/home/andrey/docker_containers');



const check = (path) => {
    return new Promise( (resolve, reject) => {
        fsStat(path).then(res => {
            if (res.isDirectory()) {
                resolve('dir')
            }
            if (res.isFile()) {
                resolve('file')
            }
        })
    })
};
const forLoop = (path, array) => {
    return new Promise(async (res, rej) => {
        const files = [];
        const dirs = [];
        for (let i = 0; i < array.length; i++) {
            const res = await Promise.resolve(check(`${path}/${array[i]}`));
            if (res === 'dir') {
                dirs.push(`${path}/${array[i]}`);
            }
            if (res === 'file') {
                files.push(`${path}/${array[i]}`);
            }
        }
        res({
            files,
            dirs
        })
    });
};
