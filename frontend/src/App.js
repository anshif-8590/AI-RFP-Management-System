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

    </>
  );
}

export default App;
