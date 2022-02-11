import { IGetInfoResponse } from '../types';
import Client from  './client'

/**
 * API client for admin endpoints
 */
class AdminAPI extends Client{
  async getInfo(): Promise<IGetInfoResponse> {
    const res: IGetInfoResponse = await this.call('node/info', 'GET');

    return res;
  }
}

export default AdminAPI;
