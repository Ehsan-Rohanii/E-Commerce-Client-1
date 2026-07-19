import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1); // 1: phone, 2: code
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (result.ok) {
        setStep(2);
      } else {
        const data = await result.json();
        setError(data.message || "خطا در ارسال کد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "کد تأیید نامعتبر است");
      }

      localStorage.setItem("token", result.token);
      navigate("/layout");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        direction: "rtl",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(20, 20, 20, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            "&:hover": {
              boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 1)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight={700}
            gutterBottom
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
              mb: 1,
            }}
          >
            {step === 1 ? "ثبت‌نام" : "تأیید کد"}
          </Typography>

          <Typography
            textAlign="center"
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              mb: 4,
              fontSize: "0.95rem",
            }}
          >
            {step === 1
              ? "برای ادامه، شماره موبایل خود را وارد کنید"
              : `کد تأیید به شماره ${phoneNumber} ارسال شد`}
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(211, 47, 47, 0.15)",
                color: "#ff6b6b",
                "& .MuiAlert-icon": {
                  color: "#ff6b6b",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {step === 1 ? (
            <Box
              component="form"
              onSubmit={handleSendCode}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    mb: 1.5,
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  شماره موبایل
                </Typography>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  required
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "2px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow =
                      "0 0 0 4px rgba(255, 255, 255, 0.05)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{
                  height: 56,
                  borderRadius: 3,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)",
                  color: "#0a0a0a",
                  transition: "all 0.3s ease",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 30px rgba(255, 255, 255, 0.2)",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={28} sx={{ color: "#0a0a0a" }} />
                ) : (
                  "ارسال کد تأیید"
                )}
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleVerifyCode}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    mb: 1.5,
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  کد تأیید
                </Typography>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="کد ۶ رقمی را وارد کنید"
                  required
                  maxLength={6}
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "2px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "1.2rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    textAlign: "center",
                    direction: "ltr",
                    letterSpacing: "8px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow =
                      "0 0 0 4px rgba(255, 255, 255, 0.05)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{
                  height: 56,
                  borderRadius: 3,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)",
                  color: "#0a0a0a",
                  transition: "all 0.3s ease",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 30px rgba(255, 255, 255, 0.2)",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={28} sx={{ color: "#0a0a0a" }} />
                ) : (
                  "تأیید کد"
                )}
              </Button>

              <Button
                variant="text"
                onClick={() => setStep(1)}
                sx={{
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "0.9rem",
                  textTransform: "none",
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.7)",
                    backgroundColor: "transparent",
                  },
                }}
              >
                تغییر شماره موبایل
              </Button>
            </Box>
          )}

          {/* ===== دکمه انتقال به صفحه لاگین ===== */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.3)",
                display: "inline-block",
                ml: 1,
              }}
            >
              حساب کاربری دارید؟
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.95rem",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "transparent",
                  transform: "scale(1.02)",
                },
                transition: "all 0.3s ease",
              }}
            >
              وارد شوید
            </Button>
          </Box>

          <Typography
            textAlign="center"
            variant="caption"
            sx={{
              display: "block",
              mt: 2,
              color: "rgba(255, 255, 255, 0.15)",
              fontSize: "0.7rem",
            }}
          >
            {step === 1
              ? "با ثبت‌نام، شرایط و قوانین را می‌پذیرید"
              : "کد تأیید به شماره موبایل شما ارسال شد"}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}