// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {},
    dev: {
        env: {
            // NODE_ENV: '"production"',
            // 通过 monit.json 会传入 NODE_ENV，生产模式用的是 pm2 start 方式所以没有值
            NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : '"production"',
        },
        // 上传文件会返回带此域名前缀的 url
        curDomain: '//undefined.ga',
        port: 10010,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
