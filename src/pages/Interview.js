// import React, { useState, useContext, useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { UserContext } from '../UserContext';

// const QUESTIONS = {
//   developer: [
//     '자기소개를 해주세요.',
//     '최근에 사용한 기술 스택은 무엇인가요?',
//     '문제 해결 경험을 말해주세요.'
//   ],
//   designer: [
//     '자기소개를 해주세요.',
//     '가장 기억에 남는 디자인 프로젝트는?',
//     '디자인 트렌드를 어떻게 파악하나요?'
//   ],
//   marketer: [
//     '자기소개를 해주세요.',
//     '마케팅 캠페인 성공 사례를 말해주세요.',
//     '데이터 분석 경험이 있나요?'
//   ],
//   planner: [
//     '자기소개를 해주세요.',
//     '프로젝트 기획 시 가장 중요하게 생각하는 점은?',
//     '협업 경험을 말해주세요.'
//   ],
//   etc: [
//     '자기소개를 해주세요.',
//     '해당 직무에 지원한 동기는?',
//     '자신의 강점은 무엇인가요?'
//   ]
// };

// const TIME_LIMIT = 120; // 초

// function Interview() {
//   const location = useLocation();
//   const job = location.state?.job || 'developer';
//   const questions = QUESTIONS[job];
//   const { addInterview } = useContext(UserContext);

//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [subtitle, setSubtitle] = useState('');  // 화면에 보여줄 텍스트
//   const [buffer, setBuffer] = useState('');      // 저장할 텍스트
//   const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

//   const recognitionRef = useRef(null);
//   const videoRef = useRef(null);

//   // 1) SpeechRecognition 초기화 (한 번만)
//   useEffect(() => {
//     const TR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!TR) {
//       console.error('SpeechRecognition not supported');
//       return;
//     }
//     const recog = new TR();
//     recog.lang = 'ko-KR';
//     recog.interimResults = true;
//     recog.continuous = true;

//     recog.onstart = () => setListening(true);
//     recog.onend   = () => setListening(false);

//     recog.onresult = event => {
//       // event.results 전체에서 지금까지 인식된 텍스트 누적
//       let transcript = '';
//       for (let i = 0; i < event.results.length; i++) {
//         transcript += event.results[i][0].transcript + ' ';
//       }
//       transcript = transcript.trim();
//       setSubtitle(transcript);
//       setBuffer(transcript);
//     };

//     recog.onerror = e => console.error('SpeechRecognition error:', e.error);

//     recognitionRef.current = recog;
//   }, []);

//   // 2) 질문(step) 바뀔 때마다 초기화 + TTS 호출
//   useEffect(() => {
//     setSubtitle('');
//     setBuffer('');
//     setTimeLeft(TIME_LIMIT);

//     // 이전 세션 멈추고…
//     recognitionRef.current?.abort();

//     // TTS로 질문 읽어주기 (끝나면 start)
//     speakQuestion();
//   }, [step]);

//   // 3) TTS: 질문 읽어주고, 끝나면 음성 인식 시작
//   const speakQuestion = () => {
//     if (!('speechSynthesis' in window)) return;
//     speechSynthesis.cancel();

//     const loadVoices = () => {
//       const voices = speechSynthesis.getVoices();
//       if (voices.length === 0) {
//         // 아직 로딩 중이면 잠시 대기
//         return setTimeout(loadVoices, 100);
//       }
//       const sel = voices.find(v => v.name === 'Yuna' && v.lang?.startsWith('ko'))
//                || voices.find(v => v.lang === 'ko-KR')
//                || voices[0];

//       const u = new SpeechSynthesisUtterance(questions[step]);
//       if (sel) {
//         u.voice = sel;
//         u.lang  = sel.lang;
//       } else {
//         u.lang = 'ko-KR';
//       }
//       u.rate  = 1.0;
//       u.pitch = 1.0;
//       u.volume= 1.0;

