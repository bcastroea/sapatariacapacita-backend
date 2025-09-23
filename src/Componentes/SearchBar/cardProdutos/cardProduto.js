import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../Buttons/Button";
import Stars from "../../Stars/Stars";
import "./cardProduto.css";

function ProdutoCard({ produto }) {
  const [hover, setHover] = useState(false);
  const imagemPrincipal = produto.imagens[0].url;
  const segundaImagem = produto.imagens[1].url || imagemPrincipal;

  const precos = produto.precos[0];

  return (
    <Link
      type="none"
      to={`/produtos/${produto.id}`}
      className="produto-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="produto-imagem-container">
        <img
          src={imagemPrincipal}
          alt={produto.nome}
          className={`produto-imagem ${hover ? "fade-out" : "fade-in"}`}
        />
        {segundaImagem && (
          <img
            src={segundaImagem}
            alt={produto.nome}
            className={`produto-imagem ${hover ? "fade-in" : "fade-out"}`}
          />
        )}
      </div>
      <div className="produto-informacoes">
        <h3 className="produto-nome">{produto.nome}</h3>
        <Stars rating={produto.stars} size="medium" />
        <p className="produto-preco-sem-desconto">
          R$ {precos.semDesconto.toFixed(2)}
        </p>
        <div className="produto-opcoes-pagamento">
          <p className="produto-parcelado">
            {precos.parcelamentos.parcelas}x de R${" "}
            {precos.parcelamentos.valor} sem juros
          </p>
          <p className="produto-a-vista">
            ou R$ {precos.aVista.toFixed(2)} à vista (5% de desconto) no Pix
          </p>
        </div>
      </div>
      <Button title="Comprar" variant="primary" />
    </Link>
  );
}

export default ProdutoCard;