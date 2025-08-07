import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Interview.css';

const QUESTIONS = {
  developer: [
    '자기소개를 해주세요.',
    '최근에 사용한 기술 스택은 무엇인가요?',
    '문제 해결 경험을 말해주세요.'
  ],
};

const TIME_LIMIT = 120; // 초

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job || 'developer';
  const { addInterview } = useContext(UserContext);

  const [cameraMode, setCameraMode] = useState('select');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [listening, setListening] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [buffer, setBuffer] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 1. TTS 재생 상태를 추적하기 위한 상태 추가
  const [isSpeaking, setIsSpeaking] = useState(false); 

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const apiQuestions = location.state?.questions;
  const questions = (apiQuestions && Array.isArray(apiQuestions)) ? 
    apiQuestions.map(q => q.question) : 
    QUESTIONS[job];
    
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

  useEffect(() => {
    if (cameraMode === 'select' || isAnalyzing) return;
    
    setSubtitle('');
    setBuffer('');
    setTimeLeft(TIME_LIMIT);
    recognitionRef.current?.abort();
    speakQuestion();
  }, [step, isAnalyzing, cameraMode]);

  // 2. TTS 재생 상태를 제어하도록 speakQuestion 함수 수정
  const speakQuestion = () => {
    if (!('speechSynthesis' in window) || !questions[step]) return;

    speechSynthesis.cancel();
    setIsSpeaking(true); // TTS 시작 시 상태를 true로 설정

    const utterance = new SpeechSynthesisUtterance(questions[step]);
    utterance.lang = 'ko-KR';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => {
        setIsSpeaking(false); // TTS 종료 시 상태를 false로 설정
        try { recognitionRef.current.start(); }
        catch (e) { console.warn("음성 인식 시작 오류:", e); }
    };

    const setVoiceAndSpeak = () => {
        const voices = speechSynthesis.getVoices();
        const koreanVoice = voices.find(v => v.name === 'Yuna' && v.lang?.startsWith('ko'))
                       || voices.find(v => v.lang === 'ko-KR');
        
        if (koreanVoice) {
            utterance.voice = koreanVoice;
        }
        
        speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
    } else {
        speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    }
  };

  useEffect(() => {
    if (cameraMode === 'select' || isAnalyzing || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, isAnalyzing, cameraMode]);

  useEffect(() => {
    if (cameraMode === 'select') return;
    if (timeLeft === 0) handleNext();
  }, [timeLeft, cameraMode]);

  useEffect(() => {
    if (cameraMode === 'user') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => videoRef.current && (videoRef.current.srcObject = s))
        .catch(e => console.error('Webcam error:', e));
    }
  }, [cameraMode]);

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

  const handleNext = () => {
    recognitionRef.current?.stop();
    if (!buffer.trim()) {
      alert('답변이 인식되지 않았습니다.');
      handleVoiceSubmit('None');
    } else {
      handleVoiceSubmit(buffer);
    }
  };

  useEffect(() => {
    if (!isAnalyzing) return;
    const id = setTimeout(() => {
      navigate('/result', { replace: true });
    }, 3000);
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

  if (cameraMode === 'select') {
    return (
      <div className="interview-container selection-mode">
        <div className="camera-select-card">
          <h2>면접 화면 설정</h2>
          <p>면접 중 보여질 화면을 선택해주세요.</p>
          <div className="camera-select-buttons">
            <button onClick={() => setCameraMode('user')}>내 얼굴 보기 (웹캠)</button>
            <button onClick={() => setCameraMode('character')}>캐릭터 보기</button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="interview-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>질문을 불러올 수 없습니다</h2>
          <p>다시 시도해주세요.</p>
          <button onClick={() => navigate('/select-job')}>
            직무 선택으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  const percent = ((step + 1) / questions.length) * 100;
  return (
    <div className="interview-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
      <div className="webcam-container">
        {cameraMode === 'user' ? (
          <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
        ) : (
          // 3. isSpeaking 상태에 따라 다른 이미지 소스를 전달
          <img 
            src={isSpeaking ? "/talking.png" : "/normal.png"} 
            alt="Character" 
            className="character-image" 
          />
        )}
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