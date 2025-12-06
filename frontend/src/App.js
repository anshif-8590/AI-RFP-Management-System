import { useEffect } from "react";
import api from "./api/axios";


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
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-bold text-green-400">
        Tailwind is working 🚀
      </h1>
    </div>
    </>
  );
}

export default App;
