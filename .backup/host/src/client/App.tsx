import React from 'react';
import { registry } from './base';

export type State = unknown;

// В качестве параметров принимает __state__

export const App: React.FC = () => {
  const Widget1 = registry.get('widget1');
  // const Widget2 = registry.get('widget2');
  // const Widget3 = registry.get('widget3');

  return (
    <div data-name="app">
      <div>
        <Widget1 />
      </div>
      {/* <br />
      <div>
        <Widget1>
          <Widget2>
            <Widget3>
              <Widget1 />
            </Widget3>
          </Widget2>
        </Widget1>
      </div> */}
    </div>
  );
};

export default App;
