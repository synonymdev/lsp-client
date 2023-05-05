import {
  IBuyChannelRequest,
  IBuyChannelResponse,
  IExchangeRatesResponse,
  IFinalizeChannelRequest,
  IFinalizeChannelResponse,
  IGetInfoResponse,
  IGetOrderResponse,
} from '../types';
import Client from './client';

/**
 * API client for public end user facing endpoints
 */
class PublicAPI extends Client {
  async getInfo(): Promise<IGetInfoResponse> {
    const res: IGetInfoResponse = await this.call('v1/node/info', 'GET');

    res.services.forEach((service, index) => {
      res.services[index].max_chan_receiving = Number(service.max_chan_receiving) || 0;
      res.services[index].max_chan_receiving_usd = Number(service.max_chan_receiving_usd) || 0;
      res.services[index].max_chan_spending = Number(service.max_chan_spending) || 0;
      res.services[index].max_chan_spending_usd = Number(service.max_chan_spending_usd) || 0;
    });

    return res;
  }

  async buyChannel(req: IBuyChannelRequest): Promise<IBuyChannelResponse> {
    const res: IBuyChannelResponse = await this.call('v1/channel/buy', 'POST', req);

    res.price = Number(res.price);
    res.total_amount = Number(res.total_amount);

    return res;
  }

  async finalizeChannel(req: IFinalizeChannelRequest): Promise<IFinalizeChannelResponse> {
    const res: IFinalizeChannelResponse = await this.call('v1/channel/manual_finalise', 'POST', req);

    return res;
  }

  async getOrders(orderIds: Array<string>): Promise<Array<IGetOrderResponse>> {
    const res: Array<IGetOrderResponse> = await this.call(`v1/channel/order?order_id=${orderIds.join()}`, 'GET');
    return res.map((res: IGetOrderResponse) => {
      res.amount_received = res.amount_received ? Number(res.amount_received) : 0;
      res.onchain_payments.forEach((payment, index) => {
        res.onchain_payments[index] = {
          ...payment,
          amount_base: Number(payment.amount_base),
          fee_base: Number(payment.fee_base),
        };
      });
      res.total_amount = Number(res.total_amount);
      res.stateMessage = Client.getStateMessage(res.state);
      return res;
    });
  }

  async getOrder(orderId: string): Promise<IGetOrderResponse> {
    const res: IGetOrderResponse = await this.call(`v1/channel/order?order_id=${orderId}`, 'GET');

    res.amount_received = res.amount_received ? Number(res.amount_received) : 0;

    res.onchain_payments.forEach((payment, index) => {
      res.onchain_payments[index] = {
        ...payment,
        amount_base: Number(payment.amount_base),
        fee_base: Number(payment.fee_base),
      };
    });

    res.total_amount = Number(res.total_amount);
    res.stateMessage = Client.getStateMessage(res.state);

    return res;
  }

  async getRates(): Promise<IExchangeRatesResponse> {
    const rates: IExchangeRatesResponse = {};

    const res: string[][] = await this.call('v1/rate', 'GET');
    res.forEach((a) => {
      rates[a[0].replace('tBTC', '')] = Math.round(Number(a[1]) * 100) / 100;
    });

    return rates;
  }
}

export default PublicAPI;
