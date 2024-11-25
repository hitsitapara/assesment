const { createProxyMiddleware } = require('http-proxy-middleware');

// Exporting a function that sets up the proxy middleware
module.exports = function (app) {
  // Configure the app to use the proxy middleware for requests starting with /api
  app.use(
    '/api',
    createProxyMiddleware({
      // Set the target server for the proxy
      target: 'http://stageapi.monkcommerce.app',
      // Allow changing the origin of the host header to the target URL
      changeOrigin: true,
      // Rewrite the URL path - remove /api prefix before forwarding to target
      pathRewrite: { '^/api': '' },
    }),
  );
};
