import { BrowserRouter as Router, } from "react-router-dom";
import AppRouter from './routers';
import useAppInitialization from "./hooks/useAppInitialization";
import Splash from "./components/Splash";

function App() {
  const { loading } = useAppInitialization();

  if (loading) return <Splash />

  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;