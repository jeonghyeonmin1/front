import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email }
  const [interviews, setInterviews] = useState([]); // [{ job, answers, date }]

  // 페이지 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    
    if (token && username && email) {
      console.log('저장된 사용자 정보 복원:', { username, email });
      setUser({
        name: username,
        email: email
      });
    }
  }, []);

  const signUp = (name, email) => {
    setUser({ name, email });
  };

  const signIn = (email, username) => {
    // 사용자 정보 설정
    const userData = { 
      name: username || user?.name || '홍길동', 
      email 
    };
    setUser(userData);
    console.log('사용자 로그인:', userData);
  };

  const signOut = () => {
    // 로그아웃 - localStorage와 state 정리
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setUser(null);
    console.log('사용자 로그아웃');
  };

  const addInterview = (job, answers) => {
    setInterviews(prev => [
      ...prev,
      { job, answers, date: new Date().toISOString().slice(0, 10) }
    ]);
  };

  return (
    <UserContext.Provider value={{ user, signUp, signIn, signOut, interviews, addInterview }}>
      {children}
    </UserContext.Provider>
  );
}
