import React, { FunctionComponent } from 'react';

export interface DashboardGroupProps {
    errorMessage?: string;
};

export const DashboardGroup: FunctionComponent<DashboardGroupProps> = ({
    children,
    errorMessage,
}): JSX.Element => {
    const className: string = [
        'dashboard-group',
        errorMessage !== undefined ? `dashboard-group__error-message` : ''
    ].join(' ');

    return (
        <div className={className}>
            {errorMessage &&
                errorMessage
            }
            {!errorMessage && children}
        </div>
    );
};