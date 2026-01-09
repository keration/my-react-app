import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  opacitySpeed: number;
  direction: number;
}

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  // 新增：用 ref 保存 drawStars 函数引用，解决循环引用问题
  const drawStarsRef = useRef<() => void>(() => {});

  // 用 useCallback 包裹 initStars，确保函数引用稳定
  const initStars = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: Star[] = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 15000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.1,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.8 + 0.2,
        opacitySpeed: Math.random() * 0.01 + 0.005,
        direction: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, []);

  // 用 useCallback 包裹 drawStars，通过 ref 引用自身
  const drawStars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布（半透明叠加，营造拖影效果）
    ctx.fillStyle = 'rgba(0, 0, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制所有星星
    starsRef.current.forEach((star) => {
      // 更新星星位置
      star.x += Math.cos(star.direction) * star.speed;
      star.y += Math.sin(star.direction) * star.speed;

      // 边界检测，超出画布则重置位置
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      // 更新透明度（闪烁效果）
      star.opacity += star.opacitySpeed * (Math.random() > 0.5 ? 1 : -1);
      if (star.opacity > 1) star.opacity = 1;
      if (star.opacity < 0.1) star.opacity = 0.1;

      // 绘制星星
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });

    // 关键修改：通过 ref 调用自身，避免先访问后声明的问题
    animationRef.current = requestAnimationFrame(drawStarsRef.current);
  }, []);

  // 用 useCallback 包裹 resizeCanvas，确保函数引用稳定
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 适配父容器/窗口大小
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // 重新初始化星星
    initStars(canvas);
  }, [initStars]);

  useEffect(() => {
    // 将 drawStars 赋值给 ref，解决循环引用
    drawStarsRef.current = drawStars;
  }, [drawStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初始化
    resizeCanvas();
    drawStars(); // 启动动画

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);

    // 清理动画和事件
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawStars, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{
        background: '#00001a', // 深空底色
      }}
    />
  );
};

export default StarBackground;
