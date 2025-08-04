import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterviewApi } from '../api/auth';
import './SelectJob.css';

const JOBS = [
  { id: 'developer', name: '개발자' },
  { id: 'designer', name: '디자이너' },
  { id: 'marketer', name: '마케터' },
  { id: 'planner', name: '기획자' },
  { id: 'etc', name: '기타' }
];

function SelectJob() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!selected) return;
    
    setLoading(true);
    
    try {
      const result = await startInterviewApi(selected);
      
      console.log('API 결과:', result); // 디버깅용
      
      if (result.success) {
        console.log('질문 목록:', result.data.questionList); // 디버깅용
        
        // API에서 받은 질문 목록과 함께 면접 페이지로 이동
        navigate('/interview', { 
          state: { 
            job: selected,
            questions: result.data.questionList
          } 
        });
      } else {
        console.warn('API 실패, 기본 질문으로 진행:', result.message);
        // API 실패 시 기본 질문으로 진행
        navigate('/interview', { 
          state: { 
            job: selected
          } 
        });
      }
    } catch (error) {
      console.error('면접 시작 오류:', error);
      console.warn('API 오류로 기본 질문으로 진행');
      
      // API 오류 시에도 기본 질문으로 면접 진행
      navigate('/interview', { 
        state: { 
          job: selected
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="select-job-container">
      <h2>어떤 분야/직업의 면접을 진행할까요?</h2>
      <ul className="job-list">
        {JOBS.map(job => (
          <li key={job.id}>
            <label>
              <input
                type="radio"
                name="job"
                value={job.id}
                checked={selected === job.id}
                onChange={() => setSelected(job.id)}
              />
              {job.name}
            </label>
          </li>
        ))}
      </ul>
      <button
        className="start-btn"
        disabled={!selected || loading}
        onClick={handleStart}
      >
        {loading ? '질문을 불러오는 중...' : '인터뷰 시작'}
      </button>
    </div>
  );
}

export default SelectJob;
