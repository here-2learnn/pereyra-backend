import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class CustomersService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT * FROM customers',
        );
        return rows;
    }

    async getOne(id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT * FROM customers WHERE customer_id = ?',
            [id],
        );

        if (rows.length === 0) {
            throw new NotFoundException('Customer not found');
        }

        return rows[0];
    }

    async create(body: {
        customer_name: string;
        customer_email: string;
        customer_type_id: number;
    }) {
        const [result] = await this.pool().execute<ResultSetHeader>(
            `INSERT INTO customers
             (customer_name, customer_email, customer_type_id)
             VALUES (?, ?, ?)`,
            [body.customer_name, body.customer_email, body.customer_type_id],
        );

        return this.getOne(result.insertId);
    }

    async update(
        id: number,
        body: {
            customer_name?: string;
            customer_email?: string;
            customer_type_id?: number;
        },
    ) {
        await this.getOne(id);

        const fields: string[] = [];
        const values: (string | number)[] = [];

        if (body.customer_name !== undefined) {
            fields.push('customer_name = ?');
            values.push(body.customer_name);
        }

        if (body.customer_email !== undefined) {
            fields.push('customer_email = ?');
            values.push(body.customer_email);
        }

        if (body.customer_type_id !== undefined) {
            fields.push('customer_type_id = ?');
            values.push(body.customer_type_id);
        }

        if (fields.length > 0) {
            values.push(id);
            await this.pool().execute(
                `UPDATE customers SET ${fields.join(', ')}
                 WHERE customer_id = ?`,
                values,
            );
        }

        return this.getOne(id);
    }

    async remove(id: number) {
        await this.getOne(id);

        const [result] = await this.pool().execute<ResultSetHeader>(
            'DELETE FROM customers WHERE customer_id = ?',
            [id],
        );

        return { deleted: result.affectedRows > 0 };
    }
}