import React from 'react';
import LoginForm from '../components/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css'; 

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-form shadow p-4 rounded">
              <h2 className="text-center mb-4">Faça seu Login</h2>
              <LoginForm onLogin={onLogin} />
              <div className="text-center mt-3">
                <a href="/recover-password" className="text-primary">Esqueceu sua senha?</a>
                {/*Adicionaremos o componente posteriormente*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
