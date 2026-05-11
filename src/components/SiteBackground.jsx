import { useEffect, useRef } from 'react';

const ANGLE_RAD = (43 * Math.PI) / 180;
const MAX_DPR = 2;

const VOLUMES = {
  back: [
    {
      x: 0.18,
      y: 0.58,
      length: 1.75,
      hazeWidth: 640,
      glowWidth: 310,
      coreWidth: 0,
      hazeOpacity: 0.036,
      glowOpacity: 0.03,
      coreOpacity: 0,
      drift: 10,
      period: 34,
      phase: 0.4,
      parallax: 8,
      angleOffset: -4,
    },
    {
      x: 0.74,
      y: 0.82,
      length: 1.55,
      hazeWidth: 560,
      glowWidth: 270,
      coreWidth: 0,
      hazeOpacity: 0.03,
      glowOpacity: 0.022,
      coreOpacity: 0,
      drift: 8,
      period: 38,
      phase: 2.2,
      parallax: 6,
      angleOffset: 5,
    },
    {
      x: 0.08,
      y: 0.18,
      length: 1.45,
      hazeWidth: 760,
      glowWidth: 300,
      coreWidth: 0,
      hazeOpacity: 0.02,
      glowOpacity: 0.018,
      coreOpacity: 0,
      drift: 7,
      period: 44,
      phase: 4.1,
      parallax: 4,
      angleOffset: -9,
    },
    {
      x: -0.04,
      y: 0.06,
      length: 1.5,
      hazeWidth: 820,
      glowWidth: 330,
      coreWidth: 0,
      hazeOpacity: 0.016,
      glowOpacity: 0.014,
      coreOpacity: 0,
      drift: 6,
      period: 52,
      phase: 1.9,
      parallax: 3,
      angleOffset: -15,
    },
    {
      x: 0.03,
      y: 0.46,
      length: 1.55,
      hazeWidth: 680,
      glowWidth: 260,
      coreWidth: 0,
      hazeOpacity: 0.022,
      glowOpacity: 0.02,
      coreOpacity: 0,
      drift: 8,
      period: 48,
      phase: 5.7,
      parallax: 4,
      angleOffset: 10,
    },
  ],
  mid: [
    {
      x: 0.72,
      y: 0.36,
      length: 1.9,
      hazeWidth: 520,
      glowWidth: 265,
      coreWidth: 46,
      hazeOpacity: 0.14,
      glowOpacity: 0.36,
      coreOpacity: 0.82,
      drift: 16,
      period: 18,
      phase: 1.1,
      parallax: 20,
      angleOffset: 0,
    },
    {
      x: 0.28,
      y: 0.86,
      length: 1.35,
      hazeWidth: 360,
      glowWidth: 170,
      coreWidth: 22,
      hazeOpacity: 0.046,
      glowOpacity: 0.12,
      coreOpacity: 0.3,
      drift: 12,
      period: 24,
      phase: 3.7,
      parallax: 12,
      angleOffset: 6,
    },
    {
      x: 0.48,
      y: 0.46,
      length: 1.42,
      hazeWidth: 460,
      glowWidth: 185,
      coreWidth: 18,
      hazeOpacity: 0.046,
      glowOpacity: 0.095,
      coreOpacity: 0.21,
      drift: 9,
      period: 28,
      phase: 5.4,
      parallax: 9,
      angleOffset: -6,
    },
    {
      x: 0.66,
      y: 0.16,
      length: 1.25,
      hazeWidth: 410,
      glowWidth: 150,
      coreWidth: 0,
      hazeOpacity: 0.04,
      glowOpacity: 0.06,
      coreOpacity: 0,
      drift: 8,
      period: 32,
      phase: 2.9,
      parallax: 8,
      angleOffset: 8,
    },
    {
      x: 0.36,
      y: 0.34,
      length: 1.18,
      hazeWidth: 390,
      glowWidth: 135,
      coreWidth: 0,
      hazeOpacity: 0.032,
      glowOpacity: 0.052,
      coreOpacity: 0,
      drift: 7,
      period: 30,
      phase: 4.8,
      parallax: 7,
      angleOffset: -11,
    },
    {
      x: 0.9,
      y: 0.04,
      length: 1.08,
      hazeWidth: 340,
      glowWidth: 125,
      coreWidth: 0,
      hazeOpacity: 0.046,
      glowOpacity: 0.068,
      coreOpacity: 0,
      drift: 9,
      period: 26,
      phase: 0.9,
      parallax: 10,
      angleOffset: 13,
    },
  ],
  front: [
    {
      x: 0.82,
      y: 0.18,
      length: 1.25,
      hazeWidth: 340,
      glowWidth: 155,
      coreWidth: 26,
      hazeOpacity: 0.15,
      glowOpacity: 0.44,
      coreOpacity: 1,
      drift: 22,
      period: 12,
      phase: 2.6,
      parallax: 32,
      angleOffset: 1.5,
    },
  ],
};

