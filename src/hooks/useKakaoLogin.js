import { useEffect, useContext, useRef } from 'react';
import { UserContext } from '../UserContext';

// 카카오 로그인 URL 파라미터 처리를 위한 커스텀 훅
export const useKakaoLogin = () => {
  const { signIn } = useContext(UserContext);
  const processedRef = useRef(false); // 중복 처리 방지

  useEffect(() => {
    // 이미 처리했다면 건너뛰기
    if (processedRef.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const kakaoLogin = urlParams.get('kakao_login');
    
    if (kakaoLogin === 'success') {
      const token = urlParams.get('token');
      const username = urlParams.get('username');
      const email = urlParams.get('email');
      
      if (token && username && email) {
        // 처리 시작 마킹
        processedRef.current = true;
        
        // 로컬 스토리지에 저장
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        
        // Context 상태 업데이트
        signIn(email, username);
        
        // URL에서 파라미터 제거 (깔끔하게)
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // 로그인 성공 알림
        alert(`카카오 로그인이 완료되었습니다! 환영합니다, ${username}님!`);
      }
    } else if (kakaoLogin === 'error') {
      const message = urlParams.get('message') || '알 수 없는 오류가 발생했습니다.';
      
      // 처리 시작 마킹
      processedRef.current = true;
      
      // URL에서 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // 에러 알림
      alert(`카카오 로그인 실패: ${decodeURIComponent(message)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열을 빈 배열로 유지하고 ESLint 경고 무시
};