//       u.onend = () => {
//         try { recognitionRef.current.start(); }
//         catch (e) { console.warn('Recognition start failed:', e); }
//       };

//       speechSynthesis.speak(u);
//     };

//     loadVoices();
//   };

//   // 4) 타이머 카운트다운
//   useEffect(() => {
//     if (timeLeft <= 0) return;
//     const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearInterval(id);
//   }, [timeLeft]);

//   // 5) 0초 되면 자동 다음
//   useEffect(() => {
//     if (timeLeft === 0) handleNext();
//   }, [timeLeft]);

//   // 6) 웹캠 초기화
//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//       .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
//       .catch(err => console.error('Webcam error:', err));
//   }, []);

//   // 답변 저장 및 다음 스텝
//   const handleVoiceSubmit = transcript => {
//     setAnswers(prev => {
//       const next = [...prev, transcript];
//       if (step < questions.length - 1) {
//         setStep(s => s + 1);
//       } else {
//         addInterview(job, next);
//         alert('면접이 완료되었습니다!');
//       }
//       return next;
//     });
//   };

//   // “다음 질문” 버튼 또는 타이머 종료 시 호출
//   const handleNext = () => {
//     // 인식 강제 종료 → 마지막 결과를 onresult에서 버퍼에 담아줌
//     recognitionRef.current?.stop();

//     if (!buffer.trim()) {
//       alert('답변이 인식되지 않았습니다. 다시 말씀해주세요.');
//       return;
//     }
//     handleVoiceSubmit(buffer);
//   };

//   const percent = ((step + 1) / questions.length) * 100;

//   return (
//     <div className="interview-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
//       {/* Webcam */}
//       <div className="webcam-container">
//         <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
//       </div>

//       {/* 질문 배너 */}
//       {/* <div className="question-banner">{questions[step]}</div> */}

//       {/* 실시간 자막 */}
//       <div className="subtitle">{subtitle}</div>

//       {/* 인식 상태 */}
//       {/* <div className="listening-indicator">
//         {listening ? '음성 인식 중...' : '음성 인식 대기 중'}
//       </div> */}

//       {/* 진행 정보 */}
//       <h2 style={{
//         position: 'absolute', bottom: '8rem',
//         left: 0, right: 0, margin: 0, textAlign: 'center'
//       }}>
//         면접 진행 <span style={{ fontWeight: 400, fontSize: '1rem', color: '#888' }}>
//           ({step + 1}/{questions.length})
//         </span>
//       </h2>

//       {/* 다음 & 타이머 */}
//       <div style={{
//         position: 'absolute', bottom: '1rem',
//         left: '50%', transform: 'translateX(-50%)',
//         display: 'flex', flexDirection: 'column',
//         alignItems: 'center', gap: '0.5rem'
//       }}>
//         <button onClick={handleNext}
//                 style={{ padding: '.5rem 1rem', borderRadius: '.5rem', cursor: 'pointer' }}>
//           다음 질문
//         </button>
//         <div>남은 시간: {timeLeft}s</div>
//       </div>

//       {/* Progress Bar */}
//       <div className="progress-bar">
//         <div className="progress" style={{ width: `${percent}%` }} />
//       </div>
//     </div>
//   );
// }

// export default Interview;


import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const QUESTIONS = {
  developer: [
    '자기소개를 해주세요.',
    '최근에 사용한 기술 스택은 무엇인가요?',
    '문제 해결 경험을 말해주세요.'
  ],
  // … 이하 생략 (기존 QUESTIONS 그대로) …
};

