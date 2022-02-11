import PublicAPI from  './services/public'
import AdminAPI from './services/admin';
import * as types from './types';

const bt = new PublicAPI();
const btAdmin = new AdminAPI();

export {btAdmin, types};
export default bt;
