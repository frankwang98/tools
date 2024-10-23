import axios from "axios";
import { ElMessage } from "element-plus";
//创建axios实例
let request = axios.create({
    baseURL: import.meta.env.VITE_IS_MOCK == 'true' ? import.meta.env.VITE_APP_BASE_API :  import.meta.env.VITE_SERVE + import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
});  

//请求拦截器
request.interceptors.request.use(config => {
    return config;
});
//响应拦截器
request.interceptors.response.use((response) => {
    if (response.data.code == 401) {
        //登录过期
        localStorage.setItem('TOKEN', '')
        location.reload()
    }
    return response.data;
}, (error) => {
    if (error.code == 'ERR_CANCELED') {
        //拒绝响应
        return Promise.race([]);
    }
    //处理网络错误
    let msg = '';
    let status = error.response.status;
    switch (status) {
        case 401:
            //msg = "token过期";
            msg = "登录过期";
            break;
        case 403:
            msg = '无权访问';
            break;
        case 404:
            msg = "请求地址错误";
            break;
        case 500:
            msg = "服务器出现问题";
            break;
        default:
            msg = "无网络";

    }
    ElMessage({
        type: 'error',
        message: msg
    })
    return Promise.reject(error);
});
export default request;