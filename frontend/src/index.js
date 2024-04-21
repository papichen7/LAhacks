import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';

import './index.css';
import App from './App';
import QuizPage from './QuizPage'
import DebatePage from './DebatePage'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />}/>
        <Route exact path="/quiz" element={<QuizPage />}/>
        <Route exact path="/debate" element={<DebatePage />}/>
      </Routes>
    </Router>
  </React.StrictMode>
);

