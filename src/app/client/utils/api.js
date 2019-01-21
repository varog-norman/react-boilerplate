import axios from 'axios';
import { API_DOMAIN } from 'constants';

function prepareGetParams(data) {
  if (!Object.keys(data).length) {
    return ''
  }

  return `?${Object.keys(data).map(k => k + '=' + encodeURIComponent(typeof data[k] === 'string' ? data[k] : JSON.stringify(data[k]))).join('&')}`
}

const api = {
  async call(url, data = {}, type = 'get', config = {}) {
    let apiUrl = API_DOMAIN + '/api/' + url;
    let axiosConf = {
      url: type === 'get' ? `${apiUrl}${prepareGetParams(data)}` : apiUrl,
      method: type,
      // withCredentials: true,
      ...config,
    };

    if (type !== 'get') {
      axiosConf.data = data;
    }

    return axios(axiosConf)
      .then(data => data.response || data)
      .catch(err => err.response || err)
  }
};

export default api;
export {
  prepareGetParams
}
