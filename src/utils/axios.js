/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios';
import { Toast } from 'vant';

axios.defaults.timeout = 20000;
//返回其他状态吗
axios.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;

//表单序列化
const serialize = data => {
    let list = [];
    Object.keys(data).forEach(ele => {
        list.push(`${ele}=${data[ele]}`);
    });
    return list.join('&');
};

//HTTPrequest拦截
axios.interceptors.request.use(
    config => {
        const meta = config.meta || {};
        // config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
        let token = sessionStorage.getItem('token');
        if (process.env.NODE_ENV !== 'development') {
            config.url = location.origin + '/' + config.url;
        }
        if (token) {
            config.headers['Blade-Auth'] = 'bearer ' + token;
        }
        if (config.method === 'post' && meta.isSerialize === true) {
            config.data = serialize(config.data);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//HTTPresponse拦截
axios.interceptors.response.use(
    res => {
        const status = res.data.code || 200;
        const message = res.data.msg || res.data.message || '未知错误';
       
        if (status != 200) {
            if (status === 401) {
                Toast.fail('您的登陆已过期, 是否重新登陆？');
            } else if (status === 404) {
                Toast.fail(message);
            } else {
                Toast.fail(message);
            }
            return Promise.reject(message);
        }
        return res;
    },
    error => {
        return Promise.reject(new Error(error || ''));
    }
);

export default axios;
