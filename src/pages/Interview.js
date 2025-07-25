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

// const TIME_LIMIT = 30; // 제한 시간 (초)

// function Interview() {
//   const location = useLocation();
//   const job = location.state?.job || 'developer';
//   const questions = QUESTIONS[job];
//   const { addInterview } = useContext(UserContext);

//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [subtitle, setSubtitle] = useState('');
//   const [buffer, setBuffer] = useState('');
//   const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

//   const recognitionRef = useRef(null);
//   const videoRef = useRef(null);

//   // 1) SpeechRecognition 초기화
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.error('SpeechRecognition not supported');
//       return;
//     }
//     const recog = new SpeechRecognition();
//     recog.lang = 'ko-KR';
//     recog.interimResults = true;
//     recog.continuous = true;

//     recog.onstart = () => setListening(true);
//     recog.onend = () => setListening(false);

//     recog.onresult = event => {
//       let interim = '';
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         const text = result[0].transcript.trim();
//         if (result.isFinal) {
//           setSubtitle(text);
//           setBuffer(text);
//         } else {
//           interim += text + ' ';
//           setSubtitle(interim);
//         }
//       }
//     };

//     recog.onerror = e => console.error('SpeechRecognition error', e.error);

//     recognitionRef.current = recog;
//   }, []);

//   // 2) 질문 변경 시 subtitle, buffer, 타이머 초기화 및 인식 재시작
//   useEffect(() => {
//     setSubtitle('');
//     setBuffer('');
//     setTimeLeft(TIME_LIMIT);
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.start();
//       } catch (e) {
//         console.warn('Recognition start failed', e);
//       }
//     }
//   }, [step]);

//   // 3) 타이머 카운트다운
//   useEffect(() => {
//     if (timeLeft <= 0) return;
//     const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearInterval(id);
//   }, [timeLeft]);

//   // 4) 타이머 종료 시 자동 다음 질문
//   useEffect(() => {
//     if (timeLeft === 0) {
//       handleNext();
//     }
//   }, [timeLeft]);

//   // 5) 웹캠 초기화
//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//       .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
//       .catch(err => console.error('Webcam error:', err));
//   }, []);

//   // 6) 질문 텍스트 음성 안내 (TTS)
//   // useEffect(() => {
//   //   if ('speechSynthesis' in window) {
//   //     speechSynthesis.cancel();
//   //     const utterance = new SpeechSynthesisUtterance(questions[step]);
//   //     const voices = speechSynthesis.getVoices();
//   //     const selectedVoice =
//   //     voices.find(v => v.name === 'Yuna')     
//   //     || voices.find(v => v.name === 'Google 한국어 여성')         // 정확 매칭
//   //     || voices.find(v => v.name.includes('Microsoft'))         // 일부 문자열 매칭
//   //     || voices.find(v => v.lang === 'ko-KR')                  // 언어 조건
//   //     || voices[0];      

//   //     // 3) utterance에 세팅
//   //     utterance.voice   = selectedVoice;
//   //     utterance.lang    = selectedVoice.lang;
//   //     utterance.rate    = 1.0;   // 속도 (0.1 ~ 10)
//   //     utterance.pitch   = 1.0;   // 피치 (0 ~ 2)
//   //     utterance.volume  = 1.0;   // 볼륨 (0 ~ 1)

//   //     speechSynthesis.speak(utterance);
//   //   }
//   // }, [step, questions]);

//   useEffect(() => {
//   if (!('speechSynthesis' in window)) return;
//   speechSynthesis.cancel();

//   const utterance = new SpeechSynthesisUtterance(questions[step]);
//   const voices = speechSynthesis.getVoices();
//   const selectedVoice =
//     voices.find(v => v.name === 'Yuna')                         // Yuna로 정확 매칭
//     || voices.find(v => v.name === 'Google 한국어 여성')        // 기존 백업
//     || voices.find(v => v.name.includes('Microsoft'))          // 일부 문자열 매칭
//     || voices.find(v => v.lang === 'ko-KR')                    // 언어 조건
//     || voices[0];

//   utterance.voice   = selectedVoice;
//   utterance.lang    = selectedVoice.lang;
//   utterance.rate    = 1.0;
//   utterance.pitch   = 1.0;
//   utterance.volume  = 1.0;

//   speechSynthesis.speak(utterance);
// }, [step, questions]);


//   const handleVoiceSubmit = transcript => {
//     setAnswers(prev => {
//       const newAnswers = [...prev, transcript];
//       if (step < questions.length - 1) {
//         setStep(s => s + 1);
//       } else {
//         addInterview(job, newAnswers);
//         alert('면접이 완료되었습니다!');
//       }
//       return newAnswers;
//     });
//   };

//   // "다음 질문" 버튼 또는 타이머 종료 시 호출
//   const handleNext = () => {``
//     handleVoiceSubmit(buffer || '');
//   };

//   const percent = ((step + 1) / questions.length) * 100;

//   return (
//     <div className="interview-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
//       {/* Webcam feed */}
//       <div className="webcam-container">
//         <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
//       </div>

//       {/* Question banner */}
//       <div className="question-banner">{questions[step]}</div>

//       {/* Listening indicator and subtitle */}
//       <div className="listening-indicator">
//         {listening ? '음성 인식 중...' : '음성 인식 대기 중'}
//       </div>
//       {/* <div className="subtitle">{subtitle}</div> */}

