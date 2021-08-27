import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import EditPool from './pages/EditPool';
import Vote from './pages/Vote'
import Home from './pages';
import { Guid } from 'js-guid'


if (!localStorage.getItem('guestId')) {
  localStorage.setItem('guestId', Guid.newGuid().toString())
}

function App() {
  return (
    <Router>
      <div className="main-container">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/new" component={EditPool} />
          <Route path="/edit/:id" component={EditPool} />
          <Route path="/vote/:id" component={Vote} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
