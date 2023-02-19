import styles from '../styles/header.module.css';

function Header(props: HeaderProps) {  
  return (
    <header className={styles.appHeader}>
      Header
    </header>
  );
}

export default Header;

export interface HeaderProps {}
