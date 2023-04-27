import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './configs/configuration';
import { getMongoConfig } from './configs/mongo.config';
import { AccessTokenGuard } from './common/guards/accessToken.guard';
import { CaslModule } from './casl/casl.module';
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';
import { ActorModule } from './actor/actor.module';
import { MovieModule } from './movie/movie.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UsersModule,
    AuthModule,
    CaslModule,
    GenreModule,
    FileModule,
    ActorModule,
    MovieModule,
    RatingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
