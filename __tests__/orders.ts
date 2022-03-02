import bt from '../src/index';
global.fetch = require('node-fetch');

describe('blocktank public api', () => {
    beforeAll(async () => {});

    it('get CR info and get invoice for first product', async () => {
        const info = await bt.getInfo();

        expect(info.capacity.remote_balance).not.toBeNaN();

        const service = info.services[0];

        const rates = await bt.getRates();
        expect(rates.BTC).not.toBeNaN();

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


        // const f = await bt.finalizeChannel({order_id: '618d08ea89e7dfdde19d34e5', product_id: info.services[0].product_id, node_uri: '0376e750bb6fba22f0414adc179c82e4f00b9fa43cf26229dbd8e55148d2cc2b8a@35.233.47.252:52048'})
    });
});
