import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCliente } from "./clientSlice";
import Button from "../../Componentes/Buttons/Button";
import "./Auth.css";
import { authUtils, clienteApi } from "../../utils/clientApi";

export default function LoginCliente() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Se já tiver token válido, vai direto pra ClientPage
  useEffect(() => {
    const token = authUtils.obterToken();
    if (token && !authUtils.tokenExpirado(token)) {
      navigate("/client-page");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const response = await fetch(BASE_URL + "/clients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao fazer login");

      // Salvar token no localStorage
      authUtils.salvarToken(data.token);

      // Decodificar token e buscar dados completos do cliente
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const clienteData = await clienteApi.getCliente(
        payload.clientId,
        data.token
      );

      // Atualizar Redux
      dispatch(setCliente({ ...clienteData, token: data.token }));

      // Redirecionar pra ClientPage
      navigate("/client-page");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login do Cliente</h2>

        {erro && <div className="auth-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Seu email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Sua senha"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={carregando}
            title={carregando ? "Entrando..." : "Entrar"}
          />
        </form>

        <p className="auth-link">
          Não tem uma conta? <Link to="/cadastro-cliente">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}