// Start the server
require('./server.js');

setTimeout(async () => {
  // Run tests
  const { spawn } = require('child_process');
  const testProcess = spawn('node', ['backend/testServer.js'], { stdio: 'inherit' });

  testProcess.on('exit', (code) => {
    console.log(`\nTest runner completed with exit code: ${code}`);
    process.exit(code);
  });
}, 800);
