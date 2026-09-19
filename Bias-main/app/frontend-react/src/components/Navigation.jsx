import { Link, NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
    <> 
      <div id='top-nav-container'>
        <nav id='top-nav'>
          <div id='title-container'>
            <Link id='title-text' to='/'>Ecotrax</Link>
          </div>

          <div id='nav-links'>
            <NavLink className='nav-link' id='info' to='/info'>Info</NavLink>
            <NavLink className='nav-link' id='about' to='/about'>About</NavLink>
            <NavLink className='nav-link bordered' id='report' to='/report'>Report</NavLink>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navigation;