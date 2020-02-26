import React from 'react';
import { ErrorIndicator } from '../grid-tile/error-indicator';
import { GithubContextConsumer } from './context';
import { GithubStatusBadge } from './badge';
import { LoadingIndicator } from '../grid-tile/loading-indicator';

type FunctionComponent = import('react').FunctionComponent;
type GithubStatusContext = import('.').GithubStatusContext;

export const GithubStatusTile: FunctionComponent = (): JSX.Element => {
    return (
        <GithubContextConsumer>
            {
                (value: GithubStatusContext) =>
                    value.isLoading
                        ? <LoadingIndicator />
                        : value.hasErrors
                            ? <ErrorIndicator error={value.error} />
                            : <GithubStatusBadge lastUpdated={value.lastUpdated} status={value.status} />

            }
        </GithubContextConsumer>
    );
}