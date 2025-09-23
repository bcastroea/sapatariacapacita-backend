import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Componentes/Buttons/Button";
import "./Auth.css";
import Alert from "../../Componentes/Alert/alert";

export default function CadastroCliente() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (erro) {
      const timer = setTimeout(() => setErro(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [erro]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem");
      setCarregando(false);
      return;
    }

    if (formData.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      setCarregando(false);
      return;
    }

    try {
      const response = await fetch(BASE_URL + "/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      // Redirecionar para login após cadastro bem-sucedido
      navigate("/login-cliente", {
        state: {
          message: "Conta criada com sucesso! Faça login para continuar.",
        },
      });
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Criar Conta</h2>
        {erro && (
          <Alert type="error" message={erro} onClose={() => setErro("")} />
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Seu email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              placeholder="Digite a senha novamente"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            title="Criar Conta"
            disabled={carregando}
          >
            {carregando ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        <p className="auth-link">
          Já tem uma conta? <Link to="/login-cliente">Faça login</Link>
        </p>
      </div>
    </div>
  );
}