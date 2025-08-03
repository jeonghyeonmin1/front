import React from 'react';
import Header from '../components/Header';
import { useKakaoLogin } from '../hooks/useKakaoLogin';

function Layout({ children }) {
  // 카카오 로그인 처리
  useKakaoLogin();

  return (
    <>
      <Header />
      <div className="App">
        {children}
      </div>
    </>
  );
}

export default Layout;
