import {
  IAdminOrderResponse,
  IAdminManualCreditRequest,
  IAdminActionResponse,
  IAdminLoginRequest,
  IAdminLoginResponse,
  IAdminRefundRequest,
  IAdminRefundResponse,
  IAdminChannelCloseRequest,
} from '../types';
import Client from './client';

/**
 * API client for admin endpoints
 */
class AdminAPI extends Client {
  private sessionKey: string | undefined;

  async login(req: IAdminLoginRequest): Promise<IAdminLoginResponse> {
    const res: IAdminLoginResponse = await this.call('admin/v1/login', 'POST', req);

    if (res.key) {
      this.setSessionKey(res.key);
    }

    return res;
  }

  setSessionKey(key: string): void {
    this.sessionKey = key;
    this.setHeaders({ authorization: key });
  }

  getSessionKey(): string | undefined {
    return this.sessionKey;
  }

  async getOrders(): Promise<IAdminOrderResponse[]> {
    const res: IAdminOrderResponse[] = await this.call('admin/v1/channel/orders', 'GET');

    res.forEach((o) => {
      o.amount_received = Number(o.amount_received);
      o.stateMessage = Client.getStateMessage(o.state);
      o.amount_received = o.amount_received ? Number(o.amount_received) : 0;

      o.onchain_payments.forEach((payment, index) => {
        o.onchain_payments[index] = {
          ...payment,
          amount_base: Number(payment.amount_base),
          fee_base: Number(payment.fee_base),
        };
      });

      o.total_amount = Number(o.total_amount);
    });

    return res;
  }

  async manualCredit(req: IAdminManualCreditRequest): Promise<IAdminActionResponse> {
    const res: IAdminActionResponse = await this.call('admin/v1/channel/manual_credit', 'POST', req);
    return res;
  }

  async refund(req: IAdminRefundRequest): Promise<IAdminRefundResponse> {
    const res: IAdminRefundResponse = await this.call('admin/v1/channel/refund', 'POST', req);
    return res;
  }

  async close(req: IAdminChannelCloseRequest): Promise<IAdminActionResponse> {
    const res: IAdminActionResponse = await this.call('admin/v1/channel/close', 'POST', req);
    return res;
  }

  // /btc/sweep
}

export default AdminAPI;
