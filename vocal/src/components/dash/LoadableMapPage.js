import React from 'react';
import Loadable from 'react-loadable';
import { SyncLoader } from 'react-spinners';

export const LoadableMapPage = Loadable({
  loading: () => <SyncLoader loading={true}>Loading...</SyncLoader>,
  loader: () => import(/* webpackChunkName: "mappage" */ './MapPage'),
})