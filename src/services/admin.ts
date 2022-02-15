import {
  IGetInfoResponse,
  IAdminOrder,
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
  async login(req: IAdminLoginRequest): Promise<void> {
    const res: IAdminLoginResponse = await this.call('admin/v1/login', 'POST', req);
    
    if (res.key) {
      this.setSessionKey(res.key);
    }
  }

  setSessionKey(key: string): void {
    this.setHeaders({authorization: key})
  }

  async getOrders(): Promise<IAdminOrder[]> {
    const res: IAdminOrder[] = await this.call('admin/v1/channel/orders', 'GET');

    res.forEach(o => {
      o.amount_received = Number(o.amount_received);
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
