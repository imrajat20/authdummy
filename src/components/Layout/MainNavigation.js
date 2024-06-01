import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const MainNavigation = () => {

  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const deleteIdToken = () => {
    authCtx.logout();
    history.replace('/auth');
    localStorage.removeItem('idToken');
  };

  const isLoggedIn = authCtx.isLoggedIn;
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn &&  
          <li>
            <Link to='/auth'>Login</Link>
          </li>
          }
          {isLoggedIn && <li>
          <Link to='/profile'>Profile</Link>
        </li>}
         { isLoggedIn &&
        <li>
          <button onClick={deleteIdToken}>Logout</button>
        </li>}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
