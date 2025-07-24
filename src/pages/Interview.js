import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

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

function Interview() {
  const location = useLocation();
  const job = location.state?.job || 'developer';
  const questions = QUESTIONS[job];
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnswers([...answers, answer]);
    setAnswer('');
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      alert('면접이 완료되었습니다!');
      // 결과 페이지로 이동 등 추가 구현 가능
    }
  };

  return (
    <div className="interview-container">
      <h2>면접 진행 <span style={{fontWeight:400, fontSize:'1rem', color:'#888'}}>({step + 1}/{questions.length})</span></h2>
      <div className="question-box">
        <strong>질문:</strong> {questions[step]}
      </div>
      <form onSubmit={handleSubmit} className="answer-form">
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          rows={5}
          className="answer-textarea"
          placeholder="답변을 입력하세요"
        />
        <br />
        <button type="submit" className="submit-btn" disabled={!answer.trim()}>
          {step < questions.length - 1 ? '다음 질문' : '면접 완료'}
        </button>
      </form>
      <div className="progress-bar">
        <div className="progress" style={{width: `${((step + 1) / questions.length) * 100}%`}}></div>
      </div>
    </div>
  );
}

export default Interview;
