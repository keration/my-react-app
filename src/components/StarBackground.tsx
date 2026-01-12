import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  opacitySpeed: number;
  direction: number;
  layer: 'near' | 'middle' | 'far';
  flickerFrequency: number;
}

const STAR_CONFIG = {
  starCountRange: { min: 80, max: 300 },
  layerConfig: {
    near: {
      radius: { min: 1, max: 1.8 },
      speed: { min: 0.05, max: 0.1 }, // 🔴 近层速度降低（原0.3-0.6→0.2-0.4）
      opacity: { min: 0.7, max: 1 },
      color: 'rgba(255, 255, 255, {opacity})',
    },
    middle: {
      radius: { min: 0.5, max: 1 },
      speed: { min: 0.05, max: 0.1 }, // 🔴 中层速度降低（原0.15-0.3→0.1-0.2）
      opacity: { min: 0.4, max: 0.7 },
      color: 'rgba(220, 230, 255, {opacity})',
    },
    far: {
      radius: { min: 0.1, max: 0.5 },
      speed: { min: 0.03, max: 0.1 }, // 🔴 远层速度降低（原0.05-0.15→0.03-0.1）
      opacity: { min: 0.1, max: 0.4 },
      color: 'rgba(180, 200, 255, {opacity})',
    },
  },
  flicker: {
    baseSpeed: 0.008,
    frequencyRange: { min: 0.02, max: 0.08 },
  },
  meteor: {
    chance: 0.0003,
    maxCount: 1,
    speed: 6,
    length: 60,
    lifetime: 100,
  },
  canvas: {
    bgColor: '#00001a',
    clearAlpha: 0.2, // 🔴 清空透明度调大（原0.08→0.2），拖影快速消失
    clearColor: 'rgba(0, 0, 26, {alpha})', // 🔴 清空颜色和背景一致（#00001a=rgb(0,0,26)）
  },
  resizeDebounce: 200,
};

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Array<{ x: number; y: number; angle: number; life: number }>>([]);
  const drawStarsRef = useRef<() => void>(() => {});
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initStars = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: Star[] = [];
    const baseCount = Math.floor((canvas.width * canvas.height) / 15000);
    const starCount = Math.min(
      STAR_CONFIG.starCountRange.max,
      Math.max(STAR_CONFIG.starCountRange.min, baseCount)
    );

    const nearCount = Math.floor((starCount * 1) / 6);
    const middleCount = Math.floor((starCount * 2) / 6);
    const farCount = starCount - nearCount - middleCount;

    for (let i = 0; i < nearCount; i++) {
      stars.push(createStar(canvas, 'near'));
    }
    for (let i = 0; i < middleCount; i++) {
      stars.push(createStar(canvas, 'middle'));
    }
    for (let i = 0; i < farCount; i++) {
      stars.push(createStar(canvas, 'far'));
    }

    starsRef.current = stars;
    meteorsRef.current = [];
  }, []);

  const createStar = (canvas: HTMLCanvasElement, layer: 'near' | 'middle' | 'far'): Star => {
    const config = STAR_CONFIG.layerConfig[layer];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * (config.radius.max - config.radius.min) + config.radius.min,
      speed: Math.random() * (config.speed.max - config.speed.min) + config.speed.min,
      opacity: Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min,
      opacitySpeed:
        Math.random() * STAR_CONFIG.flicker.baseSpeed + STAR_CONFIG.flicker.baseSpeed / 2,
      direction: Math.random() * Math.PI * 2,
      layer,
      flickerFrequency:
        Math.random() *
          (STAR_CONFIG.flicker.frequencyRange.max - STAR_CONFIG.flicker.frequencyRange.min) +
        STAR_CONFIG.flicker.frequencyRange.min,
    };
  };

  const drawStars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = `rgba(0, 0, 15, ${STAR_CONFIG.canvas.clearAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制星星（占90%+视觉占比，核心不变）
    const stars = starsRef.current;
    const starLen = stars.length;
    for (let i = 0; i < starLen; i++) {
      const star = stars[i];
      const layerConfig = STAR_CONFIG.layerConfig[star.layer];

      star.x += Math.cos(star.direction) * star.speed;
      star.y += Math.sin(star.direction) * star.speed;

      if (star.x < -star.radius) star.x = canvas.width + star.radius;
      if (star.x > canvas.width + star.radius) star.x = -star.radius;
      if (star.y < -star.radius) star.y = canvas.height + star.radius;
      if (star.y > canvas.height + star.radius) star.y = -star.radius;

      const flicker = Math.sin(Date.now() * star.flickerFrequency) * star.opacitySpeed;
      star.opacity += flicker;
      star.opacity = Math.max(
        layerConfig.opacity.min,
        Math.min(layerConfig.opacity.max, star.opacity)
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      const fillColor = layerConfig.color.replace('{opacity}', star.opacity.toString());
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = layerConfig.color.replace('{opacity}', (star.opacity * 0.2).toString());
      ctx.fill();
      ctx.restore();
    }

    // 🔴 核心修改：流星生成添加【数量限制】，配合低概率，仅作点缀
    const meteors = meteorsRef.current;
    // 生成流星：先判断「概率」+「当前数量是否小于最大值」，双重限制
    if (Math.random() < STAR_CONFIG.meteor.chance && meteors.length < STAR_CONFIG.meteor.maxCount) {
      meteors.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.PI * 1.2 + Math.random() * Math.PI * 0.6,
        life: STAR_CONFIG.meteor.lifetime,
      });
    }
    // 绘制流星（视觉调淡，不抢镜）
    const meteorLen = meteors.length;
    for (let i = meteorLen - 1; i >= 0; i--) {
      const meteor = meteors[i];
      if (meteor.life <= 0) {
        meteors.splice(i, 1);
        continue;
      }
      meteor.x += Math.cos(meteor.angle) * STAR_CONFIG.meteor.speed;
      meteor.y += Math.sin(meteor.angle) * STAR_CONFIG.meteor.speed;
      meteor.life--;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(
        meteor.x -
          Math.cos(meteor.angle) *
            STAR_CONFIG.meteor.length *
            (meteor.life / STAR_CONFIG.meteor.lifetime),
        meteor.y -
          Math.sin(meteor.angle) *
            STAR_CONFIG.meteor.length *
            (meteor.life / STAR_CONFIG.meteor.lifetime)
      );
      ctx.lineWidth = 1; // 🔴 流星线宽调细，更淡
      const alpha = (meteor.life / STAR_CONFIG.meteor.lifetime) * 0.5; // 🔴 透明度降低，不显眼
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.stroke();
      ctx.restore();
    }

    animationRef.current = requestAnimationFrame(drawStarsRef.current);
  }, []);

  const resizeCanvas = useCallback(() => {
    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    resizeTimeoutRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      initStars(canvas);
    }, STAR_CONFIG.resizeDebounce);
  }, [initStars]);

  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const resumeAnimation = useCallback(() => {
    animationRef.current = requestAnimationFrame(drawStarsRef.current);
  }, []);

  useEffect(() => {
    drawStarsRef.current = drawStars;

    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    resumeAnimation();

    window.addEventListener('resize', resizeCanvas);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          resumeAnimation();
        } else {
          pauseAnimation();
        }
      });
    });
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => {
      pauseAnimation();
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas.parentElement) {
        observer.unobserve(canvas.parentElement);
      }
      observer.disconnect();
    };
  }, [drawStars, resizeCanvas, pauseAnimation, resumeAnimation]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{
        background: `linear-gradient(135deg, ${STAR_CONFIG.canvas.bgColor}, #000033, #00001a)`,
      }}
    />
  );
};

export default StarBackground;
