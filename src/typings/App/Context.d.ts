import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { AnyAction, Store } from 'redux';

export type SSRContext = GetServerSidePropsContext & {
  store: Store<any, AnyAction>;
};

export type SSGContext = GetStaticPropsContext & {
  store: Store<any, AnyAction>;
};
