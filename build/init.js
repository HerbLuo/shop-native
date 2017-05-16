const fs = require('fs');
const path = require('path');
const args = process.argv.splice(2);
const ip = getArg(args, '-h');
fs.writeFileSync(path.resolve('assets/config.js'), 'let CURRENT_IP = \'' + ip + '\';');

function getArg(args, str) {
    let index = args.findIndex(arg => arg === str);
    return args[index + 1];
}
