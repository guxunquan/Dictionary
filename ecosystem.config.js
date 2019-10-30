module.exports = {
    apps: [{
      name: 'dictionary',
      script: 'dist',
      instances: 2,
      wait_ready: true,
      listen_timeout: 15000,
      log_date_format: 'YYYY-MM-DD HH:mm:SS Z',
      exec_mode: 'cluster',
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 80
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 80
      },
      post_update: [
        'npm install',
        'npm run-script build'
      ]
    }, {
      name: 'mq',
      script: 'dist/mq.js',
      log_date_format: 'YYYY-MM-DD HH:mm:SS Z',
      env_staging: {
        NODE_ENV: 'staging',
        TYPE: 'mq'
      },
      env_production: {
        NODE_ENV: 'production',
        TYPE: 'mq'
      },
      post_update: [
        'npm install',
        'npm run-script build',
        'echo launching mq'
      ]
    }],
  
    deploy: {
      staging: {
        user: 'ubuntu',
        key: process.env.HOME + '/.ssh/fiton-staging.pem',
        host: 'ec2-18-191-172-221.us-east-2.compute.amazonaws.com',
        ref: 'origin/staging',
        repo: 'git@github.com:fitonapp/fiton-api.git',
        path: '/home/ubuntu/fiton',
        ssh_options: 'StrictHostKeyChecking=no',
        'pre-setup': 'sudo apt-get -y install git; pm2 install pm2-intercom',
        'post-deploy': 'npm install && npm run-script build && sudo pm2 reload all --update-env staging'
      }
    }
  }