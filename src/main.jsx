import React from 'react'
import ReactDOM from 'react-dom/client'

// ==========================================
// [보안 트릭 1] 마우스 우클릭 및 단축키 차단 (윈도우 + 맥 모두 대응)
// ==========================================

// 1. 마우스 오른쪽 클릭 금지
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// 2. 개발자 도구 주요 단축키 금지
document.addEventListener('keydown', (e) => {
  // 윈도우용 단축키 체크 (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
  const isWindowsDevTools = 
    e.keyCode === 123 || 
    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
    (e.ctrlKey && e.keyCode === 85);

  // 맥용 단축키 체크 (Fn+F12, Cmd+Opt+I, Cmd+Opt+J, Cmd+Opt+U)
  const isMacDevTools = 
    (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 85));

  if (isWindowsDevTools || isMacDevTools) {
    e.preventDefault();
    alert('🔒 보안을 위해 개발자 도구 단축키 이용이 제한됩니다. 정당하게 승부하세요!');
  }
});

// ==========================================
// [보안 트릭 2] 데이터 무결성 체크 (위조 방지 + 한글 패치 완료)
// ==========================================
const encodeBase64 = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
};

const decodeBase64 = (str) => {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return null;
  }
};

if (typeof window !== "undefined" && !window.storage) {
  const SECRET_SALT = "kimchi_super_secret_password_5678"; 

  window.storage = {
    get: async (key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return { value: null };

      try {
        const decodedRaw = decodeBase64(raw);
        if (!decodedRaw) {
          localStorage.removeItem(key);
          return { value: null };
        }

        const data = JSON.parse(decodedRaw);
        
        if (data.points !== undefined && data.check) {
          const expectedCheck = encodeBase64(data.points + SECRET_SALT);
          
          if (data.check !== expectedCheck) {
            alert("⚠️ [보안 경고] 비정상적인 데이터 변조가 감지되었습니다. 진행 상황이 초기화됩니다.");
            localStorage.removeItem(key);
            return { value: null };
          }
        }
        return { value: JSON.stringify(data.profileData) };
      } catch (e) {
        localStorage.removeItem(key);
        return { value: null };
      }
    },
    set: async (key, value) => {
      try {
        const profileData = JSON.parse(value);
        const points = profileData.points || 0;
        const check = encodeBase64(points + SECRET_SALT); 

        const saveObject = {
          profileData: profileData,
          points: points,
          check: check
        };

        const encryptedRaw = encodeBase64(JSON.stringify(saveObject));
        localStorage.setItem(key, encryptedRaw);
      } catch (e) {
        console.error("보안 저장 중 오류 발생:", e);
      }
    }
  };
}

// ==========================================
// 원래 앙금 게임 코드 연결 및 실행
// ==========================================
import App from '../앙금_암기_게임_수정본.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
