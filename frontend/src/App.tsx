import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SelectDetails from "./pages/SelectDetails";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import { BookingProvider } from "./context/BookingContext";

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/experience/:id" element={<SelectDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}
