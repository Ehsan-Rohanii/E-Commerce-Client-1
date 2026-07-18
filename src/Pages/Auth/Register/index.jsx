import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";

export default function Register() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });
      console.log(result);
    } catch (err) {
      console.log(err);
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
        direction: "rtl", // راست‌چین کلی
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(10, 10, 10, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.15)",
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
              mb: 2,
            }}
          >
            ثبت‌نام
          </Typography>

          <Typography
            textAlign="center"
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              mb: 4,
              fontSize: "0.95rem",
            }}
          >
            برای ادامه، شماره موبایل خود را وارد کنید
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* اینپوت عادی (بدون MUI TextField) */}
            <Box>
              <Typography
                component="label"
                sx={{
                  display: "block",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                شماره موبایل
              </Typography>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                required
                dir="ltr"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                height: 52,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)",
                color: "#0a0a0a",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 30px -10px rgba(255, 255, 255, 0.3)",
                  background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={26} sx={{ color: "#0a0a0a" }} />
              ) : (
                "ارسال کد تأیید"
              )}
            </Button>
          </Box>

          <Typography
            textAlign="center"
            variant="caption"
            sx={{
              display: "block",
              mt: 3,
              color: "rgba(255, 255, 255, 0.25)",
              fontSize: "0.75rem",
            }}
          >
            با ثبت‌نام، شرایط و قوانین را می‌پذیرید
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}