//       {/* Progress info */}
//       <h2 style={{
//         position: 'absolute',
//         bottom: '8rem',
//         left: 0,
//         right: 0,
//         margin: 0,
//         textAlign: 'center'
//       }}>
//         면접 진행 <span style={{ fontWeight: 400, fontSize: '1rem', color: '#888' }}>
//           ({step + 1}/{questions.length})
//         </span>
//       </h2>

//       {/* Next button & Timer */}
//       <div
//         style={{
//           position: 'absolute',
//           bottom: '1rem',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           display: 'flex',
//           flexDirection: 'column',  
//           alignItems: 'center',     
//           gap: '0.5rem',            
//         }}
//       >
//         <button
//           onClick={handleNext}
//           style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}
//         >
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
import { useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';

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

const TIME_LIMIT = 30; // 제한 시간 (초)

function Interview() {
  const location = useLocation();
  const job = location.state?.job || 'developer';
  const questions = QUESTIONS[job];
  const { addInterview } = useContext(UserContext);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [listening, setListening] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [buffer, setBuffer] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  // 1) SpeechRecognition 초기화
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('SpeechRecognition not supported');
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = 'ko-KR';
    recog.interimResults = true;
    recog.continuous = true;

    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);

    recog.onresult = event => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();
        if (result.isFinal) {
          setSubtitle(text);
          setBuffer(text);
        } else {
          interim += text + ' ';
          setSubtitle(interim);
        }
      }
    };

    recog.onerror = e => console.error('SpeechRecognition error', e.error);

    recognitionRef.current = recog;
  }, []);

  // 2) 질문 변경 시 subtitle, buffer, 타이머 초기화 및 인식 재시작
  useEffect(() => {
    setSubtitle('');
    setBuffer('');
    setTimeLeft(TIME_LIMIT);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start failed', e);
      }
    }
    speakQuestion();
  }, [step]);

  // TTS: 질문 음성 안내 함수
  const speakQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();

    // 음성 목록 가져오기
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return setTimeout(loadVoices, 100);
      const utterance = new SpeechSynthesisUtterance(questions[step]);
      utterance.lang = 'ko-KR';
      console.log(utterance.voice.name)
      // 목소리 톤과 속도 조절
      utterance.rate = 1.1;    // 말하는 속도 (0.1 ~ 10), 기본 1
      utterance.pitch = 1.2;   // 목소리 높낮이 (0 ~ 2), 기본 1
      utterance.volume = 1;    // 볼륨 (0 ~ 1)

      // 한국어 목소리 중 여성 음성 우선 선택
  //     const selectedVoice = (
  // voices.find(v => v.name === 'Microsoft Heami - Korean') || // Yuna 우선 선택
  // // voices.find(v => v.name === 'Google 한국어 여성') ||
  // // voices.find(v => v.name.includes('Microsoft')) ||
  // voices.find(v => v.lang === 'ko-KR') ||
  // voices[2]
       const selectedVoice = voices.find(v => v.name === 'Yuna') || voices[0];


// 3) utterance에 세팅
utterance.voice   = selectedVoice;
utterance.lang    = selectedVoice.lang;
utterance.rate    = 1.0;   // 속도 (0.1 ~ 10)
utterance.pitch   = 1.0;   // 피치 (0 ~ 2)
utterance.volume  = 1.0;   // 볼륨 (0 ~ 1)

speechSynthesis.speak(utterance);
    };
    loadVoices();
  };

  // 3) 타이머 카운트다운
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  // 4) 타이머 종료 시 자동 다음 질문
  useEffect(() => {
    if (timeLeft === 0) handleNext();
  }, [timeLeft]);

  // 5) 웹캠 초기화
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(err => console.error('Webcam error:', err));
  }, []);

  const handleVoiceSubmit = transcript => {
    setAnswers(prev => {
      const newAnswers = [...prev, transcript];
      if (step < questions.length - 1) setStep(s => s + 1);
      else {
        addInterview(job, newAnswers);
        alert('면접이 완료되었습니다!');
      }
      return newAnswers;
    });
  };

  // "다음 질문" 버튼 또는 타이머 종료 시 호출
  const handleNext = () => handleVoiceSubmit(buffer || '');

  const percent = ((step + 1) / questions.length) * 100;

  return (
    <div className="interview-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
      {/* Webcam feed */}
      <div className="webcam-container">
        <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
      </div>

      {/* Question banner */}
      <div className="question-banner">{questions[step]}</div>

      {/* Listening indicator */}
      <div className="listening-indicator">
        {listening ? '음성 인식 중...' : '음성 인식 대기 중'}
      </div>
      {/* <div className="subtitle">{subtitle}</div> */}

      {/* Progress info */}
      <h2 style={{
        position: 'absolute',
        bottom: '8rem',
        left: 0,
        right: 0,
        margin: 0,
        textAlign: 'center'
      }}>
        면접 진행 <span style={{ fontWeight: 400, fontSize: '1rem', color: '#888' }}>
          ({step + 1}/{questions.length})
        </span>
      </h2>

      {/* Next button & Timer */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',  
          alignItems: 'center',     
          gap: '0.5rem',
        }}
      >
        <button
          onClick={handleNext}
          style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}
        >
          다음 질문
        </button>
        <div>남은 시간: {timeLeft}s</div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default Interview;
