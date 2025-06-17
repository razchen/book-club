import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './user.permission';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    CaslModule.forFeature({ permissions }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UsersModule {}
