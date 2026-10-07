import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Explore from "./pages/Explore";
import MyTrips from "./pages/MyTrips";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/trips" element={<MyTrips />} />
        </Routes>
      </main>
      <footer className="footer">Acme Travel · demo application</footer>
    </div>
  );
}
