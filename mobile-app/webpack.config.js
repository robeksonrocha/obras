const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Adiciona configuração do proxy
  config.devServer = {
    ...config.devServer,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api'
        },
        onProxyRes: function (proxyRes) {
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        },
      },
    },
  };

  return config;
}; 