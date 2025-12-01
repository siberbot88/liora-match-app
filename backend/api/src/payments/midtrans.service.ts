import { Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';

@Injectable()
export class MidtransService {
    private snap: midtransClient.Snap;
    private coreApi: midtransClient.CoreApi;

    constructor() {
        const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

        this.snap = new midtransClient.Snap({
            isProduction,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });

        this.coreApi = new midtransClient.CoreApi({
            isProduction,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });
    }

    async createTransaction(orderId: string, amount: number, customerDetails: any) {
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: customerDetails,
            enabled_payments: [
                'credit_card',
                'bca_va',
                'bni_va',
                'bri_va',
                'permata_va',
                'other_va',
                'gopay',
                'shopeepay',
            ],
        };

        const transaction = await this.snap.createTransaction(parameter);
        return transaction;
    }

    async getTransactionStatus(orderId: string) {
        return this.coreApi.transaction.status(orderId);
    }

    verifySignature(orderId: string, statusCode: string, grossAmount: string, signatureKey: string): boolean {
        const crypto = require('crypto');
        const serverKey = process.env.MIDTRANS_SERVER_KEY;

        const hash = crypto
            .createHash('sha512')
            .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
            .digest('hex');

        return hash === signatureKey;
    }
}
