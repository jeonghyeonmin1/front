const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // API 요청을 백엔드 서버로 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    })
  );

  // 카카오 로그인 요청도 프록시
  app.use(
    '/kakao',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    })
  );
};
