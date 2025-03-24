import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store"; // ✅ นำเข้า Zustand Store

const RedirectHandler = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useEcomStore(); // ✅ ใช้ setToken และ setUser จาก Zustand

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("✅ Token Received:", token);
      localStorage.setItem("token", token);
      setToken(token); // ✅ อัปเดต Zustand

      // 🔥 ดึงข้อมูลผู้ใช้จาก API หลังจากได้ Token
      fetch("http://localhost:5001/api/current-user/google", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ User Data Received:", data);
          setUser(data); // ✅ อัปเดต Zustand
        })
        .catch((err) => console.error("❌ Fetch User Error:", err));

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        navigate("/");
      } else {
        navigate("/login");
      }
    }
  }, [navigate, setToken, setUser]);

  return (
    <div style={styles.container}>
      <h2>Redirecting...</h2>
      <p>Please wait while we process your login.</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
};

export default RedirectHandler;
