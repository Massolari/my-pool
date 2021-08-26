import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import EditPool from './pages/edit_pool';
import Home from './pages';
import { Guid } from 'js-guid'


if (!localStorage.getItem('guestId')) {
  localStorage.setItem('guestId', Guid.newGuid().toString())
}
console.log(Guid.newGuid().toString());

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/new" component={EditPool} />
        <Route path="/edit/:id" component={EditPool} />
      </Switch>
    </Router>
  );
}

export default App;
