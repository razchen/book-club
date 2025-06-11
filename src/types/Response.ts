import { HttpStatus } from '@nestjs/common';

export type Response = {
  message: string;
  code: HttpStatus;
};
