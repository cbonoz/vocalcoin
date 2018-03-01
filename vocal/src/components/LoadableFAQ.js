import React from 'react';
import Loadable from 'react-loadable';
import { SyncLoader } from 'react-spinners';

export const LoadableFAQ = Loadable({
  loading: () => <SyncLoader loading={true}>Loading...</SyncLoader>,
  loader: () => import(/* webpackChunkName: "faq" */ './FAQ'),
})