
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>{t.notFound.title}</h1>
        <p className={styles.description}>{t.notFound.description}</p>
        <Link className={styles.link} to="/">{t.notFound.returnHome}</Link>
      </div>
    </div>
  );
};

export default NotFound;
