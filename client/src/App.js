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
          <ProtectedRoute allowedRoles={['Farmer']}>
            <Farmer />
          </ProtectedRoute>
        } />
        <Route path='/crop-detail' element={
          <ProtectedRoute allowedRoles={['Farmer']}>
            <Cropdetails />
          </ProtectedRoute>
        } />
        <Route path='/delivery' element={
          <ProtectedRoute allowedRoles={['Farmer']}>
            <Delivery />
          </ProtectedRoute>
        } />
        <Route path="/farmer-admin-panel" element={
          <ProtectedRoute allowedRoles={['Factory Admin']}>
            <Farmeradminpanel />
          </ProtectedRoute>
        } />
        <Route path='/field' element={
          <ProtectedRoute allowedRoles={['Field Staff']}>
            <Field />
          </ProtectedRoute>
        } />
        <Route path='/driver' element={
          <ProtectedRoute allowedRoles={['Driver']}>
            <Driver />

          </ProtectedRoute>
        } />
        <Route path='/trip' element={
          <ProtectedRoute allowedRoles={['Driver']}>
            <Trip />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
