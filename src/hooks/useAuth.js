import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCliente, logoutCliente } from "../store/clienteSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { cliente, isAuthenticated } = useSelector((state) => state.cliente);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Verificar se há token salvo no localStorage ao carregar a aplicação
    const token = localStorage.getItem("clienteToken");
    if (token) {
      try {
        // Decodificar token para verificar se ainda é válido
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          // Token válido, buscar dados do cliente
          fetchClienteData(token);
        } else {
          // Token expirado
          dispatch(logoutCliente());
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        dispatch(logoutCliente());
      }
    }
  }, [dispatch]);

  const fetchClienteData = async (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const response = await fetch(BASE_URL + `/clients/${payload.clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const clienteData = await response.json();
        dispatch(setCliente({ ...clienteData, token }));
      } else {
        dispatch(logoutCliente());
      }
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
      dispatch(logoutCliente());
    }
  };

  return { cliente, isAuthenticated };
};
