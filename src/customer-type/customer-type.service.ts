import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class CustomerTypeService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT * FROM customer_type',
        );

        return rows;
    }

    async getOne(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT * FROM customer_type WHERE customer_type_id = ?',
            [id],
        );

        if (rows.length === 0) {
            throw new NotFoundException('Customer type not found');
        }

        return rows[0];
    }

    async create(body: {
        customer_type_code: string;
        customer_type_name: string;
    }) {
        const [result] = await this.pool().execute<ResultSetHeader>(
            `INSERT INTO customer_type
             (customer_type_code, customer_type_name)
             VALUES (?, ?)`,
            [body.customer_type_code, body.customer_type_name],
        );

        return this.getOne(result.insertId);
    }

    async update(
        id: number,
        body: {
            customer_type_code?: string;
            customer_type_name?: string;
        },
    ) {
        await this.getOne(id);

        const fields: string[] = [];
        const values: string[] = [];

        if (body.customer_type_code !== undefined) {
            fields.push('customer_type_code = ?');
            values.push(body.customer_type_code);
        }

        if (body.customer_type_name !== undefined) {
            fields.push('customer_type_name = ?');
            values.push(body.customer_type_name);
        }

        if (fields.length > 0) {
            values.push(String(id));

            await this.pool().execute(
                `UPDATE customer_type
                 SET ${fields.join(', ')}
                 WHERE customer_type_id = ?`,
                values,
            );
        }

        return this.getOne(id);
    }

    async remove(id: number) {
        await this.getOne(id);

        const [result] = await this.pool().execute<ResultSetHeader>(
            'DELETE FROM customer_type WHERE customer_type_id = ?',
            [id],
        );

        return { deleted: result.affectedRows > 0 };
    }
}