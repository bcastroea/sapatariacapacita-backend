import "./CheckoutCompras.css";
import ResumoCompraCheckout from "../../Componentes/ResumoCompra/ResumoCompraCheckout";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../Componentes/Cart/CartSlice";

import { comprasApi } from "../../utils/comprasApi";
import { authUtils } from "../../utils/clientApi";

export default function CheckoutCompras() {
  const formRef = useRef();
  const dispatch = useDispatch();
  const cliente = useSelector((state) => state.client.cliente);

  const [selectedEndereco, setSelectedEndereco] = useState(null);

  // Seleciona o primeiro endereço por padrão quando o cliente está logado
  useEffect(() => {
    if (cliente?.enderecos?.length) {
      setSelectedEndereco(cliente.enderecos[0]);
    }
  }, [cliente]);

  // Preenche os campos do form quando muda o endereço selecionado
  useEffect(() => {
    if (selectedEndereco && formRef.current) {
      formRef.current.address.value = selectedEndereco.rua || "";
      formRef.current.numero.value = selectedEndereco.numero || "";
      formRef.current.city.value = selectedEndereco.cidade || "";
      formRef.current.state.value = selectedEndereco.estado || "";
      formRef.current.zip.value = selectedEndereco.cep || "";
    }
  }, [selectedEndereco]);

  const handleConfirmOrder = async (cartItems, total) => {
    const token = authUtils.obterToken();
    if (!token) {
      alert("Você precisa estar logado para finalizar a compra!");
      return;
    }

    if (!selectedEndereco) {
      alert("Selecione um endereço válido.");
      return;
    }

    try {
      const itens = cartItems.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantity,
        precoUnit: item.price,
      }));

      const payment = formRef.current.payment.value.toUpperCase(); // 'credit' ou 'paypal'

      const endereco = {
        rua: formRef.current.address.value,
        numero: formRef.current.numero.value,
        cidade: formRef.current.city.value,
        estado: formRef.current.state.value,
        cep: formRef.current.zip.value,
      };

      console.log("Sending payload:", { itens, total, payment, endereco });

      await comprasApi.createCompra({ itens, total, payment, endereco }, token);

      alert("Pedido confirmado!");
      dispatch(clearCart());
    } catch (error) {
      console.error(error);
      alert("Erro ao confirmar compra.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <form className="checkout-form" ref={formRef}>
          <h2>Checkout</h2>

          {/* Dados Pessoais */}
          <section className="form-section">
            <h3>Informações Pessoais</h3>
            <div className="form-grid">
              <div className="form-grid-full">
                <label>Nome Completo</label>
                <input type="text" name="name" required defaultValue={cliente?.nome || ""} />
                <label>Email</label>
                <input type="email" name="email" required defaultValue={cliente?.email || ""} />
              </div>
            </div>
          </section>

          {/* Endereço */}
          <section className="form-section">
            <h3>Endereço de Entrega</h3>
            <div className="form-grid">
              {cliente?.enderecos?.length > 0 && (
                <div className="form-grid-full">
                  <label>Escolha um endereço</label>
                  <select
                    value={selectedEndereco?.id || ""}
                    onChange={(e) => {
                      const endereco = cliente.enderecos.find(
                        (end) => end.id === parseInt(e.target.value)
                      );
                      setSelectedEndereco(endereco);
                    }}
                  >
                    {cliente.enderecos.map((end) => (
                      <option key={end.id} value={end.id}>
                        {end.rua}, {end.numero} - {end.cidade}/{end.estado}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-grid-full">
                <label>Endereço</label>
                <input type="text" name="address" required />
              </div>
              <div>
                <label>Numero</label>
                <input type="text" name="numero" required />
              </div>
              <div>
                <label>Cidade</label>
                <input type="text" name="city" required />
              </div>
              <div>
                <label>Estado</label>
                <input type="text" name="state" required />
              </div>
              <div>
                <label>CEP</label>
                <input type="text" name="zip" required />
              </div>
            </div>
          </section>

          {/* Pagamento */}
          <section className="form-section">
            <h3>Método de Pagamento</h3>
            <div className="form-grid">
              <div className="form-grid-full">
                <label>
                  <input type="radio" name="payment" value="credit" defaultChecked />
                  Cartão de Crédito
                </label>
                <label>
                  <input type="radio" name="payment" value="paypal" />
                  PayPal
                </label>
              </div>
              <div className="form-grid-full">
                <label>Número do Cartão</label>
                <input type="text" name="cardNumber" />
              </div>
              <div>
                <label>Data de Validade</label>
                <input type="text" name="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <label>CVV</label>
                <input type="text" name="cvv" />
              </div>
            </div>
          </section>
        </form>

        <ResumoCompraCheckout
          onConfirm={(cartItems, total) => handleConfirmOrder(cartItems, total)}
        />
      </div>
    </div>
  );
}
