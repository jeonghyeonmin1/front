// API 기본 설정 및 공통 함수들
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// 공통 fetch 함수
export const apiRequest = async (endpoint, options = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // query parameters 처리
  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    url += `?${searchParams.toString()}`;
  }
  
  // 기본 헤더 설정
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };
  
  // params는 fetch config에서 제거
  delete config.params;

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // HTTP 상태 코드가 에러인 경우
    if (!response.ok) {
      throw new ApiError(
        data.message || '요청 처리 중 오류가 발생했습니다.',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 네트워크 오류 등
    throw new ApiError(
      '서버와의 연결에 문제가 발생했습니다.',
      0,
      null
    );
  }
};

// GET 요청
export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, { method: 'GET', ...options });
};

//POST 요청
// export const apiPost = (endpoint, data) => {
//   return apiRequest(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// };

export const apiPost = (endpoint, { headers = {}, ...data } = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
};

// PUT 요청
export const apiPut = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE 요청
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};
