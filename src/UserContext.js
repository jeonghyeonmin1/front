import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email }
  const [interviews, setInterviews] = useState([]); // [{ job, answers, date }]

  const signUp = (name, email) => {
    setUser({ name, email });
  };

  const signIn = (email) => {
    // 실제 서비스에서는 인증 로직 필요
    setUser(prev => prev ? prev : { name: '홍길동', email });
  };

  const addInterview = (job, answers) => {
    setInterviews(prev => [
      ...prev,
      { job, answers, date: new Date().toISOString().slice(0, 10) }
    ]);
  };

  return (
    <UserContext.Provider value={{ user, signUp, signIn, interviews, addInterview }}>
      {children}
    </UserContext.Provider>
  );
}
