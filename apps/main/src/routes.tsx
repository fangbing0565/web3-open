import React from 'react';
import { Route, Switch, useHistory } from '@jupiter/plugin-runtime/router';
import { ModuleInfo } from '@jupiter/plugin-garfish';

function loading({ pastDelay, error }: any) {
  if (error) {
    console.error(error);
    return <div>error: {error?.message}</div>;
  } else if (pastDelay) {
    return <div>loading</div>;
  } else {
    return null;
  }
}

export function Routes(props: {
  apps: Array<ModuleInfo>;
  handleRouteChange: (res: any) => void;
}) {
  const { apps, handleRouteChange } = props;
  const history = useHistory();
  return (
    <Switch>
      {apps
        .filter(mApp => Boolean(mApp.name))
        .map(mApp => {
          return (
            <Route
              key={mApp.name}
              path={mApp.name === 'home' ? '/' : `/${mApp.name}`}
              exact={mApp.name === 'home' ? true : false}
              render={props => {
                return (
                  mApp.Component && (
                    <mApp.Component
                      mainHistory={history}
                      handleRouteChange={handleRouteChange}
                      loadable={{ loading: loading, delay: 300 }}
                    />
                  )
                );
              }}
            />
          );
        })}
      <Route
        path="*"
        render={() => {
          document.title = '404';
          return <div>404</div>;
        }}
      />
    </Switch>
  );
}
