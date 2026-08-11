// src/Pages/NotFound/index.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Fade } from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";

// ========== FuzzyText Component ==========
const FuzzyText = ({
  children,
  fontSize = "clamp(2rem, 10vw, 10rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  fuzzRange = 30,
  fps = 60,
  direction = "horizontal",
  transitionDuration = 0,
  clickEffect = false,
  glitchMode = false,
  glitchInterval = 2000,
  glitchDuration = 200,
  gradient = null,
  letterSpacing = 0,
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let isCancelled = false;
    let glitchTimeoutId;
    let glitchEndTimeoutId;
    let clickTimeoutId;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily;

      const fontSizeStr =
        typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;

      try {
        await document.fonts.load(fontString);
      } catch {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      let numericFontSize;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement("span");
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize);
        document.body.removeChild(temp);
      }

      const text = React.Children.toArray(children).join("");

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";

      let totalWidth = 0;
      if (letterSpacing !== 0) {
        for (const char of text) {
          totalWidth += offCtx.measureText(char).width + letterSpacing;
        }
        totalWidth -= letterSpacing;
      } else {
        totalWidth = offCtx.measureText(text).width;
      }

      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight =
        letterSpacing !== 0
          ? totalWidth
          : (metrics.actualBoundingBoxRight ?? metrics.width);
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent =
        metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(
        letterSpacing !== 0 ? totalWidth : actualLeft + actualRight,
      );
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;

      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;

      const xOffset = extraWidthBuffer / 2;
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";

      if (gradient && Array.isArray(gradient) && gradient.length >= 2) {
        const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0);
        gradient.forEach((c, i) =>
          grad.addColorStop(i / (gradient.length - 1), c),
        );
        offCtx.fillStyle = grad;
      } else {
        offCtx.fillStyle = color;
      }

      if (letterSpacing !== 0) {
        let xPos = xOffset;
        for (const char of text) {
          offCtx.fillText(char, xPos, actualAscent);
          xPos += offCtx.measureText(char).width + letterSpacing;
        }
      } else {
        offCtx.fillText(text, xOffset - actualLeft, actualAscent);
      }

      const horizontalMargin = fuzzRange + 20;
      const verticalMargin = 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      let isHovering = false;
      let isClicking = false;
      let isGlitching = false;
      let currentIntensity = baseIntensity;
      let targetIntensity = baseIntensity;
      let lastFrameTime = 0;
      const frameDuration = 1000 / fps;

      const startGlitchLoop = () => {
        if (!glitchMode || isCancelled) return;
        glitchTimeoutId = setTimeout(() => {
          if (isCancelled) return;
          isGlitching = true;
          glitchEndTimeoutId = setTimeout(() => {
            isGlitching = false;
            startGlitchLoop();
          }, glitchDuration);
        }, glitchInterval);
      };

      if (glitchMode) startGlitchLoop();

      const run = (timestamp) => {
        if (isCancelled) return;

        if (timestamp - lastFrameTime < frameDuration) {
          animationFrameId = window.requestAnimationFrame(run);
          return;
        }
        lastFrameTime = timestamp;

        ctx.clearRect(
          -fuzzRange - 20,
          -fuzzRange - 10,
          offscreenWidth + 2 * (fuzzRange + 20),
          tightHeight + 2 * (fuzzRange + 10),
        );

        if (isClicking) {
          targetIntensity = 1;
        } else if (isGlitching) {
          targetIntensity = 1;
        } else if (isHovering) {
          targetIntensity = hoverIntensity;
        } else {
          targetIntensity = baseIntensity;
        }

        if (transitionDuration > 0) {
          const step = 1 / (transitionDuration / frameDuration);
          if (currentIntensity < targetIntensity) {
            currentIntensity = Math.min(
              currentIntensity + step,
              targetIntensity,
            );
          } else if (currentIntensity > targetIntensity) {
            currentIntensity = Math.max(
              currentIntensity - step,
              targetIntensity,
            );
          }
        } else {
          currentIntensity = targetIntensity;
        }

        if (direction === "horizontal") {
          for (let j = 0; j < tightHeight; j++) {
            const dx = Math.floor(
              currentIntensity * (Math.random() - 0.5) * fuzzRange,
            );
            ctx.drawImage(
              offscreen,
              0,
              j,
              offscreenWidth,
              1,
              dx,
              j,
              offscreenWidth,
              1,
            );
          }
        } else if (direction === "vertical") {
          for (let i = 0; i < offscreenWidth; i++) {
            const dy = Math.floor(
              currentIntensity * (Math.random() - 0.5) * fuzzRange,
            );
            ctx.drawImage(
              offscreen,
              i,
              0,
              1,
              tightHeight,
              i,
              dy,
              1,
              tightHeight,
            );
          }
        } else {
          for (let j = 0; j < tightHeight; j++) {
            const dx = Math.floor(
              currentIntensity * (Math.random() - 0.5) * fuzzRange,
            );
            ctx.drawImage(
              offscreen,
              0,
              j,
              offscreenWidth,
              1,
              dx,
              j,
              offscreenWidth,
              1,
            );
          }
          const tempData = ctx.getImageData(
            0,
            0,
            offscreenWidth + fuzzRange,
            tightHeight + fuzzRange,
          );
          ctx.clearRect(
            -fuzzRange - 20,
            -fuzzRange - 10,
            offscreenWidth + 2 * (fuzzRange + 20),
            tightHeight + 2 * (fuzzRange + 10),
          );
          ctx.putImageData(tempData, 0, 0);
          for (let i = 0; i < offscreenWidth + fuzzRange; i++) {
            const dy = Math.floor(
              currentIntensity * (Math.random() - 0.5) * fuzzRange * 0.5,
            );
            const colData = ctx.getImageData(i, 0, 1, tightHeight + fuzzRange);
            ctx.clearRect(i, -fuzzRange, 1, tightHeight + 2 * fuzzRange);
            ctx.putImageData(colData, i, dy);
          }
        }
        animationFrameId = window.requestAnimationFrame(run);
      };

      animationFrameId = window.requestAnimationFrame(run);

      const isInsideTextArea = (x, y) => {
        return (
          x >= interactiveLeft &&
          x <= interactiveRight &&
          y >= interactiveTop &&
          y <= interactiveBottom
        );
      };

      const handleMouseMove = (e) => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleMouseLeave = () => {
        isHovering = false;
      };

      const handleClick = () => {
        if (!clickEffect) return;
        isClicking = true;
        clearTimeout(clickTimeoutId);
        clickTimeoutId = setTimeout(() => {
          isClicking = false;
        }, 150);
      };

      const handleTouchMove = (e) => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleTouchEnd = () => {
        isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        canvas.addEventListener("touchend", handleTouchEnd);
      }

      if (clickEffect) {
        canvas.addEventListener("click", handleClick);
      }

      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
        clearTimeout(glitchTimeoutId);
        clearTimeout(glitchEndTimeoutId);
        clearTimeout(clickTimeoutId);
        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
        }
        if (clickEffect) {
          canvas.removeEventListener("click", handleClick);
        }
      };

      canvas.cleanupFuzzyText = cleanup;
    };

    init();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      clearTimeout(glitchTimeoutId);
      clearTimeout(glitchEndTimeoutId);
      clearTimeout(clickTimeoutId);
      if (canvas && canvas.cleanupFuzzyText) {
        canvas.cleanupFuzzyText();
      }
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
    fuzzRange,
    fps,
    direction,
    transitionDuration,
    clickEffect,
    glitchMode,
    glitchInterval,
    glitchDuration,
    gradient,
    letterSpacing,
  ]);

  return <canvas ref={canvasRef} className={className} />;
};

