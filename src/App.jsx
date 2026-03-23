import Navbar from "./components/NavBar";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="bg-bg min-h-screen text-textMain">
      <Navbar />
      <Home />
    </div>
  );
}