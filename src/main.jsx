import React from 'react'
import ReactDOM from 'react-dom/client'

// window.storage 에러 방지를 위한 모킹 코드
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: async (key) => {
      const val = localStorage.getItem(key);
      return { value: val };
    },
    set: async (key, value) => {
      localStorage.setItem(key, value);
    }
  };
}

// 💡 바뀐 한글 파일 이름으로 정확하게 연결해줍니다!
import App from '../앙금_암기_게임_수정본.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
