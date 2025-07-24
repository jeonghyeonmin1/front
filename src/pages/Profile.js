import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

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
      <div style={{marginTop: '2.5rem', textAlign: 'left'}}>
        <h3 style={{fontSize:'1.1rem', color:'#6366f1'}}>내 인터뷰 내역</h3>
        {interviews.length === 0 ? (
          <div style={{color:'#888', marginTop:'1rem'}}>아직 인터뷰 내역이 없습니다.</div>
        ) : (
          <ul style={{marginTop:'1rem', paddingLeft:0}}>
            {interviews.map((iv, idx) => (
              <li key={idx} style={{marginBottom:'1.2rem', background:'#f1f3f6', borderRadius:'1rem', padding:'1rem'}}>
                <div><strong>분야:</strong> {iv.job}</div>
                <div><strong>날짜:</strong> {iv.date}</div>
                <div><strong>답변:</strong>
                  <ul style={{marginTop:'0.5rem', paddingLeft:'1.2rem'}}>
                    {iv.answers.map((ans, i) => (
                      <li key={i}>{ans}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
