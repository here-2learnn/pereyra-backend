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
import { CustomerTypeService } from './customer-type.service';

@Controller('customer-type')
export class CustomerTypeController {
    constructor(private customerTypeService: CustomerTypeService) {}

    @Get()
    async getAll() {
        return this.customerTypeService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.customerTypeService.getOne(id);
    }

    @Post()
    async create(
        @Body()
        body: {
            customer_type_code: string;
            customer_type_name: string;
        },
    ) {
        return this.customerTypeService.create(body);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: {
            customer_type_code?: string;
            customer_type_name?: string;
        },
    ) {
        return this.customerTypeService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.customerTypeService.remove(id);
    }
}