import React from 'react'
import ReactDOM from 'react-dom/client'

// ==========================================
// 🔤 한글(Unicode)을 안전하게 지원하는 암호화 함수
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
    return null; // 올바르지 않은 암호화 형식이면 null 반환
  }
};

// ==========================================
// [보안 트릭] 데이터 무결성 체크 (위조 방지 + 한글 패치 완료)
// ==========================================
if (typeof window !== "undefined" && !window.storage) {
  const SECRET_SALT = "kimchi_super_secret_password_5678"; 

  window.storage = {
    get: async (key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return { value: null };

      try {
        // 한글 안전 디코딩 적용
        const decodedRaw = decodeBase64(raw);
        
        // 만약 옛날 데이터가 남아있어 디코딩에 실패했다면 안전하게 리셋
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
        // 예기치 못한 에러 발생 시 앱이 죽지 않도록 방어하고 데이터 초기화
        localStorage.removeItem(key);
        return { value: null };
      }
    },
    set: async (key, value) => {
      try {
        const profileData = JSON.parse(value);
        const points = profileData.points || 0;
        
        // 한글 안전 인코딩으로 도장 생성
        const check = encodeBase64(points + SECRET_SALT); 

        const saveObject = {
          profileData: profileData,
          points: points,
          check: check
        };

        // 데이터 전체를 한글 안전 인코딩으로 감싸기
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
