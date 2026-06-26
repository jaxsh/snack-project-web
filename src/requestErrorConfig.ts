import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { getIntl, getLocale } from '@umijs/max';
import { staticMessage } from '@/utils/antdStaticApi';

export const errorConfig: RequestConfig = {
  errorConfig: {
    errorThrower: (res) => {
      const { success, code, msg, data } = res as unknown as API.ApiResponse;
      if (success === false) {
        const error: any = new Error(msg || 'Business Error');
        error.name = 'BizError';
        error.info = { errorCode: code, errorMessage: msg, data };
        throw error;
      }
    },
    errorHandler: (error: any, opts: any) => {
      const isSkip = opts?.skipErrorHandler || error?.config?.skipErrorHandler;
      const isNetworkError = !error.response;
      const canSkip = isSkip && !isNetworkError;
      if (canSkip) {
        throw error;
      }

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        void staticMessage().error(
          getIntl().formatMessage({
            id: 'app.request.timeout',
          }),
        );
      } else if (error.name === 'BizError') {
        const errorInfo = error.info as
          | (API.ApiResponse & { errorCode?: string; errorMessage?: string })
          | undefined;
        if (errorInfo) {
          const { errorMessage, data } = errorInfo;
          if (data?.loginUrl) {
            window.location.href = data.loginUrl;
            return;
          }
          const fieldErrors = Array.isArray(data)
            ? (data as { field?: string; message?: string }[]).filter(
                (e) => e.message,
              )
            : [];
          if (fieldErrors.length > 0) {
            fieldErrors.forEach(
              (e) => void staticMessage().error(e.message ?? ''),
            );
          } else {
            void staticMessage().error(errorMessage || 'Business Error');
          }
        }
      } else if (error.response) {
        if (error.response.status === 401) {
          const loginUrl = error.response.data?.data?.loginUrl;
          if (loginUrl) {
            void staticMessage().warning(
              error.response.data?.msg ||
                getIntl().formatMessage({ id: 'app.request.session-expired' }),
            );
            setTimeout(() => {
              window.location.href = loginUrl;
            }, 1500);
            return;
          }
        }
        if (error.response.status === 400) {
          const body = error.response.data;
          const fieldErrors = Array.isArray(body?.data)
            ? (body.data as { message?: string }[]).filter((e) => e.message)
            : [];
          if (fieldErrors.length > 0) {
            fieldErrors.forEach(
              (e) => void staticMessage().error(e.message ?? ''),
            );
          } else {
            void staticMessage().error(body?.msg || 'Request failed');
          }
        } else if (error.response.status >= 500) {
          const body = error.response.data as API.ApiResponse | undefined;
          void staticMessage().error(
            body?.msg ||
              getIntl().formatMessage({
                id: 'app.request.offline',
              }),
          );
        } else {
          const body = error.response.data as API.ApiResponse | undefined;
          void staticMessage().error(
            body?.msg || `Response status:${error.response.status}`,
          );
        }
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        void staticMessage().error(
          getIntl().formatMessage({
            id: 'app.request.offline',
          }),
        );
      } else if (error.request) {
        void staticMessage().error('None response! Please retry.');
      } else {
        void staticMessage().error('Request error, please retry.');
      }

      if (canSkip) {
        throw error;
      }
    },
  },

  requestInterceptors: [
    (config: RequestOptions) => {
      const locale = getLocale();
      const params = { ...config.params };
      if (locale) {
        params.locale = locale;
      }

      const headers = { ...config.headers };
      if (locale) {
        headers['Accept-Language'] = locale;
      }
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        headers['X-Timezone'] = timezone;
      }

      return { ...config, params, headers };
    },
  ],

  responseInterceptors: [],
};
