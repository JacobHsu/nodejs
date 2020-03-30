const program = require('commander');
const package = require('./package.json');

program
  //.version(package.version)
  .version(package.version, '-v, --version') // 如果希望程序響應-v選項而不是-V選項，
  .parse(process.argv);


// node index.js -V
// node index -v