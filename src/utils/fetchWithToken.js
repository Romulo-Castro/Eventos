const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado. Usuário não está autenticado.');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Tratamento de 401 - Token expirado ou inválido
    if (response.status === 401) {
      const contentType = response.headers.get('Content-Type');
      const errorResponse = contentType && contentType.includes('application/json')
        ? await response.json()
        : {};

      if (errorResponse.message && errorResponse.message.includes('expired')) {
        localStorage.removeItem('token'); // Remove o token se expirado
        window.location.href = '/login'; // Redireciona para login
        throw new Error('Sessão expirada. Faça login novamente.');
      } else {
        throw new Error('Credenciais inválidas. Verifique seus dados.');
      }
    }

    // Tratamento de 403 - Acesso negado
    if (response.status === 403) {
      throw new Error('Você não tem permissão para acessar este recurso.');
    }

    // Tratamento de erros genéricos
    if (!response.ok) {
      const contentType = response.headers.get('Content-Type');
      const errorData = contentType && contentType.includes('application/json')
        ? await response.json()
        : {};
      throw new Error(errorData.message || 'Erro desconhecido.');
    }

    // Tratamento de respostas sem corpo
    const contentType = response.headers.get('Content-Type');
    return contentType && contentType.includes('application/json')
      ? await response.json()
      : null;
  } catch (error) {
    console.error('Erro no fetchWithToken:', error);
    throw error; // Propaga o erro para ser tratado nas chamadas
  }
};

export default fetchWithToken;
