import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import Cart from '../Cart/Cart';
import Success from '../Success/Success';
import Cancel from '../Cancel/Cancel';
import Admin from '../Admin/Admin';
import CoursePage from '../CoursePage/CoursePage';
import RegisterDemo from '../RegisterForm/RegisterDemographics';
import PurchasePunchCard from '../PurchasePunchCard/PurchasePunchCard';
import './App.css';
import AboutHeader from '../AboutHeader/AboutHeader';
import ReportsGolfCoursesHigh from '../Admin/Reports/ReportsGolfCoursesHigh';
import ReportsGolfCoursesLow from '../Admin/Reports/ReportsGolfCoursesLow';
import ReportsDiscounts from '../Admin/Reports/ReportsDiscounts';
import ReportsGolfcoursesNotRedeemed from '../Admin/Reports/ReportsGolfCoursesNotRedeemed';
import ReportsUserZip from '../Admin/Reports/ReportsUserZip';
import ReportsPaymentsLog from '../Admin/Reports/ReportsPaymentsLog';
import ReportsRedeemedLog from '../Admin/Reports/ReportsRedeemedLog';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const punchCards = useSelector((store) => store.punchCards);
  const [hasPunchCard, setHasPunchCard] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  useEffect(() => {
    if (user.id) {
      dispatch({ type: 'FETCH_PUNCH_CARDS' });
    }
  }, [user.id, dispatch]);

  useEffect(() => {
    if (punchCards.length > 0) {
      setHasPunchCard(true);
    } else {
      setHasPunchCard(false);
    }
  }, [punchCards]);

  return (
    <Router>
      <Content />
    </Router>
  );
}

function Content() {
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const punchCards = useSelector((store) => store.punchCards);
  const [hasPunchCard, setHasPunchCard] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  useEffect(() => {
    if (user.id) {
      dispatch({ type: 'FETCH_PUNCH_CARDS' });
    }
  }, [user.id, dispatch]);

  useEffect(() => {
    if (punchCards.length > 0) {
      setHasPunchCard(true);
    } else {
      setHasPunchCard(false);
    }
  }, [punchCards]);

  return (
    <div className='app-container'>
      {location.pathname === '/about' ? <AboutHeader /> : <Nav />}
      <div className='main-content'>
        <Switch>
          <Redirect exact from='/' to='/home' />
          <Route exact path='/about'>
            <AboutPage />
          </Route>
          <ProtectedRoute exact path='/home'>
            {hasPunchCard ? <LandingPage /> : <Redirect to='/purchase-punchcard' />}
          </ProtectedRoute>
          <ProtectedRoute exact path="/landing">
            {hasPunchCard || user.admin ? (
              <LandingPage />
            ) : (
              <Redirect to="/purchase-punchcard" />
            )}
          </ProtectedRoute>
          <ProtectedRoute exact path='/coursepage/:id'>
            {hasPunchCard ? <CoursePage /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/user'>
            <UserPage />
          </ProtectedRoute>
          <ProtectedRoute exact path='/cart'>
            <Cart />
          </ProtectedRoute>
          <ProtectedRoute exact path="/success">
             <Success /> : 
          </ProtectedRoute>
          <ProtectedRoute exact path='/cancel'>
            <Cancel />
          </ProtectedRoute>

          <ProtectedRoute exact path='/admin'>
            {user.admin ? <Admin /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/reports/admin/golfcourses/high'>
            {user.admin ? <ReportsGolfCoursesHigh /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/reports/admin/golfcourses/low'>
            {user.admin ? <ReportsGolfCoursesLow /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/reports/admin/discounts'>
            {user.admin ? <ReportsDiscounts /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/reports/admin/golfcourses/not'>
            {user.admin ? <ReportsGolfcoursesNotRedeemed /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/reports/admin/user/zip'>
            {user.admin ? <ReportsUserZip /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/reports/admin/payments/log'>
            {user.admin ? <ReportsPaymentsLog /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <ProtectedRoute exact path='/reports/admin/redeemed/log'>
            {user.admin ? <ReportsRedeemedLog /> : <Redirect to='/home' />}
          </ProtectedRoute>
          <Route exact path='/demographics'>
            <RegisterDemo />
          </Route>
          <Route exact path='/login'>
            {user.id ? <Redirect to='/home' /> : <LoginPage />}
          </Route>
          <Route exact path='/registration'>
            {user.id ? <Redirect to='/home' /> : <RegisterPage />}
          </Route>
          <Route exact path='/purchase-punchcard'>
            {hasPunchCard ? <Redirect to='/home' /> : <PurchasePunchCard />}
          </Route>
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </div>
      {location.pathname !== '/about' && <Footer />}
    </div>
  );
}

export default App;
