import React from 'react'
import ReactDOM from 'react-dom/client'

// window.storage에 암호화(Base64) 기능 추가
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: async (key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return { value: null };
        // 외계어로 저장된 값을 다시 원래 글자로 해독(Decode)
        const decrypted = atob(raw); 
        return { value: decrypted };
      } catch (e) {
        return { value: null };
      }
    },
    set: async (key, value) => {
      try {
        // 원래 글자를 알아볼 수 없는 외계어로 암호화(Encode)
        const encrypted = btoa(value); 
        localStorage.setItem(key, encrypted);
      } catch (e) {
        console.error(e);
      }
    }
  };
}

// 바뀐 한글 파일 이름으로 정확하게 연결
import App from '../앙금_암기_게임_수정본.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// 마우스 우클릭 금지
document.addEventListener('contextmenu', (obj) => {
  obj.preventDefault();
});

// F12 및 주요 개발자 도구 단축키 금지
document.addEventListener('keydown', (e) => {
  if (
    e.keyCode === 123 || // F12
    (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
    (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
    (e.ctrlKey && e.keyCode === 85) // Ctrl+U (소스 보기)
  ) {
    e.preventDefault();
    alert('개발자 도구를 사용할 수 없습니다.');
  }
});
