import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import MyNotes from './screens/MyNotes/MyNotes';
import CreateNote from './screens/CreateNote/CreateNote';
import EditNote from './screens/EditNote/EditNote';
import LoginPage from './screens/LoginPage/LoginPage';
import RegisterPage from './screens/RegisterPage/RegisterPage';
import UserProfile from './screens/UserProfile/UserProfile';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();
  console.log('hellow orld');
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route
          path='/login'
          element={!user ? <LoginPage /> : <Navigate to='/mynotes' />}
        />
        <Route
          path='/signup'
          element={!user ? <RegisterPage /> : <Navigate to='/mynotes' />}
        />
        <Route
          path='/myprofile'
          element={user ? <UserProfile /> : <Navigate to='/login' />}
        />
        <Route
          path='/mynotes'
          element={user ? <MyNotes /> : <Navigate to='/login' />}
        />
        <Route
          path='/create-note'
          element={user ? <CreateNote /> : <Navigate to='/login' />}
        />
        <Route
          path='/note/:id'
          element={user ? <EditNote /> : <Navigate to='/login' />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
