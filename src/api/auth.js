// 인증 관련 API 함수들
import { apiPost, apiGet } from './index';

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

// 사용자 정보 조회 API (JWT 필요)
export const getUserInfoApi = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const response = await apiGet('/api/user/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.result === 'ok') {
      return {
        success: true,
        data: {
          username: response.data.username,
          email: response.data.email
        }
      };
    } else {
      return {
        success: false,
        message: '사용자 정보 조회에 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return {
      success: false,
      message: '사용자 정보 조회 중 오류가 발생했습니다.'
    };
  }
};

// 면접 시작 API (JWT 필요)
export const startInterviewApi = async (jobType) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const response = await apiGet('/api/interview/start', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      // job 타입을 query parameter로 전달
      params: { job: jobType }
    });

    if (response.result === 'ok') {
      return {
        success: true,
        data: {
          questionList: response.data.questionList
        }
      };
    } else {
      return {
        success: false,
        message: '면접 질문을 가져오는데 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('면접 시작 API 오류:', error);
    return {
      success: false,
      message: '면접 시작 중 오류가 발생했습니다.'
    };
  }
};
