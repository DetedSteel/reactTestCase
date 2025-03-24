import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { changePrice, deletePortfolioItem, PortfolioItem } from "../../store/portfolioSlice";
import styles from "./portfolio.module.scss";
import { socketMsg } from "../../api/types/socket";

const fallbackData: PortfolioItem[] = [];

export const Portfolio: FC = () => {
  const portfolio = useAppSelector((state) => state.portfolio.portfolio);
  const dispatch = useAppDispatch();

  const columnHelper = createColumnHelper<PortfolioItem>();

  useEffect(() => {
    const url = portfolio.map((e) => e.symbol.toLowerCase() + "@ticker").join("/");
    const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${url}`);
    socket.onmessage = function (event: MessageEvent<string>) {
      const data = JSON.parse(event.data) as socketMsg;
      dispatch(
        changePrice({ symbol: data.data.s, newPrice: data.data.c, percentChange: data.data.P })
      );
    };
    return () => {
      socket.close();
    };
  }, [dispatch, portfolio]);

  const columns = [
    columnHelper.accessor("name", {
      header: "Актив",
      cell(props) {
        return <div>{props.row.original.name}</div>;
      },
    }),
    columnHelper.accessor("count", { header: "Количество" }),
    columnHelper.accessor("currentPrice", {
      header: "Цена",
      cell(props) {
        return <div>${props.row.original.currentPrice.toFixed(2)}</div>;
      },
    }),
    columnHelper.accessor("totalPrice", {
      header: "Общая стоимость",
      cell(props) {
        return <div>${props.row.original.totalPrice.toFixed(2)}</div>;
      },
    }),
    columnHelper.accessor("change24hrPercent", {
      header: "Изм. за 24 ч.",
      cell(props) {
        return (
          <div
            className={
              props.row.original.change24hrPercent.toString().includes("-")
                ? "red"
                : props.row.original.change24hrPercent.toString() === "0"
                ? ""
                : "green"
            }
          >
            {props.row.original.change24hrPercent}%
          </div>
        );
      },
    }),
    columnHelper.accessor("portfolioPercentPart", {
      header: "% портфеля",
      cell(props) {
        return <div>{props.row.original.portfolioPercentPart}%</div>;
      },
    }),
  ];

  const table = useReactTable({
    columns: columns,
    data: portfolio || fallbackData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup, headerIx) => (
            <tr className={styles.header} key={headerIx}>
              {headerGroup.headers.map((column, colIx) => (
                <th className={styles.cell} key={`${headerIx}_${colIx}`}>
                  {flexRender(column.column.columnDef.header, column.getContext())}
                </th>
              ))}
              <th key={headerIx}></th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIx) => (
            <tr
              className={styles.row}
              key={rowIx}
              onClick={() => {
                dispatch(deletePortfolioItem({ symbol: row.original.symbol }));
                const storedItems = localStorage.getItem("portfolio");
                if (storedItems) {
                  const items = JSON.parse(storedItems) as PortfolioItem[];
                  const newItems = items.filter(
                    (e: PortfolioItem) => e.symbol !== row.original.symbol
                  );
                  localStorage.setItem("portfolio", JSON.stringify(newItems));
                }
              }}
            >
              {row.getVisibleCells().map((cell, cellIx) => (
                <td className={styles.cell} key={`${rowIx}_${cellIx}`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
