import {
  IGetInfoResponse,
  IAdminOrderResponse,
  IAdminManualCreditRequest,
  IAdminManualCreditResponse,
  IAdminLoginRequest,
  IAdminLoginResponse
} from '../types';
import Client from  './client'

/**
 * API client for admin endpoints
 */
class AdminAPI extends Client {
  async login(req: IAdminLoginRequest): Promise<IAdminLoginResponse> {
    const res: IAdminLoginResponse = await this.call('admin/v1/login', 'POST', req);

    if (res.key) {
      this.setSessionKey(res.key);
    }

    return res;
  }

  setSessionKey(key: string): void {
    this.setHeaders({authorization: key})
  }

  async getOrders(): Promise<IAdminOrderResponse[]> {
    const res: IAdminOrderResponse[] = await this.call('admin/v1/channel/orders', 'GET');

    res.forEach(o => {
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

  async manualCredit(req: IAdminManualCreditRequest): Promise<IAdminManualCreditResponse> {
    const res: IAdminManualCreditResponse = await this.call('v1/channel/manual_credit', 'POST', req);

    return res;
  }

  ///channel/manual_credit
  ///channel/refund
  ///channel/close
  ///btc/sweep
}

export default AdminAPI;
