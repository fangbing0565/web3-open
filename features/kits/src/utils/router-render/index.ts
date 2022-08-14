import { matchPath, Route, Switch } from '@jupiter/plugin-runtime/router';
import React from 'react';

function _extends(..._arguments: any): any {
  return function (this: any) {
    const __extends =
      Object.assign ||
      function (target: any, ...__arguments: any) {
        for (let i = 1; i < __arguments.length; i++) {
          const source = __arguments[i];
          for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };

    return __extends.apply(this, _arguments);
  };
}

function handleRoute(routes: any, appName: string, appProps?: any) {
  const newRoutes: any = [];
  routes &&
    routes.map((route: any) => {
      if (
        route.hasOwnProperty('routes') &&
        !route.routes.find((item: any) => item.path === route.path)
      ) {
        const res = handleRoute(route.routes, appName);
        res.unshift({
          path: route.path,
          name: route.name,
          exact: true,
          render: route.render ? route.render : route.component,
        });
        res.push({
          name: '404',
          path: `/${route.path.replaceAll('/', '')}/*`,
          render: () => {
            return 404;
          },
        });
        route.routes = res;
        route.render = () =>
          renderRoutes(route.routes, appName, appProps, null, null, 2);
      }
      newRoutes.push(route);
    });
  return newRoutes;
}

export function renderRoutes(
  routes: any,
  appName: string,
  appProps?: any,
  extraProps?: any,
  switchProps?: any,
  mode = 1,
) {
  if (extraProps === void 0) {
    extraProps = {};
  }

  if (switchProps === void 0) {
    switchProps = {};
  }

  if (mode === 1) {
    routes = handleRoute(routes, appName, appProps);
  }

  return routes
    ? React.createElement(
        Switch,
        switchProps,
        routes.map(function (route: any, i: any) {
          return React.createElement(Route, {
            key: route.key || i,
            path: route.path,
            exact: route.exact,
            strict: route.strict,
            render: function render(props) {
              document.title = route.name ? route.name : 'Partner Center';
              if (mode === 2 && appProps) {
                const { handleRouteChange } = appProps;
                handleRouteChange({
                  name: route.name,
                  appName: appName,
                  path: route.path,
                  navbar: route.navbar ?? true,
                  sidebar: route.sidebar ?? true,
                });
              }
              // IProps && IProps.setCurrentRoutes(routes);
              return route.render
                ? route.render(
                    _extends({}, props, {}, extraProps, {
                      route: route,
                    }),
                  )
                : React.createElement(
                    route.component,
                    _extends({}, props, extraProps, {
                      route: route,
                    }),
                  );
            },
          });
        }),
      )
    : null;
}

function computeRootMatch(pathname: any) {
  return {
    path: '/',
    url: '/',
    params: {},
    isExact: pathname === '/',
  };
}

export function matchRoutes(routes: any, pathname: any, branch: any) {
  if (branch === void 0) {
    branch = [];
  }

  routes.some(function (route: any) {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match // use parent match
      : computeRootMatch(pathname); // use default "root" match

    if (match && !branch.find((item: any) => item.route.path === route.path)) {
      branch.push({
        route: route,
        match: match,
      });

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });
  return branch;
}

const handlerParams = function (
  path: string,
  query?: {
    [key: string]: string;
  },
) {
  if (!path || typeof path !== 'string') return '';
  let url = path;
  if (url[0] !== '/') url = '/' + url;
  if (Object.prototype.toString.call(query) === '[object Object]' && query) {
    const qs = Object.keys(query)
      .map(key => `${key}=${query[key]}`)
      .join('&');
    url += qs ? '?' + qs : '';
  }
  if (url[0] !== '/') url = '/' + url;
  return url;
};

export function redirectApp({
  path,
  query,
}: {
  path: string;
  query?: {
    [key: string]: string;
  };
}) {
  history.pushState(null, '', handlerParams(path, query));
  var evt = new PopStateEvent('popstate', {});
  window.dispatchEvent(evt);
}
