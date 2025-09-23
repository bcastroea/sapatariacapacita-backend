import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch("/data/sapatos.json");
        const data = await res.json();
        setProdutos(data);
      } catch (e) {
        console.error("Erro ao buscar sapatos:", e);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    const filtrados = produtos.filter((p) =>
      p.nome.toLowerCase().includes(query.toLowerCase())
    );
    setResultados(filtrados);
  }, [query, produtos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/produtos?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleResultadoClick = (id) => {
    navigate(`/produtos/${id}`);
    onClose();
  };

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
          autoFocus
        />
        <button type="submit" className={styles.searchBtn}>
          Buscar
        </button>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          ✖
        </button>
      </form>

      {query && resultados.length > 0 && (
        <div className={styles.resultadosContainer}>
          {resultados.slice(0, 5).map((produto) => (
            <div
              key={produto.id}
              className={styles.cardResultado}
              onClick={() => handleResultadoClick(produto.id)}
            >
              <img
                src={produto.imagens[0]}
                alt={produto.nome}
                className={styles.cardImagem}
              />
              <div className={styles.cardInfo}>
                <p className={styles.cardNome}>{produto.nome}</p>
                <p className={styles.cardPreco}>
                  R$ {produto.precos[0].aVista.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {query && resultados.length === 0 && (
        <div className={styles.semResultado}>Nenhum produto encontrado</div>
      )}
    </div>
  );
}