module.exports = {
  apps: [
    {
      name: 'qilu-school',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/qilu-school/client',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/qilu-school-error.log',
      out_file: '/var/log/pm2/qilu-school-out.log',
      log_file: '/var/log/pm2/qilu-school.log',
      time: true
    }
  ]
};
