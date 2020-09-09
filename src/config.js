module.exports = {
  chatchawan-users-post-endpoint
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL : process.env.DATABASE_URL || 'postgresql://@localhost/felix',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://@localhost/felix-test',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  JWT_SECRET : process.env.JWT_SECRET || 'not_a_working_secret'
};
