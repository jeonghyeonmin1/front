import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

function SignIn() {
  const { signIn } = useContext(UserContext);

  const handleKakaoLogin = () => {
    // 실제 카카오 로그인 연동은 SDK/REST API 필요
    // 예시: window.location.href = 'https://kauth.kakao.com/oauth/authorize?...';
    alert('카카오 로그인 시도! (실제 서비스는 카카오 SDK 연동 필요)');
    signIn('kakao_user@email.com'); // 예시
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <button type="button" className="kakao-btn" onClick={handleKakaoLogin}>
        <img src="https://developers.kakao.com/assets/img/about/logos/kakaologin/logo/kakaolink_btn_medium.png" alt="Kakao Login" style={{height:'24px', marginRight:'8px', verticalAlign:'middle'}} />
        카카오로 로그인
      </button>
    </div>
  );
}

export default SignIn;
