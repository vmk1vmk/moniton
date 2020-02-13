import React, { FunctionComponent } from 'react';

export const DashboardGrid: FunctionComponent = ({ children }): JSX.Element => {


    return (
        <div className='dashboard-grid'>
            { children }
        </div>
    )
}