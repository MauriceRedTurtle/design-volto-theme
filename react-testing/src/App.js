import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom';


const user = {
  firstName: 'Maurizio',
  lastName: 'Querzoli',
  avatarUrl: 'https://via.placeholder.com/150'
};
const image = <img src={user.avatarUrl} alt="avatar"/>;
const element = <h1 className="test" >Hello, {formatName(user)}!</h1>;

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img src={user.avatarUrl} className="test" alt="avatar" />
      
      </header>
    </div> 
  );
}

function Tick() {
  const tickz = (
    <div>
      <h1>Hello, world!</h1>
      <Button>Test bottone con orario .now()  {new Date().toLocaleTimeString()}</Button>
    </div>
  );

    ReactDOM.render(tickz, document.getElementById('root'));
  
}

setInterval(Tick, 1000);

export default App;





//ReactDOM.render([element, image ],document.getElementById('root'));