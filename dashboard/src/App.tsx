import React from 'react';
import { GithubStatusTile } from './github-status'
import { GithubContextProvider } from './github-status/context';

function App() {
  return (
    <div className="App">
      <GithubContextProvider>
        <GithubStatusTile />
      </GithubContextProvider>
    </div>
  );
}

export default App;
