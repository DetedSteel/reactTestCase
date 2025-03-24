export type socketMsg = {
  stream: string;
  data: {
    A: string; // Best ask quantity
    B: string; // Best bid quantity
    C: number; // Close time
    E: number; // Event time
    F: number; // First trade ID
    L: number; // Last trade ID
    O: number; // Open time
    P: string; // Price change percent
    Q: string; // Last quantity
    a: string; // Best ask price
    b: string; // Best bid price
    c: string; // Current price
    e: string; // Event type
    h: string; // High price
    l: string; // Low price
    n: number; // Number of trades
    o: string; // Open price
    p: string; // Price change
    q: string; // Quote volume
    s: string; // Symbol
    v: string; // Volume
    w: string; // Weighted average price
    x: string; // Previous close price
  };
};
