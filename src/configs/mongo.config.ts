import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: ConfigService) =>
  // 'mongodb://' +
  // configService.get<string>('mongo_login') +
  // ':' +
  // configService.get<string>('mongo_password') +
  // '@' +
  // configService.get<string>('mongo_host') +
  // ':' +
  // configService.get<number>('mongo_port') +
  // '/' +
  // configService.get<string>('mongo_auth_db');
  'mongodb://admin:root@localhost:27017/admin';
const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
