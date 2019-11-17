import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import HttpClient from './utils/HttpClient';

function useCalendars() {
  const [calendars, setCalendar] = useState([]);

  useEffect(() => {
    HttpClient
      .get('/rest/calendars')
      .then((calendars) => {
        setCalendar(calendars);
      });
  }, []);

  return [calendars, setCalendar];
}

function App() {
  const [calendars] = useCalendars();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <h3>Speakers agenda</h3>

        <table>
          <tbody>
          {
            calendars.map((calendar) => {
              return (
                <tr key={calendar.id}>
                  <td>{calendar.id}</td>
                  <td>{calendar.name}</td>
                </tr>
              );
            })
          }
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
