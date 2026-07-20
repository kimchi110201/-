import React from 'react'
import ReactDOM from 'react-dom/client'


if (typeof window !== "undefined" && !window.storage) {
  const SECRET_SALT = "kimchi_super_secret_password_5678"; 

  window.storage = {
    get: async (key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return { value: null };

      try {
        
        const decodedRaw = atob(raw);
        const data = JSON.parse(decodedRaw);
       
        if (data.points !== undefined && data.check) {
          const expectedCheck = btoa(data.points + SECRET_SALT);
          if (data.check !== expectedCheck) {
            alert("⚠️ 데이터 변조 감지! 초기화합니다.");
            localStorage.clear();
            return { value: null };
          }
        }
        return { value: JSON.stringify(data.profileData) };
      } catch (e) {
        
        localStorage.clear();
        return { value: null };
      }
    },
    set: async (key, value) => {
      try {
        const profileData = JSON.parse(value);
        const points = profileData.points || 0;
        const check = btoa(points + SECRET_SALT); 

        const saveObject = {
          profileData: profileData,
          points: points,
          check: check
        };

        
        const encryptedRaw = btoa(JSON.stringify(saveObject));
        localStorage.setItem(key, encryptedRaw);
      } catch (e) {
        console.error(e);
      }
    }
  };
}
