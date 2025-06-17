import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './book/books.module';
import { BookClubsModule } from './book-club/book-clubs.module';
import { CaslModule } from 'nest-casl';
import { Roles } from './app.roles';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
    }),
    CaslModule.forRoot<Roles>({
      superuserRole: Roles.admin,
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    BookClubsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
