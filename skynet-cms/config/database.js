const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
  // CRITICAL: Use DATABASE_URL from Railway
  const databaseUrl = env('DATABASE_URL');
  
  console.log('=== DATABASE DEBUG ===');
  console.log('DATABASE_URL exists:', !!databaseUrl);
  console.log('DATABASE_CLIENT:', env('DATABASE_CLIENT', 'not set'));
  console.log('======================');
  
  // If DATABASE_URL exists (Railway provides this)
  if (databaseUrl) {
    const config = parse(databaseUrl);
    console.log('Parsed database config:');
    console.log('Host:', config.host);
    console.log('Port:', config.port);
    console.log('Database:', config.database);
    console.log('User:', config.user);
    console.log('SSL:', env.bool('DATABASE_SSL', true));
    
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: env.bool('DATABASE_SSL', true) ? {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false)
          } : false,
        },
        debug: false,
        pool: {
          min: 0,
          max: 10,
        },
      },
    };
  }
  
  // FALLBACK WARNING - This should NOT happen in Railway
  console.error('⚠️ WARNING: DATABASE_URL not found! Using fallback config.');
  console.error('⚠️ This will fail in Railway. Please add PostgreSQL to your project.');
  
  // For local development only
  const client = env('DATABASE_CLIENT', 'sqlite');
  
  if (client === 'sqlite') {
    return {
      connection: {
        client: 'better-sqlite3',
        connection: {
          filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        },
        useNullAsDefault: true,
      },
    };
  }
  
  // This config will fail - it's just to show the error clearly
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', 'DATABASE_URL_NOT_SET'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'DATABASE_URL_NOT_SET'),
        user: env('DATABASE_USERNAME', 'DATABASE_URL_NOT_SET'),
        password: env('DATABASE_PASSWORD', 'DATABASE_URL_NOT_SET'),
        ssl: false,
      },
      debug: true,
    },
  };
};
