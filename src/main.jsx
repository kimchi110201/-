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

// 루트에 있는 원래 앙금 게임 코드 불러오기
import App from '../precipitate-memory-lab.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
