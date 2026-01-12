import { useEffect, useRef, useCallback } from 'react';

const CyberGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const stateRef = useRef({
    scrollSpeed: 0.3,
    type: 'horizontal' as 'horizontal' | 'vertical',
    baseTime: performance.now(),
    hasCompletedFullCycle: false,
    glowIntensity: 1,
    gridPulseSpeed: 0.001,
  });

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = stateRef.current;

    // 渐变背景
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#05051a');
    bgGradient.addColorStop(0.5, '#080825');
    bgGradient.addColorStop(1, '#05051a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 核心参数
    const gridSize = 30;
    const originThreshold = 3;
    // 扫描线保持柔和（不变）
    const horizontalColor = {
      main: 'rgba(255, 100, 200, 0.7)',
      glow: 'rgba(255, 100, 200, 0.15)',
    };
    const verticalColor = {
      main: 'rgba(100, 200, 255, 0.7)',
      glow: 'rgba(100, 200, 255, 0.15)',
    };

    // ------------ 核心周期逻辑（完全保留） ------------
    const currentTime = performance.now();
    const elapsedTime = currentTime - state.baseTime;
    const pixelOffset = elapsedTime * state.scrollSpeed;

    let totalDistance = 0;
    let currentPosition = 0;
    let isAtOrigin = false;
    let isFullDistanceReached = false;

    if (state.type === 'horizontal') {
      totalDistance = canvas.height * 2;
      currentPosition = Math.abs((pixelOffset % totalDistance) - canvas.height);
      isAtOrigin = currentPosition < originThreshold;
      isFullDistanceReached = pixelOffset >= totalDistance;
    } else {
      totalDistance = canvas.width * 2;
      currentPosition = Math.abs((pixelOffset % totalDistance) - canvas.width);
      isAtOrigin = currentPosition < originThreshold;
      isFullDistanceReached = pixelOffset >= totalDistance;
    }

    if (isFullDistanceReached && !state.hasCompletedFullCycle) {
      state.hasCompletedFullCycle = true;
    }

    if (state.hasCompletedFullCycle && isAtOrigin) {
      state.type = state.type === 'horizontal' ? 'vertical' : 'horizontal';
      state.baseTime = currentTime;
      state.hasCompletedFullCycle = false;
    }

    // ------------ 关键调整：网格提亮度+保可见度+多彩 ------------
    // 优化多彩色值：提高基础明度，更易见但仍暗调
    const coolColors = [
      // 冷色系（纵向网格：蓝/青/紫，明度提升）
      'rgba(100, 200, 255, ',
      'rgba(140, 120, 255, ',
      'rgba(120, 220, 220, ',
      'rgba(80, 170, 240, ',
    ];
    const warmColors = [
      // 暖色系（横向网格：粉/玫/紫粉，明度提升）
      'rgba(255, 100, 200, ',
      'rgba(230, 120, 255, ',
      'rgba(255, 140, 220, ',
      'rgba(220, 100, 240, ',
    ];
    const influenceRange = 80;
    state.glowIntensity = Math.sin(currentTime * 0.002) * 0.5 + 1;
    // 🔴 网格核心提亮度：基础透明度0.06→0.12，脉冲幅度0.04→0.06（肉眼清晰可见）
    const gridBaseAlpha = 0.25 + Math.sin(currentTime * state.gridPulseSpeed) * 0.1;
    ctx.lineWidth = 0.6; // 网格线0.5→0.6，轻微加粗提升可见度

    // 绘制横向暖色系多彩网格
    for (let y = 0; y < canvas.height; y += gridSize) {
      const colorIdx = Math.floor(y / gridSize) % warmColors.length;
      let alpha = gridBaseAlpha;
      // 提亮幅度0.15→0.2，扫描线附近网格更明显，互动感强
      if (state.type === 'vertical') {
        const distance = Math.abs(y - currentPosition);
        if (distance < influenceRange) {
          alpha = gridBaseAlpha + (1 - distance / influenceRange) * 0.2 * state.glowIntensity;
        }
      }
      ctx.strokeStyle = warmColors[colorIdx] + `${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    // 绘制纵向冷色系多彩网格
    for (let x = 0; x < canvas.width; x += gridSize) {
      const colorIdx = Math.floor(x / gridSize) % coolColors.length;
      let alpha = gridBaseAlpha;
      if (state.type === 'horizontal') {
        const distance = Math.abs(x - currentPosition);
        if (distance < influenceRange) {
          alpha = gridBaseAlpha + (1 - distance / influenceRange) * 0.2 * state.glowIntensity;
        }
      }
      ctx.strokeStyle = coolColors[colorIdx] + `${alpha})`;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // ------------ 扫描线：保持之前的柔和设置（不改动） ------------
    const currentColor = state.type === 'horizontal' ? horizontalColor : verticalColor;
    const trailCount = 3;
    const trailAlphaStep = 0.08;
    for (let i = 0; i < trailCount; i++) {
      const trailAlpha = (trailCount - i) * trailAlphaStep * state.glowIntensity;
      const trailOffset = i * 2;
      ctx.lineWidth = 1 + i * 0.5;

      if (state.type === 'horizontal') {
        const trailY = currentPosition - trailOffset;
        if (trailY > 0) {
          ctx.strokeStyle = `rgba(${currentColor.main.slice(5, -4)}, ${trailAlpha})`;
          ctx.beginPath();
          ctx.moveTo(0, trailY);
          ctx.lineTo(canvas.width, trailY);
          ctx.stroke();
        }
      } else {
        const trailX = currentPosition - trailOffset;
        if (trailX > 0) {
          ctx.strokeStyle = `rgba(${currentColor.main.slice(5, -4)}, ${trailAlpha})`;
          ctx.beginPath();
          ctx.moveTo(trailX, 0);
          ctx.lineTo(trailX, canvas.height);
          ctx.stroke();
        }
      }
    }

    // 主扫描线柔和设置不变
    ctx.shadowBlur = 8 * state.glowIntensity;
    ctx.shadowColor = currentColor.glow;
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = currentColor.main;

    if (state.type === 'horizontal') {
      ctx.beginPath();
      ctx.moveTo(0, currentPosition);
      ctx.lineTo(canvas.width, currentPosition);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(currentPosition, 0);
      ctx.lineTo(currentPosition, canvas.height);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // ------------ 角落光效：轻微提亮，和网格匹配 ------------
    const cornerPulse = Math.sin(currentTime * 0.0015) * 20 + 100;
    const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, cornerPulse);
    gradient1.addColorStop(0, 'rgba(255, 100, 200, 0.35)');
    gradient1.addColorStop(0.7, 'rgba(255, 100, 200, 0.15)');
    gradient1.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, cornerPulse, cornerPulse);

    const gradient2 = ctx.createRadialGradient(
      canvas.width,
      canvas.height,
      0,
      canvas.width,
      canvas.height,
      cornerPulse
    );
    gradient2.addColorStop(0, 'rgba(100, 200, 255, 0.35)');
    gradient2.addColorStop(0.7, 'rgba(100, 200, 255, 0.15)');
    gradient2.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient2;
    ctx.fillRect(canvas.width - cornerPulse, canvas.height - cornerPulse, cornerPulse, cornerPulse);

    animationRef.current = requestAnimationFrame(drawGrid);
  }, []);

  // 窗口适配（保留）
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent ? parent.clientWidth : window.innerWidth;
    canvas.height = parent ? parent.clientHeight : window.innerHeight;
    const state = stateRef.current;
    state.baseTime = performance.now();
    state.hasCompletedFullCycle = false;
  }, []);

  // 生命周期（全局滤镜轻微提亮，配合网格可见度）
  useEffect(() => {
    resizeCanvas();
    animationRef.current = requestAnimationFrame(drawGrid);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawGrid, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{
        background: '#05051a',
        filter: 'brightness(1.05) contrast(1.15)', // 轻微提亮亮/对比，网格更清晰
      }}
    />
  );
};

export default CyberGridBackground;
