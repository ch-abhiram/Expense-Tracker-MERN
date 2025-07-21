import React, { useMemo } from 'react';
import styled from 'styled-components';
import bg from './img/bg.png';
import Orb from './Components/Orb/Orb';
import { MainLayout } from './styles/Layouts';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import Login from './Components/credentials/Login';
import Signup from './Components/credentials/Signup';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// The main layout for authenticated pages (nav + content)
function NavigationWrapper() {
  const [active, setActive] = React.useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />; // You can change this to a Transactions page if needed
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Navigation active={active} setActive={setActive} />
      <main>{displayData()}</main>
    </>
  );
}

// Protect any children with JWT check in localStorage
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  // Memoize Orb so animation is not re-rendered
  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <Router>
      <AppStyled bg={bg} className="App">
        {orbMemo}
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <NavigationWrapper />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </AppStyled>
    </Router>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
