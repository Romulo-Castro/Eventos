import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Indica que o login está em andamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa mensagens de erro anteriores
    setLoading(true); // Indica que o login está sendo processado

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Armazena o token no localStorage
        onLogin(true); // Atualiza o estado de login no app
      } else {
        const contentType = response.headers.get('Content-Type');
        const errorData = contentType && contentType.includes('application/json')
          ? await response.json()
          : { message: 'Erro desconhecido ao fazer login.' };

        // Verifica status e fornece mensagens de erro específicas
        if (response.status === 401) {
          setError('Usuário ou senha incorretos. Por favor, tente novamente.');
        } else if (response.status === 400) {
          setError(errorData.message || 'Dados inválidos. Verifique os campos e tente novamente.');
        } else {
          setError(errorData.message || 'Erro ao fazer login. Tente novamente mais tarde.');
        }
      }
    } catch (err) {
      setError('Erro de conexão com o servidor. Por favor, tente novamente.');
    } finally {
      setLoading(false); // Conclui o processo de login
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;
