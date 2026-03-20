import './App.css'
import { useEffect } from "react";
import DashboardForm from './components/DashboardForm';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';

function App() {

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        console.log("Backend says:", data);
      })
      .catch(err => {
        console.error("Frontend → Backend failed:", err);
      });
  }, []);

  return <DashboardForm />;
}

export default App;