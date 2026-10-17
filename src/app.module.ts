import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CustomerTypeModule } from './customer-type/customer-type.module';
import { CustomersModule } from './customers/customers.module';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule,
        CustomerTypeModule,
        CustomersModule,
    ],
})
export class AppModule {}