import { useEffect } from "react";
import api from "./api/axios";
import { Routes, Route, NavLink } from "react-router-dom";
import DashboardPage from "./pages/Dashboard"
import VendorsPage from "./pages/Vendor"
import CreateRfpPage from "./pages/CreatedRfp"
import RfpDetailsPage from "./pages/RfpDetails"




function App() {
  useEffect(() => {
    const checkData = async () => {
      try {
        const { data } = await api.get("/health")
        console.log(data, "data")
      } catch (error) {
        console.log(error.response.data);
        return error.response.data;
      }
    }

    checkData()
  }, []);
  return (
    <>
      
        <div className="min-h-screen bg-slate-100">
          {/* Top bar */}
          <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
            <h1 className="font-semibold text-lg">AI RFP Management</h1>
            <nav className="flex gap-4 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "font-bold" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/rfps/new"
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "font-bold" : ""}`
                }
              >
                Create RFP
              </NavLink>
              <NavLink
                to="/vendors"
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "font-bold" : ""}`
                }
              >
                Vendors
              </NavLink>
            </nav>
          </header>

          {/* Page content */}
          <main className="max-w-5xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/rfps/new" element={<CreateRfpPage />} />
              <Route path="/rfps/:id" element={<RfpDetailsPage />} />
            </Routes>
          </main>
        </div>
     
    </>
  );
}

export default App;

