
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(private customersService: CustomersService) {}

    @Get()
    async getAll() {
        return this.customersService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.customersService.getOne(id);
    }

    @Post()
    async create(
        @Body()
        body: {
            customer_name: string;
            customer_email: string;
            customer_type_id: number;
        },
    ) {
        return this.customersService.create(body);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: {
            customer_name?: string;
            customer_email?: string;
            customer_type_id?: number;
        },
    ) {
        return this.customersService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.customersService.remove(id);
    }
}