function CanvasBeams() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const ctx = canvas.getContext('2d');

    const pointer = { x: 0, y: 0 };
    const targetPointer = { x: 0, y: 0 };
    const size = { width: 0, height: 0, dpr: 1 };
    const scene = {
      diagonal: 0,
      volumes: [],
      particles: [],
      bloomTextures: [],
      volumeTextures: new Map(),
      grainPattern: null,
    };

    let resizeTimeout = null;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function createVolumeTexture(width, colorStops, lengthStops) {
      const texture = document.createElement('canvas');
      texture.width = Math.max(24, Math.ceil(width));
      texture.height = 512;

      const textureCtx = texture.getContext('2d');
      const crossGradient = textureCtx.createLinearGradient(0, 0, texture.width, 0);
      for (let i = 0; i < colorStops.length; i += 1) {
        const [stop, opacity] = colorStops[i];
        crossGradient.addColorStop(stop, `rgba(255,255,255,${opacity})`);
      }

      textureCtx.fillStyle = crossGradient;
      textureCtx.fillRect(0, 0, texture.width, texture.height);

      textureCtx.globalCompositeOperation = 'destination-in';
      const lengthGradient = textureCtx.createLinearGradient(0, 0, 0, texture.height);
      for (let i = 0; i < lengthStops.length; i += 1) {
        const [stop, opacity] = lengthStops[i];
        lengthGradient.addColorStop(stop, `rgba(0,0,0,${opacity})`);
      }

      textureCtx.fillStyle = lengthGradient;
      textureCtx.fillRect(0, 0, texture.width, texture.height);
      textureCtx.globalCompositeOperation = 'source-over';
      return texture;
    }

    function createShimmerTexture(width) {
      const texture = document.createElement('canvas');
      texture.width = Math.max(24, Math.ceil(width));
      texture.height = 512;

      const textureCtx = texture.getContext('2d');
      const crossGradient = textureCtx.createLinearGradient(0, 0, texture.width, 0);
      crossGradient.addColorStop(0, 'rgba(255,248,226,0)');
      crossGradient.addColorStop(0.34, 'rgba(255,248,226,0.08)');
      crossGradient.addColorStop(0.5, 'rgba(255,250,235,1)');
      crossGradient.addColorStop(0.66, 'rgba(255,248,226,0.08)');
      crossGradient.addColorStop(1, 'rgba(255,248,226,0)');

      textureCtx.fillStyle = crossGradient;
      textureCtx.fillRect(0, 0, texture.width, texture.height);

      textureCtx.globalCompositeOperation = 'destination-in';
      const lengthGradient = textureCtx.createLinearGradient(0, 0, 0, texture.height);
      lengthGradient.addColorStop(0, 'rgba(0,0,0,0)');
      lengthGradient.addColorStop(0.14, 'rgba(0,0,0,0.04)');
      lengthGradient.addColorStop(0.26, 'rgba(0,0,0,0.24)');
      lengthGradient.addColorStop(0.38, 'rgba(0,0,0,0.08)');
      lengthGradient.addColorStop(0.52, 'rgba(0,0,0,0.28)');
      lengthGradient.addColorStop(0.66, 'rgba(0,0,0,0.06)');
      lengthGradient.addColorStop(0.8, 'rgba(0,0,0,0.18)');
      lengthGradient.addColorStop(1, 'rgba(0,0,0,0)');

      textureCtx.fillStyle = lengthGradient;
      textureCtx.fillRect(0, 0, texture.width, texture.height);
      textureCtx.globalCompositeOperation = 'source-over';
      return texture;
    }

    function createTravelBandTexture(width) {
      const texture = document.createElement('canvas');
      texture.width = Math.max(8, Math.ceil(width));
      texture.height = 192;

      const textureCtx = texture.getContext('2d');
      const crossGradient = textureCtx.createLinearGradient(0, 0, texture.width, 0);
      crossGradient.addColorStop(0, 'rgba(255,248,226,0)');
      crossGradient.addColorStop(0.24, 'rgba(255,248,226,0.1)');
      crossGradient.addColorStop(0.5, 'rgba(255,252,244,1)');
      crossGradient.addColorStop(0.76, 'rgba(255,248,226,0.1)');
      crossGradient.addColorStop(1, 'rgba(255,248,226,0)');

      textureCtx.fillStyle = crossGradient;
      textureCtx.fillRect(0, 0, texture.width, texture.height);

      textureCtx.globalCompositeOperation = 'destination-in';
      const lengthGradient = textureCtx.createLinearGradient(0, 0, 0, texture.height);
      lengthGradient.addColorStop(0, 'rgba(0,0,0,0)');
      lengthGradient.addColorStop(0.16, 'rgba(0,0,0,0.18)');
      lengthGradient.addColorStop(0.5, 'rgba(0,0,0,1)');
      lengthGradient.addColorStop(0.84, 'rgba(0,0,0,0.18)');
      lengthGradient.addColorStop(1, 'rgba(0,0,0,0)');

      textureCtx.fillStyle = lengthGradient;
      textureCtx.fillRect(0, 0, texture.width, texture.height);
      textureCtx.globalCompositeOperation = 'source-over';
      return texture;
    }

    function createFlareTexture(sizePx) {
      const texture = document.createElement('canvas');
      texture.width = sizePx;
      texture.height = sizePx;

      const textureCtx = texture.getContext('2d');
      const radius = sizePx / 2;
      const gradient = textureCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.08, 'rgba(255,250,232,0.82)');
      gradient.addColorStop(0.26, 'rgba(239,232,214,0.28)');
      gradient.addColorStop(0.58, 'rgba(210,205,196,0.08)');
      gradient.addColorStop(1, 'rgba(239,232,214,0)');

      textureCtx.fillStyle = gradient;
      textureCtx.fillRect(0, 0, sizePx, sizePx);
      return texture;
    }

    function createBloomTexture(sizePx, stops) {
      const texture = document.createElement('canvas');
      texture.width = sizePx;
      texture.height = sizePx;

      const textureCtx = texture.getContext('2d');
      const radius = sizePx / 2;
      const gradient = textureCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      for (let i = 0; i < stops.length; i += 1) {
        const [stop, opacity] = stops[i];
        gradient.addColorStop(stop, `rgba(255,255,255,${opacity})`);
      }

      textureCtx.fillStyle = gradient;
      textureCtx.fillRect(0, 0, sizePx, sizePx);
      return texture;
    }

    function createGrainPattern() {
      const grainCanvas = document.createElement('canvas');
      const grainSize = 180;
      grainCanvas.width = grainSize;
      grainCanvas.height = grainSize;

      const grainCtx = grainCanvas.getContext('2d');
      const imageData = grainCtx.createImageData(grainSize, grainSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = Math.random() * 14;
      }

      grainCtx.putImageData(imageData, 0, 0);
      return ctx.createPattern(grainCanvas, 'repeat');
    }

    function getVolumeTexture(width, type) {
      const key = `${type}-${Math.round(width)}`;
      if (scene.volumeTextures.has(key)) return scene.volumeTextures.get(key);

      if (type === 'shimmer') {
        const texture = createShimmerTexture(width);
        scene.volumeTextures.set(key, texture);
        return texture;
      }

      if (type === 'shimmerBand') {
        const texture = createTravelBandTexture(width);
        scene.volumeTextures.set(key, texture);
        return texture;
      }

      if (type === 'flare') {
        const texture = createFlareTexture(Math.round(width));
        scene.volumeTextures.set(key, texture);
        return texture;
      }

      const stopsByType = {
        haze: [
          [0, 0],
          [0.26, 0.004],
          [0.5, 1],
          [0.74, 0.004],
          [1, 0],
        ],
        glow: [
          [0, 0],
          [0.38, 0.025],
          [0.5, 1],
          [0.62, 0.028],
          [1, 0],
        ],
        core: [
          [0, 0],
          [0.44, 0.02],
          [0.5, 1],
          [0.56, 0.022],
          [1, 0],
        ],
      };
      const lengthStopsByType = {
        haze: [
          [0, 0],
          [0.24, 0.16],
          [0.5, 1],
          [0.76, 0.16],
          [1, 0],
        ],
        glow: [
          [0, 0],
          [0.18, 0.48],
          [0.5, 1],
          [0.82, 0.48],
          [1, 0],
        ],
        core: [
          [0, 0],
          [0.34, 0.18],
          [0.5, 1],
          [0.66, 0.18],
          [1, 0],
        ],
      };

      const texture = createVolumeTexture(width, stopsByType[type], lengthStopsByType[type]);
      scene.volumeTextures.set(key, texture);
      return texture;
    }

    function buildVolumes() {
      const source = isTouchDevice
        ? {
            back: [VOLUMES.back[0], VOLUMES.back[2], VOLUMES.back[3]],
            mid: [VOLUMES.mid[0], VOLUMES.mid[2], VOLUMES.mid[4]],
            front: [VOLUMES.front[0]],
          }
        : VOLUMES;

      return [...source.back, ...source.mid, ...source.front].map((volume, index) => ({
        ...volume,
        index,
        lengthPx: scene.diagonal * volume.length,
        hazeTexture: getVolumeTexture(volume.hazeWidth, 'haze'),
        shimmerTexture: getVolumeTexture(Math.max(120, volume.hazeWidth * 0.72), 'shimmer'),
        shimmerBandTexture: getVolumeTexture(Math.max(10, Math.min(46, volume.glowWidth * 0.18)), 'shimmerBand'),
        glowTexture: getVolumeTexture(volume.glowWidth, 'glow'),
        coreTexture: volume.coreWidth > 0 ? getVolumeTexture(volume.coreWidth, 'core') : null,
        travelGlintTexture: volume.coreWidth > 0 ? getVolumeTexture(Math.max(4, volume.coreWidth * 0.22), 'core') : null,
        flareTexture: getVolumeTexture(volume.coreWidth > 0 ? 54 : 34, 'flare'),
      }));
    }

    function buildParticles() {
      const particles = [];
      const mainBeam = VOLUMES.mid[0];
      const frontBeam = VOLUMES.front[0];
      const sources = isTouchDevice
        ? [{ beam: mainBeam, count: 54, opacityBoost: 1, spread: 0.62 }]
        : [
            { beam: mainBeam, count: 96, opacityBoost: 1, spread: 0.58 },
            { beam: frontBeam, count: 138, opacityBoost: 1.28, spread: 0.5 },
          ];

      for (let s = 0; s < sources.length; s += 1) {
        const { beam, count, opacityBoost, spread } = sources[s];
        const cx = (beam.x - 0.5) * size.width;
        const cy = (beam.y - 0.5) * size.height;

        for (let i = 0; i < count; i += 1) {
          const along = (Math.random() - 0.5) * scene.diagonal * beam.length * 0.82;
          const off = (Math.random() - 0.5) * beam.hazeWidth * spread;
          particles.push({
            x: cx + off,
            y: cy + along,
            size: 0.5 + Math.random() * 1.45,
            opacity: (0.032 + Math.random() * 0.095) * opacityBoost,
            phase: Math.random() * Math.PI * 2,
            period: 10 + Math.random() * 18,
            drift: 1.5 + Math.random() * 5,
          });
        }
      }

      return particles;
    }

    function rebuildScene() {
      scene.diagonal = Math.hypot(size.width, size.height);
      scene.volumeTextures.clear();
      scene.volumes = buildVolumes();
      scene.particles = buildParticles();
      scene.grainPattern = createGrainPattern();
      scene.bloomTextures = [
        createBloomTexture(isTouchDevice ? 480 : 760, [
          [0, 0.95],
          [0.1, 0.46],
          [0.3, 0.12],
          [1, 0],
        ]),
        createBloomTexture(isTouchDevice ? 300 : 440, [
          [0, 0.78],
          [0.16, 0.22],
          [0.42, 0.055],
          [1, 0],
        ]),
      ];
    }

    function resize() {
      size.width = window.innerWidth;
      size.height = window.innerHeight;
      size.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      canvas.width = Math.floor(size.width * size.dpr);
      canvas.height = Math.floor(size.height * size.dpr);
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);

      rebuildScene();
    }

    function drawBase() {
      ctx.fillStyle = '#000001';
      ctx.fillRect(0, 0, size.width, size.height);
    }

    function drawBloom(elapsed) {
      const t = prefersReducedMotion ? 0 : elapsed;
      const mainPulse = 0.82 + 0.18 * ((Math.sin(t * 0.36 + 1.3) + 1) / 2);
      const smallPulse = 0.78 + 0.22 * ((Math.cos(t * 0.42 + 0.7) + 1) / 2);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const main = scene.bloomTextures[0];
      const mainX = size.width * 0.78 + Math.sin(t * 0.18) * 16;
      const mainY = size.height * 0.16 + Math.cos(t * 0.14) * 10;
      ctx.globalAlpha = 0.28 * mainPulse;
      ctx.drawImage(main, mainX - main.width / 2, mainY - main.height / 2);

      const accent = scene.bloomTextures[1];
      const accentX = size.width * 0.64 + Math.sin(t * 0.2 + 2) * 10;
      const accentY = size.height * 0.42 + Math.cos(t * 0.16 + 2) * 12;
      ctx.globalAlpha = 0.1 * smallPulse;
      ctx.drawImage(accent, accentX - accent.width / 2, accentY - accent.height / 2);

      ctx.restore();
    }

    function drawVolumeTexture(texture, x, y, width, length, opacity) {
      ctx.globalAlpha = opacity;
      ctx.drawImage(texture, x - width / 2, y - length / 2, width, length);
    }

    function getIrregularPulse(t, phase, speed, power = 4) {
      const primary = (Math.sin(t * speed + phase) + 1) / 2;
      const secondary = 0.62 + 0.38 * ((Math.sin(t * speed * 0.37 + phase * 2.31) + 1) / 2);
      return Math.pow(primary, power) * secondary;
    }

    function getBeamTravelProgress(elapsed, volume, isRightCore) {
      const phaseOffset = (volume.phase * 0.173 + volume.index * 0.217) % 1;
      const speed = isRightCore
        ? 0.115 + (volume.index % 3) * 0.012
        : volume.coreWidth > 0
          ? 0.07 + (volume.index % 4) * 0.006
          : 0.038 + (volume.index % 5) * 0.004;

      return (elapsed * speed + phaseOffset) % 1;
    }

    function drawTravelingShimmer(volume, x, y, elapsed, hazeMotion) {
      if (prefersReducedMotion) return;
      if (isTouchDevice && volume.index !== 0 && volume.index !== 3 && !volume.coreWidth) return;
      if (volume.glowOpacity < 0.05) return;

      const isRightCore = volume.coreWidth > 0 && volume.x > 0.7;
      const progress = getBeamTravelProgress(elapsed, volume, isRightCore);
      const gateShape = Math.pow(Math.sin(progress * Math.PI), isRightCore ? 1.25 : 1.8);
      const gate = isRightCore ? 0.18 + gateShape * 0.82 : 0.04 + gateShape * 0.96;
      const travelRange = volume.lengthPx * 1.08;
      const bandY = y - travelRange / 2 + progress * travelRange;
      const width = Math.max(18, Math.min(76, volume.glowWidth * (volume.coreWidth ? 0.3 : 0.23)));
      const length = Math.max(138, volume.lengthPx * (volume.coreWidth ? 0.12 : 0.1));
      const strength = isRightCore ? 0.36 : volume.coreWidth ? 0.27 : 0.13;
      const touchScale = isTouchDevice ? 0.45 : 1;

      drawVolumeTexture(
        volume.shimmerBandTexture,
        x + hazeMotion * 2.2,
        bandY,
        width,
        length,
        volume.glowOpacity * strength * gate * touchScale,
      );
    }

    function drawTravelingCoreGlint(volume, x, y, elapsed, hazeMotion) {
      if (prefersReducedMotion || isTouchDevice || !volume.travelGlintTexture) return;

      const isRightCore = volume.x > 0.7;
      const progress = getBeamTravelProgress(elapsed + 1.85, volume, isRightCore);
      const gateShape = Math.pow(Math.sin(progress * Math.PI), isRightCore ? 1.9 : 3);
      const gate = (isRightCore ? 0.1 : 0.025) + gateShape * getIrregularPulse(elapsed, volume.phase, 0.13, 1.15);
      const glintRange = volume.lengthPx * 0.9;
      const glintY = y - glintRange / 2 + progress * glintRange;

      drawVolumeTexture(
        volume.travelGlintTexture,
        x + hazeMotion * 5,
        glintY,
        Math.max(5, volume.coreWidth * 0.32),
        Math.max(72, volume.lengthPx * 0.06),
        volume.coreOpacity * (isRightCore ? 0.34 : 0.16) * gate,
      );
    }

    function drawVolumes(elapsed, scrollY, pointerStrength) {
      const t = prefersReducedMotion ? 0 : elapsed;

      for (let i = 0; i < scene.volumes.length; i += 1) {
        const volume = scene.volumes[i];
        const wave = Math.sin((t / volume.period) * Math.PI * 2 + volume.phase);
        const breathe = 0.78 + 0.22 * ((wave + 1) / 2);
        const hazeMotion = prefersReducedMotion ? 0 : Math.sin(t * 0.13 + volume.phase * 1.7);
        const brightnessDrift = prefersReducedMotion ? 1 : 0.97 + 0.03 * ((Math.sin(t * 0.19 + volume.phase) + 1) / 2);
        const x =
          (volume.x - 0.5) * size.width +
          wave * volume.drift +
          pointer.x * volume.parallax * pointerStrength -
          scrollY * 0.012;
        const y =
          (volume.y - 0.5) * size.height +
          Math.cos((t / volume.period) * Math.PI * 2 + volume.phase) * volume.drift * 0.35 +
          pointer.y * volume.parallax * 0.5 * pointerStrength +
          scrollY * 0.045;

        ctx.save();
        ctx.translate(size.width / 2, size.height / 2);
        ctx.rotate(ANGLE_RAD + ((volume.angleOffset || 0) * Math.PI) / 180);
        ctx.globalCompositeOperation = 'screen';

        drawVolumeTexture(
          volume.hazeTexture,
          x + hazeMotion * 1.6,
          y + hazeMotion * 0.8,
          volume.hazeWidth * (1 + hazeMotion * 0.006),
          volume.lengthPx,
          volume.hazeOpacity * breathe * brightnessDrift,
        );

        if (!isTouchDevice && volume.glowOpacity >= 0.05) {
          const shimmerPulse = 0.62 + 0.38 * ((Math.sin(t * 0.27 + volume.phase * 2.4) + 1) / 2);
          const shimmerTravel = Math.sin(t * 0.1 + volume.phase) * volume.lengthPx * 0.035;
          drawVolumeTexture(
            volume.shimmerTexture,
            x - hazeMotion * 2.4,
            y + shimmerTravel,
            volume.hazeWidth * 0.72,
            volume.lengthPx * 0.88,
            volume.hazeOpacity * 0.86 * shimmerPulse,
          );
        }

        drawVolumeTexture(
          volume.glowTexture,
          x,
          y,
          volume.glowWidth,
          volume.lengthPx * 0.92,
          volume.glowOpacity * breathe * (0.98 + (brightnessDrift - 0.97)),
        );

        if (volume.coreTexture) {
          drawVolumeTexture(volume.coreTexture, x, y, volume.coreWidth, volume.lengthPx * 0.72, volume.coreOpacity * breathe);
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
      }
    }

    function drawTravelingHighlights(elapsed, scrollY, pointerStrength) {
      if (prefersReducedMotion) return;

      const t = elapsed;

      for (let i = 0; i < scene.volumes.length; i += 1) {
        const volume = scene.volumes[i];
        if (volume.glowOpacity < 0.05) continue;

        const wave = Math.sin((t / volume.period) * Math.PI * 2 + volume.phase);
        const hazeMotion = Math.sin(t * 0.13 + volume.phase * 1.7);
        const x =
          (volume.x - 0.5) * size.width +
          wave * volume.drift +
          pointer.x * volume.parallax * pointerStrength -
          scrollY * 0.012;
        const y =
          (volume.y - 0.5) * size.height +
          Math.cos((t / volume.period) * Math.PI * 2 + volume.phase) * volume.drift * 0.35 +
          pointer.y * volume.parallax * 0.5 * pointerStrength +
          scrollY * 0.045;

        ctx.save();
        ctx.translate(size.width / 2, size.height / 2);
        ctx.rotate(ANGLE_RAD + ((volume.angleOffset || 0) * Math.PI) / 180);
        ctx.globalCompositeOperation = 'screen';

        drawTravelingShimmer(volume, x, y, t, hazeMotion);
        drawTravelingCoreGlint(volume, x, y, t, hazeMotion);

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
      }
    }

    function drawParticles(elapsed, scrollY) {
      const t = prefersReducedMotion ? 0 : elapsed;

      ctx.save();
      ctx.translate(size.width / 2, size.height / 2);
      ctx.rotate(ANGLE_RAD);
      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < scene.particles.length; i += 1) {
        const p = scene.particles[i];
        const phase = (t / p.period) * Math.PI * 2 + p.phase;
        const pulse = 0.35 + 0.65 * ((Math.sin(phase) + 1) / 2);
        const x = p.x + Math.sin(phase) * p.drift - scrollY * 0.008;
        const y = p.y + Math.cos(phase) * p.drift * 1.6 + scrollY * 0.03;

        ctx.globalAlpha = p.opacity * pulse;
        ctx.fillRect(x, y, p.size, p.size);
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawEdgeGlints(elapsed) {
      if (isTouchDevice) return;

      const t = prefersReducedMotion ? 0 : elapsed;
      const glints = [
        { x: 0.69, y: 0.31, w: 14, h: 190, opacity: 0.62, phase: 0.5 },
        { x: 0.82, y: 0.2, w: 10, h: 132, opacity: 0.76, phase: 2.1 },
        { x: 0.84, y: 0.29, w: 7, h: 86, opacity: 0.72, phase: 1.4 },
        { x: 0.76, y: 0.52, w: 8, h: 108, opacity: 0.58, phase: 3.9 },
        { x: 0.88, y: 0.42, w: 7, h: 82, opacity: 0.62, phase: 5.8 },
        { x: 0.56, y: 0.43, w: 7, h: 96, opacity: 0.24, phase: 3.4 },
        { x: 0.28, y: 0.72, w: 6, h: 84, opacity: 0.14, phase: 5.4 },
      ];

      ctx.save();
      ctx.translate(size.width / 2, size.height / 2);
      ctx.rotate(ANGLE_RAD);
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < glints.length; i += 1) {
        const g = glints[i];
        const rightSide = g.x > 0.65;
        const pulse = (rightSide ? 0.28 : 0.12) + (rightSide ? 0.72 : 0.88) * getIrregularPulse(t, g.phase, 0.34, rightSide ? 1.6 : 2.8);
        const texture = getVolumeTexture(g.w, 'core');
        ctx.globalAlpha = g.opacity * pulse;
        ctx.drawImage(
          texture,
          (g.x - 0.5) * size.width - g.w / 2,
          (g.y - 0.5) * size.height - g.h / 2,
          g.w,
          g.h,
        );
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
    }

    function findClosestVolume(targetX, targetY, preferCore) {
      let best = null;
      let bestDistance = Infinity;

      for (let i = 0; i < scene.volumes.length; i += 1) {
        const volume = scene.volumes[i];
        if (preferCore && !volume.coreWidth) continue;

        const distance = Math.abs(volume.x - targetX) + Math.abs(volume.y - targetY) * 0.65;
        if (distance < bestDistance) {
          best = volume;
          bestDistance = distance;
        }
      }

      return best;
    }

    function drawLensFlares(elapsed, scrollY, pointerStrength) {
      if (prefersReducedMotion) return;

      const t = elapsed;
      const flares = isTouchDevice
        ? [
            { x: 0.82, y: 0.2, vx: 0.82, vy: 0.18, size: 38, opacity: 0.07, phase: 1.1, zone: 0.12, core: true },
          ]
        : [
            { x: 0.82, y: 0.2, vx: 0.82, vy: 0.18, size: 76, opacity: 0.3, phase: 1.1, zone: 0.13, core: true },
            { x: 0.76, y: 0.52, vx: 0.72, vy: 0.36, size: 62, opacity: 0.25, phase: 3.8, zone: 0.16, core: true },
            { x: 0.88, y: 0.42, vx: 0.82, vy: 0.18, size: 52, opacity: 0.22, phase: 6.2, zone: 0.13, core: true },
            { x: 0.69, y: 0.31, vx: 0.72, vy: 0.36, size: 58, opacity: 0.2, phase: 4.6, zone: 0.15, core: true },
            { x: 0.9, y: 0.1, vx: 0.82, vy: 0.18, size: 44, opacity: 0.15, phase: 2.2, zone: 0.12, core: true },
            { x: 0.56, y: 0.43, vx: 0.48, vy: 0.46, size: 36, opacity: 0.06, phase: 2.7, zone: 0.18, core: false },
            { x: 0.28, y: 0.72, vx: 0.28, vy: 0.86, size: 30, opacity: 0.042, phase: 5.1, zone: 0.2, core: false },
          ];

      for (let i = 0; i < flares.length; i += 1) {
        const flare = flares[i];
        const volume = findClosestVolume(flare.vx, flare.vy, flare.core);
        if (!volume) continue;

        const rightSide = flare.x > 0.65;
        const wave = Math.sin((t / volume.period) * Math.PI * 2 + volume.phase);
        const hazeMotion = Math.sin(t * 0.13 + volume.phase * 1.7);
        const volumeX =
          (volume.x - 0.5) * size.width +
          wave * volume.drift +
          pointer.x * volume.parallax * pointerStrength -
          scrollY * 0.012;
        const volumeY =
          (volume.y - 0.5) * size.height +
          Math.cos((t / volume.period) * Math.PI * 2 + volume.phase) * volume.drift * 0.35 +
          pointer.y * volume.parallax * 0.5 * pointerStrength +
          scrollY * 0.045;
        const progress = getBeamTravelProgress(t + flare.phase * 0.7, volume, rightSide && volume.coreWidth > 0);
        const travelRange = volume.lengthPx * 1.08;
        const movingY = volumeY - travelRange / 2 + progress * travelRange;
        const anchorY = (flare.y - 0.5) * size.height;
        const distance = Math.abs(movingY - anchorY);
        const zone = Math.max(90, volume.lengthPx * flare.zone);
        const proximity = Math.max(0, 1 - distance / zone);
        const pulse = Math.pow(proximity, rightSide ? 1.6 : 2.2) * (0.72 + 0.28 * getIrregularPulse(t, flare.phase, 0.17, 1.2));
        if (pulse <= 0.002) continue;

        const flareX = (flare.x - 0.5) * size.width + hazeMotion * (rightSide ? 5 : 2);
        const flareY = movingY;
        const texture = getVolumeTexture(flare.size, 'flare');
        const coreTexture = getVolumeTexture(Math.max(5, flare.size * 0.12), 'core');

        ctx.save();
        ctx.translate(size.width / 2, size.height / 2);
        ctx.rotate(ANGLE_RAD + ((volume.angleOffset || 0) * Math.PI) / 180);
        ctx.globalCompositeOperation = 'screen';

        ctx.globalAlpha = flare.opacity * pulse;
        ctx.drawImage(
          texture,
          flareX - flare.size / 2,
          flareY - flare.size / 2,
          flare.size,
          flare.size,
        );

        ctx.globalAlpha = flare.opacity * pulse * (rightSide ? 0.9 : 0.45);
        ctx.drawImage(
          coreTexture,
          flareX - Math.max(4, flare.size * 0.08) / 2,
          flareY - flare.size * 0.85,
          Math.max(4, flare.size * 0.08),
          flare.size * 1.7,
        );

        ctx.globalAlpha = flare.opacity * pulse * (rightSide ? 0.42 : 0.18);
        ctx.drawImage(
          coreTexture,
          flareX - flare.size * 0.5,
          flareY - 2,
          flare.size,
          4,
        );

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
      }
    }

    function drawMasks() {
      ctx.save();

      ctx.fillStyle = 'rgba(0,0,0,0.48)';
      ctx.fillRect(0, 0, size.width, size.height);

      const topMask = ctx.createLinearGradient(0, 0, 0, size.height * 0.72);
      topMask.addColorStop(0, 'rgba(0,0,0,0.6)');
      topMask.addColorStop(0.6, 'rgba(0,0,0,0.38)');
      topMask.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topMask;
      ctx.fillRect(0, 0, size.width, size.height * 0.72);

      const side = Math.max(130, size.width * 0.16);
      const bottom = Math.max(180, size.height * 0.28);

      const leftMask = ctx.createLinearGradient(0, 0, side, 0);
      leftMask.addColorStop(0, 'rgba(0,0,0,0.88)');
      leftMask.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = leftMask;
      ctx.fillRect(0, 0, side, size.height);

      const rightMask = ctx.createLinearGradient(size.width, 0, size.width - side, 0);
      rightMask.addColorStop(0, 'rgba(0,0,0,0.88)');
      rightMask.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rightMask;
      ctx.fillRect(size.width - side, 0, side, size.height);

      const bottomMask = ctx.createLinearGradient(0, size.height, 0, size.height - bottom);
      bottomMask.addColorStop(0, 'rgba(0,0,0,0.78)');
      bottomMask.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bottomMask;
      ctx.fillRect(0, size.height - bottom, size.width, bottom);

      ctx.restore();
    }

    function drawGrain(elapsed) {
      if (!scene.grainPattern) return;

      ctx.save();
      ctx.globalAlpha = 0.025;
      ctx.translate((elapsed * 5) % 180, (elapsed * -4) % 180);
      ctx.fillStyle = scene.grainPattern;
      ctx.fillRect(-180, -180, size.width + 360, size.height + 360);
      ctx.restore();
    }

    function draw(elapsed) {
      const scrollY = window.scrollY || 0;
      const pointerStrength = isTouchDevice ? 0 : clamp(Math.hypot(pointer.x, pointer.y) * 1.7 + 0.12, 0, 1);

      drawBase();
      drawBloom(elapsed);
      drawVolumes(elapsed, scrollY, pointerStrength);
      drawParticles(elapsed, scrollY);
      drawMasks();
      drawTravelingHighlights(elapsed, scrollY, pointerStrength);
      drawLensFlares(elapsed, scrollY, pointerStrength);
      drawEdgeGlints(elapsed);
      drawGrain(elapsed);
    }

    function handleResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        if (prefersReducedMotion) draw(0);
        resizeTimeout = null;
      }, 100);
    }

    function handlePointerMove(event) {
      if (isTouchDevice) return;
      targetPointer.x = event.clientX / size.width - 0.5;
      targetPointer.y = event.clientY / size.height - 0.5;
    }

    function handlePointerLeave() {
      targetPointer.x = 0;
      targetPointer.y = 0;
    }

    resize();
    window.addEventListener('resize', handleResize);

    if (!isTouchDevice) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave);
    }

    if (prefersReducedMotion) {
      draw(0);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
        if (resizeTimeout) clearTimeout(resizeTimeout);
      };
    }

    let rafId;
    let startTime = null;

    function animate(ts) {
      if (startTime === null) startTime = ts;
      pointer.x += (targetPointer.x - pointer.x) * 0.04;
      pointer.y += (targetPointer.y - pointer.y) * 0.04;
      draw((ts - startTime) / 1000);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -25,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}

export default function SiteBackground() {
  return (
    <>
      {/* Graphite base fills all pages */}
      <div
        aria-hidden
        className="fixed inset-0 -z-30 pointer-events-none select-none"
        style={{ background: 'var(--bg)' }}
      />
      {/* Layered light volumes stay fixed behind every route */}
      <CanvasBeams />
    </>
  );
}