// ========== NotFound Page ==========
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0a0a0a",
        p: 2,
        direction: "rtl",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,140,0,0.05) 0%, transparent 70%)",
          top: "-200px",
          right: "-200px",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,140,0,0.03) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-100px",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: "center" }}>
            {/* 404 با افکت Fuzzy - نارنجی */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1,
                "& canvas": {
                  maxWidth: "100%",
                  height: "auto !important",
                },
              }}
            >
              <FuzzyText
                fontSize="clamp(6rem, 20vw, 15rem)"
                fontWeight={900}
                color="#FF8C00"
                enableHover={true}
                baseIntensity={0.15}
                hoverIntensity={0.6}
                fuzzRange={40}
                direction="horizontal"
                glitchMode={true}
                glitchInterval={1000}
                glitchDuration={150}
                gradient={["#FF6F00", "#FF8C00", "#FFA000"]}
              >
                404
              </FuzzyText>
            </Box>

            {/* متن Not Found با افکت Fuzzy - سفید */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
                "& canvas": {
                  maxWidth: "100%",
                  height: "auto !important",
                },
              }}
            >
              <FuzzyText
                fontSize="clamp(1.2rem, 3vw, 2.5rem)"
                fontWeight={700}
                color="#FF8C00"
                enableHover={true}
                baseIntensity={0.1}
                hoverIntensity={0.4}
                fuzzRange={40}
                direction="horizontal"
                glitchMode={true}
                glitchInterval={1000}
                glitchDuration={150}
                letterSpacing={2}
              >
                Not Found
              </FuzzyText>
            </Box>

            {/* توضیحات */}
            <Box
              sx={{
                animation: "fadeInUp 0.8s ease-out 0.4s both",
                "@keyframes fadeInUp": {
                  "0%": { transform: "translateY(20px)", opacity: 0 },
                  "100%": { transform: "translateY(0)", opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  //   color: "rgba(255,255,255,0.4)",
                  color: "#FF8C00",
                  mb: 4,
                  maxWidth: 500,
                  mx: "auto",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                }}
              >
                ممکن است آدرس اشتباه باشد یا صفحه حذف شده باشد.
                <br />
                لطفاً به صفحه اصلی بازگردید.
              </Box>
            </Box>

            {/* دکمه‌ها */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
                animation: "fadeInUp 0.8s ease-out 0.6s both",
                "@keyframes fadeInUp": {
                  "0%": { transform: "translateY(20px)", opacity: 0 },
                  "100%": { transform: "translateY(0)", opacity: 1 },
                },
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                endIcon={<Home />}
                sx={{
                  gap: 1,
                  height: 48,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 700,
                  bgcolor: "#FF8C00",
                  color: "#fff",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#FF6F00",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 20px rgba(255,140,0,0.3)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                صفحه اصلی
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                endIcon={<ArrowBack />}
                sx={{
                  gap: 1,
                  height: 48,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  borderColor: "rgba(255,255,255,0.15)",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#FF8C00",
                    bgcolor: "rgba(255,140,0,0.05)",
                    color: "#fff",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                بازگشت
              </Button>
            </Box>

            {/* شماره خطا */}
            <Box
              sx={{
                mt: 4,
                color: "rgba(255,255,255,0.06)",
                fontSize: "0.75rem",
                animation: "fadeInUp 0.8s ease-out 0.8s both",
                "@keyframes fadeInUp": {
                  "0%": { transform: "translateY(20px)", opacity: 0 },
                  "100%": { transform: "translateY(0)", opacity: 1 },
                },
              }}
            >
              خطای ۴۰۴ • صفحه یافت نشد
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
