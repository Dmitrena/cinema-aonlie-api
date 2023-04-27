export default () => ({
  database: {
    mongo_login: process.env.MONGO_LOGIN,
    mongo_password: process.env.MONGO_PASSWORD,
    mongo_host: process.env.MONGO_HOST,
    mongo_port: process.env.MONGO_PORT,
    mongo_auth_db: process.env.MONGO_AUTH_DB,
  },
});
