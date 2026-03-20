import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        {/* Additional routes can be added here */}
      </Switch>
    </Router>
  );
};

export default App;