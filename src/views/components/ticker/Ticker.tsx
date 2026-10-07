import "./ticker.scss";

type TickerProps = { items: readonly string[] };

export function Ticker({ items }: TickerProps) {
  return <div className="studio-ticker" aria-label="Actualités"><div>{[...items, ...items].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></div>;
}
