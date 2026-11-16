import { BrowserRouter as Router } from "react-router-dom";

import useAppInitialization from "@shared/hooks/useAppInitialization";
import Splash from "@shared/components/Splash";

import AppRouter from "./routers";

function App() {
  const { loading } = useAppInitialization();

  if (loading) return <Splash />;

  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;