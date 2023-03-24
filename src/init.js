
const { spawn } = require('child_process');

const app = spawn('node', ['src/app.js'], {
  detached: true,
  stdio: 'ignore'
});

app.unref();