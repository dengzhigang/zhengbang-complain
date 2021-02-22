module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '../apps/com.awspaas.user.apps.it/' : '/',
    // publicPath: '../apps/com.awspaas.user.apps.it/',
    // publicPath: '/',
    lintOnSave: false,
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: 'localhost',
        port: 8081,
        https: false, //是否使用https协议
        hotOnly: false, //是否开启热更新
        proxy: {
            '/api': {
                target: 'http://10.89.3.131', //源地址
                changeOrigin: true, //改变源
                pathRewrite: {
                    '^/api': 'http://10.89.3.131', //路径重写
                },
            },
            '/bpmApi': {
                target: 'http://pal.zhengbang.com', //源地址
                // target: 'http://bpmuat.zberpnc.com', //源地址
                changeOrigin: true, //改变源
                pathRewrite: {
                    '^/bpmApi': 'http://pal.zhengbang.com', //路径重写
                    // '^/bpmApi': 'http://bpmuat.zberpnc.com', //路径重写
                },
            },
        },
    },
};
