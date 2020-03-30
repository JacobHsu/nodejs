// https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows

// https://stackoverflow.com/questions/45405206/node-child-process-spawn-path
var path = require('path');
var nwDir = path.dirname(process.execPath);

console.log(nwDir)
// On Windows Only...
const { spawn } = require('child_process');
const bat = spawn('cmd.exe', ['/c', 'my.bat']);

bat.stdout.on('data', (data) => {
  console.log(data.toString());
});

bat.stderr.on('data', (data) => {
  console.error(data.toString());
});

bat.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});