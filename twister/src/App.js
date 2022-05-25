import logo from './logo.svg';
import './App.css';
import './styles/LoginForm.css'
import LoginInput from './components/login/LoginInput';
import LoginForm from './components/login/LoginForm';
import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <LoginForm/>
    </div>
  );
}

export default App;
