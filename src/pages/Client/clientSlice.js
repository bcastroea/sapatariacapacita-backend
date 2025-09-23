import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('clienteToken');

const initialState = {
  cliente: null,
  token: token || null,
  isAuthenticated: !!token
};

const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setCliente: (state, action) => {
      state.cliente = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('clienteToken', action.payload.token); // 👈 salva o token
    },
    logoutCliente: (state) => {
      state.cliente = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('clienteToken');
    },
    updateCliente: (state, action) => {
      if (state.cliente) {
        state.cliente = { ...state.cliente, ...action.payload };
      }
    }
  }
});

export const { setCliente, logoutCliente, updateCliente } = clienteSlice.actions;
export default clienteSlice.reducer;