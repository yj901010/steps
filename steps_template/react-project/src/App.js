import './App.css';
import Body from './components/Body';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { Suspense } from 'react';

function App() {
  const routing = useRoutes(Themeroutes);

  return (
    
    <div >
      <Suspense fallback="...loading">
      <div className="dark">{routing}</div>
      </Suspense>
    </div>
  );
}

export default App;
