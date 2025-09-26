import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import useAuthStore from './store/useAuthStore';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await authService.login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light p-4">
      <div className="card shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body d-flex flex-column align-items-center">
          <h1 className="text-center fw-bold mb-4">Inicio de sesión</h1>
          
          {error && (
            <div className="alert alert-danger w-100" role="alert">
              {error}
            </div>
          )}
          
          <form className="w-100" onSubmit={handleSubmit}>
            <div className="form-group py-2">
              <label className="py-2 px-1" htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Introduzca su email"
                required
              />
            </div>
            <div className="form-group py-2">
              <label className="py-2 px-1" htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Introduzca su contraseña"
                required
              />
            </div>
            <div className="d-flex justify-content-center py-2">
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-3">
            <p className="mb-0">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-decoration-none">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
  