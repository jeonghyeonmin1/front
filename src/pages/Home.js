import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>AI 기반 LLM 면접 서비스</h1>
        <p>실제 면접처럼, 다양한 분야의 질문을 AI가 제공합니다.<br />
        준비된 인터뷰로 실력을 점검해보세요!</p>
        <Link to="/select-job">
          <button className="main-btn">면접 시작하기</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
