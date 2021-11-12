import {
    IBuyChannelRequest,
    IBuyChannelResponse,
    IFinalizeChannelRequest,
    IFinalizeChannelResponse,
    IGetInfoResponse,
    IGetOrderResponse,
    IHeaders
} from './types';
import fetch from 'cross-fetch';

class Blocktank {
    private host = '';
    private additionalHeaders: IHeaders = {};

    constructor() {
        this.setNetwork('testnet');
    }

    setNetwork(network: 'mainnet' | 'testnet' | 'regtest'): void {
        switch (network) {
            case 'mainnet': {
                throw new Error('Network not yet supported');
                break;
            }
            case 'testnet': {
                this.host = 'http://35.233.47.252:443/chainreactor/v1/';
                break;
            }
            case 'regtest': {
                throw new Error('Network not yet supported');
                break;
            }
        }
    }

    setHeaders(headers: IHeaders) {
        this.additionalHeaders = headers;
    }

    static getStateMessage(code: number): string {
        switch (code) {
            case 0:
                return 'Awaiting payment';
            case 100:
                return 'Paid';
            case 200:
                return 'Queued for opening';
            case 300:
                return 'Channel opening';
            case 350:
                return 'Channel closing';
            case 400:
                return 'Given up';
            case 450:
                return 'Channel closed';
            case 500:
                return 'Channel open';
        }

        return `Unknown code: ${code}`;
    }

    async call(path: string, method: 'GET' | 'POST', request?: any): Promise<any> {
        const url = `${this.host}${path}`;

        const fetchRes = await fetch(url, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...this.additionalHeaders
            },
            body: request ? JSON.stringify(request) : undefined
        });

        if (fetchRes.status !== 200) {
            throw new Error(`HTTP error ${fetchRes.status}`);
        }
        const body = await fetchRes.json();

        if (!body) {
            throw new Error('Unknown HTTP error');
        }

        if (body.error) {
            throw new Error(body.error);
        }

        return body;
    }

    async getInfo(): Promise<IGetInfoResponse> {
        const res: IGetInfoResponse = await this.call('node/info', 'GET');

        return res;
    }

    async buyChannel(req: IBuyChannelRequest): Promise<IBuyChannelResponse> {
        const res: IBuyChannelResponse = await this.call('channel/buy', 'POST', req);

        res.price = Number(res.price);
        res.total_amount = Number(res.total_amount);

        return res;
    }

    async finalizeChannel(req: IFinalizeChannelRequest): Promise<IFinalizeChannelResponse> {
        const res: IFinalizeChannelResponse = await this.call('channel/manual_finalise', 'POST', req);

        return res;
    }

    async getOrder(orderId: string): Promise<IGetOrderResponse> {
        const res: IGetOrderResponse = await this.call(`channel/order?order_id=${orderId}`, 'GET');

        res.amount_received = res.amount_received ? Number(res.amount_received) : 0;

        res.onchain_payments.forEach((payment, index) => {
            res.onchain_payments[index] = {
                ...payment,
                amount_base: Number(payment.amount_base),
                fee_base: Number(payment.fee_base)
            };
        });

        res.total_amount = Number(res.total_amount);
        res.stateMessage = Blocktank.getStateMessage(res.state);

        return res;
    }
}

const bt = new Blocktank();

export * from './types';

export default bt;
