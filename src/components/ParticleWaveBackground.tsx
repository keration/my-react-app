import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

// 提取关键配置常量（方便后续调整）
const PARTICLE_CONFIG = {
  // 粒子数量控制：分母越小粒子越多（原20000 → 8000）
  particleDensityDenominator: 8000,
  // 粒子统一透明度（原随机0.1-0.8 → 固定0.8）
  particleOpacity: 0.8,
  // 粒子大小范围（原0.5-2.5 → 0.8-2.8，稍大更明显）
  particleSizeMin: 0.8,
  particleSizeMax: 2.8,
  // 连线最大距离（原100 → 180，范围更大）
  lineMaxDistance: 180,
  // 连线基础透明度（原0.2 → 0.25，更明显）
  lineBaseOpacity: 0.25,
  // 连线宽度（原0.3 → 0.4，稍粗更清晰）
  lineWidth: 0.4,
  // 鼠标拉力（原0.001 → 0.0012，粒子跟随更明显）
  mousePullForce: 0.002,
};

const ParticleWaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // 初始化粒子（修改数量、大小、统一透明度）
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // 增加粒子数量：减小分母，粒子数提升2.5倍
    const particleCount = Math.floor(
      (canvas.width * canvas.height) / PARTICLE_CONFIG.particleDensityDenominator
    );
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // 粒子大小稍大，更明显
        size:
          Math.random() * (PARTICLE_CONFIG.particleSizeMax - PARTICLE_CONFIG.particleSizeMin) +
          PARTICLE_CONFIG.particleSizeMin,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        // 统一亮度：固定透明度值
        opacity: PARTICLE_CONFIG.particleOpacity,
      });
    }
    particlesRef.current = particles;
  }, []);

  // 绘制粒子和连线（扩大连线范围、加粗线条）
  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mousePos = mousePosRef.current;

    // 绘制粒子 + 粒子间连线
    particles.forEach((particle, index) => {
      // 粒子向鼠标方向偏移（拉力稍大，效果更明显）
      const dx = mousePos.x - particle.x;
      const dy = mousePos.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pullForce = PARTICLE_CONFIG.mousePullForce;

      if (distance < 200) {
        particle.x += (dx / distance) * pullForce * distance;
        particle.y += (dy / distance) * pullForce * distance;
      }

      // 更新粒子位置
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // 边界回弹
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

      // 绘制粒子（统一亮度）
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 150, 255, ${particle.opacity})`;
      ctx.fill();

      // 绘制粒子间连线（扩大范围、加粗线条）
      particles.forEach((other, otherIndex) => {
        if (index === otherIndex) return;
        const dx2 = particle.x - other.x;
        const dy2 = particle.y - other.y;
        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        // 扩大连线触发距离（原100 → 180）
        if (distance2 < PARTICLE_CONFIG.lineMaxDistance) {
          // 调整连线透明度计算，让更远的粒子也有可见连线
          const opacity =
            PARTICLE_CONFIG.lineBaseOpacity - distance2 / (PARTICLE_CONFIG.lineMaxDistance * 2);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200, 150, 255, ${opacity})`;
          ctx.lineWidth = PARTICLE_CONFIG.lineWidth; // 加粗线条
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
    });

    animationRef.current = requestAnimationFrame(drawParticles);
  }, []);

  // 监听鼠标移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // 适配窗口大小
  const resizeCanvas = useCallback(() => {
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
    initParticles();
  }, [initParticles]);

  useEffect(() => {
    resizeCanvas();
    initParticles();
    animationRef.current = requestAnimationFrame(drawParticles);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [drawParticles, resizeCanvas, handleMouseMove, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ background: '#050510' }}
    />
  );
};

export default ParticleWaveBackground;
