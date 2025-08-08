// 인증 관련 API 함수들
import { apiPost, apiGet } from './index';

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

// Answer 전달 API (JWT 필요)
// request = {"question": "string","answer": "string","video": "video","type": "string",}
// response = {"result" : "ok","data" : {"message": "ok"}
export const postAnswer = async (question, useranswer, video, type) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return { success: false, message: '로그인이 필요합니다.' };
  }

  try {
    const response = await apiPost('/api/interview/answer', {
      headers: { Authorization: `Bearer ${token}` },
      question,
      useranswer,
      video: video || '',
      type,
    });

    if (response.result === 'ok') {
      return { success: true };
    } else {
      return { success: false, message: response.message || '전송 오류' };
    }

  } catch (err) {
    console.error('postAnswer error:', err);
    return { success: false, message: err.message || '요청 처리 실패' };
  }
};


// 면접 분석 API (JWT 필요)
export const getAnalysisInfoApi = async (jobType) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const response = await apiGet('/api/analysis/info', {
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
          InterviewList: response.data.InterviewList,
          summary: response.data.summary,
          video: response.data.video
        }
      };
    } else {
      return {
        success: false,
        message: '분석 내용을 가져오는데 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('분석 API 오류:', error);
    return {
      success: false,
      message: '분석 중 오류가 발생했습니다.'
    };
  }
};

// 인터뷰 내역 get API (JWT 필요)
export const getInterviewHistoryApi = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  try {
    const response = await apiGet('/api/interview/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.result === 'ok') {
      return {
        success: true,
        data: {
          InterviewList: response.data.InterviewList,
          summary: response.data.summary,
          video: response.data.video
        }
      };
    } else {
      return {
        success: false,
        message: '분석 내용을 가져오는데 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('분석 API 오류:', error);
    return {
      success: false,
      message: '분석 중 오류가 발생했습니다.'
    };
  }
};