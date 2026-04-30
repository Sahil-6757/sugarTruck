import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import Farmer from './components/Farmer';
import Cropdetails from './components/Cropdetails';
import Delivery from './components/Delivery';
import Farmeradminpanel from './components/Farmeradminpanel';
import Field from './components/Field';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/farmer" element={<Farmer />} />
        <Route path='/crop-detail' element={<Cropdetails/>}/>
        <Route path='/delivery' element={<Delivery/>}/>
        <Route path="/farmer-admin-panel" element={<Farmeradminpanel/>}/>
        <Route path='/field' element={<Field/>}/>
      </Routes>
    </div>
  );
}

export default App;
