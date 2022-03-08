import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from './app.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Config,
    Logger,
  ]
})
export class AppModule { }
