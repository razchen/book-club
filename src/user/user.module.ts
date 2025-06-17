import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './user.permission';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    CaslModule.forFeature({ permissions }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
