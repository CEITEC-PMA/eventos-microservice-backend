import { Injectable } from '@nestjs/common';

export type ApiName = {
  api: string;
  version: string;
  port: number;
};

@Injectable()
export class AppService {
  getHello(): ApiName {
    return {
      api: 'micro-eventos-backend',
      version: '0.0.1',
      port: 3000,
    };
  }
}
