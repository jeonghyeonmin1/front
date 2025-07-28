// src/components/Profile.js
import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
// ① Interview.js에서 QUESTIONS를 export 했다면, 이렇게 import 해서 쓰세요.
// import { QUESTIONS } from '../Interview';
import './Profile.css'

// ①을 못 쓰실 경우, Interview.js와 동일하게 QUESTIONS를 복사해도 됩니다.
const QUESTIONS = {
  developer: [
    '자기소개를 해주세요.',
    '최근에 사용한 기술 스택은 무엇인가요?',
    '문제 해결 경험을 말해주세요.'
  ],
  designer: [
    '자기소개를 해주세요.',
    '가장 기억에 남는 디자인 프로젝트는?',
    '디자인 트렌드를 어떻게 파악하나요?'
  ],
  marketer: [
    '자기소개를 해주세요.',
    '마케팅 캠페인 성공 사례를 말해주세요.',
    '데이터 분석 경험이 있나요?'
  ],
  planner: [
    '자기소개를 해주세요.',
    '프로젝트 기획 시 가장 중요하게 생각하는 점은?',
    '협업 경험을 말해주세요.'
  ],
  etc: [
    '자기소개를 해주세요.',
    '해당 직무에 지원한 동기는?',
    '자신의 강점은 무엇인가요?'
  ]
};

function Profile() {
  const { user, interviews } = useContext(UserContext);

  return (
    <div className="profile-container">
      <h2>내 프로필</h2>
      <div className="profile-card">
        <div className="profile-avatar" />
        <div className="profile-info">
          <div><strong>이름:</strong> {user?.name || '미등록'}</div>
          <div><strong>이메일:</strong> {user?.email || '미등록'}</div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#6366f1' }}>내 인터뷰 내역</h3>
        {interviews.length === 0 ? (
          <div style={{ color: '#888', marginTop: '1rem' }}>
            아직 인터뷰 내역이 없습니다.
          </div>
        ) : (
          <ul style={{ marginTop: '1rem', paddingLeft: 0 }}>
            {interviews.map((iv, idx) => {
              // 해당 인터뷰의 질문 리스트
              const qs = QUESTIONS[iv.job] || [];

              return (
                <li
                  key={idx}
                  style={{
                    marginBottom: '1.2rem',
                    background: '#f1f3f6',
                    borderRadius: '1rem',
                    padding: '1rem'
                  }}
                >
                  <div><strong>분야:</strong> {iv.job}</div>
                  <div><strong>날짜:</strong> {iv.date}</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>질문 &amp; 답변:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      {iv.answers.map((ans, i) => (
                        <div
                          key={i}
                          style={{
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            background: '#fff',
                            borderRadius: '0.5rem'
                          }}
                        >
                          <div>
                            <strong>Q{i + 1}:</strong> {qs[i] || '질문 데이터를 찾을 수 없습니다.'}
                          </div>
                          <div style={{ marginTop: '0.25rem' }}>
                            <strong>A{i + 1}:</strong> {ans}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
