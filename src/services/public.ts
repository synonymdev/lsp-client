import {
  IBuyChannelRequest,
  IBuyChannelResponse,
  IFinalizeChannelRequest,
  IFinalizeChannelResponse,
  IGetInfoResponse,
  IGetOrderResponse,
  IHeaders,
} from '../types';
import Client from  './client'

/**
 * API client for public end user facing endpoints
 */
class PublicAPI extends Client{
  private static getStateMessage(code: number): string {
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

  async getInfo(): Promise<IGetInfoResponse> {
    const res: IGetInfoResponse = await this.call('v1/node/info', 'GET');

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
    res.stateMessage = PublicAPI.getStateMessage(res.state);

    return res;
  }
}

export default PublicAPI;
