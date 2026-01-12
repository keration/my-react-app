import confetti from 'canvas-confetti';

// 独立配置礼花颜色
export const CONFETTI_COLORS = [
  '#FF5252', // 红
  '#FFD740', // 黄
  '#4CAF50', // 绿
  '#2196F3', // 蓝
  '#9C27B0', // 紫
  '#FF9800', // 橙
];

// 工具函数：生成指定范围的随机数（核心，让参数有自然波动）
const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// 基础配置（按位置差异化）
const baseConfig = {
  decay: 0.94, // 空气阻力：0.93-0.96之间更自然（匹配重力）
  ticks: 200, // 存活时间：800-900，兼顾轨迹完整度和消失速度
  colors: CONFETTI_COLORS,
};

// 修复TS报错：显式指定类型
let confettiInterval: NodeJS.Timeout | null = null;

/**
 * 单次发射礼花（核心逻辑：参数随机化，让弧形更自然）
 */
const fireConfettiOnce = () => {
  // 1. 左侧礼花：往右上方发射，弧形轨迹自然化
  confetti({
    ...baseConfig,
    particleCount: Math.floor(randomBetween(35, 45)), // 粒子数随机：35-45
    startVelocity: randomBetween(32, 38), // 初始速度随机：32-38（避免直线）
    gravity: 0.75, // 重力：0.7-0.9之间，平衡下拉力度（太大小弧形过陡，太小接近直线）
    drift: randomBetween(1.3, 1.7), // 横向漂移随机：1.3-1.7（避免所有粒子偏移一致）
    spread: 55, // 扩散范围：50-60，让粒子轨迹有层次
    origin: { x: 0, y: 0.8 },
    angle: randomBetween(60, 70), // 发射角度随机：60-70°（避免绝对固定）
    scalar: randomBetween(0.8, 1.3), // 粒子大小随机：1.3-1.7（视觉层次）
  });

  // 2. 右侧礼花：往左上方发射，对称但带随机化
  confetti({
    ...baseConfig,
    particleCount: Math.floor(randomBetween(35, 45)),
    startVelocity: randomBetween(32, 38), // 左右速度统一随机，保证对称感
    gravity: 0.75, // 左右重力一致，弧形曲率对称
    drift: randomBetween(-1.7, -1.3), // 负向漂移随机：-1.7到-1.3
    spread: 55,
    origin: { x: 1, y: 0.8 },
    angle: randomBetween(110, 120), // 发射角度随机：110-120°（对称左侧）
    scalar: randomBetween(0.8, 1.3),
  });

  // 3. 中间礼花：垂直弧形（更轻柔的抛物线）
  confetti({
    ...baseConfig,
    particleCount: Math.floor(randomBetween(20, 30)),
    startVelocity: randomBetween(55, 65), // 垂直速度随机
    gravity: 0.55, // 中间重力稍小，弧形更缓（贴近现实中垂直发射的礼花）
    drift: randomBetween(-0.2, 0.2), // 轻微横向随机偏移（避免绝对垂直）
    spread: 18, // 适度增大扩散，更自然
    origin: { x: 0.5, y: 1 },
    angle: 90, // 垂直方向固定，保留聚焦感
    scalar: randomBetween(0.8, 1.3),
  });
};

/**
 * 启动持续喷射礼花
 * @param {number} interval - 喷射间隔（毫秒），默认200ms，可自定义
 */
export const startContinuousConfetti = (interval = 200) => {
  if (confettiInterval) {
    stopContinuousConfetti();
  }
  confettiInterval = setInterval(fireConfettiOnce, interval);
};

/**
 * 停止持续喷射礼花
 */
export const stopContinuousConfetti = () => {
  if (confettiInterval) {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }
};

/**
 * 原一次性触发方法（保留兼容）
 */
export const launchCenterConfetti = () => {
  fireConfettiOnce();
};

/**
 * 防抖时间等通用配置
 */
export const CONFETTI_CONFIG = {
  debounceTime: 3000,
  defaultContinuousInterval: 200,
};
