import cr from '../src/index';
global.fetch = require('node-fetch');

describe('chain reactor', () => {
    beforeAll(async () => {});

    it('get CR info and get invoice for first product', async () => {
        const info = await cr.getInfo();

        expect(info.capacity.remote_balance).not.toBeNaN();

        const service = info.services[0];

        // const buy = await cr.buyChannel({
        //     product_id: service.product_id,
        //     channel_expiry: 4,
        //     remote_balance: 0,
        //     local_balance: 20000,
        // });
        //
        // expect(typeof buy.ln_invoice).toBe('string');
        // expect(typeof buy.total_amount).toBe('number');
        // expect(typeof buy.btc_address).toBe('string');
        //
        // //Check order
        // const order = await cr.getOrder(buy.order_id);
        //
        // expect(order.state).toBe(0);
        // expect(typeof order.purchase_invoice).toBe('string');
    });
});
