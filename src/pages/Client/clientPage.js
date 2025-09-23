import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../Componentes/Buttons/Button";
import Alert from "../../Componentes/Alert/alert";
import { authUtils, clienteApi } from "../../utils/clientApi";
import { logoutCliente, setCliente } from "./clientSlice";
import { comprasApi } from "../../utils/comprasApi";
import "./ClientPage.css";

export default function ClientPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clienteSlice = useSelector((state) => state.client);
  const cliente = clienteSlice.cliente;

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCliente = async () => {
      const token = authUtils.obterToken();
      if (!token || authUtils.tokenExpirado(token)) {
        navigate("/login-cliente");
        return;
      }

      try {
        const payload = authUtils.decodificarToken(token);
        const clienteData = await clienteApi.getCliente(payload.clientId, token);
        dispatch(setCliente({ ...clienteData, token }));

        // buscar compras
        const comprasData = await comprasApi.getCompras(token);
        setCompras(comprasData);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchCliente();
  }, [dispatch, navigate]);

  const handleLogout = () => {
    authUtils.removerToken();
    dispatch(logoutCliente());
    navigate("/login-cliente");
  };

  const handleCancelarCompra = async (id) => {
    try {
      await comprasApi.cancelCompra(id, cliente.token);
      setCompras((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "cancelada" } : c
        )
      );
    } catch (err) {
      alert("Erro ao cancelar compra");
    }
  };

  if (carregando) return <p>Carregando informações...</p>;
  if (!cliente) return <p>Cliente não encontrado.</p>;

  return (
    <div className="clientpage-container">
      {erro && <Alert type="error" message={erro} onClose={() => setErro("")} />}

      {/* Perfil */}
      <section className="profile-section">
        <h1 className="title">Olá, {cliente.nome}!</h1>
        <div className="profile-card">
          <p>
            <strong>Nome:</strong> {cliente.nome}
          </p>
          <p>
            <strong>Email:</strong> {cliente.email}
          </p>
          <div className="profile-actions">
            <Button
              title="Editar Perfil"
              variant="primary"
              onClick={() => navigate("/editar-cliente")}
            />
            <Button
              title="Sair"
              variant="danger"
              onClick={handleLogout}
            />
          </div>
        </div>
      </section>

      {/* Endereços */}
      <section className="enderecos-section">
        <h2>Meus Endereços</h2>
        <Button
          title="Gerenciar Endereços"
          variant="primary"
          onClick={() => navigate("/enderecos")}
        />
      </section>

      {/* Compras */}
      <section className="compras-section">
        <h2>Minhas Compras</h2>
        <Button
          title="Ver Compras"
          variant="primary"
          onClick={() => navigate("/compras")}
        />
      </section>
    </div>
  );
}