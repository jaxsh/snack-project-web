/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
const OAUTH_TARGET = process.env.OAUTH_TARGET || 'http://localhost:8080';

export default {
  dev: {
    '/api/': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/auth-api/login': {
      target: OAUTH_TARGET,
      changeOrigin: true,
      pathRewrite: { '^/auth-api/login': '/login' },
    },
    '/auth-api/logout': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: { '^/auth-api/logout': '/logout' },
    },
    '/oauth2/authorization/': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/oauth2/': {
      target: OAUTH_TARGET,
      changeOrigin: true,
    },
    '/upload/': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://pro-api.ant-design-demo.workers.dev/api/**
    '/api/': {
      target: 'https://pro-api.ant-design-demo.workers.dev',
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
    },
  },
};
