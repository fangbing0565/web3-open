import { subApplicationSDKInit } from '@oec-open/ttspc-internal';
import { BrowserRouter } from '@jupiter/plugin-runtime/router';
import { renderRoutes } from '@oec-open/ttspc-kits';
import { routers } from './routes';
import React from 'react';

subApplicationSDKInit();

export default props => {
  return (
    <BrowserRouter>{renderRoutes(routers, 'account', props)}</BrowserRouter>
  );
};
