import React, { useEffect, useState } from "react";
import krx from "krx-stock-api";
import "./App.css";

function App() {
  const [stock, setStock] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await krx.getStock("005930");
      console.log(res);
      setStock(res);
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header"></header>
      {res}
    </div>
  );
}

export default App;
