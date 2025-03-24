import { useGetTiker24hrQuery } from "./api/ticker";
import { Header } from "./components";
import { Portfolio } from "./components/Portfolio/Portfolio";

function App() {
  useGetTiker24hrQuery(null);

  return (
    <div>
      <Header />
      <Portfolio />
    </div>
  );
}

export default App;