const TIME_LIMIT = 120; // 초

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job || 'developer';
  const questions = QUESTIONS[job];
  const { addInterview } = useContext(UserContext);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [listening, setListening] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [buffer, setBuffer] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  // 1) SpeechRecognition 초기화
  useEffect(() => {
    const TR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!TR) return;
    const recog = new TR();
    recog.lang = 'ko-KR';
    recog.interimResults = true;
    recog.continuous = true;
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = event => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      transcript = transcript.trim();
      setSubtitle(transcript);
      setBuffer(transcript);
    };
    recog.onerror = e => console.error('SpeechRecognition error:', e.error);
    recognitionRef.current = recog;
  }, []);

  // 2) 질문 바뀔 때마다 초기화 → TTS
  useEffect(() => {
    if (isAnalyzing) return;  // 분석중이면 건너뛰기
    setSubtitle('');
    setBuffer('');
    setTimeLeft(TIME_LIMIT);
    recognitionRef.current?.abort();
    speakQuestion();
  }, [step, isAnalyzing]);

  // 3) TTS 및 음성 인식 시작
  const speakQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return setTimeout(loadVoices, 100);
      const sel = voices.find(v => v.name === 'Yuna' && v.lang?.startsWith('ko'))
                || voices.find(v => v.lang === 'ko-KR')
                || voices[0];
      const u = new SpeechSynthesisUtterance(questions[step]);
      if (sel) { u.voice = sel; u.lang = sel.lang; }
      else      { u.lang = 'ko-KR'; }
      u.rate = 1; u.pitch = 1; u.volume = 1;
      u.onend = () => {
        try { recognitionRef.current.start(); }
        catch (e) { console.warn(e); }
      };
      speechSynthesis.speak(u);
    };
    loadVoices();
  };

  // 4) 타이머
  useEffect(() => {
    if (isAnalyzing || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, isAnalyzing]);

  // 5) 타임아웃 시 자동 다음
  useEffect(() => {
    if (timeLeft === 0) handleNext();
  }, [timeLeft]);

  // 6) 웹캠
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(s => videoRef.current && (videoRef.current.srcObject = s))
      .catch(e => console.error('Webcam error:', e));
  }, []);

  // 면접 완료 후 분석 시작 → addInterview, 분석화면 토글
  const handleVoiceSubmit = transcript => {
    setAnswers(prev => {
      const next = [...prev, transcript];
      if (step < questions.length - 1) {
        setStep(s => s + 1);
      } else {
        addInterview(job, next);
        setIsAnalyzing(true);
      }
      return next;
    });
  };

  // “다음 질문” 혹은 타이머 만료 시
  const handleNext = () => {
    recognitionRef.current?.stop();
    if (!buffer.trim()) {
      alert('답변이 인식되지 않았습니다.');
      return;
    }
    handleVoiceSubmit(buffer);
  };

  // 7) 분석중 화면에서 3초 뒤 홈으로 이동
  useEffect(() => {
    if (!isAnalyzing) return;
    const id = setTimeout(() => {
      navigate('/result', { replace: true });
    }, 3000); // 3초 뒤
    return () => clearTimeout(id);
  }, [isAnalyzing, navigate]);

  
  if (isAnalyzing) {
    return (
      <div className="analyzing-overlay">
        <div className="analyzing-card">
          <div className="analyzing-spinner" />
          <div className="analyzing-text">면접 질문 분석 중...</div>
          <div className="analyzing-subtext">잠시만 기다려주세요.</div>
        </div>
      </div>
    );
  }

  // **면접 진행 화면**
  const percent = ((step + 1) / questions.length) * 100;
  return (
    <div className="interview-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
      <div className="webcam-container">
        <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
      </div>

      <div className="subtitle">{subtitle}</div>

      <h2 style={{
        position: 'absolute', bottom: '8rem',
        left: 0, right: 0, margin: 0, textAlign: 'center'
      }}>
        면접 진행 <span style={{ fontWeight: 400, fontSize: '1rem', color: '#888' }}>
          ({step + 1}/{questions.length})
        </span>
      </h2>

      <div style={{
        position: 'absolute', bottom: '1rem',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '0.5rem'
      }}>
        <button onClick={handleNext}
                style={{ padding: '.5rem 1rem', borderRadius: '.5rem', cursor: 'pointer' }}>
          다음 질문
        </button>
        <div>남은 시간: {timeLeft}s</div>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default Interview;
