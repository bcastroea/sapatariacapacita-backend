import styles from "./Header.module.css";
import React, { useEffect, useState } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Header/Logo/logo-sapataria.png";
import CartIcon from "../Cart/CartIcon";
import SearchBar from "../SearchBar/SearchBar";
import { authUtils } from "../../utils/clientApi";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [ setSearchResults] = useState([]);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Verifica token do cliente
    const token = authUtils.obterToken();
    setIsLogged(token && !authUtils.tokenExpirado(token));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");

    const handleResize = () => {
      if (mediaQuery.matches) setMenuOpen(false);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={Logo} alt="Sapataria Capacita Logo" className={styles.logoImage} />
        </Link>

        <nav className={styles.navDesktop}>
          <Link to="/">Início</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/produtos">Produtos</Link>
        </nav>

        <div className={styles.actions}>
          <Search
            className={`${styles.icon} ${styles.desktopOnly}`}
            onClick={() => setShowSearch(!showSearch)}
            style={{ cursor: "pointer" }}
          />
          {/* Ícone do usuário */}
          <Link to={isLogged ? "/client-page" : "/login-cliente"}>
            <User className={`${styles.icon} ${styles.desktopOnly}`} />
          </Link>

          <Link to="/carrinho" onClick={() => setMenuOpen(false)}>
            <CartIcon isMobile={false} />
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.menuToggle}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`${styles.navMobile} ${menuOpen ? styles.open : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
        <Link to="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link>
        <Link to="/produtos" onClick={() => setMenuOpen(false)}>Produtos</Link>
        <div className={styles.mobileIcons}>
          <Search className={styles.icon} />
          <Link to={isLogged ? "/client-page" : "/login-cliente"}>
            <User className={styles.icon} />
          </Link>
          <Link to="/carrinho" onClick={() => setMenuOpen(false)}>
            <CartIcon className={styles.icon} />
          </Link>
        </div>
      </div>

      {/* Barra de pesquisa */}
      {showSearch && (
        <SearchBar
          onClose={() => setShowSearch(false)}
          onResults={(res) => setSearchResults(res)}
        />
      )}
    </header>
  );
}
