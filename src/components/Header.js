import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Header.css';

function Header() {
  const { user } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          EchoView : AI 면접 서비스
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/signin" className="navbar-menu">
          Sign In
        </Link>
        <Link to="/signup" className="navbar-menu">
          Sign Up
        </Link>

        <div
          className="navbar-menu profile-wrapper"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
          ref={profileRef}
        >
          <Link to="/profile" className="profile-link">
            Profile
          </Link>
          {showProfile && (
            <div className="profile-popover">
              <div className="popover-header">내 프로필</div>
              <div>
                <strong>이름:</strong> {user?.name || '미등록'}
              </div>
              <div>
                <strong>이메일:</strong> {user?.email || '미등록'}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
