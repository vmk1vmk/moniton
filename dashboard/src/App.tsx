import React from 'react';
import { DashboardGroup } from './dashboard/group';
import { DashboardGrid } from './dashboard/grid';

const App = () => {
  return (<DashboardGrid>
    <DashboardGroup>1234 ms</DashboardGroup>
    <DashboardGroup errorMessage="Connection lost">1234 ms</DashboardGroup>
  </DashboardGrid>);
}

export default App;
