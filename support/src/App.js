import { BrowserRouter as Router, } from "react-router-dom";

import AppRouter from './routers';

import useAppInitialization from "@shared/hooks/useAppInitialization";
import Splash from "@shared/components/Splash";

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