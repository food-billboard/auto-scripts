module.exports = {
  name: "app",
  apps : [
    {
      name: 'app',
      script: 'src/index.js',
      env: {
        NODE_ENV: "production"
      },
      exec_mode: "cluster_mode",
      error_file: './log/pm2/error.log',
      out_file: './log/pm2/output.log'
    }, 
  ],
};