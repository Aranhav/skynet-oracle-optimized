module.exports = {
  apps: [
    {
      name: 'skynet-frontend',
      cwd: '/var/www/skynet/frontend',
      script: 'npm',
      args: 'start',
      instances: 2, // Use 2 cores for frontend
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '2G',
      error_file: '/var/log/pm2/frontend-error.log',
      out_file: '/var/log/pm2/frontend-out.log',
      log_file: '/var/log/pm2/frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      // ARM optimization
      node_args: '--max-old-space-size=2048'
    },
    {
      name: 'skynet-cms',
      cwd: '/var/www/skynet/cms',
      script: 'npm',
      args: 'start',
      instances: 1, // Strapi doesn't support clustering
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      max_memory_restart: '3G',
      error_file: '/var/log/pm2/cms-error.log',
      out_file: '/var/log/pm2/cms-out.log',
      log_file: '/var/log/pm2/cms-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      // ARM optimization
      node_args: '--max-old-space-size=3072'
    }
  ],

  // Deploy configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-oracle-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/skynet-oracle-optimized.git',
      path: '/var/www/skynet',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to Oracle Cloud..."'
    }
  }
};