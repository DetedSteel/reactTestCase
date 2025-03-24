import { FC, useEffect, useState } from "react";
import styles from "./header.module.scss";
import { AddForm } from "../AddForm/AddForm";
import { addToPortfolio, PortfolioItem } from "../../store/portfolioSlice";
import { useAppDispatch } from "../../store/hooks";

export const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const storedItems = localStorage.getItem("portfolio");
    if (storedItems) {
      const items = JSON.parse(storedItems) as PortfolioItem[];
      if (items.length > 0) {
        items.forEach((e: PortfolioItem) => {
          dispatch(addToPortfolio(e));
        });
      }
    }
  }, [dispatch]);

  return (
    <header className={styles.header}>
      <h1 className="header__title">Portfolio Overview</h1>
      <button
        className={styles.btn}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        добавить
      </button>
      {isOpen && <AddForm onClose={close} />}
    </header>
  );
};
