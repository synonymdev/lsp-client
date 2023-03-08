import PublicAPI from './services/public';
import AdminAPI from './services/admin';

const bt = new PublicAPI();
const btAdmin = new AdminAPI();

export * from './types';
export { btAdmin };
export default bt;
