import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

export const TestDatabaseConfig = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  entities: ['./**/*.entity.ts'],
  synchronize: true,
});

export const TestConfigModule = ConfigModule.forRoot({
  envFilePath: '.env.test',
});
