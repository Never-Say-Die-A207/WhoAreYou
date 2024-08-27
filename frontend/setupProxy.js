import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = (app) => {
    app.use(
        '/chat',
        createProxyMiddleware({
            target: 'http://3.36.120.21:4040',
            ws: true,
        })
    );
};
