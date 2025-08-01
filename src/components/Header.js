import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Header.css';

function Header() {
  const { user, signOut } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();

  
  // 스크롤 상태를 관리하기 위한 state 추가
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트를 감지하는 useEffect 훅
  useEffect(() => {
    // 스크롤 위치에 따라 isScrolled 상태를 업데이트하는 함수
    const handleScroll = () => {
      if (window.scrollY > 10) { // 10px 이상 스크롤되면
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거하는 클린업 함수
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

  const handleLogout = () => {
    signOut();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    // isScrolled 상태에 따라 'scrolled' 클래스를 동적으로 추가
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          EchoView : AI 면접 서비스
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          // 로그인된 상태
          <>
            <span className="navbar-user">
              {user.name}님!
            </span>
            <Link to="/profile" className="navbar-menu">
              Profile
            </Link>
            <button className="navbar-menu navbar-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          // 로그인되지 않은 상태
          <>
            <Link to="/signin" className="navbar-menu">
              Sign In
            </Link>
            <Link to="/signup" className="navbar-menu">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
