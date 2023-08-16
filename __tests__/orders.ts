import bt, {EBolt11InvoiceState, EPaymentState, IOrder} from '../src/index';

const validateOrder = (order: IOrder) => {
    expect(typeof order.id).toBe('string');
    expect(order.state).toEqual('created');
    expect(typeof order.feeSat).toBe('number');
    expect(typeof order.lspBalanceSat).toBe('number');
    expect(order.clientBalanceSat).toEqual(0);
    expect(typeof order.zeroConf).toBe('boolean');
    expect(order.channelExpiryWeeks).toEqual(6);
    expect(typeof order.channelExpiresAt).toBe('string');
    expect(typeof order.orderExpiresAt).toBe('string');
    expect(order.channel).toEqual(null);
    expect(typeof order.lspNode.alias).toBe('string');
    expect(typeof order.lspNode.pubkey).toBe('string');
    expect(Array.isArray(order.lspNode.connectionStrings)).toEqual(true);
    expect(Object.values(EPaymentState)).toContain(order.payment.state);
    expect(typeof order.payment.paidSat).toBe('number');
    expect(Object.values(EBolt11InvoiceState)).toContain(order.payment.bolt11Invoice.state);
    expect(typeof order.payment.bolt11Invoice.request).toBe('string');
    expect(typeof order.payment.bolt11Invoice.expiresAt).toBe('string');
    expect(typeof order.payment.bolt11Invoice.updatedAt).toBe('string');
    expect(typeof order.couponCode).toBe('string');
    expect(typeof order.discountPercent).toBe('number');
    expect(typeof order.updatedAt).toBe('string');
    expect(typeof order.createdAt).toBe('string');
}

describe('Blocktank public api', () => {
    it('Get Blocktank version info', async () => {
        const info = await bt.getInfo();
        expect(info.version).toBe(2);
    });

    it('Create a buy channel request', async () => {
        const order = await bt.createOrder({
            lspBalanceSat: 50000,
            channelExpiryWeeks: 6,
            clientBalanceSat: 0,
        });
        expect(order.lspBalanceSat).toEqual(50000);
        validateOrder(order);
    });

    it('Get order info', async () => {
        const id = '49eff859-e4bf-4433-a4d1-d84ff322988a';
        const order = await bt.getOrder(id);
        expect(order.id).toBe(id);
        validateOrder(order);
    });

    it('Get info from multiple orders', async () => {
        const ids = ['49eff859-e4bf-4433-a4d1-d84ff322988a', 'f6c62c6e-bb24-4d55-8239-efb847128ccb'];
        const orders = await bt.getOrders(ids);
        orders.forEach((order, i) => {
            expect(order.id).toBe(ids[i]);
            validateOrder(order);
        });
    });
});
