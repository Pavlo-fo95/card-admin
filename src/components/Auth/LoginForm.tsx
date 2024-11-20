import React, { useState } from 'react';
import './LoginForm.css';
import axios from 'axios';
// import { error } from 'console';

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

const hadleLogin = async (userName: string, Password: string): Promise<number> => {
  const loginCredentials = {
    username: userName,
    password: Password
 };

   const tokenAuth = axios.create({
       baseURL: 'https://webapplication220241104121304.azurewebsites.net/api/Authenticate/login',
       method: 'post',
       responseType: 'json',
   });

   try{
       const responce = await tokenAuth.post('',loginCredentials);
       //console.log(responce);
       //return responce.data;
       localStorage.setItem("token", responce.data);
       return 201;
   }
   catch(error){
       console.log('error ', error)
       return 403;
   }
}

const handleLogout = () => {
  localStorage.removeItem('token');
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [userName, setUsername] = useState('');
  const [Password, setPassword] = useState('');
 
  return (
    <div className="login-form">
      <h2>Avtorization</h2>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={(e) => {hadleLogin(userName, Password)}}>Avtorization</button>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default LoginForm;