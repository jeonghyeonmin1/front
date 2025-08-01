// 인증 관련 API 함수들
import { apiPost } from './index';

// 로그인 API
export const loginApi = async (email, password) => {
  const response = await apiPost('/api/auth/login', {
    email,
    password
  });

  if (response.result === 'ok') {
    return {
      success: true,
      data: {
        username: response.data.username,
        email: response.data.email,
        token: response.data.token
      }
    };
  } else {
    return {
      success: false,
      message: '로그인에 실패했습니다. 이메일과 패스워드를 확인해주세요.'
    };
  }
};

// 카카오 로그인 API - 프록시를 통해 백엔드로 리다이렉트
export const kakaoLoginApi = () => {
  // setupProxy.js를 통해 /kakao/login 요청이 백엔드로 프록시됨
  window.location.href = '/kakao/login';
};

// 회원가입 API
export const signupApi = async (email, password, username) => {
  const response = await apiPost('/api/auth/join', {
    email,
    password,
    username
  });

  if (response.result === 'ok') {
    return {
      success: true,
      data: {
        username: response.data.username,
        email: response.data.email,
        token: response.data.token
      }
    };
  } else {
    return {
      success: false,
      message: response.message || '회원가입에 실패했습니다.'
    };
  }
};

// 이메일 중복확인 API
export const verifyEmailApi = async (email) => {
  const response = await apiPost('/api/auth/verify', {
    email
  });

  if (response.result === 'ok') {
    return {
      success: true,
      exists: response.data.exists
    };
  } else {
    return {
      success: false,
      message: '이메일 확인 중 오류가 발생했습니다.'
    };
  }
};
