import { FC, useState } from "react";
import styles from "./addform.module.scss";
import { useGetTiker24hrQuery } from "../../api/ticker";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToPortfolio, PortfolioItem } from "../../store/portfolioSlice";

export const AddForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data } = useGetTiker24hrQuery(null);

  const [search, setSearch] = useState("");
  const [currentCurrency, setCurrentCurrency] = useState<
    { name: string; price: string; change: string } | undefined
  >(undefined);
  const [count, setCount] = useState<number>(0);

  const dispatch = useAppDispatch();
  const totalValue = useAppSelector((state) => state.portfolio.totalPortfolioValue);

  return (
    <div className={styles.container} onClick={onClose}>
      <form
        className={styles.form}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();

          const newItem = {
            symbol: currentCurrency!.name + "USDT",
            name: currentCurrency!.name,
            count,
            currentPrice: parseFloat(currentCurrency!.price),
            totalPrice: count * parseFloat(currentCurrency!.price),
            change24hrPercent: parseFloat(currentCurrency!.change),
            portfolioPercentPart:
              totalValue === 0
                ? "100"
                : (((count * parseFloat(currentCurrency!.price)) / totalValue) * 100).toFixed(2),
          };

          const storedItems = localStorage.getItem("portfolio");
          if (storedItems) {
            const items = JSON.parse(storedItems) as PortfolioItem[];
            if (!items.find((e) => e.symbol === newItem.symbol)) {
              items.push(newItem);
              localStorage.setItem("portfolio", JSON.stringify(items));
            } else {
              items.forEach((e: PortfolioItem) => {
                if (e.symbol === newItem.symbol) {
                  e.count += newItem.count;
                  e.totalPrice += newItem.totalPrice;
                }
              });
              localStorage.setItem("portfolio", JSON.stringify(items));
            }
          } else {
            localStorage.setItem("portfolio", JSON.stringify([newItem]));
          }

          dispatch(addToPortfolio(newItem));
          onClose();
        }}
      >
        <input
          className={styles.input}
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          name=""
          id=""
          placeholder="Поиск валюты"
        />
        <div className={styles.list}>
          {data
            ?.filter((e) => e.symbol.endsWith("USDT"))
            .filter((e) => e.symbol.includes(search.toUpperCase()))
            .map((e) => (
              <button
                type="button"
                key={e.symbol}
                className={styles.item}
                disabled={e.askPrice === "0.00000000"}
                onClick={() =>
                  setCurrentCurrency({
                    name: e.symbol.replace("USDT", ""),
                    price: parseFloat(e.askPrice).toFixed(5),
                    change: e.priceChangePercent,
                  })
                }
              >
                <p>{e.symbol.replace("USDT", "")}</p>
                <p>${parseFloat(e.askPrice).toFixed(5)}</p>
                <p
                  className={
                    e.priceChangePercent.includes("-")
                      ? "red"
                      : e.priceChangePercent === "0"
                      ? ""
                      : "green"
                  }
                >
                  {e.priceChangePercent}%
                </p>
              </button>
            ))}
        </div>
        {currentCurrency && (
          <>
            <p>
              {currentCurrency.name} ${currentCurrency.price}
            </p>
            <input
              inputMode="decimal"
              min={0.01}
              step={0.01}
              required
              className={styles.input}
              onChange={(e) => {
                setCount(parseFloat(e.target.value));
              }}
              type="number"
              name="count"
              id="count"
              placeholder="Количество"
            />
            <div className={styles.btnsContainer}>
              <button className={styles.btn} type="submit">
                Добавить
              </button>
              <button className={styles.btn} onClick={onClose} type="button">
                Отмена
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
