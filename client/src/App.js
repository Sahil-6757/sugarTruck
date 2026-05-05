import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import Farmer from './components/Farmer';
import Cropdetails from './components/Cropdetails';
import Delivery from './components/Delivery';
import Farmeradminpanel from './components/Farmeradminpanel';
import Field from './components/Field';
import Driver from './components/Driver';
import Trip from './components/Trip'
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/farmer" element={
          <ProtectedRoute>
            <Farmer />
          </ProtectedRoute>
        } />
        <Route path='/crop-detail' element={
          <ProtectedRoute>
            <Cropdetails />
          </ProtectedRoute>
        }/>
        <Route path='/delivery' element={
          <ProtectedRoute>
            <Delivery />
          </ProtectedRoute>
        }/>
        <Route path="/farmer-admin-panel" element={
          <ProtectedRoute>
            <Farmeradminpanel />
          </ProtectedRoute>
        }/>
        <Route path='/field' element={
          <ProtectedRoute>
            <Field />
          </ProtectedRoute>
        }/>
        <Route path='/driver' element={
          <ProtectedRoute>
            <Driver />
            <Trip/>
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  );
}

export default App;
