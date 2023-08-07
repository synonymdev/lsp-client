import { ICreateOrderRequest, IGetInfoResponse, IOpenChannelRequest, IOpenChannelResponse, IOrder } from '../types';
import Client from './client';

/**
 * API client for public end user facing endpoints
 */
class PublicAPI extends Client {
  async getInfo(): Promise<IGetInfoResponse> {
    return await this.call('v2/info', 'GET');
  }

  async createOrder(req: ICreateOrderRequest): Promise<IOrder> {
    return await this.call('v2/channels', 'POST', req);
  }

  async getOrder(orderId: string): Promise<IOrder> {
    return await this.call(`v2/channels/${orderId}`, 'GET');
  }

  async getOrders(orderIds: string[]): Promise<IOrder[]> {
    const url = orderIds.reduce((acc, id, index) => {
      return acc + (index === 0 ? '?' : '&') + 'ids=' + id;
    }, 'v2/channels');
    return await this.call(url, 'GET');
  }

  async openChannel(req: IOpenChannelRequest): Promise<IOpenChannelResponse> {
    return await this.call(`v2/channels/${req.orderId}/open`, 'POST', req);
  }
}

export default PublicAPI;
