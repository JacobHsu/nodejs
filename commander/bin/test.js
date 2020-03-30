// 引入依赖
var program = require('commander');

// 定义版本和参数选项
program
  .version('0.1.0', '-v, --version')
  .option('-i, --init', 'init something')
  .option('-g, --generate', 'generate something')
  .option('-r, --remove', 'remove something')
  .option('-d, --debug', 'output extra debugging')
  .option("--dids <n>", 'Number of dids', parseInt);

// 必须在.parse()之前，因为node的emit()是即时的
program.on('--help', function(){
 console.log('  Examples:');
  console.log('');
  console.log('    this is an example');
  console.log('');
});

program.parse(process.argv);

// node bin/test -i
if(program.init) {
  console.log('init something')
}

if(program.generate) {
  console.log('generate something')
}

if(program.remove) {
  console.log('remove something')
}

// node bin/test -d
if (program.debug) console.log(program.opts());


// node bin/test --dids 7
const numberOfDids = program.dids || 3
console.log('numberOfDids:', numberOfDids);