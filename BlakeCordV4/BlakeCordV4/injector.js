/**
 * ██████╗ ██╗      █████╗ ██╗  ██╗███████╗ ██████╗ ██████╗ ██████╗ 
 * ██╔══██╗██║     ██╔══██╗██║ ██╔╝██╔════╝██╔════╝██╔═══██╗██╔══██╗
 * ██████╔╝██║     ███████║█████╔╝ █████╗  ██║     ██║   ██║██████╔╝
 * ██╔══██╗██║     ██╔══██║██╔═██╗ ██╔══╝  ██║     ██║   ██║██╔══██╗
 * ██████╔╝███████╗██║  ██║██║  ██╗███████╗╚██████╗╚██████╔╝██║  ██║
 * ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ V4 🌻
 *
 * BLAKECORD V4 — Ultimate Discord Voice Manager
 * Made by Blake
 * ═══════════════════════════════════════════════════════════
 * Black & Gold Edition
 *   • Premium black/gold glassmorphism theme
 *   • Sunflower GIF animated background
 *   • 88 Voice FX, 20 Presets, 12 Voice Tones
 *   • CHAOS Engine, Stereo Wider, 10-band EQ
 *   • Advanced Loudmic Engine with 500+ controls
 *   • Settings, Visual, Advanced, Profiles, Broadcast tabs
 * ═══════════════════════════════════════════════════════════
 */
(function () {
  'use strict';
  if (window.__BLAKECORD__) return;
  window.__BLAKECORD__ = true;

  const EXT_URL = (() => { try { for (const s of document.scripts) { const src = s.src || ''; if (src.includes('injector.js')) return src.substring(0, src.lastIndexOf('/') + 1); } } catch(e){} return ''; })();
  const GIFS = {
    banner:    EXT_URL + 'assets/sunflower.gif',
    doodle:    EXT_URL + 'assets/sunflower.gif',
    level:     EXT_URL + 'assets/sunflower.gif',
    eyes:      EXT_URL + 'assets/sunflower.gif',
    sunflower: EXT_URL + 'assets/sunflower.gif',
  };

  const SVG  = (path) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg>';
  const SVGF = (path) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="' + path + '"/></svg>';

  const ICONS = {
    close: SVG('M3 3l10 10M13 3L3 13'),
    play: SVG('M4 2v12l10-6z'),
    pause: SVG('M5 2h2v12H5zM9 2h2v12H9z'),
    stop: SVG('M3 3h10v10H3z'),
    prev: SVG('M11 2v12l-8-6zM12 2h1v12h-1z'),
    next: SVG('M5 2v12l8-6zM3 2h1v12H3z'),
    loop: SVG('M13.5 8A5.5 5.5 0 0 1 3 10l1-1M2.5 8A5.5 5.5 0 0 1 13 6l-1 1'),
    reset: SVG('M2 8a6 6 0 0 1 10.5-3.5L14 3v5H9l2-2a4 4 0 1 0 1 4.2'),
    flat: SVG('M2 8h12'),
    clear: SVG('M3 3l10 10M13 3L3 13'),
    route: SVG('M3 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM9 4a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM5 12l4-8'),
    check: SVG('M2 8l4 4 8-8'),
    live: SVG('M8 2a6 6 0 0 0 0 12A6 6 0 0 0 8 2zM8 5a3 3 0 0 1 0 6'),
    ready: SVG('M8 2a6 6 0 0 0 0 12A6 6 0 0 0 8 2zM8 5a3 3 0 0 1 0 6'),
    mixer: SVG('M2 12V9h2v3zm4 2V7h2v7zm4-5V5h2v4zm4-1V3h2v5z'),
    voice: SVG('M5 5a3 3 0 1 1 6 0v2a3 3 0 1 1-6 0zM3 9a5 5 0 0 0 10 0M8 14v2'),
    fx: SVG('M5 2l-1 5h3L6 14l6-8H9l2-4z'),
    eq: SVG('M2 14V2h2v12zm3-2V6h2v6zm3-3V4h2v5zm3-5h2v10h-2zM14 2h2v12h-2z'),
    reverb: SVG('M2 8c2-3 4-3 6 0s4 3 6 0'),
    spatial: SVG('M3 8h10M7 4l-4 4 4 4M9 4l4 4-4 4'),
    player: SVG('M5 3l9 5-9 5z'),
    engine: SVG('M7 2h2l1 2h2l2-1 1 1-1 2v2l1 1-1 1-1 2-2-1H9l-1 2H6L5 9H3l-1-1 1-1V5L4 4l2 1h2z'),
    presets: SVG('M2 3h12v2H2zm0 4h8v2H2zm0 4h10v2H2z'),
    stats: SVG('M2 14V2h2v12zm4-4V6h2v4zm4-2V4h2v4zm4-2h2v8h-2z'),
    wider: SVG('M2 8h4m4 0h4M6 5l3 3-3 3M10 5l-3 3 3 3'),
    pitch: SVG('M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4'),
    gain: SVG('M2 8h4m4 0h4M6 5l3 3-3 3M10 5l-3 3 3 3'),
    overdrive: SVG('M8 2L4 8h3l-1 6 6-8H9z'),
    hyper: SVG('M4 2l3 7-1 5 6-9H8l2-3z'),
    mute: SVG('M5 5a3 3 0 0 1 6 0v2a3 3 0 0 1-1.5 2.6M3 9a5 5 0 0 0 7.5 4M3 3l10 10'),
    deafen: SVG('M5 5a3 3 0 0 0 6 0v2a3 3 0 0 1-1.5 2.6M3 9a5 5 0 0 0 7.5 4M3 3l10 10M2 2l12 12'),
    comp: SVG('M5 12V4h2v8zm4-6v6h2V6z'),
    chaos: SVG('M8 2v3M8 11v3M3 8h3m7 0h3M4.5 4.5l2 2m7-2l-2 2m0 5l2 2m-7-2l-2 2'),
    speed: SVG('M8 2v6l4 2'),
    bass: SVG('M5 8h2l3-4v8L7 8H5z'),
    treble: SVG('M13 8h-2L8 4v8l3-4h2z'),
    music: SVG('M6 3v9a2 2 0 1 1-2-2V3l8-1v8a2 2 0 1 1-2-2V2z'),
    boost: SVG('M4 8h2l3-4v8L6 8H4z'),
    depth: SVG('M2 10l6-6 6 6'),
    room: SVG('M3 3h10v10H3zM3 7h10M7 3v10'),
    dry: SVG('M2 2l12 12M14 2L2 14'),
    threshold: SVG('M2 12h12M10 8l2-4 2 4'),
    ratio: SVG('M2 12h12M2 8h8M2 4h4'),
    folder: SVG('M2 3h5l2 2h5v8H2z'),
    star: SVG('M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z'),
    crown: SVG('M2 12V5l3 3 3-5 3 5 3-3v7z'),
    skull: SVG('M5 3a3 3 0 0 1 6 0v1a4 4 0 0 1 3 4c0 2-1 3-1 4H5c0-1-1-2-1-4a4 4 0 0 1 3-4V3zM5 12v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1'),
    vortex: SVG('M8 2l6 6-6 6-6-6zM8 5l3 3-3 3-3-3z'),
    circuit: SVG('M4 4h8v8H4zM2 8h12M8 2v12M6 6h4v4H6z'),
    pulse: SVG('M2 10h3l1-3 2 6 2-6 1 3h3'),
    broadcast: SVG('M3 8a5 5 0 0 1 10 0M5 8a3 3 0 0 1 6 0M7 8a1 1 0 0 1 2 0'),
    wave: SVG('M2 8c3-4 5-4 6 0s3 4 6 0'),
    aura: SVG('M8 2c3 0 5 2 5 5 0 4-5 7-5 7s-5-3-5-7c0-3 2-5 5-5zM8 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'),
    flame: SVG('M8 2c-1 3-3 4-3 6 0 2 1 4 3 4s3-2 3-4c0-2-1-5-3-6zM5 12c-2 1-2 2 0 2 1 0 2 0 3-1'),
    ghost: SVG('M4 3a4 4 0 0 1 8 0v8l-2-2-2 2-2-2-2 2zM6 6h1v1H6zm3 0h1v1H9z'),
    alien: SVG('M4 4a4 4 0 0 1 8 0v2a4 4 0 0 1-8 0zM3 10h2l1 3-3-1zm8 0h2l-1 3-3-1zM7 13l1 1 1-1'),
    demon: SVG('M4 2l2 3h4l2-3-1 4a4 4 0 0 1-6 0zM3 9h10l-1 3H4zm3 4h4v1H6z'),
    herald: SVG('M3 8h2l4-4v8L5 8H3zM11 5l2 3-2 3'),
    natural: SVG('M2 8a6 6 0 0 1 12 0c0 3-3 6-6 6S2 11 2 8zM8 5v3l2 1'),
    titan: SVG('M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4M2 8h12'),
    seraphim: SVG('M8 2l1 3h3l-2 2 1 4-3-2-3 2 1-4-2-2h3z'),
    sprite: SVG('M8 2v12M4 8h8M6 4l2-2 2 2M6 12l2 2 2-2'),
    kitsune: SVG('M3 3l2 3 3-2 3 2 2-3-1 4a4 4 0 0 1-8 0zM5 9l3 4 3-4'),
    leviathan: SVG('M3 8a5 5 0 0 1 10 0v2H3zM5 10v2h6v-2M4 14l1-2h6l1 2'),
    synthex: SVG('M3 3h10v10H3zM6 6h4v4H6zM8 3v10M3 8h10'),
    wraith: SVG('M4 3a4 4 0 0 1 8 0v6a5 5 0 0 1-8 0zM8 3v6'),
    cosmic: SVG('M8 2l4 4-4 4-4-4zM8 8l4 4-4 4-4-4zM8 5l2 2-2 2-2-2z'),
    caster: SVG('M3 6a5 5 0 0 1 10 0M5 6a3 3 0 0 1 6 0M7 6a1 1 0 0 1 2 0'),
    abyssal: SVG('M2 2h12l-4 12H6zM8 2v12M4 8h8'),
    mecha: SVG('M4 2h8v4H4zM3 6h10v2H3zM5 8h6v4H5zM4 12h8v2H4zM7 4v4M9 4v4'),
    amplify: SVG('M3 8h3l2-4v8L6 8H3zM11 4v8l4-4z'),
    vintage: SVG('M2 4h12v6H5l-3 3zM10 8h1v1h-1z'),
    darkvoid: SVG('M8 2c-4 0-6 3-6 6s2 6 6 6 6-3 6-6-2-6-6-6zM8 5v6M5 8h6'),
    sugar: SVG('M8 2l-2 3H3l2 3-1 4 4-2 4 2-1-4 2-3h-3z'),
    phantom: SVG('M8 2c3 0 5 2 5 5v5H3V7c0-3 2-5 5-5zM6 8h4M6 10h4'),
    rampage: SVG('M6 2l-2 4h3L5 14l5-7H7l3-5z'),
    ethereal: SVG('M8 2l3 3-3 3-3-3zM5 5l3 3-3 3-3-3zM11 5l3 3-3 3-3-3zM8 8l3 3-3 3-3-3z'),
    galaxy: SVG('M8 2c4 0 6 2 6 6s-2 6-6 6-6-2-6-6 2-6 6-6zM5 8h6M8 5v6'),
    warp: SVG('M2 8c3 0 5-3 6-6 1 3 3 6 6 6-3 0-5 3-6 6-1-3-3-6-6-6z'),
    pixel: SVG('M3 3h2v2H3zm4 0h2v2H7zm4 0h2v2h-2zM3 7h2v2H3zm4 0h2v2H7zm4 0h2v2h-2zM3 11h2v2H3zm4 0h2v2H7zm4 0h2v2h-2z'),
    quake: SVG('M2 10h3l1-3 2 6 2-6 1 3h3'),
    abyss: SVG('M2 14l6-12 6 12zM8 2v12M4 8h8'),
    static: SVG('M3 6l-1 4h3l-1 4M8 4l-1 6h3L9 14M13 2l-1 6h3l-1 6'),
    resonator: SVG('M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4'),
    shade: SVG('M8 2c4 0 6 3 6 7 0 3-3 5-6 5S2 12 2 9c0-4 2-7 6-7zM8 5v6M5 8h6'),
    predator: SVG('M3 3h2l3 3 3-3h2v3l-3 3 3 3v3h-2l-3-3-3 3H3v-3l3-3-3-3zM8 9v3'),
    depths: SVG('M2 12l6-10 6 10zM8 2v12M5 6h6M5 9h6'),
    diamond: SVG('M8 1l7 7-7 7L1 8zM8 3l5 5-5 5-5-5z'),
    amplify2: SVG('M2 8h3l3-6v12L5 8H2zM10 4v8l6-4z'),
    echo: SVG('M3 8c2-3 4-3 5 0s3 3 5 0'),
    chipmunk: SVG('M8 2c2 0 4 2 4 4s-2 4-4 4-4-2-4-4 2-4 4-4zM6 7l2 3 2-3'),
    telephone: SVG('M2 4h3l1 3L4 9c1 2 3 3 5 3l2-2 3 1v3h-2C6 14 2 10 2 4z'),
    download: SVG('M8 1v10M4 7l4 4 4-4M2 13h12'),
    time: SVG('M8 2a6 6 0 0 0 0 12A6 6 0 0 0 8 2zM8 5v3l2 2'),
    loudmic: SVG('M6 3v9a2 2 0 1 1-2-2V3l8-1v8a2 2 0 1 1-2-2V2zM2 8h12'),
    settings: SVG('M7 2h2l1 2h2l2-1 1 1-1 2v2l1 1-1 1-1 2-2-1H9l-1 2H6L5 9H3l-1-1 1-1V5L4 4l2 1h2z'),
    visual: SVG('M2 4h12v8H2zM4 6h8M4 9h5'),
    advanced: SVG('M8 2l6 6-6 6-6-6zM8 5l3 3-3 3-3-3z'),
    profiles: SVG('M4 2h8v2H4zm0 4h8v2H4zm0 4h5v2H4z'),
    save: SVG('M13 13H3V3h7l3 3v7zM9 3v4H5V3'),
    load: SVG('M8 11V5M5 8l3 3 3-3M3 13h10'),
    sunflower: SVG('M8 8m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M8 2v2M8 12v2M2 8h2M12 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M11 5l1.5-1.5M3.5 12.5L5 11'),
    hotkeys: SVG('M3 3h10v10H3zM6 6h1v1H6zm3 0h1v1H9zm-3 3h4v1H6z'),
  };
  const ICON = (name) => ICONS[name] || '';

  /* ═══════════════════════════════════════════════════════
     STATE
     ═══════════════════════════════════════════════════════ */
  const STATE = {
    masterGain: 1.0,
    preAmp: 2.5,
    pitch: 0,
    stereoWidth: 0,
    inputLevel: -Infinity,
    eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    effect: null,
    reverb: { wetMix: 0.35, decay: 3.5, roomSize: 2.3, dry: false },
    chaosMode: false,
    godGain: 0,
    hyperBoost: 0,
    voiceTone: 'Aura',
    compEnabled: true,
    compThreshold: -28,
    compRatio: 6,
    widerEnabled: false,
    widerWidth: 1.0,
    widerDepth: 1.0,
    widerFreq: 80,
    eqMaster:0, eqQ:1.2, eqBypass:false, eqLpf:20000, eqHpf:40, eqReso:0, eqSub:0, eqAir:0,
    gateEnabled:true, gateThresh:-55,
    limiter:0, autoLevel:false, deEsser:false, warmth:0, outputBoost:1.2, balance:0,
    phaseInvert:false, forceMono:false, swapChannels:false, midOnly:false, sideOnly:false,
    haas:0, crossfeed:0, stereoBase:100, mp3Bal:0,
    sessionStart: Date.now(),
    clipCount: 0,
    peakDb: -Infinity,
    clarityMode: true,
    presenceBoost: 3,
  };

  /* ═══════════════════════════════════════════════════════
     LOUDMIC STATE (1000+ features)
     ═══════════════════════════════════════════════════════ */
  const LMIC = {
    // ── Input Processing ──
    inputGain: 1.0, inputPad: 0, phaseInvertL: false, phaseInvertR: false,
    dcOffset: 0, subsonicFilter: false, rfFilter: false, humRemover: false,
    clipPrevention: true, inputNoise: -90, agcEnabled: false, agcAttack: 10,
    agcRelease: 100, agcTarget: -18, agcMax: 0, agcMin: -30,
    inputMode: 'stereo', latencyComp: 0, inputTrim: 0, truePeakLim: false,
    clipIndicator: false, vuMeterMode: 'peak', crestFactor: 0,
    dynamicRange: 0, signalNoiseRatio: 0, autoZeroCross: false,
    dcBlocker: true, asymClip: false, softClip: true, hardClip: false,
    noiseFloor: -90, noiseShaping: 'none', dither: 'none', bit24Mode: false,

    // ── 31-Band Music EQ ──
    eq31: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    eq31Bypass: false, eq31Master: 0, eq31Type: 'parametric',
    eq31Q: 1.4, eq31Slope: 12,

    // ── Dynamics ──
    lmCompEnabled: false, lmCompThreshold: -24, lmCompRatio: 4,
    lmCompAttack: 5, lmCompRelease: 50, lmCompKnee: 3, lmCompMakeup: 0,
    lmCompAuto: false, lmCompParallel: false, lmCompParallelMix: 50,
    lmLimEnabled: false, lmLimThreshold: -3, lmLimRelease: 50,
    lmLimLookahead: 1, lmLimCeiling: -0.1,
    lmGateEnabled: false, lmGateThreshold: -60, lmGateAttack: 1,
    lmGateHold: 100, lmGateRelease: 200, lmGateRange: -80,
    lmExpEnabled: false, lmExpThreshold: -40, lmExpRatio: 2,
    lmTransShaper: false, lmTransAttack: 10, lmTransSustain: 0,

    // ── Effects Processing ──
    lmRevType: 'hall', lmRevPreDelay: 20, lmRevDecay: 2.5,
    lmRevSize: 2.0, lmRevDamp: 50, lmRevWet: 0,
    lmChRate: 1.5, lmChDepth: 50, lmChWet: 0, lmChVoices: 3,
    lmDelTime: 250, lmDelFb: 30, lmDelWet: 0, lmDelMode: 'simple',
    lmDelTone: 50, lmDelSync: false, lmDelBpm: 120, lmDelSubdiv: '1/4',
    lmFlRate: 0.5, lmFlDepth: 50, lmFlFb: 30, lmFlWet: 0,
    lmPhStages: 4, lmPhRate: 0.5, lmPhDepth: 50, lmPhWet: 0,
    lmDistType: 'soft', lmDistAmt: 0, lmDistTone: 50, lmDistWet: 0,
    lmBitBits: 8, lmBitRate: 44100, lmBitWet: 0,
    lmRingFreq: 200, lmRingWet: 0,
    lmWahSens: 50, lmWahRate: 1.0, lmWahWet: 0,
    lmTremRate: 4, lmTremDepth: 50, lmTremShape: 'sine', lmTremWet: 0,
    lmVibRate: 5, lmVibDepth: 30, lmVibWet: 0,
    lmPitchShift: 0, lmPitchCents: 0, lmFormantShift: 0,
    lmHarmVoices: 2, lmHarmInterval: 7, lmHarmWet: 0,
    lmOctUp: 0, lmOctDown: 0, lmOctWet: 0,
    lmShimmerAmt: 0, lmShimmerFb: 50,
    lmGranSize: 100, lmGranDensity: 50, lmGranPitch: 0, lmGranWet: 0,
    lmConvType: 'hall', lmConvWet: 0,
    lmTapeWet: 0, lmTapeSat: 50, lmTapeSpeed: 1.0,
    lmTubeWet: 0, lmTubeGain: 1.0, lmTubeHarmonics: 50,
    lmAmpSim: 'none', lmCabSim: 'none',

    // ── Stereo & Spatial ──
    lmStereoWidth: 100, lmMidSide: 0, lmHaasTime: 0,
    lmCrossfeed: 0, lmStereoBase: 100, lmPan: 0,
    lmPhaseOffset: 0, lmLRDelay: 0, lmRoomSim: false,
    lmHRTF: false, lmBinaural: false, lmSurroundMix: 0,
    lm3DX: 0, lm3DY: 0, lm3DZ: 0, lmDistance: 0,
    lmAirAbsorption: 0, lmEarlyRef: 0.2, lmLateRef: 0.5, lmDiffusion: 50,

    // ── Output Processing ──
    lmOutGain: 1.0, lmOutLimiter: false, lmDitherType: 'none',
    lmStereoImaging: 0, lmBassEnhance: 0, lmTrebleEnhance: 0,
    lmLoudnessNorm: false, lmLufsTarget: -16, lmTruePeakTarget: -1,
    lmMeteringMode: 'peak', lmClipIndicator: false, lmOutputMode: 'stereo',
    lmUpmix: false, lmDownmix: false, lmOutputBuffer: 256,
    lmOutputLatency: 0, lmFormatConv: false,

    // ── Playback Controls ──
    lmSpeed: 1.0, lmLoopMode: 'single', lmShuffle: false,
    lmCrossfadeTime: 0, lmAutoPlay: true, lmPlaylistMode: false,
    lmAbRepeat: false, lmAPoint: 0, lmBPoint: 0, lmSleepTimer: 0,
    lmSkipSilence: false, lmSilenceThreshold: -50, lmBpmDetect: false,
    lmBpm: 120, lmKeyDetect: false, lmKey: 'C', lmTimeStretch: false,
    lmPitchCorrect: false, lmAutoGain: false,
    lmFadeIn: 0, lmFadeOut: 0, lmPreroll: 0,

    // ── Visual Meter ──
    lmMeterType: 'vu', lmMeterDecay: 300, lmMeterPeakHold: 2000,
    lmShowSpectrum: true, lmSpecMode: 'bar', lmSpecSmooth: 70,

    // ── Music Presets ──
    lmActivePreset: 'none',
  };

  /* ═══════════════════════════════════════════════════════
     SETTINGS STATE
     ═══════════════════════════════════════════════════════ */
  const SETT = {
    // Appearance
    panelWidth: 390, panelOpacity: 97, animSpeed: 'normal',
    fontSize: 'medium', tabLayout: 'horizontal', compactMode: false,
    alwaysOnTop: false, gifOpacity: 70, gifBlur: 0, borderRadius: 14,
    glowIntensity: 50, showMeter: true, headerStyle: 'full',
    tabIconOnly: false, panelPosition: 'bottom-right',
    // Behavior
    autoHide: false, rememberTab: true, showTooltips: true,
    autoApply: true, soundFeedback: false, confirmReset: true,
    saveOnExit: true, hotkeysEnabled: true, clickThrough: false,
    // Performance
    updateRate: 60, bufferSize: 256, cpuPriority: 'normal',
    lowLatencyMode: false, gpuAccel: true, reducedMotion: false,
    // Hotkeys
    hkTogglePanel: 'Alt+B', hkToggleMute: 'Alt+M', hkPresetNext: 'Alt+]',
    hkPresetPrev: 'Alt+[', hkVolumeUp: 'Alt+=', hkVolumeDown: 'Alt+-',
    hkPlayPause: 'Alt+Space', hkChaosMode: 'Alt+C', hkReset: 'Alt+R',
    hkStats: 'Alt+S', hkVoice1: 'Alt+1', hkVoice2: 'Alt+2',
    // Theme
    themeAccent: '#FFD700', themeBg: '#000000',
    themePanel: 'rgba(8,7,0,0.97)', themeGlow: '#FFD700',
  };

  /* ═══════════════════════════════════════════════════════
     PROFILES STATE
     ═══════════════════════════════════════════════════════ */
  const PROFILES = {
    saved: [],
    active: null,
    autoSave: false,
  };

  /* ═══════════════════════════════════════════════════════
     BROADCAST STATE
     ═══════════════════════════════════════════════════════ */
  const BCAST = {
    streamEnabled: false, streamQuality: 'high',
    streamBitrate: 320, streamFormat: 'opus',
    streamTarget: 'discord', streamMix: 50,
    recEnabled: false, recFormat: 'wav', recBitrate: 1411,
    recSampleRate: 48000, recChannels: 2,
    vadEnabled: false, vadThreshold: -40,
    noiseSuppression: false, nsAmount: 50,
    echoCancellation: false, ecAmount: 50,
    agcStream: false, agcStreamTarget: -18,
    monitorEnabled: false, monitorVolume: 0.5,
    loopbackEnabled: false, loopbackGain: 1.0,
    virtualCableEnabled: false, virtualCableDevice: 'none',
    broadcastEqEnabled: false, broadcastEqPreset: 'flat',
    broadcastCompEnabled: false, broadcastCompThreshold: -20,
    broadcastCompRatio: 4, broadcastLimEnabled: true,
    broadcastLimThreshold: -3, streamMetadata: true,
    streamTitle: 'BlakeCord V4 Stream', streamAuthor: 'Blake',
  };

  /* ═══════════════════════════════════════════════════════
     MP3 PLAYER STATE
     ═══════════════════════════════════════════════════════ */
  const MP3 = {
    audio: null, source: null, gainNode: null, musicGain: null,
    analyser: null, playing: false, fileName: null,
    volume: 1.0, musicBoost: 1.0, _interval: null, _objUrl: null,
    _storedFile: null, _lastRoutingOk: false,
  };

  const EQ_FREQS  = [60, 150, 400, 1000, 2400, 6000, 12000, 16000, 80, 8000];
  const EQ_LABELS = ['60','150','400','1k','2.4k','6k','12k','16k','Sub','Air'];

  const EQ31_FREQS = [20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
  const EQ31_LABELS = ['20','25','31','40','50','63','80','100','125','160','200','250','315','400','500','630','800','1k','1.2k','1.6k','2k','2.5k','3.1k','4k','5k','6.3k','8k','10k','12.5k','16k','20k'];

  /* ═══════════════════════════════════════════════════════
     PRESETS
     ═══════════════════════════════════════════════════════ */
  const PRESETS = [
    { name:"PURE",        icon:ICON('diamond'),   master:1.0,  preAmp:1.0,  pitch:0,   effect:null,        reverb:{wetMix:0,   decay:3.5,roomSize:2.3,dry:true},  god:0,   hyper:0   },
    { name:"AMPLIFY",     icon:ICON('amplify2'),  master:2.5,  preAmp:2.0,  pitch:0,   effect:null,        reverb:{wetMix:0,   decay:3.5,roomSize:2.3,dry:true},  god:0,   hyper:0   },
    { name:"SHADOW LORD", icon:ICON('predator'),  master:1.5,  preAmp:1.4,  pitch:-7,  effect:"deep",      reverb:{wetMix:0.4, decay:3.0,roomSize:2.5,dry:false}, god:0.2, hyper:0   },
    { name:"CATHEDRAL",   icon:ICON('reverb'),    master:1.2,  preAmp:1.1,  pitch:0,   effect:"cave",      reverb:{wetMix:0.6, decay:5.0,roomSize:4.0,dry:false}, god:0,   hyper:0   },
    { name:"PHANTOM",     icon:ICON('phantom'),   master:0.9,  preAmp:0.8,  pitch:3,   effect:"echo",      reverb:{wetMix:0.5, decay:2.5,roomSize:2.0,dry:false}, god:0,   hyper:0   },
    { name:"FURY",        icon:ICON('rampage'),   master:1.6,  preAmp:1.6,  pitch:-3,  effect:"distort",   reverb:{wetMix:0.3, decay:2.0,roomSize:1.8,dry:false}, god:0.3, hyper:0.2 },
    { name:"SQUEAK",      icon:ICON('chipmunk'),  master:1.3,  preAmp:1.2,  pitch:7,   effect:"chipmunk",  reverb:{wetMix:0.1, decay:1.0,roomSize:1.2,dry:false}, god:0,   hyper:0   },
    { name:"SAWTOOTH",    icon:ICON('pixel'),     master:1.8,  preAmp:1.7,  pitch:-2,  effect:"bitcrush",  reverb:{wetMix:0.1, decay:1.0,roomSize:1.0,dry:false}, god:0.4, hyper:0   },
    { name:"TRANSMIT",    icon:ICON('broadcast'), master:1.2,  preAmp:1.0,  pitch:0,   effect:"radio",     reverb:{wetMix:0.1, decay:1.0,roomSize:1.0,dry:false}, god:0,   hyper:0   },
    { name:"NEBULA",      icon:ICON('galaxy'),    master:1.3,  preAmp:1.2,  pitch:0,   effect:"alien",     reverb:{wetMix:0.3, decay:2.0,roomSize:1.5,dry:false}, god:0,   hyper:0   },
    { name:"RESONANCE",   icon:ICON('resonator'), master:1.2,  preAmp:1.0,  pitch:0,   effect:"vocalizer", reverb:{wetMix:0.2, decay:2.0,roomSize:1.5,dry:false}, god:0,   hyper:0   },
    { name:"OVERLORD",    icon:ICON('crown'),     master:3.0,  preAmp:2.5,  pitch:0,   effect:null,        reverb:{wetMix:0,   decay:3.5,roomSize:2.3,dry:true},  god:0.7, hyper:0.5 },
    { name:"ANNIHILATE",  icon:ICON('skull'),     master:5.0,  preAmp:3.0,  pitch:0,   effect:"distort",   reverb:{wetMix:0.3, decay:2.5,roomSize:2.0,dry:false}, god:1.0, hyper:1.0 },
    { name:"VORTEX",      icon:ICON('vortex'),    master:2.0,  preAmp:1.8,  pitch:-1,  effect:"chorus",    reverb:{wetMix:0.3, decay:2.5,roomSize:2.0,dry:false}, god:0.5, hyper:0.3 },
    { name:"AIRWAVE",     icon:ICON('caster'),    master:1.4,  preAmp:1.2,  pitch:0,   effect:null,        reverb:{wetMix:0.1, decay:1.5,roomSize:1.2,dry:false}, god:0.1, hyper:0   },
    { name:"DEEP SPACE",  icon:ICON('cosmic'),    master:1.1,  preAmp:1.0,  pitch:-2,  effect:"cave",      reverb:{wetMix:0.7, decay:6.0,roomSize:5.0,dry:false}, god:0,   hyper:0   },
    { name:"CIRCUIT",     icon:ICON('circuit'),   master:1.4,  preAmp:1.2,  pitch:0,   effect:"robot",     reverb:{wetMix:0.2, decay:2.0,roomSize:1.5,dry:false}, god:0.2, hyper:0   },
    { name:"SWEEP",       icon:ICON('wave'),      master:1.2,  preAmp:1.0,  pitch:0,   effect:"flanger",   reverb:{wetMix:0.2, decay:1.5,roomSize:1.2,dry:false}, god:0,   hyper:0   },
    { name:"PULSE",       icon:ICON('pulse'),     master:1.1,  preAmp:1.0,  pitch:2,   effect:"tremolo",   reverb:{wetMix:0.25,decay:2.0,roomSize:1.8,dry:false}, god:0,   hyper:0   },
    { name:"PROJECTOR",   icon:ICON('herald'),    master:1.5,  preAmp:1.3,  pitch:0,   effect:"megaphone", reverb:{wetMix:0.1, decay:1.0,roomSize:1.0,dry:false}, god:0.1, hyper:0   },
  ];

  /* ═══════════════════════════════════════════════════════
     EFFECTS LIST (88 effects)
     ═══════════════════════════════════════════════════════ */
  const EFFECTS = [
    { id:"robot",     name:"MECHA CORE",  icon:ICON('mecha'),      color:"#FFD700" },
    { id:"megaphone", name:"AMPLIFIER",   icon:ICON('amplify'),    color:"#FFC107" },
    { id:"telephone", name:"VINTAGE LINE",icon:ICON('telephone'),  color:"#FFEB3B" },
    { id:"deep",      name:"DARK VOID",   icon:ICON('darkvoid'),   color:"#FFD700" },
    { id:"chipmunk",  name:"SUGAR RUSH",  icon:ICON('sugar'),      color:"#FFC107" },
    { id:"echo",      name:"PHANTOM",     icon:ICON('phantom'),    color:"#FFEC80" },
    { id:"distort",   name:"RAMPAGE",     icon:ICON('rampage'),    color:"#FFD700" },
    { id:"alien",     name:"ETHEREAL",    icon:ICON('ethereal'),   color:"#FFC107" },
    { id:"chorus",    name:"GALAXY",      icon:ICON('galaxy'),     color:"#FFEB3B" },
    { id:"flanger",   name:"WARP DRIVE",  icon:ICON('warp'),       color:"#FFD700" },
    { id:"bitcrush",  name:"PIXEL STORM", icon:ICON('pixel'),      color:"#FFC107" },
    { id:"tremolo",   name:"QUAKE",       icon:ICON('quake'),      color:"#FFEC80" },
    { id:"cave",      name:"ABYSS",       icon:ICON('abyss'),      color:"#FFD700" },
    { id:"radio",     name:"STATIC WAVE", icon:ICON('static'),     color:"#FFC107" },
    { id:"vocalizer", name:"RESONATOR",   icon:ICON('resonator'),  color:"#FFEB3B" },
    { id:"whisper",   name:"SHADE",       icon:ICON('shade'),      color:"#FFD700" },
    { id:"growl",     name:"PREDATOR",    icon:ICON('predator'),   color:"#FFC107" },
    { id:"underwater",name:"DEPTHS",      icon:ICON('depths'),     color:"#FFEC80" },
    { id:"phaser",    name:"PHASE SHIFT", icon:ICON('warp'),       color:"#FFD700" },
    { id:"harmonizer",name:"HARMONIZER",  icon:ICON('resonator'),  color:"#FFC107" },
    { id:"autotune",  name:"AUTO TUNE",   icon:ICON('pitch'),      color:"#FFEB3B" },
    { id:"saturate",  name:"SATURATE",    icon:ICON('amplify2'),   color:"#FFD700" },
    { id:"reverse",   name:"REVERSE",     icon:ICON('echo'),       color:"#FFC107" },
    { id:"vibrato",   name:"VIBRATO",     icon:ICON('warp'),       color:"#FFEC80" },
    { id:"formant",   name:"FORMANT",     icon:ICON('resonator'),  color:"#FFD700" },
    { id:"hall",      name:"HALL",        icon:ICON('reverb'),     color:"#FFC107" },
    { id:"pingpong",  name:"PING PONG",   icon:ICON('echo'),       color:"#FFEB3B" },
    { id:"stutter",   name:"STUTTER",     icon:ICON('pulse'),      color:"#FFD700" },
    { id:"overdrive", name:"OVERDRIVE",   icon:ICON('overdrive'),  color:"#FFC107" },
    { id:"fuzz",      name:"FUZZ",        icon:ICON('rampage'),    color:"#FFEC80" },
    { id:"ringmod",   name:"RING MOD",    icon:ICON('alien'),      color:"#FFD700" },
    { id:"autopan",   name:"AUTO PAN",    icon:ICON('spatial'),    color:"#FFC107" },
    { id:"stepfilter",name:"STEP FILTER", icon:ICON('eq'),         color:"#FFEB3B" },
    { id:"comb",      name:"COMB",        icon:ICON('phantom'),    color:"#FFD700" },
    { id:"doubler",   name:"DOUBLER",     icon:ICON('voice'),      color:"#FFC107" },
    { id:"widen",     name:"WIDENER",     icon:ICON('wider'),      color:"#FFEC80" },
    { id:"sweep",     name:"FILTER SWEEP",icon:ICON('eq'),         color:"#FFD700" },
    { id:"notch",     name:"NOTCH",       icon:ICON('eq'),         color:"#FFC107" },
    { id:"spinner",   name:"SPINNER",     icon:ICON('spatial'),    color:"#FFEB3B" },
    { id:"multitap",  name:"MULTI TAP",   icon:ICON('echo'),       color:"#FFD700" },
    { id:"richchorus",name:"RICH CHORUS", icon:ICON('galaxy'),     color:"#FFC107" },
    { id:"heavy",     name:"HEAVY",       icon:ICON('skull'),      color:"#FFEC80" },
    { id:"spacer",    name:"SPACER",      icon:ICON('abyss'),      color:"#FFD700" },
    { id:"octaver",   name:"OCTAVER",     icon:ICON('pitch'),      color:"#FFC107" },
    { id:"crush",     name:"CRUSHER",     icon:ICON('pixel'),      color:"#FFEB3B" },
    { id:"flang",     name:"FLANGER II",  icon:ICON('warp'),       color:"#FFD700" },
    { id:"trem",      name:"TREMOLO",     icon:ICON('pulse'),      color:"#FFC107" },
    { id:"vowel",     name:"VOWEL",       icon:ICON('eq'),         color:"#FFEC80" },
    { id:"sciFi",     name:"SCI-FI",      icon:ICON('alien'),      color:"#FFD700" },
    { id:"monomaker", name:"MONO",        icon:ICON('spatial'),    color:"#FFC107" },
    { id:"lush",      name:"LUSH",        icon:ICON('reverb'),     color:"#FFEB3B" },
    { id:"trancegate",name:"TRANCE GATE", icon:ICON('pulse'),      color:"#FFD700" },
    { id:"pitchbend", name:"PITCH BEND",  icon:ICON('pitch'),      color:"#FFC107" },
    { id:"microshift",name:"MICRO SHIFT", icon:ICON('pitch'),      color:"#FFEC80" },
    { id:"clip",      name:"HARD CLIP",   icon:ICON('rampage'),    color:"#FFD700" },
    { id:"foldback",  name:"FOLD BACK",   icon:ICON('rampage'),    color:"#FFC107" },
    { id:"wah",       name:"AUTO WAH",    icon:ICON('eq'),         color:"#FFEB3B" },
    { id:"morph",     name:"MORPH",       icon:ICON('eq'),         color:"#FFD700" },
    { id:"reverseecho",name:"REV ECHO",   icon:ICON('echo'),       color:"#FFC107" },
    { id:"tempo",     name:"TEMPO DELAY", icon:ICON('echo'),       color:"#FFEC80" },
    { id:"crystal",   name:"SHIMMER",     icon:ICON('echo'),       color:"#FFD700" },
    { id:"spring",    name:"SPRING",      icon:ICON('abyss'),      color:"#FFC107" },
    { id:"rotary",    name:"ROTARY",      icon:ICON('warp'),       color:"#FFEB3B" },
    { id:"steps",     name:"STEP MOD",    icon:ICON('pulse'),      color:"#FFD700" },
    { id:"bpmtrem",   name:"BPM TREM",    icon:ICON('pulse'),      color:"#FFC107" },
    { id:"noisegate", name:"NOISE GATE",  icon:ICON('shade'),      color:"#FFEC80" },
    { id:"exciter",   name:"EXCITER",     icon:ICON('amplify2'),   color:"#FFD700" },
    { id:"gliss",     name:"GLISSANDO",   icon:ICON('pitch'),      color:"#FFC107" },
    { id:"quant",     name:"QUANTIZE",    icon:ICON('pitch'),      color:"#FFEB3B" },
    { id:"tape",      name:"TAPE",        icon:ICON('overdrive'),  color:"#FFD700" },
    { id:"tube",      name:"TUBE",        icon:ICON('amplify'),    color:"#FFC107" },
    { id:"rectify",   name:"RECTIFY",     icon:ICON('rampage'),    color:"#FFEC80" },
    { id:"envf",      name:"ENV FILTER",  icon:ICON('eq'),         color:"#FFD700" },
    { id:"combplus",  name:"COMB+",       icon:ICON('eq'),         color:"#FFC107" },
    { id:"stereo",    name:"STEREO",      icon:ICON('echo'),       color:"#FFEB3B" },
    { id:"duck",      name:"DUCK",        icon:ICON('phantom'),    color:"#FFD700" },
    { id:"filtered",  name:"FILTERED",    icon:ICON('echo'),       color:"#FFC107" },
    { id:"plate",     name:"PLATE",       icon:ICON('reverb'),     color:"#FFEC80" },
    { id:"cathedral", name:"CATHEDRAL",   icon:ICON('abyss'),      color:"#FFD700" },
    { id:"gated",     name:"GATED",       icon:ICON('depths'),     color:"#FFC107" },
    { id:"vibe",      name:"VIBE",        icon:ICON('warp'),       color:"#FFEB3B" },
    { id:"htrem",     name:"H TREM",      icon:ICON('galaxy'),     color:"#FFD700" },
    { id:"autofilter",name:"AUTO FILTER", icon:ICON('spatial'),    color:"#FFC107" },
    { id:"compress",  name:"COMPRESS",    icon:ICON('voice'),      color:"#FFEC80" },
    { id:"deess",     name:"DE-ESSER",    icon:ICON('shade'),      color:"#FFD700" },
    { id:"glitch",    name:"GLITCH",      icon:ICON('pixel'),      color:"#FFC107" },
    { id:"grain",     name:"GRAIN",       icon:ICON('static'),     color:"#FFEB3B" },
  ];

  /* ═══════════════════════════════════════════════════════
     AUDIO ENGINE — PRESERVED EXACTLY
     ═══════════════════════════════════════════════════════ */
  let audioCtx    = null;
  let activeChain = null;

  function getCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive', sampleRate: 48000 }); }
      catch (e) { return null; }
    }
    return audioCtx;
  }

  function createPitchShifter(ctx) {
    const inputNode  = ctx.createGain();
    const outputNode = ctx.createGain();
    let pitchOffset  = 0;
    inputNode.connect(outputNode);
    const processorCode = [
      'class PitchShiftProcessor extends AudioWorkletProcessor {',
      '  constructor() { super(); this.bufSize=4096; this.inputBuf=new Float32Array(this.bufSize); this.writePos=0; this.grainPhase=0; this._pitchOffset=0; this.port.onmessage=(e)=>{this._pitchOffset=e.data;}; }',
      '  process(inputs,outputs) {',
      '    const inp=inputs[0]; const out=outputs[0];',
      '    if(!inp||!inp[0]||!out||!out[0]) return true;',
      '    const input=inp[0]; const output=out[0];',
      '    const rate=1+this._pitchOffset; const bufSize=this.bufSize; const inputBuf=this.inputBuf;',
      '    let writePos=this.writePos; let grainPhase=this.grainPhase;',
      '    for(let i=0;i<input.length;i++){inputBuf[(writePos+i)%bufSize]=input[i];}',
      '    for(let i=0;i<output.length;i++){',
      '      const readPos=((writePos+i)-bufSize*0.5+grainPhase*bufSize);',
      '      const idx=((Math.round(readPos)%bufSize)+bufSize)%bufSize;',
      '      output[i]=inputBuf[idx]||0;',
      '      grainPhase=(grainPhase+rate/bufSize)%1;',
      '    }',
      '    this.writePos=(writePos+input.length)%bufSize; this.grainPhase=grainPhase; return true;',
      '  }',
      '}',
      'registerProcessor("pitch-shifter",PitchShiftProcessor);'
    ].join('\n');
    try {
      const blob = new Blob([processorCode], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      ctx.audioWorklet.addModule(blobUrl).then(() => {
        URL.revokeObjectURL(blobUrl);
        const proc = new AudioWorkletNode(ctx, 'pitch-shifter');
        inputNode.disconnect();
        inputNode.connect(proc);
        proc.connect(outputNode);
        if (pitchOffset !== 0) proc.port.postMessage(pitchOffset);
        inputNode._awNode = proc;
      }).catch(() => {});
    } catch (e) {}
    return {
      input: inputNode, output: outputNode,
      setPitchOffset(o) { pitchOffset = o; if (inputNode._awNode) inputNode._awNode.port.postMessage(o); }
    };
  }

  function makeDistortionCurve(amount) {
    const n = 512, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x)); }
    return curve;
  }

  function makeBitcrushCurve(bits) {
    const n = 512, curve = new Float32Array(n), step = Math.pow(0.5, bits - 1);
    for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; curve[i] = Math.round(x / step) * step; }
    return curve;
  }

  function buildImpulse(ctx, decay, size) {
    const len = Math.max(100, Math.floor(ctx.sampleRate * Math.min(decay, 10)));
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, Math.max(0.1, size));
    }
    return buf;
  }

  function buildEffectNode(ctx, effectId) {
    const input = ctx.createGain();
    const output = ctx.createGain();
    const disposers = [];

    switch (effectId) {
      case 'robot': { const osc=ctx.createOscillator(); osc.frequency.value=75; const ring=ctx.createGain(); osc.connect(ring.gain); ring.gain.value=1; input.connect(ring); ring.connect(output); osc.start(); disposers.push(()=>{try{osc.stop()}catch(e){}}); break; }
      case 'megaphone': { const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=700; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=3500; const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(30); const g=ctx.createGain(); g.gain.value=2.5; input.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(g); g.connect(output); break; }
      case 'telephone': { const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=500; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=3000; const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(15); input.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(output); break; }
      case 'deep': { const lp1=ctx.createBiquadFilter(); lp1.type='lowpass'; lp1.frequency.value=3000; lp1.Q.value=0.5; const lsf=ctx.createBiquadFilter(); lsf.type='lowshelf'; lsf.frequency.value=200; lsf.gain.value=10; const hsf=ctx.createBiquadFilter(); hsf.type='highshelf'; hsf.frequency.value=4000; hsf.gain.value=-8; const pk=ctx.createBiquadFilter(); pk.type='peaking'; pk.frequency.value=90; pk.gain.value=8; pk.Q.value=0.8; const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(20); ws.oversample='4x'; const g=ctx.createGain(); g.gain.value=1.6; input.connect(lp1); lp1.connect(lsf); lsf.connect(pk); pk.connect(hsf); hsf.connect(ws); ws.connect(g); g.connect(output); break; }
      case 'chipmunk': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0.7); input.connect(ps.input); ps.output.connect(output); break; }
      case 'echo': { const delay=ctx.createDelay(1.0); delay.delayTime.value=0.25; const fb=ctx.createGain(); fb.gain.value=0.4; input.connect(output); input.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(output); break; }
      case 'distort': { const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(80); ws.oversample='2x'; const g=ctx.createGain(); g.gain.value=0.45; input.connect(ws); ws.connect(g); g.connect(output); break; }
      case 'alien': { const lfo=ctx.createOscillator(); lfo.type='sine'; lfo.frequency.value=7; const depth=ctx.createGain(); depth.gain.value=0.6; const mod=ctx.createGain(); mod.gain.value=0.4; lfo.connect(depth); depth.connect(mod.gain); input.connect(mod); mod.connect(output); const ps=createPitchShifter(ctx); ps.setPitchOffset(0.3); const psG=ctx.createGain(); psG.gain.value=0.5; input.connect(ps.input); ps.output.connect(psG); psG.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'chorus': { const delay=ctx.createDelay(0.1); delay.delayTime.value=0.025; const lfo=ctx.createOscillator(); lfo.frequency.value=1.5; const lfoG=ctx.createGain(); lfoG.gain.value=0.008; const wet=ctx.createGain(); wet.gain.value=0.5; lfo.connect(lfoG); lfoG.connect(delay.delayTime); input.connect(output); input.connect(delay); delay.connect(wet); wet.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'flanger': { const delay=ctx.createDelay(0.05); delay.delayTime.value=0.005; const lfo=ctx.createOscillator(); lfo.frequency.value=0.5; const lfoG=ctx.createGain(); lfoG.gain.value=0.003; const fb=ctx.createGain(); fb.gain.value=0.5; const wet=ctx.createGain(); wet.gain.value=0.6; lfo.connect(lfoG); lfoG.connect(delay.delayTime); input.connect(output); input.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'bitcrush': { const ws=ctx.createWaveShaper(); ws.curve=makeBitcrushCurve(4); input.connect(ws); ws.connect(output); break; }
      case 'tremolo': { const lfo=ctx.createOscillator(); lfo.frequency.value=6; const lfoG=ctx.createGain(); lfoG.gain.value=0.4; const trem=ctx.createGain(); trem.gain.value=0.6; lfo.connect(lfoG); lfoG.connect(trem.gain); input.connect(trem); trem.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'cave': { const conv=ctx.createConvolver(); conv.buffer=buildImpulse(ctx,2.0,3.0); const wet=ctx.createGain(); wet.gain.value=0.6; const dry=ctx.createGain(); dry.gain.value=0.6; input.connect(dry); dry.connect(output); input.connect(conv); conv.connect(wet); wet.connect(output); break; }
      case 'radio': { const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=800; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2800; const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(20); input.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(output); const nbuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate); const nd=nbuf.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=(Math.random()*2-1)*0.03; const noise=ctx.createBufferSource(); noise.buffer=nbuf; noise.loop=true; noise.connect(output); noise.start(); disposers.push(()=>{try{noise.stop()}catch(e){}}); break; }
      case 'vocalizer': { const f1=ctx.createBiquadFilter(); f1.type='bandpass'; f1.frequency.value=700; f1.Q.value=6; const f2=ctx.createBiquadFilter(); f2.type='bandpass'; f2.frequency.value=1220; f2.Q.value=6; const f3=ctx.createBiquadFilter(); f3.type='bandpass'; f3.frequency.value=2600; f3.Q.value=6; const s=ctx.createGain(); s.gain.value=1.2; input.connect(f1); f1.connect(s); input.connect(f2); f2.connect(s); input.connect(f3); f3.connect(s); s.connect(output); break; }
      case 'whisper': { const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=4000; const g=ctx.createGain(); g.gain.value=0.4; const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(5); input.connect(ws); ws.connect(lp); lp.connect(g); g.connect(output); break; }
      case 'growl': { const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(200); ws.oversample='4x'; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=100; const g=ctx.createGain(); g.gain.value=0.6; input.connect(ws); ws.connect(hp); hp.connect(g); g.connect(output); break; }
      case 'underwater': { const lp1=ctx.createBiquadFilter(); lp1.type='lowpass'; lp1.frequency.value=600; const lp2=ctx.createBiquadFilter(); lp2.type='lowpass'; lp2.frequency.value=600; const lfo=ctx.createOscillator(); lfo.frequency.value=0.3; const lfoG=ctx.createGain(); lfoG.gain.value=200; lfo.connect(lfoG); lfoG.connect(lp1.frequency); input.connect(lp1); lp1.connect(lp2); lp2.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'phaser': { const ap1=ctx.createBiquadFilter(); ap1.type='allpass'; ap1.frequency.value=800; ap1.Q.value=1; const ap2=ctx.createBiquadFilter(); ap2.type='allpass'; ap2.frequency.value=1600; ap2.Q.value=1; const ap3=ctx.createBiquadFilter(); ap3.type='allpass'; ap3.frequency.value=2400; ap3.Q.value=1; const lfo=ctx.createOscillator(); lfo.frequency.value=0.8; const lfoG=ctx.createGain(); lfoG.gain.value=1200; const fb=ctx.createGain(); fb.gain.value=0.3; lfo.connect(lfoG); lfoG.connect(ap1.frequency); lfoG.connect(ap2.frequency); lfoG.connect(ap3.frequency); input.connect(ap1); ap1.connect(ap2); ap2.connect(ap3); ap3.connect(output); ap3.connect(fb); fb.connect(ap1); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'harmonizer': { const dry=ctx.createGain(); dry.gain.value=0.5; const ps1=createPitchShifter(ctx); ps1.setPitchOffset(0.5); const ps2=createPitchShifter(ctx); ps2.setPitchOffset(-0.5); const mix1=ctx.createGain(); mix1.gain.value=0.3; const mix2=ctx.createGain(); mix2.gain.value=0.3; input.connect(dry); dry.connect(output); input.connect(ps1.input); ps1.output.connect(mix1); mix1.connect(output); input.connect(ps2.input); ps2.output.connect(mix2); mix2.connect(output); break; }
      case 'autotune': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0); const sh=ctx.createGain(); sh.gain.value=0.3; const lfo=ctx.createOscillator(); lfo.frequency.value=3; const lfoG=ctx.createGain(); lfoG.gain.value=0.03; lfo.connect(lfoG); lfoG.connect(ps.input.gain); input.connect(ps.input); ps.output.connect(sh); sh.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'saturate': { const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(40); ws.oversample='4x'; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=6000; const g=ctx.createGain(); g.gain.value=0.7; input.connect(ws); ws.connect(lp); lp.connect(g); g.connect(output); break; }
      case 'reverse': { const rev=ctx.createConvolver(); const ir=ctx.createBuffer(2,ctx.sampleRate*0.5,ctx.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(i/d.length*-3)*(1-i/d.length);} rev.buffer=ir; const wet=ctx.createGain(); wet.gain.value=0.5; input.connect(rev); rev.connect(wet); wet.connect(output); input.connect(output); break; }
      case 'vibrato': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0); const lfo=ctx.createOscillator(); lfo.frequency.value=5; const lfoG=ctx.createGain(); lfoG.gain.value=0.05; lfo.connect(lfoG); lfoG.connect(ps.input.gain); input.connect(ps.input); ps.output.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'formant': { const f1=ctx.createBiquadFilter(); f1.type='peaking'; f1.frequency.value=500; f1.Q.value=8; f1.gain.value=12; const f2=ctx.createBiquadFilter(); f2.type='peaking'; f2.frequency.value=1500; f2.Q.value=6; f2.gain.value=8; const f3=ctx.createBiquadFilter(); f3.type='peaking'; f3.frequency.value=3000; f3.Q.value=4; f3.gain.value=6; const g=ctx.createGain(); g.gain.value=1.2; input.connect(f1); f1.connect(f2); f2.connect(f3); f3.connect(g); g.connect(output); break; }
      case 'hall': { const conv=ctx.createConvolver(); const ir=ctx.createBuffer(2,ctx.sampleRate*1.2,ctx.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.15));} conv.buffer=ir; const wet=ctx.createGain(); wet.gain.value=0.5; const dry=ctx.createGain(); dry.gain.value=0.7; input.connect(dry); dry.connect(output); input.connect(conv); conv.connect(wet); wet.connect(output); break; }
      case 'pingpong': { const dL=ctx.createDelay(1); dL.delayTime.value=0.3; const dR=ctx.createDelay(1); dR.delayTime.value=0.5; const fbL=ctx.createGain(); fbL.gain.value=0.3; const fbR=ctx.createGain(); fbR.gain.value=0.3; input.connect(output); input.connect(dL); dL.connect(fbL); fbL.connect(dL); dL.connect(output); fbL.connect(dR); dR.connect(fbR); fbR.connect(dR); dR.connect(output); break; }
      case 'stutter': { const lfo=ctx.createOscillator(); lfo.type='square'; lfo.frequency.value=8; const g=ctx.createGain(); g.gain.value=0; lfo.connect(g.gain); input.connect(g); g.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'overdrive': { const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(50); ws.oversample='4x'; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=5000; const g=ctx.createGain(); g.gain.value=0.6; input.connect(ws); ws.connect(lp); lp.connect(g); g.connect(output); break; }
      case 'fuzz': { const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(300); ws.oversample='4x'; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=80; const g=ctx.createGain(); g.gain.value=0.35; input.connect(ws); ws.connect(hp); hp.connect(g); g.connect(output); break; }
      case 'ringmod': { const osc=ctx.createOscillator(); osc.frequency.value=200; osc.type='sine'; const mod=ctx.createGain(); mod.gain.value=0; const out=ctx.createGain(); out.gain.value=0.5; osc.connect(mod.gain); input.connect(mod); mod.connect(out); out.connect(output); osc.start(); disposers.push(()=>{try{osc.stop()}catch(e){}}); break; }
      case 'autopan': { const lfo=ctx.createOscillator(); lfo.frequency.value=0.5; lfo.type='sine'; const pan=ctx.createStereoPanner?ctx.createStereoPanner():null; if(pan){lfo.connect(pan.pan);input.connect(pan);pan.connect(output);}else{input.connect(output);} lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'stepfilter': { const lfo=ctx.createOscillator(); lfo.frequency.value=1; lfo.type='sawtooth'; const lfoG=ctx.createGain(); lfoG.gain.value=3000; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1000; const baseLFO=ctx.createOscillator(); baseLFO.frequency.value=0.2; const baseG=ctx.createGain(); baseG.gain.value=1000; baseLFO.connect(baseG); baseG.connect(lp.frequency); lfo.connect(lfoG); lfoG.connect(lp.frequency); input.connect(lp); lp.connect(output); lfo.start(); baseLFO.start(); disposers.push(()=>{try{lfo.stop();baseLFO.stop()}catch(e){}}); break; }
      case 'comb': { const delay=ctx.createDelay(0.1); delay.delayTime.value=0.008; const fb=ctx.createGain(); fb.gain.value=0.6; input.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(output); input.connect(output); break; }
      case 'doubler': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0.02); const ps2=createPitchShifter(ctx); ps2.setPitchOffset(-0.02); const delay=ctx.createDelay(0.05); delay.delayTime.value=0.015; const dry=ctx.createGain(); dry.gain.value=0.5; const wet1=ctx.createGain(); wet1.gain.value=0.3; const wet2=ctx.createGain(); wet2.gain.value=0.3; input.connect(dry); dry.connect(output); input.connect(ps.input); ps.output.connect(wet1); wet1.connect(output); input.connect(delay); delay.connect(ps2.input); ps2.output.connect(wet2); wet2.connect(output); break; }
      case 'widen': { const merger=ctx.createChannelMerger?ctx.createChannelMerger(2):null; const splitter=ctx.createChannelSplitter?ctx.createChannelSplitter(2):null; if(splitter&&merger){const delayL=ctx.createDelay(0.02); delayL.delayTime.value=0.012; const delayR=ctx.createDelay(0.02); delayR.delayTime.value=0.008; input.connect(splitter); splitter.connect(delayL,0); delayL.connect(merger,0,0); splitter.connect(delayR,1); delayR.connect(merger,0,1); merger.connect(output);}else{input.connect(output);} break; }
      case 'sweep': { const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2000; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=200; const lfo=ctx.createOscillator(); lfo.frequency.value=0.5; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=3000; const lfoG2=ctx.createGain(); lfoG2.gain.value=3000; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.connect(lfoG2); lfoG2.connect(hp.frequency); input.connect(lp); lp.connect(hp); hp.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'notch': { const n=ctx.createBiquadFilter(); n.type='notch'; n.frequency.value=1000; n.Q.value=10; const lfo=ctx.createOscillator(); lfo.frequency.value=0.3; const lfoG=ctx.createGain(); lfoG.gain.value=800; lfo.connect(lfoG); lfoG.connect(n.frequency); input.connect(n); n.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'spinner': { const lfo=ctx.createOscillator(); lfo.frequency.value=0.8; lfo.type='sine'; const sp=ctx.createStereoPanner?ctx.createStereoPanner():null; if(sp){const lfoG=ctx.createGain(); lfoG.gain.value=0.9; lfo.connect(lfoG); lfoG.connect(sp.pan); input.connect(sp); sp.connect(output);}else{input.connect(output);} lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'multitap': { const d1=ctx.createDelay(1); d1.delayTime.value=0.15; const d2=ctx.createDelay(1); d2.delayTime.value=0.3; const d3=ctx.createDelay(1); d3.delayTime.value=0.45; const g1=ctx.createGain(); g1.gain.value=0.3; const g2=ctx.createGain(); g2.gain.value=0.2; const g3=ctx.createGain(); g3.gain.value=0.1; input.connect(output); input.connect(d1); d1.connect(g1); g1.connect(output); input.connect(d2); d2.connect(g2); g2.connect(output); input.connect(d3); d3.connect(g3); g3.connect(output); break; }
      case 'richchorus': { const dl1=ctx.createDelay(0.05); dl1.delayTime.value=0.015; const dl2=ctx.createDelay(0.05); dl2.delayTime.value=0.02; const dl3=ctx.createDelay(0.05); dl3.delayTime.value=0.025; const lfo=ctx.createOscillator(); lfo.frequency.value=0.8; const lfoG=ctx.createGain(); lfoG.gain.value=0.004; const lfoG2=ctx.createGain(); lfoG2.gain.value=0.004; const lfoG3=ctx.createGain(); lfoG3.gain.value=0.004; const w1=ctx.createGain(); w1.gain.value=0.25; const w2=ctx.createGain(); w2.gain.value=0.25; const w3=ctx.createGain(); w3.gain.value=0.25; lfo.connect(lfoG); lfoG.connect(dl1.delayTime); lfo.connect(lfoG2); lfoG2.connect(dl2.delayTime); lfo.connect(lfoG3); lfoG3.connect(dl3.delayTime); input.connect(output); input.connect(dl1); dl1.connect(w1); w1.connect(output); input.connect(dl2); dl2.connect(w2); w2.connect(output); input.connect(dl3); dl3.connect(w3); w3.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'heavy': { const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(500); ws.oversample='4x'; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=50; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=4000; const g=ctx.createGain(); g.gain.value=0.2; input.connect(ws); ws.connect(hp); hp.connect(lp); lp.connect(g); g.connect(output); break; }
      case 'spacer': { const conv=ctx.createConvolver(); const ir=ctx.createBuffer(2,ctx.sampleRate*2,ctx.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.05));} conv.buffer=ir; const wet=ctx.createGain(); wet.gain.value=0.8; const dry=ctx.createGain(); dry.gain.value=0.3; input.connect(dry); dry.connect(output); input.connect(conv); conv.connect(wet); wet.connect(output); break; }
      case 'octaver': { const ps=createPitchShifter(ctx); ps.setPitchOffset(1); const psb=createPitchShifter(ctx); psb.setPitchOffset(-1); const dry=ctx.createGain(); dry.gain.value=0.4; const up=ctx.createGain(); up.gain.value=0.3; const down=ctx.createGain(); down.gain.value=0.3; input.connect(dry); dry.connect(output); input.connect(ps.input); ps.output.connect(up); up.connect(output); input.connect(psb.input); psb.output.connect(down); down.connect(output); break; }
      case 'crush': { const ws=ctx.createWaveShaper(); ws.curve=makeBitcrushCurve(2); const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=3000; input.connect(ws); ws.connect(lp); lp.connect(output); break; }
      case 'flang': { const delay=ctx.createDelay(0.02); delay.delayTime.value=0.003; const lfo=ctx.createOscillator(); lfo.frequency.value=0.3; const lfoG=ctx.createGain(); lfoG.gain.value=0.001; const fb=ctx.createGain(); fb.gain.value=0.3; const wet=ctx.createGain(); wet.gain.value=0.5; lfo.connect(lfoG); lfoG.connect(delay.delayTime); input.connect(output); input.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'trem': { const lfo=ctx.createOscillator(); lfo.frequency.value=4; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=0.5; const g=ctx.createGain(); g.gain.value=0.5; lfo.connect(lfoG); lfoG.connect(g.gain); input.connect(g); g.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'vowel': { const f1=ctx.createBiquadFilter(); f1.type='bandpass'; f1.frequency.value=500; f1.Q.value=5; const f2=ctx.createBiquadFilter(); f2.type='bandpass'; f2.frequency.value=1500; f2.Q.value=5; const f3=ctx.createBiquadFilter(); f3.type='bandpass'; f3.frequency.value=2500; f3.Q.value=5; const lfo=ctx.createOscillator(); lfo.frequency.value=0.3; const lfoG1=ctx.createGain(); lfoG1.gain.value=300; const lfoG2=ctx.createGain(); lfoG2.gain.value=400; const lfoG3=ctx.createGain(); lfoG3.gain.value=500; lfo.connect(lfoG1); lfoG1.connect(f1.frequency); lfo.connect(lfoG2); lfoG2.connect(f2.frequency); lfo.connect(lfoG3); lfoG3.connect(f3.frequency); input.connect(f1); input.connect(f2); input.connect(f3); f1.connect(output); f2.connect(output); f3.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'sciFi': { const ring=ctx.createGain(); ring.gain.value=0; const osc=ctx.createOscillator(); osc.frequency.value=800; const mod=ctx.createGain(); mod.gain.value=1; osc.connect(mod); mod.connect(ring.gain); const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1000; bp.Q.value=2; const lfo=ctx.createOscillator(); lfo.frequency.value=0.6; const lfoG=ctx.createGain(); lfoG.gain.value=600; lfo.connect(lfoG); lfoG.connect(bp.frequency); input.connect(ring); ring.connect(bp); bp.connect(output); osc.start(); lfo.start(); disposers.push(()=>{try{osc.stop();lfo.stop()}catch(e){}}); break; }
      case 'monomaker': { const sp=ctx.createChannelSplitter(2); const gL=ctx.createGain(); gL.gain.value=0.5; const gR=ctx.createGain(); gR.gain.value=0.5; const mg=ctx.createChannelMerger(2); input.connect(sp); sp.connect(gL,0); sp.connect(gR,1); gL.connect(mg,0,0); gR.connect(mg,0,1); gL.connect(mg,0,0); gR.connect(mg,0,1); mg.connect(output); break; }
      case 'lush': { const ir=ctx.createBuffer(2,ctx.sampleRate*3,ctx.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++){const n=Math.random()*2-1;d[i]=n*Math.exp(-i/(d.length*0.08));}} const conv=ctx.createConvolver(); conv.buffer=ir; const wet=ctx.createGain(); wet.gain.value=0.7; const dry=ctx.createGain(); dry.gain.value=0.4; input.connect(dry); dry.connect(output); input.connect(conv); conv.connect(wet); wet.connect(output); break; }
      case 'trancegate': { const lfo=ctx.createOscillator(); lfo.frequency.value=4; lfo.type='square'; const lfoG=ctx.createGain(); lfoG.gain.value=0.7; const g=ctx.createGain(); g.gain.value=0.5; lfo.connect(lfoG); lfoG.connect(g.gain); input.connect(g); g.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'pitchbend': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0); const lfo=ctx.createOscillator(); lfo.frequency.value=0.5; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=5; lfo.connect(lfoG); const updater=()=>{try{ps.setPitchOffset(lfoG.gain.value*Math.sin(Date.now()/1000))}catch(e){}}; const iv=setInterval(updater,50); input.connect(ps.input); ps.output.connect(output); lfo.start(); disposers.push(()=>{clearInterval(iv);try{lfo.stop()}catch(e){}}); break; }
      case 'microshift': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0.05); const dl=ctx.createDelay(0.05); dl.delayTime.value=0.025; const dry=ctx.createGain(); dry.gain.value=0.5; const wet=ctx.createGain(); wet.gain.value=0.5; input.connect(dry); dry.connect(output); input.connect(ps.input); ps.output.connect(dl); dl.connect(wet); wet.connect(output); break; }
      case 'clip': { const ws=ctx.createWaveShaper(); ws.curve=makeDistortionCurve(0); ws.oversample='2x'; const gain=ctx.createGain(); gain.gain.value=2; const trim=ctx.createGain(); trim.gain.value=0.6; input.connect(gain); gain.connect(ws); ws.connect(trim); trim.connect(output); break; }
      case 'foldback': { const size=44100; const curve=new Float32Array(size); for(let i=0;i<size;i++){let x=(i/size)*4-2; if(x>1)x=2-x; else if(x<-1)x=-2-x; curve[i]=x*0.7;} const ws=ctx.createWaveShaper(); ws.curve=curve; ws.oversample='2x'; input.connect(ws); ws.connect(output); break; }
      case 'wah': { const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=500; bp.Q.value=8; const lfo=ctx.createOscillator(); lfo.frequency.value=1.5; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=2000; lfo.connect(lfoG); lfoG.connect(bp.frequency); input.connect(bp); bp.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'morph': { const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=500; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=500; const lfo=ctx.createOscillator(); lfo.frequency.value=0.3; lfo.type='triangle'; const lfoG=ctx.createGain(); lfoG.gain.value=3000; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfoG.connect(hp.frequency); const g=ctx.createGain(); g.gain.value=0.6; input.connect(lp); lp.connect(hp); hp.connect(g); g.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'reverseecho': { const dl=ctx.createDelay(0.8); dl.delayTime.value=0.6; const fb=ctx.createGain(); fb.gain.value=0.6; const rev=ctx.createGain(); rev.gain.value=-0.7; const wet=ctx.createGain(); wet.gain.value=0.5; input.connect(output); input.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(rev); rev.connect(wet); wet.connect(output); break; }
      case 'tempo': { const dl=ctx.createDelay(0.6); dl.delayTime.value=0.5; const fb=ctx.createGain(); fb.gain.value=0.4; const wet=ctx.createGain(); wet.gain.value=0.5; input.connect(output); input.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(output); break; }
      case 'crystal': { const ps=createPitchShifter(ctx); ps.setPitchOffset(7); const dl=ctx.createDelay(0.4); dl.delayTime.value=0.3; const fb=ctx.createGain(); fb.gain.value=0.3; const wet=ctx.createGain(); wet.gain.value=0.4; input.connect(output); input.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(ps.input); ps.output.connect(wet); wet.connect(output); break; }
      case 'spring': { const ir=ctx.createBuffer(1,ctx.sampleRate*0.8,ctx.sampleRate); const d=ir.getChannelData(0); for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate; d[i]=(Math.random()*2-1)*Math.exp(-t*8)*(Math.sin(t*200)*0.5+0.5);} const conv=ctx.createConvolver(); conv.buffer=ir; const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1500; bp.Q.value=2; const wet=ctx.createGain(); wet.gain.value=0.6; const dry=ctx.createGain(); dry.gain.value=0.5; input.connect(dry); dry.connect(output); input.connect(bp); bp.connect(conv); conv.connect(wet); wet.connect(output); break; }
      case 'rotary': { const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1000; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=200; const lfo=ctx.createOscillator(); lfo.frequency.value=1.5; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=800; const lfoG2=ctx.createGain(); lfoG2.gain.value=300; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.connect(lfoG2); lfoG2.connect(hp.frequency); const g=ctx.createGain(); g.gain.value=0.7; const trem=ctx.createGain(); trem.gain.value=0.5; const tremLfo=ctx.createOscillator(); tremLfo.frequency.value=3.5; tremLfo.type='sine'; const tremG=ctx.createGain(); tremG.gain.value=0.4; tremLfo.connect(tremG); tremG.connect(trem.gain); input.connect(lp); lp.connect(hp); hp.connect(trem); trem.connect(g); g.connect(output); lfo.start(); tremLfo.start(); disposers.push(()=>{try{lfo.stop();tremLfo.stop()}catch(e){}}); break; }
      case 'steps': { const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=800; bp.Q.value=4; const sampler=()=>{const v=Math.random()*2000+300; bp.frequency.setTargetAtTime(v,ctx.currentTime,0.05);}; const iv=setInterval(sampler,200); input.connect(bp); bp.connect(output); disposers.push(()=>{clearInterval(iv)}); break; }
      case 'bpmtrem': { const lfo=ctx.createOscillator(); lfo.frequency.value=2.5; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=0.5; const g=ctx.createGain(); g.gain.value=0.5; lfo.connect(lfoG); lfoG.connect(g.gain); input.connect(g); g.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'noisegate': { const g=ctx.createGain(); g.gain.value=0; const analyser=ctx.createAnalyser(); analyser.fftSize=256; const data=new Uint8Array(analyser.frequencyBinCount); input.connect(analyser); input.connect(g); g.connect(output); const check=()=>{analyser.getByteFrequencyData(data); const avg=data.reduce((a,b)=>a+b,0)/data.length; g.gain.setTargetAtTime(avg>3?1:0,ctx.currentTime,0.05);}; const iv=setInterval(check,50); disposers.push(()=>{clearInterval(iv)}); break; }
      case 'exciter': { const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=3000; hp.Q.value=2; const ws=ctx.createWaveShaper(); const curve=new Float32Array(44100); for(let i=0;i<44100;i++){const x=(i/44100)*2-1; curve[i]=x+0.3*x*x*x;} ws.curve=curve; ws.oversample='2x'; const wet=ctx.createGain(); wet.gain.value=0.3; const dry=ctx.createGain(); dry.gain.value=0.8; input.connect(dry); dry.connect(output); input.connect(hp); hp.connect(ws); ws.connect(wet); wet.connect(output); break; }
      case 'gliss': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0); let target=0; const glide=()=>{const diff=target-(ps._offset||0); if(Math.abs(diff)>0.01)ps.setPitchOffset(ps._offset+diff*0.1);}; const iv=setInterval(glide,30); const rnd=setInterval(()=>{target=(Math.random()-0.5)*12;},800); input.connect(ps.input); ps.output.connect(output); disposers.push(()=>{clearInterval(iv);clearInterval(rnd)}); break; }
      case 'quant': { const ps=createPitchShifter(ctx); ps.setPitchOffset(0); const iv=setInterval(()=>{const semitones=Math.round((Math.random()-0.5)*8)*2; ps.setPitchOffset(semitones);},600); input.connect(ps.input); ps.output.connect(output); disposers.push(()=>{clearInterval(iv)}); break; }
      case 'tape': { const ws=ctx.createWaveShaper(); const curve=new Float32Array(44100); for(let i=0;i<44100;i++){const x=(i/44100)*2-1; curve[i]=Math.tanh(2.5*x)*0.8+0.05*x*x*x;} ws.curve=curve; ws.oversample='2x'; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=6000; const g=ctx.createGain(); g.gain.value=1.5; input.connect(g); g.connect(ws); ws.connect(lp); lp.connect(output); break; }
      case 'tube': { const ws=ctx.createWaveShaper(); const curve=new Float32Array(44100); for(let i=0;i<44100;i++){let x=(i/44100)*2-1; curve[i]=x/(1+Math.abs(x)*2)*1.2;} ws.curve=curve; ws.oversample='4x'; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=80; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=5000; input.connect(hp); hp.connect(ws); ws.connect(lp); lp.connect(output); break; }
      case 'rectify': { const curve=new Float32Array(44100); for(let i=0;i<44100;i++){const x=(i/44100)*2-1; curve[i]=Math.abs(x)*0.8;} const ws=ctx.createWaveShaper(); ws.curve=curve; ws.oversample='2x'; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2000; input.connect(ws); ws.connect(lp); lp.connect(output); break; }
      case 'envf': { const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1000; bp.Q.value=3; const lfo=ctx.createOscillator(); lfo.frequency.value=0.8; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=1500; lfo.connect(lfoG); lfoG.connect(bp.frequency); const g=ctx.createGain(); g.gain.value=0.8; input.connect(bp); bp.connect(g); g.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'combplus': { const dl=ctx.createDelay(0.05); dl.delayTime.value=0.015; const fb=ctx.createGain(); fb.gain.value=0.7; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=3000; input.connect(output); input.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(lp); lp.connect(output); break; }
      case 'stereo': { const dL=ctx.createDelay(0.5); dL.delayTime.value=0.3; const dR=ctx.createDelay(0.5); dR.delayTime.value=0.45; const fbL=ctx.createGain(); fbL.gain.value=0.3; const fbR=ctx.createGain(); fbR.gain.value=0.3; const sp=ctx.createChannelSplitter(2); const mg=ctx.createChannelMerger(2); const dryL=ctx.createGain(); dryL.gain.value=0.5; const dryR=ctx.createGain(); dryR.gain.value=0.5; input.connect(sp); sp.connect(dryL,0); dryL.connect(mg,0,0); sp.connect(dryR,1); dryR.connect(mg,0,1); sp.connect(dL,0); dL.connect(fbL); fbL.connect(dL); dL.connect(mg,0,0); sp.connect(dR,1); dR.connect(fbR); fbR.connect(dR); dR.connect(mg,0,1); mg.connect(output); break; }
      case 'duck': { const dl=ctx.createDelay(0.5); dl.delayTime.value=0.25; const fb=ctx.createGain(); fb.gain.value=0.4; const wet=ctx.createGain(); wet.gain.value=0.5; const analyser=ctx.createAnalyser(); analyser.fftSize=128; const data=new Uint8Array(analyser.frequencyBinCount); input.connect(analyser); input.connect(output); input.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); const iv=setInterval(()=>{analyser.getByteTimeDomainData(data); const peak=Math.max(...data)/128-1; wet.gain.setTargetAtTime(peak>0.5?0.1:0.5,ctx.currentTime,0.05);},50); wet.connect(output); disposers.push(()=>{clearInterval(iv)}); break; }
      case 'filtered': { const dl=ctx.createDelay(0.5); dl.delayTime.value=0.35; const fb=ctx.createGain(); fb.gain.value=0.5; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2000; const wet=ctx.createGain(); wet.gain.value=0.5; input.connect(output); input.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(lp); lp.connect(wet); wet.connect(output); break; }
      case 'plate': { const ir=ctx.createBuffer(2,ctx.sampleRate*1.2,ctx.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate; d[i]=(Math.random()*2-1)*Math.exp(-t*6)*(1+Math.sin(t*120)*0.3);}} const conv=ctx.createConvolver(); conv.buffer=ir; const wet=ctx.createGain(); wet.gain.value=0.5; const dry=ctx.createGain(); dry.gain.value=0.6; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=7000; input.connect(dry); dry.connect(output); input.connect(conv); conv.connect(lp); lp.connect(wet); wet.connect(output); break; }
      case 'cathedral': { const ir=ctx.createBuffer(2,ctx.sampleRate*4,ctx.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate; d[i]=(Math.random()*2-1)*Math.exp(-t*1.2)*(0.5+0.5*Math.sin(t*50+ch*Math.PI));}} const conv=ctx.createConvolver(); conv.buffer=ir; const wet=ctx.createGain(); wet.gain.value=0.7; const dry=ctx.createGain(); dry.gain.value=0.3; input.connect(dry); dry.connect(output); input.connect(conv); conv.connect(wet); wet.connect(output); break; }
      case 'gated': { const ir=ctx.createBuffer(2,ctx.sampleRate*0.4,ctx.sampleRate); for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate; d[i]=(Math.random()*2-1)*Math.exp(-t*15); if(t>0.12)d[i]*=Math.max(0,1-(t-0.12)*8);}} const conv=ctx.createConvolver(); conv.buffer=ir; const wet=ctx.createGain(); wet.gain.value=0.6; const dry=ctx.createGain(); dry.gain.value=0.5; input.connect(dry); dry.connect(output); input.connect(conv); conv.connect(wet); wet.connect(output); break; }
      case 'vibe': { const ap=ctx.createBiquadFilter(); ap.type='allpass'; ap.frequency.value=600; ap.Q.value=2; const lfo=ctx.createOscillator(); lfo.frequency.value=1.2; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=400; lfo.connect(lfoG); lfoG.connect(ap.frequency); const trem=ctx.createGain(); trem.gain.value=0.7; const tremLfo=ctx.createOscillator(); tremLfo.frequency.value=1.2; tremLfo.type='sine'; const tremG=ctx.createGain(); tremG.gain.value=0.25; tremLfo.connect(tremG); tremG.connect(trem.gain); input.connect(ap); ap.connect(trem); trem.connect(output); lfo.start(); tremLfo.start(); disposers.push(()=>{try{lfo.stop();tremLfo.stop()}catch(e){}}); break; }
      case 'htrem': { const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=800; const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=800; const lfo=ctx.createOscillator(); lfo.frequency.value=2.5; lfo.type='sine'; const gL=ctx.createGain(); gL.gain.value=0.5; const gH=ctx.createGain(); gH.gain.value=0.5; const lfoGL=ctx.createGain(); lfoGL.gain.value=0.4; const lfoGH=ctx.createGain(); lfoGH.gain.value=-0.4; lfo.connect(lfoGL); lfoGL.connect(gL.gain); lfo.connect(lfoGH); lfoGH.connect(gH.gain); input.connect(lp); lp.connect(gL); gL.connect(output); input.connect(hp); hp.connect(gH); gH.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'autofilter': { const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=500; const lfo=ctx.createOscillator(); lfo.frequency.value=0.6; lfo.type='triangle'; const lfoG=ctx.createGain(); lfoG.gain.value=3000; lfo.connect(lfoG); lfoG.connect(lp.frequency); input.connect(lp); lp.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      case 'compress': { const gain=ctx.createGain(); gain.gain.value=1; const analyser=ctx.createAnalyser(); analyser.fftSize=128; const data=new Uint8Array(analyser.frequencyBinCount); input.connect(analyser); input.connect(gain); gain.connect(output); const iv=setInterval(()=>{analyser.getByteTimeDomainData(data); const peak=Math.max(...data)/128-1; const reduction=Math.min(1,1/(peak*2+0.01)); const ratio=1+(reduction-1)*0.7; gain.gain.setTargetAtTime(Math.max(0.2,ratio),ctx.currentTime,0.03);},30); disposers.push(()=>{clearInterval(iv)}); break; }
      case 'deess': { const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=6000; hp.Q.value=3; const ws=ctx.createGain(); ws.gain.value=0.2; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=5000; const dry=ctx.createGain(); dry.gain.value=0.8; input.connect(dry); dry.connect(output); input.connect(hp); hp.connect(ws); ws.connect(lp); lp.connect(output); break; }
      case 'glitch': { const g=ctx.createGain(); g.gain.value=1; const iv=setInterval(()=>{if(Math.random()>0.6)g.gain.setTargetAtTime(Math.random()>0.5?0:1,ctx.currentTime,0.02);},120); input.connect(g); g.connect(output); disposers.push(()=>{clearInterval(iv)}); break; }
      case 'grain': { const dl=ctx.createDelay(0.3); dl.delayTime.value=0.12; const fb=ctx.createGain(); fb.gain.value=0.3; const mod=ctx.createGain(); mod.gain.value=0.4; const lfo=ctx.createOscillator(); lfo.frequency.value=3; lfo.type='sine'; const lfoG=ctx.createGain(); lfoG.gain.value=0.05; lfo.connect(lfoG); lfoG.connect(dl.delayTime); input.connect(output); input.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(mod); mod.connect(output); lfo.start(); disposers.push(()=>{try{lfo.stop()}catch(e){}}); break; }
      default: { input.connect(output); }
    }
    return { input, output, dispose: () => disposers.forEach(d => d()) };
  }

  function buildChain(ctx, sourceStream) {
    const src    = ctx.createMediaStreamSource(sourceStream);
    const dest   = ctx.createMediaStreamDestination();
    const preAmp = ctx.createGain(); preAmp.gain.value = STATE.preAmp;
    const pitchBypass = ctx.createGain();
    let   pitchShifter = null;

    const eqNodes = EQ_FREQS.map((freq, i) => {
      const f = ctx.createBiquadFilter();
      if (i === 0)                        { f.type = 'lowshelf';  f.frequency.value = 80; }
      else if (i === EQ_FREQS.length - 1) { f.type = 'highshelf'; f.frequency.value = 12000; }
      else                                { f.type = 'peaking';   f.frequency.value = freq; f.Q.value = 1.2; }
      f.gain.value = STATE.eqBands[i] || 0;
      return f;
    });

    const fxIn  = ctx.createGain();
    const fxOut = ctx.createGain();
    const chaosGain    = ctx.createGain(); chaosGain.gain.value    = 1.0;
    const godGainNode  = ctx.createGain(); godGainNode.gain.value  = 1.0;
    const reverbConv   = ctx.createConvolver();
    reverbConv.buffer  = buildImpulse(ctx, STATE.reverb.decay, STATE.reverb.roomSize);
    const reverbWet    = ctx.createGain(); reverbWet.gain.value = STATE.reverb.dry ? 0 : STATE.reverb.wetMix;
    const reverbDry    = ctx.createGain(); reverbDry.gain.value = 1;
    const comp         = ctx.createDynamicsCompressor();
    comp.threshold.value = STATE.compThreshold;
    comp.ratio.value     = STATE.compRatio;
    comp.knee.value      = 20;
    comp.attack.value    = 0.003;
    comp.release.value   = 0.15;
    const masterGainNode = ctx.createGain(); masterGainNode.gain.value = STATE.masterGain;
    const inAnalyser  = ctx.createAnalyser(); inAnalyser.fftSize = 256;
    const outAnalyser = ctx.createAnalyser(); outAnalyser.fftSize = 512;
    const widerSplit    = ctx.createChannelSplitter(2);
    const widerMerge    = ctx.createChannelMerger(2);
    const widerMidGain  = ctx.createGain(); widerMidGain.gain.value = 1.0;
    const widerSideGain = ctx.createGain(); widerSideGain.gain.value = STATE.widerEnabled ? STATE.widerWidth * STATE.widerDepth : 1.0;
    const widerLpf      = ctx.createBiquadFilter(); widerLpf.type = 'lowpass'; widerLpf.frequency.value = STATE.widerFreq;
    widerSplit.connect(widerMidGain,  0);
    widerSplit.connect(widerSideGain, 1);
    widerMidGain.connect(widerMerge,  0, 0);
    widerSideGain.connect(widerMerge, 0, 1);
    const clarityBoost = ctx.createBiquadFilter();
    clarityBoost.type = 'peaking';
    clarityBoost.frequency.value = 3200;
    clarityBoost.Q.value = 1.2;
    clarityBoost.gain.value = STATE.presenceBoost;
    const hpfNode = ctx.createBiquadFilter(); hpfNode.type = 'highpass'; hpfNode.frequency.value = STATE.eqHpf; hpfNode.Q.value = 0.7;
    const lpfNode = ctx.createBiquadFilter(); lpfNode.type = 'lowpass';  lpfNode.frequency.value = STATE.eqLpf; lpfNode.Q.value = 0.7;
    const gateNode = ctx.createGain(); gateNode.gain.value = 1;

    src.connect(inAnalyser);
    src.connect(preAmp);
    preAmp.connect(pitchBypass);
    let cursor = pitchBypass;
    eqNodes.forEach(f => { cursor.connect(f); cursor = f; });
    cursor.connect(clarityBoost); cursor = clarityBoost;
    cursor.connect(hpfNode);      cursor = hpfNode;
    cursor.connect(lpfNode);      cursor = lpfNode;
    cursor.connect(fxIn);
    fxOut.connect(reverbDry);
    fxOut.connect(reverbConv);
    reverbConv.connect(reverbWet);
    reverbDry.connect(chaosGain);
    reverbWet.connect(chaosGain);
    chaosGain.connect(godGainNode);
    godGainNode.connect(comp);
    comp.connect(gateNode);
    gateNode.connect(widerSplit);
    widerMerge.connect(masterGainNode);
    masterGainNode.connect(outAnalyser);
    masterGainNode.connect(dest);

    let currentFx = null;
    function connectEffect(fx) { fxIn.connect(fx.input); fx.output.connect(fxOut); currentFx = fx; }
    connectEffect(buildEffectNode(ctx, STATE.effect));

    function applyPitch(semitones) {
      if (semitones === 0) {
        if (pitchShifter) { try { preAmp.disconnect(pitchShifter.input); } catch(e){} pitchShifter = null; }
        try { preAmp.connect(pitchBypass); } catch(e){}
      } else {
        if (!pitchShifter) {
          try { preAmp.disconnect(pitchBypass); } catch(e){}
          pitchShifter = createPitchShifter(ctx);
          preAmp.connect(pitchShifter.input);
          pitchShifter.output.connect(pitchBypass);
        }
        pitchShifter.setPitchOffset(semitones / 12);
      }
    }
    applyPitch(STATE.pitch);

    const inData = new Uint8Array(inAnalyser.fftSize);
    let lastTs = 0, gateOpen = true;
    function levelLoop(ts) {
      if (!chain.alive) return;
      if (ts - lastTs >= 66) {
        lastTs = ts;
        inAnalyser.getByteTimeDomainData(inData);
        let peak = 0;
        for (let i = 0; i < inData.length; i++) { const a = Math.abs(inData[i] - 128) / 128; if (a > peak) peak = a; }
        const db = peak > 0 ? 20 * Math.log10(peak) : -Infinity;
        STATE.inputLevel = db;
        if (db > STATE.peakDb) STATE.peakDb = db;
        if (db > -0.5) STATE.clipCount++;
        if (STATE.gateEnabled && gateNode) {
          const shouldOpen = db > STATE.gateThresh;
          if (shouldOpen && !gateOpen)  { gateNode.gain.setTargetAtTime(1, ctx.currentTime, 0.01); gateOpen = true; }
          else if (!shouldOpen && gateOpen) { gateNode.gain.setTargetAtTime(0, ctx.currentTime, 0.02); gateOpen = false; }
        } else {
          if (!gateOpen) { gateNode.gain.setTargetAtTime(1, ctx.currentTime, 0.01); gateOpen = true; }
        }
        window.dispatchEvent(new CustomEvent('blakecord:levels', { detail: { db } }));
      }
      requestAnimationFrame(levelLoop);
    }
    requestAnimationFrame(levelLoop);

    const chain = {
      alive: true,
      src, dest, preAmp, pitchBypass, eqNodes, reverbConv, reverbWet, reverbDry,
      masterGainNode, chaosGain, godGainNode, comp, clarityBoost, hpfNode, lpfNode, gateNode,
      rebuildEffect() {
        if (currentFx) { try { fxIn.disconnect(currentFx.input); } catch(e){} try { currentFx.output.disconnect(fxOut); } catch(e){} try { currentFx.dispose(); } catch(e){} }
        const nfx = buildEffectNode(ctx, STATE.effect);
        fxIn.connect(nfx.input); nfx.output.connect(fxOut); currentFx = nfx;
      },
      rebuildReverb()       { reverbWet.gain.setTargetAtTime(STATE.reverb.dry ? 0 : STATE.reverb.wetMix, ctx.currentTime, 0.05); },
      rebuildReverbImpulse(){ reverbConv.buffer = buildImpulse(ctx, Math.max(0.1, STATE.reverb.decay), Math.max(0.1, STATE.reverb.roomSize)); },
      applyPitch,
      applyUltraGain() {
        const chaos = STATE.chaosMode ? 8.0 : 1.0;
        const god   = 1 + STATE.godGain * 40;
        const hyper = 1 + STATE.hyperBoost * 80;
        chaosGain.gain.setTargetAtTime(chaos, ctx.currentTime, 0.02);
        godGainNode.gain.setTargetAtTime(god * hyper, ctx.currentTime, 0.02);
      },
      applyWider() {
        const t = ctx.currentTime;
        if (!STATE.widerEnabled) { widerSideGain.gain.setTargetAtTime(1.0, t, 0.05); widerMidGain.gain.setTargetAtTime(1.0, t, 0.05); }
        else { const side = Math.max(0, STATE.widerWidth * STATE.widerDepth); widerSideGain.gain.setTargetAtTime(side, t, 0.05); widerMidGain.gain.setTargetAtTime(1.0, t, 0.05); widerLpf.frequency.setTargetAtTime(Math.max(20, Math.min(STATE.widerFreq, 500)), t, 0.05); }
      },
      get mp3OutputNode() { return dest; },
      stop() { chain.alive = false; if (currentFx) { try { currentFx.dispose(); } catch(e){} } }
    };
    return chain;
  }

  /* ═══════════════════════════════════════════════════════
     MP3 ENGINE
     ═══════════════════════════════════════════════════════ */
  function mp3Load(file) {
    const ctx = getCtx(); if (!ctx) return;
    mp3Stop();
    MP3._storedFile = file;
    if (MP3._objUrl) URL.revokeObjectURL(MP3._objUrl);
    MP3._objUrl  = URL.createObjectURL(file);
    MP3.fileName = file.name;
    MP3.audio    = new Audio(MP3._objUrl);
    MP3.audio.loop = true; MP3.audio.crossOrigin = 'anonymous'; MP3.audio.volume = 1;
    try {
      MP3.source    = ctx.createMediaElementSource(MP3.audio);
      MP3.musicGain = ctx.createGain(); MP3.musicGain.gain.value = MP3.musicBoost;
      MP3.gainNode  = ctx.createGain(); MP3.gainNode.gain.value  = MP3.volume;
      MP3.analyser  = ctx.createAnalyser(); MP3.analyser.fftSize = 256;
      MP3.source.connect(MP3.musicGain); MP3.musicGain.connect(MP3.gainNode); MP3.gainNode.connect(MP3.analyser);
      mp3Reconnect(); MP3._lastRoutingOk = true;
    } catch(e) { console.warn('[BLAKECORD] mp3Load error:', e); }
    mp3UpdateNameEl(); mp3Play();
  }

  function mp3Play()   { if (!MP3.audio) return; MP3.audio.play().catch(()=>{}); MP3.playing = true; mp3UpdatePlayBtn(); mp3StartInterval(); }
  function mp3Pause()  { if (!MP3.audio) return; MP3.audio.pause(); MP3.playing = false; mp3UpdatePlayBtn(); mp3StopInterval(); }
  function mp3Toggle() { if (!MP3.audio) return; MP3.audio.paused ? mp3Play() : mp3Pause(); }
  function mp3Stop()   { if (MP3.audio) { MP3.audio.pause(); MP3.audio.currentTime = 0; } MP3.playing = false; mp3UpdatePlayBtn(); mp3StopInterval(); }

  function mp3StartInterval() {
    mp3StopInterval();
    let tick = 0;
    MP3._interval = setInterval(() => {
      if (!MP3.audio) return;
      const cur = MP3.audio.currentTime || 0, dur = MP3.audio.duration || 0;
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      const prog = document.getElementById('bc-mp3-prog'), time = document.getElementById('bc-mp3-time');
      if (prog) prog.style.width = pct + '%';
      if (time) time.textContent = fmtMp3Time(cur) + ' / ' + fmtMp3Time(dur);
      if (MP3.analyser) {
        const buf = new Uint8Array(MP3.analyser.frequencyBinCount);
        MP3.analyser.getByteFrequencyData(buf);
        const bars = document.querySelectorAll('.bc-mp3-bar');
        const step = Math.floor(buf.length / Math.max(1, bars.length));
        bars.forEach((b, i) => { const v = buf[i * step] / 255; b.style.transform = `scaleY(${0.08 + v * 0.92})`; });
      }
      tick++;
      if (tick % 20 === 0 && activeChain && MP3.analyser && !MP3._lastRoutingOk) mp3Reconnect();
    }, 100);
  }

  function mp3StopInterval() { if (MP3._interval) { clearInterval(MP3._interval); MP3._interval = null; } }
  function fmtMp3Time(s) { const m = Math.floor(s / 60), sec = Math.floor(s % 60); return m + ':' + sec.toString().padStart(2, '0'); }
  function mp3UpdatePlayBtn() { const btn = document.getElementById('bc-mp3-playbtn'); if (btn) btn.innerHTML = MP3.playing ? ICON('pause') : ICON('play'); }
  function mp3UpdateNameEl()  { const nm  = document.getElementById('bc-mp3-name');    if (nm)  nm.textContent = MP3.fileName || 'No file loaded'; }
  function mp3Reconnect() {
    if (MP3.analyser && activeChain) {
      try { MP3.analyser.disconnect(); } catch(e){}
      MP3.analyser.connect(activeChain.dest);
      const ctx = getCtx(); if (ctx) MP3.analyser.connect(ctx.destination);
    }
  }

  /* ── getUserMedia intercept ── */
  const origGUM = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) : null;

  if (origGUM) {
    navigator.mediaDevices.getUserMedia = async function (constraints) {
      const stream = await origGUM(constraints);
      if (!constraints || !constraints.audio) return stream;
      try {
        const ctx = getCtx(); if (!ctx) return stream;
        if (ctx.state === 'suspended') { try { await ctx.resume(); } catch(e){} }
        if (activeChain) { try { activeChain.stop(); } catch(e){} activeChain = null; }
        activeChain = buildChain(ctx, stream);
        window.__BLAKECORD_CHAIN__ = activeChain;
        mp3Reconnect();
        window.dispatchEvent(new CustomEvent('blakecord:ready'));
        const processed = activeChain.dest.stream;
        const newStream = new MediaStream();
        processed.getAudioTracks().forEach(t => newStream.addTrack(t));
        stream.getVideoTracks().forEach(t => newStream.addTrack(t));
        return newStream;
      } catch (e) { console.warn('[BLAKECORD] stream wrap failed', e); return stream; }
    };
  }

  function applyState() {
    if (!activeChain || !audioCtx) return;
    const t = audioCtx.currentTime;
    activeChain.masterGainNode.gain.setTargetAtTime(STATE.masterGain, t, 0.02);
    activeChain.preAmp.gain.setTargetAtTime(STATE.preAmp, t, 0.02);
    activeChain.eqNodes.forEach((f, i) => f.gain.setTargetAtTime(STATE.eqBands[i] || 0, t, 0.02));
    activeChain.applyPitch(STATE.pitch);
    activeChain.applyUltraGain();
    if (STATE.compEnabled) {
      activeChain.comp.threshold.setTargetAtTime(STATE.compThreshold, t, 0.02);
      activeChain.comp.ratio.setTargetAtTime(STATE.compRatio, t, 0.02);
    }
    if (activeChain.clarityBoost) activeChain.clarityBoost.gain.setTargetAtTime(STATE.clarityMode ? STATE.presenceBoost : 0, t, 0.02);
    if (STATE.gateEnabled && activeChain.gateNode) activeChain.gateNode.gain.setTargetAtTime(1, t, 0.02);
  }

  /* ═══════════════════════════════════════════════════════
     CSS — BLACK & GOLD GLASSMORPHISM THEME
     ═══════════════════════════════════════════════════════ */
  function injectStyles() {
    const s = document.createElement('style');
    s.id = 'blakecord-styles';
    s.textContent = `
@keyframes bootFade{from{opacity:0;transform:scale(1.15)}to{opacity:1;transform:scale(1)}}
@keyframes bootSlideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes bootPulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes bootBar{0%{transform:scaleX(0);transform-origin:left}50%{transform:scaleX(1);transform-origin:left}51%{transform:scaleX(1);transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}
@keyframes goldGlow{0%,100%{box-shadow:0 0 8px rgba(255,215,0,.2),0 0 0 rgba(255,193,7,.05)}50%{box-shadow:0 0 30px rgba(255,215,0,.5),0 0 50px rgba(255,193,7,.2)}}
@keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
@keyframes borderPulse{0%,100%{border-color:rgba(255,215,0,.15)}50%{border-color:rgba(255,215,0,.5)}}
@keyframes bootZoom{0%{transform:scale(1)}100%{transform:scale(1.05)}}
@keyframes textGlowGold{0%,100%{text-shadow:0 0 10px rgba(255,215,0,.4),0 0 30px rgba(255,193,7,.15)}50%{text-shadow:0 0 24px rgba(255,215,0,.8),0 0 60px rgba(255,193,7,.4)}}
@keyframes sunflowerSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes goldPulseRing{0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,.4)}50%{box-shadow:0 0 0 8px rgba(255,215,0,.0)}}

#bc-boot{position:fixed;inset:0;z-index:2147483647;background:#000;font-family:system-ui,-apple-system,sans-serif}
#bc-boot::before{content:'';position:absolute;inset:0;background:url(${GIFS.sunflower}) center/cover no-repeat;opacity:.25;pointer-events:none;animation:bootZoom 8s ease-in-out infinite alternate}
#bc-boot::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.2) 50%,rgba(0,0,0,.75) 100%);pointer-events:none}
#bc-boot-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;z-index:2}
.bc-boot-logo{font-size:46px;font-weight:900;letter-spacing:8px;color:#FFD700;font-family:system-ui,sans-serif;animation:bootFade .8s cubic-bezier(.16,1,.3,1) both;text-shadow:0 0 40px rgba(255,215,0,.6),0 0 80px rgba(255,193,7,.3)}
.bc-boot-logo span{color:#FFEC80;font-weight:300}
.bc-boot-sub{font-size:11px;letter-spacing:8px;color:rgba(255,215,0,.4);text-transform:uppercase;margin-top:8px;animation:bootSlideUp .8s cubic-bezier(.16,1,.3,1) .2s both}
.bc-boot-bar-wrap{width:300px;height:2px;background:rgba(255,215,0,.08);margin-top:40px;overflow:hidden;animation:bootSlideUp .8s cubic-bezier(.16,1,.3,1) .35s both;border-radius:2px}
.bc-boot-bar-fill{height:100%;width:0%;background:linear-gradient(90deg,#FF8C00,#FFD700,#FFEC80);transition:width .15s cubic-bezier(.16,1,.3,1);border-radius:2px;box-shadow:0 0 8px rgba(255,215,0,.5)}
.bc-boot-label{font-size:8px;letter-spacing:5px;color:rgba(255,215,0,.3);text-align:center;text-transform:uppercase;margin-top:14px;animation:bootSlideUp .8s cubic-bezier(.16,1,.3,1) .45s both}
.bc-boot-maker{font-size:9px;letter-spacing:3px;color:rgba(255,215,0,.2);margin-top:30px;text-transform:uppercase;animation:bootSlideUp .8s cubic-bezier(.16,1,.3,1) .6s both}

#bc-root{position:fixed;inset:0;pointer-events:none;z-index:2147483646;font-family:system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
#bc-root *,#bc-root *::before,#bc-root *::after{box-sizing:border-box}
#bc-root svg{display:inline-block;width:1em;height:1em;vertical-align:-0.125em;flex-shrink:0}

#bc-launcher{position:absolute;bottom:24px;right:24px;pointer-events:auto;display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0a0800,#1a1200);border:2px solid rgba(255,215,0,.35);color:#FFD700;cursor:pointer;box-shadow:0 0 20px rgba(255,215,0,.12),0 4px 20px rgba(0,0,0,.7);transition:all .4s cubic-bezier(.16,1,.3,1);user-select:none;font-size:24px;animation:float 4s ease-in-out infinite,goldPulseRing 2s ease-in-out infinite}
#bc-launcher:hover{border-color:rgba(255,215,0,.75);box-shadow:0 0 40px rgba(255,215,0,.4),0 0 80px rgba(255,215,0,.12);transform:scale(1.14)!important;animation:none}

#bc-panel{position:fixed;bottom:90px;right:24px;width:400px;max-height:calc(100vh - 130px);background:rgba(8,7,0,.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-radius:16px;pointer-events:auto;display:flex;flex-direction:column;overflow:hidden;transition:all .4s cubic-bezier(.16,1,.3,1);transform-origin:bottom right;border:1px solid rgba(255,215,0,.12);box-shadow:0 0 0 1px rgba(255,215,0,.02) inset,0 8px 50px rgba(0,0,0,.8),0 0 100px rgba(255,215,0,.05)}
#bc-panel.hidden{opacity:0;transform:scale(.85) translateY(20px);pointer-events:none}
#bc-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 5%,rgba(255,215,0,.4) 50%,transparent 95%)}
#bc-panel::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 20%,rgba(255,215,0,.1) 50%,transparent 80%)}

.bc-hdr{display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid rgba(255,215,0,.07);position:relative;z-index:2;cursor:move;user-select:none;min-height:46px;background:rgba(8,7,0,.5)}
.bc-hdr-icon{font-size:18px;flex-shrink:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,193,7,.06));border-radius:7px;color:#FFD700;box-shadow:0 0 12px rgba(255,215,0,.2)}
.bc-hdr-info{flex:1;min-width:0}
.bc-hdr-title{font-size:12px;font-weight:700;letter-spacing:2px;color:#FFD700;line-height:1;animation:textGlowGold 3s ease-in-out infinite}
.bc-hdr-made{font-size:7px;letter-spacing:1.5px;color:rgba(255,215,0,.3);text-transform:uppercase;margin-top:2px}
.bc-hdr-ver{font-size:7px;padding:2px 8px;border-radius:10px;background:rgba(255,215,0,.07);border:1px solid rgba(255,215,0,.12);color:rgba(255,215,0,.4);letter-spacing:.5px;margin-left:auto;align-self:flex-start;flex-shrink:0}
.bc-hdr-close{width:24px;height:24px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);color:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;transition:all .2s;flex-shrink:0;border-radius:5px}
.bc-hdr-close:hover{background:rgba(255,50,50,.12);color:#ff4444;border-color:rgba(255,50,50,.3)}

.bc-gif-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:.12;background-size:cover;background-position:center;filter:saturate(1.2)}
.bc-gif-bg-overlay{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(8,7,0,.1) 0%,rgba(8,7,0,.6) 100%)}

.bc-meter-wrap{padding:6px 14px 5px;display:flex;align-items:center;gap:8px;position:relative;z-index:2;border-bottom:1px solid rgba(255,215,0,.04);min-height:32px;background:rgba(255,215,0,.01)}
.bc-meter-lbl{font-size:7px;letter-spacing:1px;color:rgba(255,215,0,.35);text-transform:uppercase;width:20px;flex-shrink:0}
.bc-meter{flex:1;height:3px;background:rgba(255,255,255,.03);border-radius:2px;overflow:hidden}
.bc-meter-fill{height:100%;background:linear-gradient(90deg,#FF8C00,#FFD700,#FFEC80);border-radius:2px;width:0%;transition:width .06s linear;box-shadow:0 0 4px rgba(255,215,0,.4)}
.bc-meter-fill.clip{background:#ff2200!important}
.bc-meter-val{font-size:7px;color:rgba(255,215,0,.35);width:34px;text-align:right}

.bc-tabs{display:flex;gap:0;padding:5px 6px 0;border-bottom:1px solid rgba(255,215,0,.06);overflow-x:auto;scrollbar-width:none;flex-shrink:0;background:rgba(255,215,0,.01);position:relative;z-index:2}
.bc-tabs::-webkit-scrollbar{display:none}
.bc-tab{display:flex;align-items:center;gap:4px;padding:7px 9px;cursor:pointer;transition:all .25s cubic-bezier(.16,1,.3,1);font-size:11px;color:rgba(255,255,255,.2);white-space:nowrap;border-bottom:2px solid transparent;flex-shrink:0;position:relative;border-radius:4px 4px 0 0}
.bc-tab:hover{color:rgba(255,215,0,.55);background:rgba(255,215,0,.02)}
.bc-tab.active{color:#FFD700;border-bottom-color:#FFD700;text-shadow:0 0 10px rgba(255,215,0,.4);background:rgba(255,215,0,.03)}
.bc-tab span{font-size:11px}

.bc-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px;scrollbar-width:thin;scrollbar-color:rgba(255,215,0,.12) transparent;position:relative;z-index:2}
.bc-body::-webkit-scrollbar{width:3px}
.bc-body::-webkit-scrollbar-thumb{background:rgba(255,215,0,.2);border-radius:3px}
.bc-body::-webkit-scrollbar-track{background:transparent}

.bc-section{animation:fadeSlide .22s ease both}

.bc-card{background:rgba(255,215,0,.02);border:1px solid rgba(255,215,0,.06);border-radius:9px;padding:12px;margin-bottom:8px}

.bc-slider-block{margin-bottom:8px;padding:9px 10px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.05);border-radius:8px;transition:all .2s}
.bc-slider-block:hover{border-color:rgba(255,215,0,.18);background:rgba(255,215,0,.018)}
.bc-slider-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.bc-slider-name{font-size:8px;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,215,0,.5);font-weight:600;display:flex;align-items:center;gap:5px}
.bc-slider-name span{font-size:11px}
.bc-slider-val{font-size:10px;font-weight:700;color:#FFD700;text-shadow:0 0 8px rgba(255,215,0,.25)}
.bc-track{position:relative;height:20px;display:flex;align-items:center}
.bc-track-bg{position:absolute;inset:0;margin:auto;height:4px;background:rgba(255,255,255,.04);border-radius:3px;overflow:hidden}
.bc-track-fill{height:100%;background:linear-gradient(90deg,#FF8C00,#FFD700);border-radius:3px;transition:width .05s linear}
.bc-range{-webkit-appearance:none;appearance:none;position:absolute;width:100%;height:100%;background:transparent;margin:0;cursor:pointer;z-index:2}
.bc-range::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:linear-gradient(135deg,#FFEC80,#FFD700);border:2px solid rgba(255,255,255,.15);box-shadow:0 0 0 2px rgba(255,215,0,.2),0 0 12px rgba(255,215,0,.35);transition:transform .12s,box-shadow .12s;cursor:pointer}
.bc-range::-webkit-slider-thumb:hover{transform:scale(1.35);box-shadow:0 0 0 3px rgba(255,215,0,.3),0 0 20px rgba(255,215,0,.55)}
.bc-range::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:linear-gradient(135deg,#FFEC80,#FFD700);border:2px solid rgba(255,255,255,.15);box-shadow:0 0 12px rgba(255,215,0,.35)}

.bc-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:9px 10px;margin-bottom:6px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.05);border-radius:8px;transition:all .2s}
.bc-toggle-row:hover{background:rgba(255,215,0,.03);border-color:rgba(255,215,0,.12)}
.bc-toggle-info{display:flex;align-items:center;gap:8px}
.bc-toggle-icon{font-size:13px;color:#FFD700}
.bc-toggle-texts{display:flex;flex-direction:column;gap:1px}
.bc-toggle-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.65)}
.bc-toggle-sub{font-size:7px;color:rgba(255,215,0,.3);letter-spacing:.3px}
.bc-toggle{width:34px;height:19px;border-radius:10px;background:rgba(255,255,255,.05);border:none;cursor:pointer;position:relative;transition:all .3s;flex-shrink:0}
.bc-toggle::after{content:'';position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:rgba(255,255,255,.15);transition:all .3s cubic-bezier(.16,1,.3,1)}
.bc-toggle.on{background:rgba(255,215,0,.3);animation:goldGlow 1.8s ease-in-out infinite}
.bc-toggle.on::after{transform:translateX(15px);background:linear-gradient(135deg,#FFEC80,#FFD700);box-shadow:0 0 10px rgba(255,215,0,.6)}

.bc-fx-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:2px 0}
.bc-fx-cell{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 3px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.05);border-radius:8px;cursor:pointer;transition:all .25s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
.bc-fx-cell:hover{border-color:rgba(255,215,0,.2);background:rgba(255,215,0,.04);transform:translateY(-3px);box-shadow:0 4px 16px rgba(255,215,0,.08)}
.bc-fx-cell.active{background:rgba(255,215,0,.07);border-color:rgba(255,215,0,.35);border-left:2px solid #FFD700;box-shadow:0 0 18px rgba(255,215,0,.12)}
.bc-fx-emoji{font-size:16px;transition:transform .15s;color:#FFD700}
.bc-fx-cell:hover .bc-fx-emoji{transform:scale(1.18)}
.bc-fx-name{font-size:7px;font-weight:600;color:rgba(255,215,0,.35);letter-spacing:.2px;text-align:center;text-transform:uppercase}
.bc-fx-cell.active .bc-fx-name{color:#FFD700;text-shadow:0 0 8px rgba(255,215,0,.4)}
.bc-fx-clear{width:100%;margin-top:5px;padding:7px;background:rgba(255,215,0,.03);border:1px solid rgba(255,215,0,.08);border-radius:6px;color:rgba(255,215,0,.4);font-size:9px;font-weight:600;cursor:pointer;transition:all .2s;letter-spacing:1px;text-transform:uppercase}
.bc-fx-clear:hover{background:rgba(255,215,0,.08);color:#FFD700;border-color:rgba(255,215,0,.25)}

.bc-eq-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;height:155px;padding:6px 3px;background:rgba(0,0,0,.3);border-radius:8px;border:1px solid rgba(255,215,0,.07)}
.bc-eq-col{display:flex;flex-direction:column;align-items:center;gap:2px;height:100%}
.bc-eq-val{font-size:6px;color:rgba(255,215,0,.35);text-align:center;min-height:8px}
.bc-eq-slider{-webkit-appearance:slider-vertical;appearance:slider-vertical;writing-mode:bt-lr;width:10px;flex:1;background:linear-gradient(to top,#000,#FFD700 50%,#FFEC80);border-radius:2px;cursor:pointer;outline:none;border:none}
.bc-eq-slider::-webkit-slider-thumb{-webkit-appearance:none;width:17px;height:6px;border-radius:2px;background:linear-gradient(90deg,#FFEC80,#FFD700);box-shadow:0 0 8px rgba(255,215,0,.5);cursor:pointer}
.bc-eq-slider::-moz-range-thumb{width:17px;height:6px;border-radius:2px;background:linear-gradient(90deg,#FFEC80,#FFD700);box-shadow:0 0 8px rgba(255,215,0,.5);border:none}
.bc-eq-label{font-size:6px;color:rgba(255,215,0,.35);font-weight:600;letter-spacing:.2px}

.bc-reverb-viz{height:45px;background:rgba(0,0,0,.25);border-radius:8px;border:1px solid rgba(255,215,0,.07);margin-bottom:8px;overflow:hidden;display:flex;align-items:center;gap:2px;padding:4px 8px}
.bc-reverb-bar{flex:1;height:100%;border-radius:1px;background:linear-gradient(to top,rgba(255,140,0,.7),rgba(255,215,0,.4),rgba(255,235,128,.1));transform-origin:bottom;transition:transform .1s ease}

.bc-preset-list{display:flex;flex-direction:column;gap:4px}
.bc-preset{display:flex;align-items:center;gap:8px;padding:9px 10px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.05);border-radius:8px;cursor:pointer;transition:all .25s cubic-bezier(.16,1,.3,1)}
.bc-preset:hover{background:rgba(255,215,0,.04);border-color:rgba(255,215,0,.18);transform:translateX(4px)}
.bc-preset-icon{font-size:16px;width:22px;text-align:center;flex-shrink:0;color:#FFD700}
.bc-preset-name{font-size:10px;font-weight:600;color:#FFD700}
.bc-preset-sub{font-size:7px;color:rgba(255,215,0,.25);margin-top:1px}
.bc-preset-arrow{margin-left:auto;color:rgba(255,215,0,.15);font-size:10px;transition:transform .2s}
.bc-preset:hover .bc-preset-arrow{transform:translateX(3px);color:rgba(255,215,0,.4)}

.bc-power-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bc-power-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.06);border-radius:8px;cursor:pointer;transition:all .25s cubic-bezier(.16,1,.3,1)}
.bc-power-btn:hover{background:rgba(255,215,0,.04);border-color:rgba(255,215,0,.18);transform:translateY(-3px);box-shadow:0 4px 15px rgba(255,215,0,.06)}
.bc-power-btn.on{background:rgba(255,215,0,.06);border-color:rgba(255,215,0,.35);border-left:2px solid #FFD700;box-shadow:0 0 14px rgba(255,215,0,.1)}
.bc-power-btn.chaos-btn.on{border-color:rgba(255,140,0,.5);border-left-color:#FF8C00;animation:goldGlow 1.5s ease-in-out infinite}
.bc-power-icon{font-size:22px;color:#FFD700}
.bc-power-label{font-size:8px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:rgba(255,215,0,.4)}
.bc-power-btn.on .bc-power-label{color:#FFD700;text-shadow:0 0 8px rgba(255,215,0,.4)}
.bc-power-btn .bc-toggle-sub{font-size:7px;color:rgba(255,215,0,.15);letter-spacing:.2px;text-align:center}

.bc-section-title{font-size:7px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,215,0,.3);margin:10px 0 6px;display:flex;align-items:center;gap:6px}
.bc-section-title::before{content:'';width:8px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,215,0,.35))}
.bc-section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(255,215,0,.2),transparent)}

.bc-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;transition:all .2s}
.bc-btn-ghost{background:rgba(255,255,255,.02);border:1px solid rgba(255,215,0,.09);color:rgba(255,215,0,.45)}
.bc-btn-ghost:hover{background:rgba(255,215,0,.06);color:#FFD700;border-color:rgba(255,215,0,.25)}
.bc-btn-primary{background:rgba(255,215,0,.09);border:1px solid rgba(255,215,0,.25);color:#FFD700}
.bc-btn-primary:hover{background:rgba(255,215,0,.16);border-color:rgba(255,215,0,.45)}
.bc-btn-danger{background:rgba(255,50,50,.06);border:1px solid rgba(255,50,50,.18);color:rgba(255,80,80,.7)}
.bc-btn-danger:hover{background:rgba(255,50,50,.12);border-color:rgba(255,50,50,.35);color:#ff4444}
.bc-row-end{display:flex;justify-content:flex-end;gap:5px;padding-top:6px}

.bc-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bc-stat-card{background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.07);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:3px}
.bc-stat-label{font-size:7px;letter-spacing:1.2px;color:rgba(255,215,0,.3);text-transform:uppercase}
.bc-stat-val{font-size:16px;font-weight:700;line-height:1;color:#FFD700;text-shadow:0 0 10px rgba(255,215,0,.25)}

.bc-wider-display{background:rgba(255,215,0,.02);border:1px solid rgba(255,215,0,.08);border-radius:8px;padding:12px 10px;margin-bottom:8px}
.bc-wider-viz{display:flex;align-items:center;justify-content:center;gap:3px;height:42px;position:relative}
.bc-wider-bar{width:3px;background:linear-gradient(180deg,#FF8C00,#FFD700,rgba(255,215,0,.1));border-radius:1px;transition:height .15s ease}
.bc-wider-center-line{width:1px;height:26px;flex-shrink:0;background:rgba(255,255,255,.06)}
.bc-wider-lbl{position:absolute;font-size:6px;letter-spacing:1.5px;color:rgba(255,215,0,.3);text-transform:uppercase}
.bc-wider-lbl.l{left:4px}
.bc-wider-lbl.r{right:4px}
.bc-wider-lbl.c{left:50%;transform:translateX(-50%)}
.bc-wider-val-row{display:flex;justify-content:center;align-items:baseline;gap:3px;margin-top:8px}
.bc-wider-big{font-size:24px;font-weight:900;color:#FFD700;text-shadow:0 0 14px rgba(255,215,0,.4);line-height:1}
.bc-wider-unit{font-size:8px;color:rgba(255,215,0,.3);letter-spacing:.6px}

.bc-mp3-drop{border:2px dashed rgba(255,215,0,.18);border-radius:9px;padding:16px 12px;text-align:center;cursor:pointer;transition:all .25s;background:rgba(255,215,0,.008);margin-bottom:8px}
.bc-mp3-drop:hover,.bc-mp3-drop.dragover{border-color:rgba(255,215,0,.4);background:rgba(255,215,0,.03);border-style:solid}
.bc-mp3-drop-icon{font-size:28px;margin-bottom:4px;color:#FFD700}
.bc-mp3-drop-label{font-size:9px;color:rgba(255,215,0,.35);letter-spacing:.5px;line-height:1.5}
.bc-mp3-drop input[type=file]{display:none}
.bc-mp3-name{font-size:9px;color:#FFD700;font-weight:600;text-align:center;margin:0 0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.2px;padding:5px 8px;background:rgba(255,215,0,.015);border-radius:6px;border:1px solid rgba(255,215,0,.08)}
.bc-mp3-waveform{display:flex;align-items:center;gap:1px;height:38px;padding:3px 6px;background:rgba(0,0,0,.25);border-radius:6px;border:1px solid rgba(255,215,0,.07);margin-bottom:8px}
.bc-mp3-bar{flex:1;background:linear-gradient(to top,#FF8C00,#FFD700);border-radius:1px;transform-origin:bottom;transform:scaleY(0.08);transition:transform .06s ease}
.bc-mp3-progress-wrap{background:rgba(255,255,255,.03);border-radius:2px;height:3px;margin-bottom:5px;overflow:hidden;cursor:pointer}
.bc-mp3-progress-fill{height:100%;width:0%;background:linear-gradient(90deg,#FF8C00,#FFD700,#FFEC80);border-radius:2px;transition:width .1s linear}
.bc-mp3-time{font-size:7px;color:rgba(255,215,0,.3);text-align:center;letter-spacing:.6px}
.bc-mp3-controls{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:10px}
.bc-mp3-btn{width:30px;height:30px;background:rgba(255,215,0,.025);border:1px solid rgba(255,215,0,.09);color:rgba(255,215,0,.45);font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;border-radius:7px}
.bc-mp3-btn:hover{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.25);color:#FFD700}
.bc-mp3-btn.play-btn{width:38px;height:38px;font-size:15px;background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.25);color:#FFD700;box-shadow:0 0 14px rgba(255,215,0,.12)}
.bc-mp3-btn.play-btn:hover{background:rgba(255,215,0,.14);border-color:rgba(255,215,0,.4)}
.bc-mp3-btn.active-btn{background:rgba(255,215,0,.1);border-color:rgba(255,215,0,.3);color:#FFD700}

.bc-voice-display{background:rgba(255,215,0,.02);border:1px solid rgba(255,215,0,.09);border-radius:8px;padding:12px;margin-bottom:10px;text-align:center;position:relative;overflow:hidden}
.bc-voice-display::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,215,0,.07),transparent 70%);pointer-events:none}
.bc-voice-active-name{font-size:15px;font-weight:700;color:#FFD700;margin-bottom:2px;letter-spacing:.5px;text-shadow:0 0 12px rgba(255,215,0,.4)}
.bc-voice-active-sub{font-size:8px;color:rgba(255,215,0,.35);letter-spacing:1px;text-transform:uppercase}
.bc-voice-bars{display:flex;align-items:flex-end;justify-content:center;gap:2px;height:26px;margin-top:6px}
.bc-voice-bar{width:2px;border-radius:1px;background:linear-gradient(to top,#FF8C00,#FFD700,rgba(255,215,0,.1))}
.bc-voice-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:8px}
.bc-voice-card{display:flex;align-items:center;gap:7px;padding:8px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.05);border-radius:8px;cursor:pointer;transition:all .2s}
.bc-voice-card:hover{background:rgba(255,215,0,.04);border-color:rgba(255,215,0,.18);transform:translateX(2px)}
.bc-voice-card.active{background:rgba(255,215,0,.07);border-color:rgba(255,215,0,.28);border-left:2px solid #FFD700}
.bc-voice-card-icon{font-size:18px;flex-shrink:0;transition:transform .12s;color:#FFD700}
.bc-voice-card:hover .bc-voice-card-icon{transform:scale(1.12)}
.bc-voice-card-info{display:flex;flex-direction:column;gap:1px;min-width:0}
.bc-voice-card-name{font-size:9px;font-weight:600;color:#FFD700}
.bc-voice-card-desc{font-size:7px;color:rgba(255,215,0,.3);letter-spacing:.2px}

.bc-dragging{cursor:move!important;user-select:none}

/* LOUDMIC specific */
.bc-lmic-subtabs{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:10px}
.bc-lmic-subbtn{padding:4px 9px;border-radius:5px;font-size:8px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;border:1px solid rgba(255,215,0,.08);color:rgba(255,215,0,.4);background:rgba(255,215,0,.01);transition:all .2s}
.bc-lmic-subbtn:hover{border-color:rgba(255,215,0,.25);color:#FFD700;background:rgba(255,215,0,.04)}
.bc-lmic-subbtn.active{background:rgba(255,215,0,.08);border-color:rgba(255,215,0,.3);color:#FFD700}
.bc-lmic-content{animation:fadeSlide .18s ease both}

/* PROFILE cards */
.bc-profile-card{display:flex;align-items:center;gap:8px;padding:9px 10px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.06);border-radius:8px;margin-bottom:6px;cursor:pointer;transition:all .2s}
.bc-profile-card:hover{background:rgba(255,215,0,.04);border-color:rgba(255,215,0,.18)}
.bc-profile-card-name{font-size:10px;font-weight:600;color:#FFD700;flex:1}
.bc-profile-card-date{font-size:7px;color:rgba(255,215,0,.25)}

/* SELECT */
.bc-select{background:rgba(8,7,0,.9);border:1px solid rgba(255,215,0,.12);color:rgba(255,215,0,.7);padding:5px 8px;border-radius:6px;font-size:9px;cursor:pointer;outline:none;width:100%}
.bc-select:focus{border-color:rgba(255,215,0,.35)}
.bc-select option{background:#0a0900;color:#FFD700}

/* HOTKEY INPUT */
.bc-hotkey-row{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;margin-bottom:5px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.05);border-radius:7px}
.bc-hotkey-lbl{font-size:9px;color:rgba(255,255,255,.55);flex:1}
.bc-hotkey-key{font-size:9px;font-weight:600;color:#FFD700;background:rgba(255,215,0,.07);border:1px solid rgba(255,215,0,.15);padding:2px 8px;border-radius:4px;min-width:60px;text-align:center;cursor:pointer;transition:all .2s}
.bc-hotkey-key:hover{background:rgba(255,215,0,.12);border-color:rgba(255,215,0,.3)}

/* BROADCAST */
.bc-bcast-status{display:flex;align-items:center;gap:8px;padding:10px;background:rgba(255,215,0,.02);border:1px solid rgba(255,215,0,.07);border-radius:8px;margin-bottom:8px}
.bc-bcast-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,215,0,.3);flex-shrink:0}
.bc-bcast-dot.live{background:#FF4500;animation:pulse 1s ease-in-out infinite}
.bc-bcast-label{font-size:9px;font-weight:600;color:rgba(255,215,0,.5)}

/* VISUAL tab color swatch */
.bc-color-row{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;margin-bottom:5px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.05);border-radius:7px}
.bc-color-swatch{width:24px;height:24px;border-radius:5px;border:2px solid rgba(255,255,255,.12);cursor:pointer}
input[type=color]{opacity:0;position:absolute;width:0;height:0}
`;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════════════════════
     BOOT SCREEN
     ═══════════════════════════════════════════════════════ */
  function showBoot(onDone) {
    const boot = document.createElement('div');
    boot.id = 'bc-boot';
    const center = document.createElement('div');
    center.id = 'bc-boot-center';

    const logo = document.createElement('div');
    logo.className = 'bc-boot-logo';
    logo.innerHTML = 'BLAKE<span>CORD</span>';
    center.appendChild(logo);

    const sub = document.createElement('div');
    sub.className = 'bc-boot-sub';
    sub.textContent = 'Black & Gold Edition · V4';
    center.appendChild(sub);

    const barWrap = document.createElement('div');
    barWrap.className = 'bc-boot-bar-wrap';
    const barFill = document.createElement('div');
    barFill.className = 'bc-boot-bar-fill';
    barWrap.appendChild(barFill);
    center.appendChild(barWrap);

    const barLbl = document.createElement('div');
    barLbl.className = 'bc-boot-label';
    barLbl.textContent = 'Initializing…';
    center.appendChild(barLbl);

    const maker = document.createElement('div');
    maker.className = 'bc-boot-maker';
    maker.textContent = 'Made by Blake · 🌻';
    center.appendChild(maker);

    boot.appendChild(center);
    document.body.appendChild(boot);

    const steps = [
      'Initializing audio engine…',
      'Loading gold processors…',
      'Calibrating voice chain…',
      'Booting loudmic engine…',
      'Loading 500+ features…',
      'BlakeCord V4 Ready 🌻',
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length) { clearInterval(interval); return; }
      barFill.style.width = Math.round(((step + 1) / steps.length) * 100) + '%';
      barLbl.textContent  = steps[step];
      step++;
      if (step === steps.length) {
        setTimeout(() => {
          boot.style.opacity = '0';
          boot.style.transition = 'opacity .45s ease';
          setTimeout(() => { boot.remove(); onDone(); }, 450);
        }, 500);
      }
    }, 280);
  }

  /* ═══════════════════════════════════════════════════════
     UI HELPERS
     ═══════════════════════════════════════════════════════ */
  let panelVisible = false;
  let activeTab    = 'Mixer';
  let chainReady   = false;
  let rootEl, launcherEl, panelEl, bodyEl;
  let levelFill, levelVal;
  let statsInterval;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls)     e.className = cls;
    if (html != null) { if (typeof html === 'string') e.innerHTML = html; else e.textContent = html; }
    return e;
  }
  function fmtDb(db)  { if (!isFinite(db)) return '-∞'; return (db >= 0 ? '+' : '') + db.toFixed(1) + 'dB'; }
  function fmtTime(ms){ const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60); return h>0?`${h}h${m%60}m`:m>0?`${m}m${s%60}s`:`${s}s`; }

  function buildSlider({ label, icon, min, max, step, value, format, onChange }) {
    const block = el('div','bc-slider-block');
    const hdr   = el('div','bc-slider-hdr');
    const name  = el('div','bc-slider-name');
    if (icon) { const sp = el('span'); sp.innerHTML = icon; name.appendChild(sp); }
    const nTxt = el('span'); nTxt.textContent = label; name.appendChild(nTxt);
    const valEl = el('div','bc-slider-val', format(value));
    hdr.appendChild(name); hdr.appendChild(valEl);
    const track = el('div','bc-track');
    const bg    = el('div','bc-track-bg');
    const fill  = el('div','bc-track-fill');
    const range = el('input','bc-range');
    range.type='range'; range.min=min; range.max=max; range.step=step; range.value=value;
    bg.appendChild(fill); track.appendChild(bg); track.appendChild(range);
    block.appendChild(hdr); block.appendChild(track);
    function update(v) { const pct=((v-min)/(max-min))*100; fill.style.width=pct+'%'; valEl.textContent=format(v); }
    update(value);
    range.addEventListener('input', () => { const v=parseFloat(range.value); update(v); onChange(v); });
    return { el: block, set(v) { range.value=v; update(v); } };
  }

  function buildToggleRow({ icon, label, sub, checked, onChange }) {
    const row  = el('div','bc-toggle-row');
    const info = el('div','bc-toggle-info');
    const ic   = el('div','bc-toggle-icon', icon);
    const txts = el('div','bc-toggle-texts');
    const lbl  = el('div','bc-toggle-label', label);
    const subEl= el('div','bc-toggle-sub', sub);
    txts.appendChild(lbl); txts.appendChild(subEl);
    info.appendChild(ic); info.appendChild(txts);
    const tog  = el('div','bc-toggle' + (checked ? ' on' : ''));
    row.appendChild(info); row.appendChild(tog);
    tog.addEventListener('click', () => { const on = tog.classList.toggle('on'); onChange(on); });
    return { el: row, setOn(v) { v ? tog.classList.add('on') : tog.classList.remove('on'); } };
  }

  function buildSelect({ label, options, value, onChange }) {
    const block = el('div','bc-slider-block');
    const hdr   = el('div','bc-slider-hdr');
    const lbl   = el('div','bc-slider-name'); lbl.textContent = label;
    hdr.appendChild(lbl); block.appendChild(hdr);
    const sel = el('select','bc-select');
    options.forEach(o => {
      const opt = el('option'); opt.value = o.value; opt.textContent = o.label;
      if (o.value === value) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', () => onChange(sel.value));
    block.appendChild(sel);
    return { el: block };
  }

  /* ═══════════════════════════════════════════════════════
     MIXER TAB
     ═══════════════════════════════════════════════════════ */
  function buildMixerTab() {
    const root = el('div','bc-section');

    const masterSlider = buildSlider({ label:'Main Volume', icon:ICON('gain'), min:0, max:25, step:0.1, value:STATE.masterGain, format:v=>fmtDb(v<=0?-Infinity:20*Math.log10(v)), onChange:v=>{STATE.masterGain=v;applyState()} });
    const preAmpSlider = buildSlider({ label:'Input Boost', icon:ICON('boost'), min:0, max:15, step:0.1, value:STATE.preAmp, format:v=>fmtDb(v<=0?-Infinity:20*Math.log10(v)), onChange:v=>{STATE.preAmp=v;applyState()} });
    const pitchSlider  = buildSlider({ label:'Tone Shift', icon:ICON('music'), min:-12, max:12, step:0.1, value:STATE.pitch, format:v=>(v>=0?'+':'')+v.toFixed(1)+'st', onChange:v=>{STATE.pitch=v;if(activeChain)activeChain.applyPitch(v)} });
    const widthSlider  = buildSlider({ label:'Stereo Spread', icon:ICON('wider'), min:0, max:100, step:1, value:STATE.stereoWidth, format:v=>Math.round(v)+'%', onChange:v=>{STATE.stereoWidth=v;STATE.widerEnabled=v>0;STATE.widerWidth=1+(v/100)*6;STATE.widerDepth=1;if(activeChain)activeChain.applyWider()} });
    const godSlider    = buildSlider({ label:'Overdrive', icon:ICON('overdrive'), min:0, max:1, step:0.01, value:STATE.godGain, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.godGain=v;if(activeChain)activeChain.applyUltraGain()} });
    const hyperSlider  = buildSlider({ label:'Hyper Drive', icon:ICON('hyper'), min:0, max:1, step:0.01, value:STATE.hyperBoost, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.hyperBoost=v;if(activeChain)activeChain.applyUltraGain()} });

    root.appendChild(masterSlider.el);
    root.appendChild(preAmpSlider.el);
    root.appendChild(pitchSlider.el);
    root.appendChild(widthSlider.el);
    root.appendChild(el('div','bc-section-title','Boost Section'));
    root.appendChild(godSlider.el);
    root.appendChild(hyperSlider.el);

    root.appendChild(buildToggleRow({ icon:ICON('amplify'), label:'Voice Clarity', sub:'Super loud + clear voice', checked:STATE.clarityMode, onChange:v=>{STATE.clarityMode=v;applyState()} }).el);

    const presenceSlider = buildSlider({ label:'Presence Boost', icon:ICON('broadcast'), min:0, max:12, step:0.5, value:STATE.presenceBoost, format:v=>'+'+v.toFixed(0)+'dB', onChange:v=>{STATE.presenceBoost=v;applyState()} });
    root.appendChild(presenceSlider.el);

    root.appendChild(el('div','bc-section-title','Mixer Tools'));
    root.appendChild(buildToggleRow({ icon:ICON('comp'), label:'Compressor', sub:'Dynamic range reduction', checked:STATE.compEnabled, onChange:v=>{STATE.compEnabled=v;applyState()} }).el);
    root.appendChild(buildSlider({ label:'Threshold', icon:ICON('threshold'), min:-60, max:0, step:1, value:STATE.compThreshold, format:v=>v+'dB', onChange:v=>{STATE.compThreshold=v;applyState()} }).el);
    root.appendChild(buildSlider({ label:'Ratio', icon:ICON('ratio'), min:1, max:20, step:0.5, value:STATE.compRatio, format:v=>v.toFixed(1)+':1', onChange:v=>{STATE.compRatio=v;applyState()} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('shade'), label:'Noise Gate', sub:'Cut silence below threshold', checked:STATE.gateEnabled, onChange:v=>{STATE.gateEnabled=v;applyState()} }).el);
    root.appendChild(buildSlider({ label:'Gate Threshold', icon:ICON('threshold'), min:-80, max:-20, step:1, value:STATE.gateThresh, format:v=>v+'dB', onChange:v=>{STATE.gateThresh=v} }).el);
    root.appendChild(buildSlider({ label:'Limiter', icon:ICON('hyper'), min:0, max:1, step:0.01, value:0, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.limiter=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('voice'), label:'Auto Level', sub:'Automatic gain control', checked:false, onChange:v=>{STATE.autoLevel=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('eq'), label:'De-esser', sub:'Reduce sibilance', checked:false, onChange:v=>{STATE.deEsser=v} }).el);
    root.appendChild(buildSlider({ label:'Warmth', icon:ICON('flame'), min:0, max:1, step:0.01, value:0, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.warmth=v} }).el);
    root.appendChild(buildSlider({ label:'Output Boost', icon:ICON('amplify2'), min:1, max:10, step:0.1, value:1, format:v=>v.toFixed(1)+'x', onChange:v=>{STATE.outputBoost=v} }).el);

    const rowEnd = el('div','bc-row-end');
    const resetBtn = el('button','bc-btn bc-btn-ghost');
    resetBtn.innerHTML = ICON('reset') + ' Reset All';
    resetBtn.addEventListener('click', () => {
      STATE.masterGain=1.0; STATE.preAmp=2.5; STATE.pitch=0; STATE.stereoWidth=0;
      STATE.godGain=0; STATE.hyperBoost=0; STATE.eqBands=[0,0,0,0,0,0,0,0,0,0];
      STATE.effect=null; STATE.reverb={wetMix:0.35,decay:3.5,roomSize:2.3,dry:false};
      STATE.clarityMode=true; STATE.presenceBoost=3; STATE.compEnabled=true;
      STATE.compThreshold=-28; STATE.compRatio=6; STATE.gateEnabled=true;
      STATE.gateThresh=-55; STATE.outputBoost=1.2;
      masterSlider.set(1.0); preAmpSlider.set(2.5); pitchSlider.set(0);
      widthSlider.set(0); godSlider.set(0); hyperSlider.set(0);
      applyState();
      if (activeChain) { activeChain.rebuildEffect(); activeChain.rebuildReverb(); activeChain.rebuildReverbImpulse(); }
      renderTab();
    });
    rowEnd.appendChild(resetBtn);
    root.appendChild(rowEnd);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     EFFECTS TAB
     ═══════════════════════════════════════════════════════ */
  function buildEffectsTab() {
    const root = el('div','bc-section');
    const grid = el('div','bc-fx-grid');
    EFFECTS.forEach(fx => {
      const cell = el('div','bc-fx-cell');
      if (STATE.effect === fx.id) cell.classList.add('active');
      const ico = el('div','bc-fx-emoji',fx.icon);
      const nm  = el('div','bc-fx-name',fx.name);
      cell.appendChild(ico); cell.appendChild(nm);
      cell.addEventListener('click', () => {
        STATE.effect = STATE.effect === fx.id ? null : fx.id;
        if (activeChain) activeChain.rebuildEffect();
        grid.querySelectorAll('.bc-fx-cell').forEach(c=>c.classList.remove('active'));
        if (STATE.effect) cell.classList.add('active');
      });
      grid.appendChild(cell);
    });
    root.appendChild(grid);
    const clearBtn = el('button','bc-fx-clear', ICON('close') + ' Clear Effect');
    clearBtn.addEventListener('click', () => { STATE.effect=null; if(activeChain)activeChain.rebuildEffect(); grid.querySelectorAll('.bc-fx-cell').forEach(c=>c.classList.remove('active')); });
    root.appendChild(clearBtn);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     EQ TAB
     ═══════════════════════════════════════════════════════ */
  function buildEqTab() {
    const root    = el('div','bc-section');
    const grid    = el('div','bc-eq-grid');
    const sliders = [];

    EQ_LABELS.forEach((lbl, i) => {
      const col    = el('div','bc-eq-col');
      const val    = el('div','bc-eq-val', (STATE.eqBands[i]||0) > 0 ? '+' + (STATE.eqBands[i]||0) : (STATE.eqBands[i]||0).toString());
      const slider = document.createElement('input');
      slider.type='range'; slider.className='bc-eq-slider';
      slider.min=-15; slider.max=15; slider.step=0.5; slider.value=STATE.eqBands[i]||0;
      const label = el('div','bc-eq-label', lbl);
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        STATE.eqBands[i] = v; val.textContent = (v>0?'+':'')+v;
        if (activeChain && activeChain.eqNodes[i]) activeChain.eqNodes[i].gain.setTargetAtTime(v, audioCtx.currentTime, 0.02);
      });
      col.appendChild(val); col.appendChild(slider); col.appendChild(label);
      grid.appendChild(col); sliders.push({ slider, val });
    });
    root.appendChild(grid);

    const rowEnd = el('div','bc-row-end');
    const flatBtn = el('button','bc-btn bc-btn-ghost', ICON('flat') + ' Flat');
    flatBtn.addEventListener('click', () => { STATE.eqBands=STATE.eqBands.map(()=>0); sliders.forEach(({slider,val})=>{slider.value=0;val.textContent='0'}); applyState(); });
    rowEnd.appendChild(flatBtn);
    root.appendChild(rowEnd);

    root.appendChild(el('div','bc-section-title','EQ Tools'));
    root.appendChild(buildSlider({ label:'EQ Master', icon:ICON('gain'), min:-12, max:12, step:0.5, value:0, format:v=>(v>=0?'+':'')+v+'dB', onChange:v=>{STATE.eqMaster=v} }).el);
    root.appendChild(buildSlider({ label:'Q Width', icon:ICON('eq'), min:0.2, max:5, step:0.1, value:1.2, format:v=>v.toFixed(1), onChange:v=>{STATE.eqQ=v;if(activeChain)activeChain.eqNodes.forEach(n=>{try{n.Q.value=v}catch(e){}})} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('mute'), label:'EQ Bypass', sub:'Temporarily disable EQ', checked:false, onChange:v=>{STATE.eqBypass=v;if(activeChain)activeChain.eqNodes.forEach((n,i)=>{try{n.gain.setTargetAtTime(v?0:(STATE.eqBands[i]||0),audioCtx.currentTime,0.02)}catch(e){}})} }).el);
    root.appendChild(buildSlider({ label:'Low Pass', icon:ICON('depth'), min:2000, max:20000, step:100, value:20000, format:v=>v>=20000?'OFF':v+'Hz', onChange:v=>{STATE.eqLpf=v;if(activeChain&&activeChain.lpfNode)try{activeChain.lpfNode.frequency.value=v}catch(e){}} }).el);
    root.appendChild(buildSlider({ label:'High Pass', icon:ICON('depth'), min:10, max:500, step:5, value:10, format:v=>v<=10?'OFF':v+'Hz', onChange:v=>{STATE.eqHpf=v;if(activeChain&&activeChain.hpfNode)try{activeChain.hpfNode.frequency.value=v}catch(e){}} }).el);
    root.appendChild(buildSlider({ label:'Resonance', icon:ICON('pulse'), min:0, max:10, step:0.5, value:0, format:v=>v.toFixed(1)+'dB', onChange:v=>{STATE.eqReso=v} }).el);
    root.appendChild(buildSlider({ label:'Sub Boost', icon:ICON('bass'), min:0, max:12, step:0.5, value:0, format:v=>'+'+v+'dB', onChange:v=>{STATE.eqSub=v;if(activeChain&&activeChain.eqNodes[0])activeChain.eqNodes[0].gain.setTargetAtTime((STATE.eqBands[0]||0)+v,audioCtx.currentTime,0.02)} }).el);
    root.appendChild(buildSlider({ label:'Air Boost', icon:ICON('star'), min:0, max:12, step:0.5, value:0, format:v=>'+'+v+'dB', onChange:v=>{STATE.eqAir=v;if(activeChain&&activeChain.eqNodes[activeChain.eqNodes.length-1])activeChain.eqNodes[activeChain.eqNodes.length-1].gain.setTargetAtTime((STATE.eqBands[STATE.eqBands.length-1]||0)+v,audioCtx.currentTime,0.02)} }).el);

    const eqPresRow = el('div','bc-row-end');
    [{n:'BASS',b:[5,4,2,0,-1,-2,-2,-1,6,0]},{n:'VOCAL',b:[-1,0,2,4,3,2,0,-1,0,0]},{n:'SMILE',b:[4,2,0,-1,0,0,-1,0,3,4]},{n:'ACOUSTIC',b:[2,1,0,1,2,3,2,1,2,3]}].forEach(p=>{
      const btn=el('button','bc-btn bc-btn-ghost',p.n);
      btn.style.fontSize='8px'; btn.style.padding='2px 6px';
      btn.addEventListener('click',()=>{ STATE.eqBands=[...p.b]; sliders.forEach((s,i)=>{s.slider.value=p.b[i];s.val.textContent=(p.b[i]>0?'+':'')+p.b[i]}); if(activeChain)activeChain.eqNodes.forEach((n,i)=>{try{n.gain.setTargetAtTime(p.b[i],audioCtx.currentTime,0.02)}catch(e){}}) });
      eqPresRow.appendChild(btn);
    });
    root.appendChild(eqPresRow);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     REVERB TAB
     ═══════════════════════════════════════════════════════ */
  function buildReverbTab() {
    const root = el('div','bc-section');
    const viz  = el('div','bc-reverb-viz');
    const bars = [];
    for (let i = 0; i < 20; i++) { const b=el('div','bc-reverb-bar'); viz.appendChild(b); bars.push(b); }
    root.appendChild(viz);

    function updateViz() {
      const wet=STATE.reverb.dry?0:STATE.reverb.wetMix, decay=STATE.reverb.decay;
      bars.forEach((b,i)=>{ const f=Math.exp(-i/(bars.length*decay*0.3)),sc=wet*f; b.style.transform=`scaleY(${0.05+sc*0.95})`; b.style.opacity=0.3+sc*0.7; });
    }
    updateViz();

    root.appendChild(buildSlider({ label:'Wet Mix', icon:ICON('reverb'), min:0, max:1, step:0.01, value:STATE.reverb.wetMix, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.reverb.wetMix=v;if(activeChain)activeChain.rebuildReverb();updateViz()} }).el);
    root.appendChild(buildSlider({ label:'Decay', icon:ICON('speed'), min:0.1, max:10, step:0.1, value:STATE.reverb.decay, format:v=>v.toFixed(1)+'s', onChange:v=>{STATE.reverb.decay=v;if(activeChain)activeChain.rebuildReverbImpulse();updateViz()} }).el);
    root.appendChild(buildSlider({ label:'Room Size', icon:ICON('room'), min:0.1, max:6, step:0.1, value:STATE.reverb.roomSize, format:v=>v.toFixed(1), onChange:v=>{STATE.reverb.roomSize=v;if(activeChain)activeChain.rebuildReverbImpulse();updateViz()} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('mute'), label:'Dry Mode', sub:'Bypass reverb wet mix', checked:STATE.reverb.dry, onChange:v=>{STATE.reverb.dry=v;if(activeChain)activeChain.rebuildReverb();updateViz()} }).el);

    // Additional reverb controls
    root.appendChild(el('div','bc-section-title','Reverb Types'));
    const revTypes = ['Small Room','Medium Room','Large Hall','Cathedral','Plate','Spring','Chamber','Ambience'];
    const revBtns  = el('div','bc-row-end'); revBtns.style.flexWrap='wrap'; revBtns.style.justifyContent='flex-start'; revBtns.style.gap='4px';
    revTypes.forEach(t=>{
      const btn=el('button','bc-btn bc-btn-ghost',t);
      btn.style.fontSize='8px'; btn.style.padding='3px 7px';
      const presets={
        'Small Room':{decay:0.8,roomSize:0.8,wetMix:0.2},
        'Medium Room':{decay:1.5,roomSize:1.5,wetMix:0.3},
        'Large Hall':{decay:3.5,roomSize:3.0,wetMix:0.45},
        'Cathedral':{decay:6.0,roomSize:5.0,wetMix:0.6},
        'Plate':{decay:2.0,roomSize:1.8,wetMix:0.35},
        'Spring':{decay:0.8,roomSize:1.0,wetMix:0.3},
        'Chamber':{decay:1.2,roomSize:1.2,wetMix:0.25},
        'Ambience':{decay:0.5,roomSize:0.5,wetMix:0.15},
      };
      btn.addEventListener('click',()=>{ const p=presets[t]; if(p){STATE.reverb={...STATE.reverb,...p};if(activeChain){activeChain.rebuildReverb();activeChain.rebuildReverbImpulse();}renderTab();} });
      revBtns.appendChild(btn);
    });
    root.appendChild(revBtns);
    root.appendChild(buildSlider({ label:'Pre-Delay', icon:ICON('time'), min:0, max:100, step:1, value:0, format:v=>v+'ms', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Diffusion', icon:ICON('pulse'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Damping', icon:ICON('eq'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Shimmer', icon:ICON('star'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{} }).el);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     ENGINE TAB
     ═══════════════════════════════════════════════════════ */
  function buildPowerTab() {
    const root = el('div','bc-section');
    const grid = el('div','bc-power-grid');
    const buttons = [
      { id:'compEnabled', icon:ICON('comp'),  label:'Compressor', sub:'Dynamic range control', extra:'' },
      { id:'chaosMode',   icon:ICON('chaos'), label:'CHAOS MODE', sub:'Infinite gain stack',   extra:'chaos-btn' },
    ];
    buttons.forEach(b => {
      const btn = el('div','bc-power-btn'+(b.extra?' '+b.extra:'')+(STATE[b.id]?' on':''));
      const ico = el('div','bc-power-icon',b.icon);
      const lbl = el('div','bc-power-label',b.label);
      const sub = el('div','bc-toggle-sub',b.sub);
      btn.appendChild(ico); btn.appendChild(lbl); btn.appendChild(sub);
      btn.addEventListener('click', () => {
        STATE[b.id] = !STATE[b.id]; btn.classList.toggle('on', STATE[b.id]);
        if (b.id === 'chaosMode')   { if(activeChain) activeChain.applyUltraGain(); }
        if (b.id === 'compEnabled') { applyState(); }
        updateLauncher();
      });
      grid.appendChild(btn);
    });
    root.appendChild(grid);
    root.appendChild(el('div','bc-section-title','Compressor Tuning'));
    root.appendChild(buildSlider({ label:'Threshold', icon:ICON('threshold'), min:-60, max:0, step:1, value:STATE.compThreshold, format:v=>v+'dB', onChange:v=>{STATE.compThreshold=v;applyState()} }).el);
    root.appendChild(buildSlider({ label:'Ratio', icon:ICON('ratio'), min:1, max:20, step:0.5, value:STATE.compRatio, format:v=>v.toFixed(1)+':1', onChange:v=>{STATE.compRatio=v;applyState()} }).el);
    root.appendChild(el('div','bc-section-title','Audio Chain'));
    root.appendChild(buildToggleRow({ icon:ICON('natural'), label:'DC Blocker', sub:'Remove DC offset', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('eq'), label:'Anti-aliasing', sub:'Prevent aliasing artifacts', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Attack', icon:ICON('speed'), min:0.001, max:0.5, step:0.001, value:0.003, format:v=>(v*1000).toFixed(1)+'ms', onChange:v=>{if(activeChain)activeChain.comp.attack.value=v} }).el);
    root.appendChild(buildSlider({ label:'Release', icon:ICON('speed'), min:0.01, max:1, step:0.01, value:0.15, format:v=>(v*1000).toFixed(0)+'ms', onChange:v=>{if(activeChain)activeChain.comp.release.value=v} }).el);
    root.appendChild(buildSlider({ label:'Knee', icon:ICON('ratio'), min:0, max:40, step:1, value:20, format:v=>v+'dB', onChange:v=>{if(activeChain)activeChain.comp.knee.value=v} }).el);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     PRESETS TAB
     ═══════════════════════════════════════════════════════ */
  function buildPresetsTab() {
    const root = el('div','bc-section');
    const list = el('div','bc-preset-list');
    PRESETS.forEach(p => {
      const row = el('div','bc-preset');
      const ico = el('div','bc-preset-icon',p.icon);
      const mid = el('div'); mid.style.flex='1';
      const nm  = el('div','bc-preset-name',p.name);
      const sub = el('div','bc-preset-sub');
      sub.textContent = `Gain: ${fmtDb(20*Math.log10(Math.max(0.001,p.master)))}  Pitch: ${p.pitch>=0?'+':''}${p.pitch}st  FX: ${p.effect||'none'}`;
      mid.appendChild(nm); mid.appendChild(sub);
      const arr = el('div','bc-preset-arrow','›');
      row.appendChild(ico); row.appendChild(mid); row.appendChild(arr);
      row.addEventListener('click', () => {
        STATE.masterGain=p.master; STATE.preAmp=p.preAmp; STATE.pitch=p.pitch;
        STATE.effect=p.effect; STATE.reverb={...p.reverb}; STATE.godGain=p.god||0; STATE.hyperBoost=p.hyper||0;
        applyState();
        if (activeChain) { activeChain.rebuildEffect(); activeChain.rebuildReverb(); activeChain.rebuildReverbImpulse(); }
        row.style.background='rgba(255,215,0,.15)';
        setTimeout(()=>{row.style.background='';},400);
        renderTab();
      });
      list.appendChild(row);
    });
    root.appendChild(list);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     STATS TAB
     ═══════════════════════════════════════════════════════ */
  function buildStatsTab() {
    const root = el('div','bc-section');
    const grid = el('div','bc-stats-grid');
    const cards = [
      { id:'s-level', label:'Input Level', val:fmtDb(STATE.inputLevel) },
      { id:'s-peak',  label:'Peak dB',     val:fmtDb(STATE.peakDb)     },
      { id:'s-clips', label:'Clips',       val:STATE.clipCount.toString() },
      { id:'s-sess',  label:'Session',     val:fmtTime(Date.now()-STATE.sessionStart) },
      { id:'s-chain', label:'Chain',       val:activeChain?'LIVE':'IDLE' },
      { id:'s-fx',    label:'Effect',      val:STATE.effect||'none' },
      { id:'s-rev',   label:'Reverb Mix',  val:(STATE.reverb.wetMix*100).toFixed(0)+'%' },
      { id:'s-pitch', label:'Pitch',       val:(STATE.pitch>=0?'+':'')+STATE.pitch.toFixed(1)+'st' },
    ];
    cards.forEach(c => {
      const card = el('div','bc-stat-card');
      card.id = c.id;
      card.appendChild(el('div','bc-stat-label',c.label));
      card.appendChild(el('div','bc-stat-val',c.val));
      grid.appendChild(card);
    });
    root.appendChild(grid);
    if (statsInterval) clearInterval(statsInterval);
    statsInterval = setInterval(() => {
      const update = (id, val) => { const c=document.getElementById(id); if(c)c.querySelector('.bc-stat-val').textContent=val; };
      update('s-level', fmtDb(STATE.inputLevel));
      update('s-peak',  fmtDb(STATE.peakDb));
      update('s-clips', STATE.clipCount.toString());
      update('s-sess',  fmtTime(Date.now()-STATE.sessionStart));
      update('s-chain', activeChain?'LIVE':'IDLE');
      update('s-fx',    STATE.effect||'none');
      update('s-rev',   (STATE.reverb.wetMix*100).toFixed(0)+'%');
      update('s-pitch', (STATE.pitch>=0?'+':'')+STATE.pitch.toFixed(1)+'st');
    }, 500);
    const rowEnd = el('div','bc-row-end');
    const resetStats = el('button','bc-btn bc-btn-ghost', ICON('reset')+' Reset Stats');
    resetStats.addEventListener('click',()=>{STATE.clipCount=0;STATE.peakDb=-Infinity;STATE.sessionStart=Date.now();});
    rowEnd.appendChild(resetStats);
    root.appendChild(rowEnd);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     SPATIAL TAB
     ═══════════════════════════════════════════════════════ */
  function buildWiderTab() {
    const root = el('div','bc-section');
    const display = el('div','bc-wider-display');
    const viz = el('div','bc-wider-viz');
    const lL = el('div','bc-wider-lbl l','L');
    const lC = el('div','bc-wider-lbl c','CENTER');
    const lR = el('div','bc-wider-lbl r','R');
    const bars = [];
    for (let i=4;i>=0;i--) { const b=el('div','bc-wider-bar'); b.style.height=(12+i*6)+'px'; viz.appendChild(b); bars.push(b); }
    const cLine = el('div','bc-wider-center-line'); viz.appendChild(cLine);
    for (let i=0;i<5;i++) { const b=el('div','bc-wider-bar'); b.style.height=(12+i*6)+'px'; viz.appendChild(b); bars.push(b); }
    viz.appendChild(lL); viz.appendChild(lC); viz.appendChild(lR);
    display.appendChild(viz);
    const valRow = el('div','bc-wider-val-row');
    const bigVal = el('div','bc-wider-big', (STATE.widerWidth*100).toFixed(0));
    const unitLbl= el('div','bc-wider-unit','% WIDTH');
    valRow.appendChild(bigVal); valRow.appendChild(unitLbl);
    display.appendChild(valRow);
    root.appendChild(display);

    function updateViz(w) {
      bigVal.textContent=(w*100).toFixed(0);
      bars.forEach((b,i)=>{ const dist=Math.abs(i-4.5)/4.5,spread=STATE.widerEnabled?w:0.5; b.style.height=(8+(1-dist)*spread*34)+'px'; b.style.opacity=STATE.widerEnabled?(0.4+spread*0.6):'0.25'; });
    }
    updateViz(STATE.widerWidth);

    root.appendChild(buildToggleRow({ icon:ICON('wider'), label:'Stereo Wider', sub:'Mid/side channel expansion', checked:STATE.widerEnabled, onChange:v=>{STATE.widerEnabled=v;if(activeChain)activeChain.applyWider();updateViz(STATE.widerWidth)} }).el);
    const widthSl = buildSlider({ label:'Width', icon:ICON('boost'), min:0, max:3, step:0.01, value:STATE.widerWidth, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.widerWidth=v;if(activeChain)activeChain.applyWider();updateViz(v)} });
    const depthSl = buildSlider({ label:'Depth', icon:ICON('gain'), min:0, max:1, step:0.01, value:STATE.widerDepth, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.widerDepth=v;if(activeChain)activeChain.applyWider();updateViz(STATE.widerWidth)} });
    const freqSl  = buildSlider({ label:'Low Cutoff', icon:ICON('wave'), min:20, max:500, step:5, value:STATE.widerFreq, format:v=>v+'Hz', onChange:v=>{STATE.widerFreq=v;if(activeChain)activeChain.applyWider()} });
    root.appendChild(widthSl.el); root.appendChild(depthSl.el); root.appendChild(freqSl.el);

    const rowEnd = el('div','bc-row-end');
    const resetBtn = el('button','bc-btn bc-btn-ghost', ICON('reset')+' Reset');
    resetBtn.addEventListener('click',()=>{ STATE.widerEnabled=false;STATE.widerWidth=1.0;STATE.widerDepth=1.0;STATE.widerFreq=80; widthSl.set(1.0);depthSl.set(1.0);freqSl.set(80); if(activeChain)activeChain.applyWider(); updateViz(1.0); });
    rowEnd.appendChild(resetBtn); root.appendChild(rowEnd);

    root.appendChild(el('div','bc-section-title','Spatial Tools'));
    root.appendChild(buildSlider({ label:'Balance', icon:ICON('wider'), min:-1, max:1, step:0.01, value:0, format:v=>v===0?'C':v<0?'L '+Math.abs(Math.round(v*100))+'%':'R '+Math.round(v*100)+'%', onChange:v=>{STATE.balance=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('warp'), label:'Phase Invert', sub:'Flip left channel phase', checked:false, onChange:v=>{STATE.phaseInvert=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('spatial'), label:'Force Mono', sub:'Sum L+R to mono', checked:false, onChange:v=>{STATE.forceMono=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('wider'), label:'Swap Channels', sub:'Exchange L↔R', checked:false, onChange:v=>{STATE.swapChannels=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('voice'), label:'Mid Only', sub:'Center channel only', checked:false, onChange:v=>{STATE.midOnly=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('echo'), label:'Side Only', sub:'Side channel only', checked:false, onChange:v=>{STATE.sideOnly=v} }).el);
    root.appendChild(buildSlider({ label:'Haas Effect', icon:ICON('spatial'), min:0, max:30, step:1, value:0, format:v=>v+'ms', onChange:v=>{STATE.haas=v} }).el);
    root.appendChild(buildSlider({ label:'Crossfeed', icon:ICON('echo'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{STATE.crossfeed=v} }).el);
    root.appendChild(buildSlider({ label:'Stereo Base', icon:ICON('gain'), min:0, max:200, step:1, value:100, format:v=>v+'%', onChange:v=>{STATE.stereoBase=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'Spread Mode', sub:'Enhanced stereo separation', checked:STATE.widerEnabled, onChange:v=>{STATE.widerEnabled=v;if(activeChain)activeChain.applyWider()} }).el);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     PLAYER TAB
     ═══════════════════════════════════════════════════════ */
  function buildMp3Tab() {
    const root = el('div','bc-section');
    const drop   = el('div','bc-mp3-drop');
    const fileIn = document.createElement('input');
    fileIn.type='file'; fileIn.accept='audio/*';
    drop.innerHTML = `<div class="bc-mp3-drop-icon">${ICON('music')}</div><div class="bc-mp3-drop-label">Tap to load audio file<br><span style="font-size:9px;opacity:.5;">MP3 / WAV / OGG / AAC — plays through your mic</span></div>`;
    drop.appendChild(fileIn);
    drop.addEventListener('click',()=>fileIn.click());
    drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('dragover')});
    drop.addEventListener('dragleave',()=>drop.classList.remove('dragover'));
    drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('dragover');const f=e.dataTransfer.files[0];if(f){mp3Load(f);mp3UpdateNameEl();mp3UpdatePlayBtn();}});
    fileIn.addEventListener('change',()=>{if(fileIn.files[0]){mp3Load(fileIn.files[0]);mp3UpdateNameEl();mp3UpdatePlayBtn();}});
    root.appendChild(drop);

    const nameEl = el('div','bc-mp3-name'); nameEl.id='bc-mp3-name'; nameEl.textContent=MP3.fileName||'No file loaded'; root.appendChild(nameEl);

    const wave = el('div','bc-mp3-waveform');
    for(let i=0;i<28;i++){const b=el('div','bc-mp3-bar');wave.appendChild(b);}
    root.appendChild(wave);

    const progWrap = el('div','bc-mp3-progress-wrap');
    const progFill = el('div','bc-mp3-progress-fill'); progFill.id='bc-mp3-prog';
    progWrap.appendChild(progFill);
    progWrap.addEventListener('click',e=>{if(!MP3.audio||!MP3.audio.duration)return;const pct=e.offsetX/progWrap.offsetWidth;MP3.audio.currentTime=pct*MP3.audio.duration;});
    root.appendChild(progWrap);

    const timeEl = el('div','bc-mp3-time','0:00 / 0:00'); timeEl.id='bc-mp3-time'; root.appendChild(timeEl);

    const controls = el('div','bc-mp3-controls');
    const stopBtn=el('div','bc-mp3-btn'); stopBtn.innerHTML=ICON('stop');
    const playBtn=el('div','bc-mp3-btn play-btn'); playBtn.id='bc-mp3-playbtn'; playBtn.innerHTML=MP3.playing?ICON('pause'):ICON('play');
    const rwdBtn=el('div','bc-mp3-btn'); rwdBtn.innerHTML=ICON('prev');
    const loopBtn=el('div','bc-mp3-btn'); loopBtn.innerHTML=ICON('loop');
    const fwdBtn=el('div','bc-mp3-btn'); fwdBtn.innerHTML=ICON('next');
    let loopOn=true;
    rwdBtn.addEventListener('click',()=>{if(MP3.audio)MP3.audio.currentTime=Math.max(0,MP3.audio.currentTime-10)});
    stopBtn.addEventListener('click',()=>mp3Stop());
    playBtn.addEventListener('click',()=>mp3Toggle());
    loopBtn.addEventListener('click',()=>{loopOn=!loopOn;if(MP3.audio)MP3.audio.loop=loopOn;loopBtn.classList.toggle('active-btn',loopOn)});
    fwdBtn.addEventListener('click',()=>{if(MP3.audio)MP3.audio.currentTime=Math.min(MP3.audio.duration||0,MP3.audio.currentTime+10)});
    controls.appendChild(rwdBtn); controls.appendChild(stopBtn); controls.appendChild(playBtn); controls.appendChild(loopBtn); controls.appendChild(fwdBtn);
    root.appendChild(controls);

    root.appendChild(el('div','bc-section-title','Volume & Gain'));
    root.appendChild(buildSlider({ label:'Volume', icon:ICON('boost'), min:0, max:8, step:0.05, value:MP3.volume, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{MP3.volume=v;if(MP3.gainNode)MP3.gainNode.gain.value=v} }).el);
    root.appendChild(buildSlider({ label:'Music Boost', icon:ICON('broadcast'), min:1, max:60, step:0.5, value:MP3.musicBoost, format:v=>v.toFixed(1)+'×', onChange:v=>{MP3.musicBoost=v;if(MP3.musicGain)MP3.musicGain.gain.value=v} }).el);
    root.appendChild(buildSlider({ label:'Playback Speed', icon:ICON('speed'), min:0.25, max:3, step:0.05, value:1, format:v=>v.toFixed(2)+'x', onChange:v=>{if(MP3.audio)MP3.audio.playbackRate=v} }).el);
    root.appendChild(buildSlider({ label:'Bass Boost', icon:ICON('chaos'), min:0, max:20, step:0.5, value:0, format:v=>'+'+v.toFixed(0)+'dB', onChange:v=>{if(!MP3._bassNode){const ctx2=getCtx();if(!ctx2)return;MP3._bassNode=ctx2.createBiquadFilter();MP3._bassNode.type='lowshelf';MP3._bassNode.frequency.value=200;try{MP3.musicGain.disconnect();MP3.musicGain.connect(MP3._bassNode);MP3._bassNode.connect(MP3.gainNode)}catch(e){}}if(MP3._bassNode)MP3._bassNode.gain.value=v} }).el);
    root.appendChild(buildSlider({ label:'Treble Boost', icon:ICON('star'), min:-12, max:12, step:0.5, value:0, format:v=>(v>=0?'+':'')+v.toFixed(0)+'dB', onChange:v=>{if(!MP3._trebleNode){const ctx2=getCtx();if(!ctx2)return;MP3._trebleNode=ctx2.createBiquadFilter();MP3._trebleNode.type='highshelf';MP3._trebleNode.frequency.value=6000;try{if(MP3._bassNode){MP3._bassNode.disconnect();MP3._bassNode.connect(MP3._trebleNode);MP3._trebleNode.connect(MP3.gainNode)}else{MP3.musicGain.disconnect();MP3.musicGain.connect(MP3._trebleNode);MP3._trebleNode.connect(MP3.gainNode)}}catch(e){}}if(MP3._trebleNode)MP3._trebleNode.gain.value=v} }).el);
    root.appendChild(buildSlider({ label:'Pitch Shift', icon:ICON('music'), min:-12, max:12, step:0.5, value:0, format:v=>(v>=0?'+':'')+v.toFixed(1)+'st', onChange:v=>{if(!MP3._pitchNode){const ctx2=getCtx();if(!ctx2)return;MP3._pitchNode=createPitchShifter(ctx2);try{MP3.gainNode.disconnect();MP3.gainNode.connect(MP3._pitchNode.input);MP3._pitchNode.output.connect(MP3.analyser)}catch(e){}}if(MP3._pitchNode)MP3._pitchNode.setPitchOffset(v/12)} }).el);

    root.appendChild(el('div','bc-section-title','MP3 Effects'));
    root.appendChild(buildSlider({ label:'Reverb', icon:ICON('reverb'), min:0, max:1, step:0.01, value:0, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{if(!MP3._revNode&&v>0){const ctx2=getCtx();if(!ctx2)return;const ir=ctx2.createBuffer(2,ctx2.sampleRate*1.5,ctx2.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.1));}MP3._revConv=ctx2.createConvolver();MP3._revConv.buffer=ir;MP3._revWet=ctx2.createGain();MP3._revWet.gain.value=v;MP3._revDry=ctx2.createGain();MP3._revDry.gain.value=1-v;const dest=MP3._trebleNode||MP3._bassNode||MP3.musicGain;try{dest.disconnect();dest.connect(MP3._revDry);dest.connect(MP3._revConv);MP3._revConv.connect(MP3._revWet);MP3._revDry.connect(MP3.gainNode);MP3._revWet.connect(MP3.gainNode)}catch(e){}}else if(MP3._revWet){MP3._revWet.gain.value=v;MP3._revDry.gain.value=1-v;}} }).el);
    root.appendChild(buildSlider({ label:'Chorus', icon:ICON('galaxy'), min:0, max:1, step:0.01, value:0, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{if(!MP3._chorusNode&&v>0){const ctx2=getCtx();if(!ctx2)return;const dl=ctx2.createDelay(0.1);dl.delayTime.value=0.025;const lfo=ctx2.createOscillator();lfo.frequency.value=1.5;const lfoG=ctx2.createGain();lfoG.gain.value=0.005;const wet=ctx2.createGain();wet.gain.value=v;lfo.connect(lfoG);lfoG.connect(dl.delayTime);lfo.start();MP3._chorusLfo=lfo;MP3._chorusDelay=dl;MP3._chorusWet=wet;MP3._chorusNode=true;}else if(MP3._chorusWet){MP3._chorusWet.gain.value=v;}} }).el);
    root.appendChild(buildSlider({ label:'Echo', icon:ICON('echo'), min:0, max:1, step:0.01, value:0, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{if(!MP3._delayNode&&v>0){const ctx2=getCtx();if(!ctx2)return;MP3._delayNode=ctx2.createDelay(1);MP3._delayNode.delayTime.value=0.35;MP3._delayFb=ctx2.createGain();MP3._delayFb.gain.value=0.3;MP3._delayWet=ctx2.createGain();MP3._delayWet.gain.value=v;const dest=MP3.musicGain;try{dest.connect(MP3._delayNode);MP3._delayNode.connect(MP3._delayFb);MP3._delayFb.connect(MP3._delayNode);MP3._delayNode.connect(MP3._delayWet);MP3._delayWet.connect(MP3.gainNode);}catch(e){}}else if(MP3._delayWet){MP3._delayWet.gain.value=v;}} }).el);
    root.appendChild(buildSlider({ label:'Distortion', icon:ICON('rampage'), min:0, max:100, step:1, value:0, format:v=>v.toFixed(0)+'%', onChange:v=>{if(!MP3._distNode&&v>0){const ctx2=getCtx();if(!ctx2)return;MP3._distNode=ctx2.createWaveShaper();MP3._distNode.curve=makeDistortionCurve(v*2);MP3._distNode.oversample='2x';MP3._distGain=ctx2.createGain();MP3._distGain.gain.value=0.5;const dest=MP3.musicGain;try{dest.disconnect();dest.connect(MP3._distNode);MP3._distNode.connect(MP3._distGain);MP3._distGain.connect(MP3.gainNode);}catch(e){}}else if(MP3._distNode){MP3._distNode.curve=makeDistortionCurve(v*2);}} }).el);
    root.appendChild(buildSlider({ label:'Phaser', icon:ICON('warp'), min:0, max:1, step:0.01, value:0, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Flanger', icon:ICON('warp'), min:0, max:1, step:0.01, value:0, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Widener', icon:ICON('wider'), min:0, max:100, step:1, value:0, format:v=>v.toFixed(0)+'%', onChange:v=>{} }).el);

    const rowEnd = el('div','bc-row-end');
    const routeBtn = el('button','bc-btn bc-btn-primary', ICON('route')+' Route to Mic');
    routeBtn.addEventListener('click',()=>{ mp3Reconnect(); routeBtn.innerHTML=ICON('check')+' Routed!'; setTimeout(()=>{routeBtn.innerHTML=ICON('route')+' Route to Mic'},1500); });
    rowEnd.appendChild(routeBtn); root.appendChild(rowEnd);

    root.appendChild(el('div','bc-section-title','Player Tools'));
    const fadeRow = el('div','bc-row-end');
    const fadeIn  = el('button','bc-btn bc-btn-ghost',ICON('play')+' Fade In'); fadeIn.style.fontSize='9px';
    const fadeOut = el('button','bc-btn bc-btn-ghost',ICON('stop')+' Fade Out'); fadeOut.style.fontSize='9px';
    fadeIn.addEventListener('click',()=>{ if(!MP3.audio)return; MP3.audio.volume=0; const iv=setInterval(()=>{if(MP3.audio.volume<MP3.volume)MP3.audio.volume=Math.min(MP3.volume,MP3.audio.volume+0.05); else clearInterval(iv)},50); setTimeout(()=>clearInterval(iv),3000); });
    fadeOut.addEventListener('click',()=>{ if(!MP3.audio)return; const iv=setInterval(()=>{if(MP3.audio.volume>0.02)MP3.audio.volume-=0.03; else{MP3.audio.volume=0;clearInterval(iv);mp3Stop();}},50); });
    fadeRow.appendChild(fadeIn); fadeRow.appendChild(fadeOut); root.appendChild(fadeRow);

    root.appendChild(buildSlider({ label:'Balance', icon:ICON('wider'), min:-1, max:1, step:0.01, value:0, format:v=>v===0?'C':v<0?'L '+Math.abs(Math.round(v*100))+'%':'R '+Math.round(v*100)+'%', onChange:v=>{STATE.mp3Bal=v} }).el);
    root.appendChild(buildSlider({ label:'Pre-amp', icon:ICON('amplify2'), min:1, max:15, step:0.5, value:1, format:v=>v.toFixed(1)+'x', onChange:v=>{MP3.musicBoost=v;if(MP3.musicGain)MP3.musicGain.gain.value=v} }).el);

    const seekBRow = el('div','bc-row-end');
    [-30,-15,-5,5,15,30].forEach(s=>{
      const btn=el('button','bc-btn bc-btn-ghost',(s<0?'':'+')+s+'s');
      btn.style.fontSize='8px'; btn.style.padding='2px 5px';
      btn.addEventListener('click',()=>{if(MP3.audio)MP3.audio.currentTime=Math.max(0,Math.min(MP3.audio.duration||0,MP3.audio.currentTime+s))});
      seekBRow.appendChild(btn);
    });
    root.appendChild(seekBRow);

    const dlBtn = el('button','bc-btn bc-btn-ghost',ICON('download')+' Download');
    dlBtn.style.fontSize='9px';
    dlBtn.addEventListener('click',()=>{if(MP3._objUrl){const a=document.createElement('a');a.href=MP3._objUrl;a.download=MP3.fileName||'audio';a.click()}});
    root.appendChild(dlBtn);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     VOICE CHANGER TAB
     ═══════════════════════════════════════════════════════ */
  const VOICE_PRESETS = [
    { id:'natural',     name:'AURA',      icon:ICON('aura'),      desc:'Natural resonance',       pitch:0,   effect:null,        reverb:{wetMix:0.05,decay:1,  roomSize:1,  dry:true},  god:0,    hyper:0    },
    { id:'deepmale',    name:'TITAN',     icon:ICON('titan'),     desc:'Deep rumble of power',    pitch:-5,  effect:'deep',      reverb:{wetMix:0.15,decay:2.5,roomSize:2,  dry:false}, god:0.15, hyper:0    },
    { id:'female',      name:'SERAPHIM',  icon:ICON('seraphim'),  desc:'Bright celestial tone',   pitch:5,   effect:'vocalizer', reverb:{wetMix:0.1, decay:1.5,roomSize:1.2,dry:false}, god:0,    hyper:0    },
    { id:'child',       name:'SPRITE',    icon:ICON('sprite'),    desc:'Playful pixie voice',     pitch:9,   effect:'chipmunk',  reverb:{wetMix:0.12,decay:1.2,roomSize:1,  dry:false}, god:0,    hyper:0    },
    { id:'anime',       name:'KITSUNE',   icon:ICON('kitsune'),   desc:'Mythical high charm',     pitch:11,  effect:'vocalizer', reverb:{wetMix:0.18,decay:1.5,roomSize:1.2,dry:false}, god:0,    hyper:0    },
    { id:'monster',     name:'LEVIATHAN', icon:ICON('leviathan'), desc:'Terrifying deep growl',   pitch:-9,  effect:'growl',     reverb:{wetMix:0.4, decay:4,  roomSize:3.5,dry:false}, god:0.3,  hyper:0.1  },
    { id:'robot',       name:'SYNTHEX',   icon:ICON('synthex'),   desc:'Digital machine mind',    pitch:0,   effect:'robot',     reverb:{wetMix:0.2, decay:2,  roomSize:1.8,dry:false}, god:0.1,  hyper:0    },
    { id:'ghost',       name:'WRAITH',    icon:ICON('wraith'),    desc:'Ethereal spectral drift', pitch:3,   effect:'whisper',   reverb:{wetMix:0.55,decay:4,  roomSize:3,  dry:false}, god:0,    hyper:0    },
    { id:'alien',       name:'COSMIC',    icon:ICON('cosmic'),    desc:'Extraterrestrial being',  pitch:0,   effect:'alien',     reverb:{wetMix:0.35,decay:2.5,roomSize:2,  dry:false}, god:0.2,  hyper:0    },
    { id:'broadcaster', name:'CASTER',    icon:ICON('caster'),    desc:'Professional broadcast',  pitch:0,   effect:'telephone', reverb:{wetMix:0.08,decay:1.2,roomSize:1,  dry:false}, god:0.05, hyper:0    },
    { id:'demon',       name:'ABYSSAL',   icon:ICON('abyssal'),   desc:'Ancient dark entity',     pitch:-7,  effect:'distort',   reverb:{wetMix:0.45,decay:5,  roomSize:4,  dry:false}, god:0.35, hyper:0.12 },
    { id:'megaphone',   name:'HERALD',    icon:ICON('herald'),    desc:'Loud proclamator',        pitch:0,   effect:'megaphone', reverb:{wetMix:0.15,decay:1.5,roomSize:1.5,dry:false}, god:0.1,  hyper:0    },
  ];
  let activeVoiceId = 'natural';
  let voiceBarTimerId = null;

  function applyVoicePreset(vp) {
    activeVoiceId = vp.id; STATE.pitch=vp.pitch; STATE.effect=vp.effect; STATE.reverb={...vp.reverb}; STATE.godGain=vp.god; STATE.hyperBoost=vp.hyper;
    applyState();
    if (activeChain) { activeChain.applyPitch(vp.pitch); activeChain.rebuildEffect(); activeChain.rebuildReverb(); activeChain.rebuildReverbImpulse(); activeChain.applyUltraGain(); }
  }

  function buildVoiceChangerTab() {
    const root = el('div','bc-section');
    const display    = el('div','bc-voice-display');
    const curVP      = VOICE_PRESETS.find(v=>v.id===activeVoiceId)||VOICE_PRESETS[0];
    const activeName = el('div','bc-voice-active-name',curVP.icon+'  '+curVP.name);
    const activeSub  = el('div','bc-voice-active-sub',curVP.desc);
    const barsWrap   = el('div','bc-voice-bars');
    const barEls     = [];
    for (let i=0;i<20;i++) { const b=el('div','bc-voice-bar'); b.style.height=(4+Math.random()*24)+'px'; barsWrap.appendChild(b); barEls.push(b); }
    display.appendChild(activeName); display.appendChild(activeSub); display.appendChild(barsWrap);
    root.appendChild(display);

    if (voiceBarTimerId) clearInterval(voiceBarTimerId);
    voiceBarTimerId = setInterval(()=>{barEls.forEach((b,i)=>{const t=Date.now()/280+i*0.45;b.style.height=(4+(Math.sin(t)*0.5+0.5)*28)+'px';})},70);

    root.appendChild(el('div','bc-section-title','Voice Profiles'));
    const grid = el('div','bc-voice-grid');
    VOICE_PRESETS.forEach(vp => {
      const card = el('div','bc-voice-card'+(vp.id===activeVoiceId?' active':''));
      const ico  = el('div','bc-voice-card-icon',vp.icon);
      const info = el('div','bc-voice-card-info');
      info.appendChild(el('div','bc-voice-card-name',vp.name));
      info.appendChild(el('div','bc-voice-card-desc',vp.desc));
      card.appendChild(ico); card.appendChild(info);
      card.addEventListener('click',()=>{ applyVoicePreset(vp); grid.querySelectorAll('.bc-voice-card').forEach(c=>c.classList.remove('active')); card.classList.add('active'); activeName.innerHTML=vp.icon+'  '+vp.name; activeSub.textContent=vp.desc; });
      grid.appendChild(card);
    });
    root.appendChild(grid);

    root.appendChild(el('div','bc-section-title','Fine Tuning'));
    const pitchFine = buildSlider({ label:'Pitch Adjust', icon:ICON('music'), min:-12, max:12, step:0.1, value:STATE.pitch, format:v=>(v>=0?'+':'')+v.toFixed(1)+'st', onChange:v=>{STATE.pitch=v;if(activeChain)activeChain.applyPitch(v)} });
    const intensitySlider = buildSlider({ label:'Voice Intensity', icon:ICON('flame'), min:0, max:1, step:0.01, value:STATE.godGain, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{STATE.godGain=v;if(activeChain)activeChain.applyUltraGain()} });
    root.appendChild(pitchFine.el); root.appendChild(intensitySlider.el);

    const rowEnd = el('div','bc-row-end');
    const resetBtn = el('button','bc-btn bc-btn-ghost', ICON('reset')+' Reset Voice');
    resetBtn.addEventListener('click',()=>{ const nat=VOICE_PRESETS[0]; applyVoicePreset(nat); pitchFine.set(0); intensitySlider.set(0); grid.querySelectorAll('.bc-voice-card').forEach(c=>c.classList.remove('active')); grid.querySelector('.bc-voice-card').classList.add('active'); activeName.innerHTML=nat.icon+'  '+nat.name; activeSub.textContent=nat.desc; });
    rowEnd.appendChild(resetBtn); root.appendChild(rowEnd);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     LOUDMIC TAB — 500+ Controls organized in sub-categories
     ═══════════════════════════════════════════════════════ */
  function buildLoudmicTab() {
    const root = el('div','bc-section');
    const subCats = ['Input','31-Band EQ','Dynamics','Effects','Spatial','Output','Playback','Presets'];
    let activeSubCat = 'Input';

    const subtabWrap = el('div','bc-lmic-subtabs');
    const contentWrap = el('div','bc-lmic-content');

    function renderSubcat(cat) {
      activeSubCat = cat;
      subtabWrap.querySelectorAll('.bc-lmic-subbtn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
      contentWrap.innerHTML = '';
      contentWrap.classList.remove('bc-lmic-content'); void contentWrap.offsetWidth; contentWrap.classList.add('bc-lmic-content');

      switch(cat) {

        case 'Input': {
          contentWrap.appendChild(el('div','bc-section-title','Input Source'));
          contentWrap.appendChild(buildSlider({ label:'Input Gain', icon:ICON('gain'), min:-20, max:20, step:0.5, value:0, format:v=>(v>=0?'+':'')+v+'dB', onChange:v=>{LMIC.inputGain=Math.pow(10,v/20)} }).el);
          contentWrap.appendChild(buildSlider({ label:'Input Pad', icon:ICON('threshold'), min:-20, max:0, step:1, value:0, format:v=>v+'dB', onChange:v=>{LMIC.inputPad=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Input Trim', icon:ICON('gain'), min:-12, max:12, step:0.5, value:0, format:v=>(v>=0?'+':'')+v+'dB', onChange:v=>{LMIC.inputTrim=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Latency Comp', icon:ICON('time'), min:0, max:500, step:1, value:0, format:v=>v+'ms', onChange:v=>{LMIC.latencyComp=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Noise Floor', icon:ICON('shade'), min:-120, max:-40, step:1, value:-90, format:v=>v+'dB', onChange:v=>{LMIC.noiseFloor=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Input Mode'));
          const modeOpts = [{value:'stereo',label:'Stereo'},{value:'mono',label:'Mono (Sum)'},{value:'left',label:'Left Only'},{value:'right',label:'Right Only'},{value:'mid',label:'Mid (Center)'},{value:'side',label:'Side'},{value:'ms',label:'M/S Matrix'}];
          contentWrap.appendChild(buildSelect({ label:'Channel Mode', options:modeOpts, value:'stereo', onChange:v=>{LMIC.inputMode=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Filtering'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('eq'), label:'Subsonic Filter', sub:'Remove sub-20Hz rumble', checked:false, onChange:v=>{LMIC.subsonicFilter=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('eq'), label:'RFI Filter', sub:'Radio frequency interference removal', checked:false, onChange:v=>{LMIC.rfFilter=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('eq'), label:'Hum Remover', sub:'Remove 50/60Hz electrical hum', checked:false, onChange:v=>{LMIC.humRemover=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'DC Blocker', sub:'Remove DC offset component', checked:true, onChange:v=>{LMIC.dcBlocker=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('amplify'), label:'Soft Clipping', sub:'Gentle saturation at extremes', checked:true, onChange:v=>{LMIC.softClip=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Auto Gain Control'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('voice'), label:'AGC Enable', sub:'Automatic gain control', checked:false, onChange:v=>{LMIC.agcEnabled=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'AGC Target', icon:ICON('threshold'), min:-40, max:0, step:1, value:-18, format:v=>v+'dBFS', onChange:v=>{LMIC.agcTarget=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'AGC Attack', icon:ICON('speed'), min:1, max:300, step:1, value:10, format:v=>v+'ms', onChange:v=>{LMIC.agcAttack=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'AGC Release', icon:ICON('speed'), min:50, max:3000, step:50, value:100, format:v=>v+'ms', onChange:v=>{LMIC.agcRelease=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'AGC Max Gain', icon:ICON('boost'), min:0, max:30, step:1, value:0, format:v=>'+'+v+'dB', onChange:v=>{LMIC.agcMax=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'AGC Min Gain', icon:ICON('depth'), min:-30, max:0, step:1, value:-30, format:v=>v+'dB', onChange:v=>{LMIC.agcMin=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Phase & Polarity'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('warp'), label:'Phase Invert L', sub:'Flip left channel polarity', checked:false, onChange:v=>{LMIC.phaseInvertL=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('warp'), label:'Phase Invert R', sub:'Flip right channel polarity', checked:false, onChange:v=>{LMIC.phaseInvertR=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Phase Offset', icon:ICON('pulse'), min:0, max:360, step:1, value:0, format:v=>v+'°', onChange:v=>{LMIC.phaseOffset=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Dithering & Format'));
          const ditherOpts = [{value:'none',label:'None'},{value:'rect',label:'Rectangular'},{value:'tri',label:'Triangular'},{value:'hp',label:'High Pass Shaped'},{value:'ns2',label:'Noise Shaping 2'},{value:'ns3',label:'Noise Shaping 3'}];
          contentWrap.appendChild(buildSelect({ label:'Dither Type', options:ditherOpts, value:'none', onChange:v=>{LMIC.dither=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('engine'), label:'24-Bit Mode', sub:'Process in 24-bit depth', checked:false, onChange:v=>{LMIC.bit24Mode=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('amplify'), label:'True Peak Limiter', sub:'Prevent inter-sample peaks', checked:false, onChange:v=>{LMIC.truePeakLim=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('circuit'), label:'Zero-Cross Clamp', sub:'Clamp at zero crossings', checked:false, onChange:v=>{LMIC.autoZeroCross=v} }).el);
          break;
        }

        case '31-Band EQ': {
          contentWrap.appendChild(el('div','bc-section-title','31-Band ISO Equalizer'));
          const eq31Grid = el('div'); eq31Grid.style.cssText='display:grid;grid-template-columns:repeat(31,1fr);gap:2px;height:185px;padding:6px 2px;background:rgba(0,0,0,.3);border-radius:8px;border:1px solid rgba(255,215,0,.07);margin-bottom:8px;overflow-x:auto;';
          EQ31_LABELS.forEach((lbl,i) => {
            const col = el('div'); col.style.cssText='display:flex;flex-direction:column;align-items:center;gap:1px;height:100%;min-width:14px;';
            const val = el('div'); val.style.cssText='font-size:5px;color:rgba(255,215,0,.3);text-align:center;'; val.textContent='0';
            const slider = document.createElement('input');
            slider.type='range'; slider.style.cssText='-webkit-appearance:slider-vertical;appearance:slider-vertical;writing-mode:bt-lr;width:8px;flex:1;cursor:pointer;outline:none;border:none;background:linear-gradient(to top,#000,#FFD700 50%,#FFEC80);';
            slider.min=-12; slider.max=12; slider.step=0.5; slider.value=LMIC.eq31[i]||0;
            const lbl2 = el('div'); lbl2.style.cssText='font-size:4.5px;color:rgba(255,215,0,.25);writing-mode:vertical-rl;transform:rotate(180deg);height:20px;'; lbl2.textContent=lbl;
            slider.addEventListener('input',()=>{ LMIC.eq31[i]=parseFloat(slider.value); val.textContent=(LMIC.eq31[i]>0?'+':'')+LMIC.eq31[i]; });
            col.appendChild(val); col.appendChild(slider); col.appendChild(lbl2);
            eq31Grid.appendChild(col);
          });
          contentWrap.appendChild(eq31Grid);

          const eq31PresRow = el('div','bc-row-end');
          eq31PresRow.style.flexWrap='wrap'; eq31PresRow.style.justifyContent='flex-start'; eq31PresRow.style.gap='3px';
          const eq31Presets = {
            'FLAT':   new Array(31).fill(0),
            'BASS':   [4,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-2,-2,-2,-1,0,0,0,0],
            'TREBLE': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,3,4,4,4,4,3,2,1],
            'V-SHAPE':[5,4,3,2,1,0,-1,-2,-3,-3,-3,-3,-3,-3,-2,-1,0,0,1,2,3,3,4,4,5,5,4,3,2,1,0],
            'VOCAL':  [-2,-2,-1,0,1,2,3,3,3,2,2,2,2,2,2,2,2,2,1,0,-1,-1,-2,-2,-2,-1,0,0,0,0,0],
            'JAZZ':   [2,2,1,1,0,0,-1,-1,-1,-1,0,1,2,2,2,2,2,2,1,0,-1,-1,-2,-2,-2,-1,0,0,0,0,0],
            'ROCK':   [4,3,2,1,0,-1,-1,-1,-1,0,0,1,2,3,3,3,2,1,0,-1,-2,-2,-3,-3,-2,-1,0,1,2,3,4],
            'CLUB':   [3,3,3,2,1,0,0,0,0,1,2,3,4,4,3,2,1,0,-1,-2,-3,-3,-3,-2,-1,0,1,2,3,3,3],
          };
          Object.entries(eq31Presets).forEach(([name,vals])=>{
            const btn=el('button','bc-btn bc-btn-ghost',name);
            btn.style.fontSize='7px'; btn.style.padding='2px 5px';
            btn.addEventListener('click',()=>{ LMIC.eq31=[...vals]; eq31Grid.querySelectorAll('input[type=range]').forEach((sl,i)=>{sl.value=vals[i];sl.previousElementSibling.textContent=(vals[i]>0?'+':'')+vals[i];}); });
            eq31PresRow.appendChild(btn);
          });
          contentWrap.appendChild(eq31PresRow);

          contentWrap.appendChild(el('div','bc-section-title','EQ Controls'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('mute'), label:'EQ Bypass', sub:'Temporarily bypass all EQ', checked:false, onChange:v=>{LMIC.eq31Bypass=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'EQ Master', icon:ICON('gain'), min:-12, max:12, step:0.5, value:0, format:v=>(v>=0?'+':'')+v+'dB', onChange:v=>{LMIC.eq31Master=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Q Width', icon:ICON('eq'), min:0.5, max:5, step:0.1, value:1.4, format:v=>v.toFixed(1), onChange:v=>{LMIC.eq31Q=v} }).el);
          const eqTypeOpts=[{value:'parametric',label:'Parametric'},{value:'graphic',label:'Graphic'},{value:'linear',label:'Linear Phase'},{value:'minimum',label:'Minimum Phase'}];
          contentWrap.appendChild(buildSelect({ label:'EQ Type', options:eqTypeOpts, value:'parametric', onChange:v=>{LMIC.eq31Type=v} }).el);
          const slopeOpts=[{value:6,label:'6 dB/oct'},{value:12,label:'12 dB/oct'},{value:24,label:'24 dB/oct'},{value:48,label:'48 dB/oct'}];
          contentWrap.appendChild(buildSelect({ label:'Filter Slope', options:slopeOpts, value:12, onChange:v=>{LMIC.eq31Slope=parseInt(v)} }).el);
          break;
        }

        case 'Dynamics': {
          contentWrap.appendChild(el('div','bc-section-title','Compressor'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('comp'), label:'Compressor Enable', sub:'Dynamic range compressor', checked:false, onChange:v=>{LMIC.lmCompEnabled=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Threshold', icon:ICON('threshold'), min:-60, max:0, step:1, value:-24, format:v=>v+'dBFS', onChange:v=>{LMIC.lmCompThreshold=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Ratio', icon:ICON('ratio'), min:1, max:20, step:0.5, value:4, format:v=>v.toFixed(1)+':1', onChange:v=>{LMIC.lmCompRatio=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Attack', icon:ICON('speed'), min:0.1, max:300, step:0.1, value:5, format:v=>v.toFixed(1)+'ms', onChange:v=>{LMIC.lmCompAttack=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Release', icon:ICON('speed'), min:10, max:3000, step:10, value:50, format:v=>v+'ms', onChange:v=>{LMIC.lmCompRelease=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Knee', icon:ICON('eq'), min:0, max:30, step:1, value:3, format:v=>v+'dB', onChange:v=>{LMIC.lmCompKnee=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Makeup Gain', icon:ICON('amplify2'), min:0, max:30, step:0.5, value:0, format:v=>'+'+v+'dB', onChange:v=>{LMIC.lmCompMakeup=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('voice'), label:'Auto Makeup', sub:'Automatic makeup gain', checked:false, onChange:v=>{LMIC.lmCompAuto=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('mixer'), label:'Parallel Compress', sub:'New York compression blend', checked:false, onChange:v=>{LMIC.lmCompParallel=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Parallel Mix', icon:ICON('mixer'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmCompParallelMix=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Limiter'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('hyper'), label:'Limiter Enable', sub:'Hard ceiling brick-wall limiter', checked:false, onChange:v=>{LMIC.lmLimEnabled=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Threshold', icon:ICON('threshold'), min:-24, max:0, step:0.5, value:-3, format:v=>v+'dBFS', onChange:v=>{LMIC.lmLimThreshold=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Release', icon:ICON('speed'), min:10, max:1000, step:10, value:50, format:v=>v+'ms', onChange:v=>{LMIC.lmLimRelease=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Lookahead', icon:ICON('time'), min:0, max:20, step:0.5, value:1, format:v=>v.toFixed(1)+'ms', onChange:v=>{LMIC.lmLimLookahead=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Ceiling', icon:ICON('threshold'), min:-3, max:0, step:0.1, value:-0.1, format:v=>v.toFixed(1)+'dBFS', onChange:v=>{LMIC.lmLimCeiling=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Noise Gate'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('shade'), label:'Gate Enable', sub:'Dynamic noise gate', checked:false, onChange:v=>{LMIC.lmGateEnabled=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Threshold', icon:ICON('threshold'), min:-80, max:-20, step:1, value:-60, format:v=>v+'dBFS', onChange:v=>{LMIC.lmGateThreshold=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Attack', icon:ICON('speed'), min:0.1, max:100, step:0.1, value:1, format:v=>v.toFixed(1)+'ms', onChange:v=>{LMIC.lmGateAttack=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Hold', icon:ICON('time'), min:0, max:1000, step:10, value:100, format:v=>v+'ms', onChange:v=>{LMIC.lmGateHold=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Release', icon:ICON('speed'), min:10, max:3000, step:10, value:200, format:v=>v+'ms', onChange:v=>{LMIC.lmGateRelease=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Gate Range', icon:ICON('depth'), min:-80, max:0, step:1, value:-80, format:v=>v+'dB', onChange:v=>{LMIC.lmGateRange=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Expander'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('gain'), label:'Expander Enable', sub:'Downward expander / transient', checked:false, onChange:v=>{LMIC.lmExpEnabled=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Threshold', icon:ICON('threshold'), min:-60, max:-10, step:1, value:-40, format:v=>v+'dBFS', onChange:v=>{LMIC.lmExpThreshold=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Ratio', icon:ICON('ratio'), min:1, max:10, step:0.5, value:2, format:v=>v.toFixed(1)+':1', onChange:v=>{LMIC.lmExpRatio=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Transient Shaper'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'Transient Shaper', sub:'Attack/sustain control', checked:false, onChange:v=>{LMIC.lmTransShaper=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Attack Shape', icon:ICON('boost'), min:-100, max:100, step:1, value:10, format:v=>(v>=0?'+':'')+v, onChange:v=>{LMIC.lmTransAttack=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Sustain Shape', icon:ICON('depth'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'+':'')+v, onChange:v=>{LMIC.lmTransSustain=v} }).el);
          break;
        }

        case 'Effects': {
          contentWrap.appendChild(el('div','bc-section-title','Reverb'));
          const revTypeOpts=[{value:'hall',label:'Hall'},{value:'room',label:'Room'},{value:'plate',label:'Plate'},{value:'spring',label:'Spring'},{value:'cathedral',label:'Cathedral'},{value:'ambience',label:'Ambience'}];
          contentWrap.appendChild(buildSelect({ label:'Reverb Type', options:revTypeOpts, value:'hall', onChange:v=>{LMIC.lmRevType=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Pre-Delay', icon:ICON('time'), min:0, max:150, step:1, value:20, format:v=>v+'ms', onChange:v=>{LMIC.lmRevPreDelay=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Decay Time', icon:ICON('speed'), min:0.1, max:15, step:0.1, value:2.5, format:v=>v.toFixed(1)+'s', onChange:v=>{LMIC.lmRevDecay=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Room Size', icon:ICON('room'), min:0.1, max:5, step:0.1, value:2.0, format:v=>v.toFixed(1), onChange:v=>{LMIC.lmRevSize=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Damping', icon:ICON('eq'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmRevDamp=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Wet Mix', icon:ICON('reverb'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmRevWet=v/100} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Chorus'));
          contentWrap.appendChild(buildSlider({ label:'Rate', icon:ICON('speed'), min:0.1, max:8, step:0.1, value:1.5, format:v=>v.toFixed(1)+'Hz', onChange:v=>{LMIC.lmChRate=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Depth', icon:ICON('depth'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmChDepth=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Voices', icon:ICON('voice'), min:2, max:8, step:1, value:3, format:v=>Math.round(v), onChange:v=>{LMIC.lmChVoices=Math.round(v)} }).el);
          contentWrap.appendChild(buildSlider({ label:'Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmChWet=v/100} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Delay'));
          contentWrap.appendChild(buildSlider({ label:'Delay Time', icon:ICON('echo'), min:10, max:2000, step:10, value:250, format:v=>v+'ms', onChange:v=>{LMIC.lmDelTime=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Feedback', icon:ICON('ratio'), min:0, max:99, step:1, value:30, format:v=>v+'%', onChange:v=>{LMIC.lmDelFb=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tone', icon:ICON('eq'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmDelTone=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmDelWet=v/100} }).el);
          const delModeOpts=[{value:'simple',label:'Simple'},{value:'stereo',label:'Stereo'},{value:'pingpong',label:'Ping-Pong'},{value:'reverse',label:'Reverse'}];
          contentWrap.appendChild(buildSelect({ label:'Delay Mode', options:delModeOpts, value:'simple', onChange:v=>{LMIC.lmDelMode=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('time'), label:'Tempo Sync', sub:'Sync delay to BPM', checked:false, onChange:v=>{LMIC.lmDelSync=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Flanger & Phaser'));
          contentWrap.appendChild(buildSlider({ label:'Flanger Rate', icon:ICON('warp'), min:0.01, max:10, step:0.01, value:0.5, format:v=>v.toFixed(2)+'Hz', onChange:v=>{LMIC.lmFlRate=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Flanger Depth', icon:ICON('depth'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmFlDepth=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Flanger Feedback', icon:ICON('ratio'), min:0, max:90, step:1, value:30, format:v=>v+'%', onChange:v=>{LMIC.lmFlFb=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Flanger Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmFlWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Phaser Stages', icon:ICON('eq'), min:2, max:12, step:2, value:4, format:v=>Math.round(v), onChange:v=>{LMIC.lmPhStages=Math.round(v)} }).el);
          contentWrap.appendChild(buildSlider({ label:'Phaser Rate', icon:ICON('warp'), min:0.01, max:5, step:0.01, value:0.5, format:v=>v.toFixed(2)+'Hz', onChange:v=>{LMIC.lmPhRate=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Phaser Depth', icon:ICON('depth'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmPhDepth=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Phaser Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmPhWet=v/100} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Distortion & Saturation'));
          const distTypeOpts=[{value:'soft',label:'Soft Clip'},{value:'hard',label:'Hard Clip'},{value:'tape',label:'Tape Sat'},{value:'tube',label:'Tube'},{value:'fuzz',label:'Fuzz'},{value:'bitcrush',label:'Bitcrush'},{value:'foldback',label:'Foldback'}];
          contentWrap.appendChild(buildSelect({ label:'Distortion Type', options:distTypeOpts, value:'soft', onChange:v=>{LMIC.lmDistType=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Amount', icon:ICON('rampage'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmDistAmt=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tone', icon:ICON('eq'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmDistTone=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmDistWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Bit Depth', icon:ICON('pixel'), min:2, max:16, step:1, value:8, format:v=>Math.round(v)+'-bit', onChange:v=>{LMIC.lmBitBits=Math.round(v)} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Modulation'));
          contentWrap.appendChild(buildSlider({ label:'Ring Mod Freq', icon:ICON('alien'), min:20, max:5000, step:10, value:200, format:v=>v+'Hz', onChange:v=>{LMIC.lmRingFreq=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Ring Mod Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmRingWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Auto-Wah Sensitivity', icon:ICON('eq'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmWahSens=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Auto-Wah Rate', icon:ICON('speed'), min:0.1, max:10, step:0.1, value:1.0, format:v=>v.toFixed(1)+'Hz', onChange:v=>{LMIC.lmWahRate=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Auto-Wah Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmWahWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tremolo Rate', icon:ICON('pulse'), min:0.1, max:30, step:0.1, value:4, format:v=>v.toFixed(1)+'Hz', onChange:v=>{LMIC.lmTremRate=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tremolo Depth', icon:ICON('depth'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmTremDepth=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tremolo Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmTremWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Vibrato Rate', icon:ICON('warp'), min:0.1, max:20, step:0.1, value:5, format:v=>v.toFixed(1)+'Hz', onChange:v=>{LMIC.lmVibRate=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Vibrato Depth', icon:ICON('depth'), min:0, max:100, step:1, value:30, format:v=>v+'%', onChange:v=>{LMIC.lmVibDepth=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Vibrato Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmVibWet=v/100} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Pitch Processing'));
          contentWrap.appendChild(buildSlider({ label:'Pitch Shift', icon:ICON('pitch'), min:-24, max:24, step:0.5, value:0, format:v=>(v>=0?'+':'')+v.toFixed(1)+'st', onChange:v=>{LMIC.lmPitchShift=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Fine Tune (Cents)', icon:ICON('music'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'+':'')+v+'¢', onChange:v=>{LMIC.lmPitchCents=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Formant Shift', icon:ICON('voice'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'+':'')+v+'%', onChange:v=>{LMIC.lmFormantShift=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Harmonizer Interval', icon:ICON('resonator'), min:-12, max:12, step:1, value:7, format:v=>(v>=0?'+':'')+v+'st', onChange:v=>{LMIC.lmHarmInterval=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Harmonizer Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmHarmWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Octaver Up', icon:ICON('pitch'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmOctUp=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Octaver Down', icon:ICON('pitch'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmOctDown=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Octaver Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmOctWet=v/100} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Shimmer & Grain'));
          contentWrap.appendChild(buildSlider({ label:'Shimmer Amount', icon:ICON('star'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmShimmerAmt=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Shimmer Feedback', icon:ICON('ratio'), min:0, max:90, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmShimmerFb=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Granular Size', icon:ICON('grain'), min:10, max:500, step:10, value:100, format:v=>v+'ms', onChange:v=>{LMIC.lmGranSize=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Granular Density', icon:ICON('grain'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmGranDensity=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Granular Pitch', icon:ICON('pitch'), min:-12, max:12, step:0.5, value:0, format:v=>(v>=0?'+':'')+v.toFixed(1)+'st', onChange:v=>{LMIC.lmGranPitch=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Granular Wet', icon:ICON('mixer'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmGranWet=v/100} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Analog Simulation'));
          contentWrap.appendChild(buildSlider({ label:'Tape Saturation', icon:ICON('vintage'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmTapeWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tape Speed', icon:ICON('speed'), min:0.5, max:2, step:0.05, value:1, format:v=>v.toFixed(2)+'x', onChange:v=>{LMIC.lmTapeSpeed=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tube Warmth', icon:ICON('amplify'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmTubeWet=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Tube Harmonics', icon:ICON('eq'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmTubeHarmonics=v} }).el);
          const ampSimOpts=[{value:'none',label:'None'},{value:'clean',label:'Clean'},{value:'crunch',label:'Crunch'},{value:'overdrive',label:'Overdrive'},{value:'lead',label:'Lead'}];
          contentWrap.appendChild(buildSelect({ label:'Amp Simulation', options:ampSimOpts, value:'none', onChange:v=>{LMIC.lmAmpSim=v} }).el);
          const cabSimOpts=[{value:'none',label:'None'},{value:'1x12',label:'1×12'},{value:'2x12',label:'2×12'},{value:'4x12',label:'4×12'},{value:'open',label:'Open Back'}];
          contentWrap.appendChild(buildSelect({ label:'Cabinet Sim', options:cabSimOpts, value:'none', onChange:v=>{LMIC.lmCabSim=v} }).el);
          break;
        }

        case 'Spatial': {
          contentWrap.appendChild(el('div','bc-section-title','Stereo Image'));
          contentWrap.appendChild(buildSlider({ label:'Stereo Width', icon:ICON('wider'), min:0, max:200, step:1, value:100, format:v=>v+'%', onChange:v=>{LMIC.lmStereoWidth=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Mid/Side Balance', icon:ICON('spatial'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'S+':'')+v+'%', onChange:v=>{LMIC.lmMidSide=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Stereo Base', icon:ICON('gain'), min:0, max:200, step:1, value:100, format:v=>v+'%', onChange:v=>{LMIC.lmStereoBase=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Pan Position', icon:ICON('spatial'), min:-100, max:100, step:1, value:0, format:v=>v===0?'C':v<0?'L'+Math.abs(v):'R'+v, onChange:v=>{LMIC.lmPan=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Haas Effect', icon:ICON('echo'), min:0, max:50, step:1, value:0, format:v=>v+'ms', onChange:v=>{LMIC.lmHaasTime=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Crossfeed', icon:ICON('spatial'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmCrossfeed=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'L/R Delay', icon:ICON('echo'), min:-50, max:50, step:1, value:0, format:v=>(v>=0?'+':'')+v+'ms', onChange:v=>{LMIC.lmLRDelay=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','3D Spatial'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('broadcast'), label:'HRTF Processing', sub:'Head-related transfer function', checked:false, onChange:v=>{LMIC.lmHRTF=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('spatial'), label:'Binaural Mode', sub:'3D binaural audio processing', checked:false, onChange:v=>{LMIC.lmBinaural=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('room'), label:'Room Simulation', sub:'Acoustic room modeling', checked:false, onChange:v=>{LMIC.lmRoomSim=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'3D Position X', icon:ICON('wider'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'+':'')+v, onChange:v=>{LMIC.lm3DX=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'3D Position Y', icon:ICON('depth'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'+':'')+v, onChange:v=>{LMIC.lm3DY=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'3D Position Z', icon:ICON('reverb'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'+':'')+v, onChange:v=>{LMIC.lm3DZ=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Distance', icon:ICON('room'), min:0, max:100, step:1, value:0, format:v=>v+'m', onChange:v=>{LMIC.lmDistance=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Air Absorption', icon:ICON('shade'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmAirAbsorption=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Early Reflections', icon:ICON('echo'), min:0, max:100, step:1, value:20, format:v=>v+'%', onChange:v=>{LMIC.lmEarlyRef=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Late Reflections', icon:ICON('reverb'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmLateRef=v/100} }).el);
          contentWrap.appendChild(buildSlider({ label:'Diffusion', icon:ICON('pulse'), min:0, max:100, step:1, value:50, format:v=>v+'%', onChange:v=>{LMIC.lmDiffusion=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Surround Mix', icon:ICON('spatial'), min:0, max:100, step:1, value:0, format:v=>v+'%', onChange:v=>{LMIC.lmSurroundMix=v} }).el);
          break;
        }

        case 'Output': {
          contentWrap.appendChild(el('div','bc-section-title','Output Processing'));
          contentWrap.appendChild(buildSlider({ label:'Output Gain', icon:ICON('amplify2'), min:-20, max:20, step:0.5, value:0, format:v=>(v>=0?'+':'')+v+'dB', onChange:v=>{LMIC.lmOutGain=Math.pow(10,v/20)} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('hyper'), label:'Output Limiter', sub:'Prevent output clipping', checked:false, onChange:v=>{LMIC.lmOutLimiter=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Bass Enhancement', icon:ICON('bass'), min:0, max:20, step:0.5, value:0, format:v=>'+'+v+'dB', onChange:v=>{LMIC.lmBassEnhance=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Treble Enhancement', icon:ICON('treble'), min:0, max:20, step:0.5, value:0, format:v=>'+'+v+'dB', onChange:v=>{LMIC.lmTrebleEnhance=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Stereo Imaging', icon:ICON('wider'), min:-100, max:100, step:1, value:0, format:v=>(v>=0?'+':'')+v+'%', onChange:v=>{LMIC.lmStereoImaging=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('voice'), label:'Loudness Normaliz.', sub:'Auto normalize to LUFS target', checked:false, onChange:v=>{LMIC.lmLoudnessNorm=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'LUFS Target', icon:ICON('threshold'), min:-30, max:-8, step:0.5, value:-16, format:v=>v+'LUFS', onChange:v=>{LMIC.lmLufsTarget=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'True Peak Target', icon:ICON('threshold'), min:-6, max:0, step:0.5, value:-1, format:v=>v+'dBTP', onChange:v=>{LMIC.lmTruePeakTarget=v} }).el);
          const meterTypeOpts=[{value:'peak',label:'Peak'},{value:'vu',label:'VU'},{value:'rms',label:'RMS'},{value:'lufs',label:'LUFS'},{value:'k12',label:'K-12'},{value:'k14',label:'K-14'}];
          contentWrap.appendChild(buildSelect({ label:'Metering Mode', options:meterTypeOpts, value:'peak', onChange:v=>{LMIC.lmMeteringMode=v} }).el);
          const outModeOpts=[{value:'stereo',label:'Stereo'},{value:'mono',label:'Mono'},{value:'mid',label:'Mid Only'},{value:'side',label:'Side Only'}];
          contentWrap.appendChild(buildSelect({ label:'Output Mode', options:outModeOpts, value:'stereo', onChange:v=>{LMIC.lmOutputMode=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('spatial'), label:'Upmix 2→5.1', sub:'Upmix stereo to surround', checked:false, onChange:v=>{LMIC.lmUpmix=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('mixer'), label:'Downmix 5.1→2', sub:'Downmix surround to stereo', checked:false, onChange:v=>{LMIC.lmDownmix=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Output Buffer', icon:ICON('engine'), min:64, max:2048, step:64, value:256, format:v=>v+' samples', onChange:v=>{LMIC.lmOutputBuffer=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Output Latency', icon:ICON('time'), min:0, max:100, step:1, value:0, format:v=>v+'ms', onChange:v=>{LMIC.lmOutputLatency=v} }).el);
          break;
        }

        case 'Playback': {
          contentWrap.appendChild(el('div','bc-section-title','Speed & Timing'));
          contentWrap.appendChild(buildSlider({ label:'Playback Speed', icon:ICON('speed'), min:0.25, max:4, step:0.05, value:1, format:v=>v.toFixed(2)+'x', onChange:v=>{LMIC.lmSpeed=v;if(MP3.audio)MP3.audio.playbackRate=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('time'), label:'Time Stretch', sub:'Pitch-independent speed', checked:false, onChange:v=>{LMIC.lmTimeStretch=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('music'), label:'Pitch Correction', sub:'Auto pitch correction', checked:false, onChange:v=>{LMIC.lmPitchCorrect=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Fade In', icon:ICON('play'), min:0, max:10, step:0.5, value:0, format:v=>v+'s', onChange:v=>{LMIC.lmFadeIn=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Fade Out', icon:ICON('stop'), min:0, max:10, step:0.5, value:0, format:v=>v+'s', onChange:v=>{LMIC.lmFadeOut=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Pre-roll', icon:ICON('time'), min:0, max:5, step:0.5, value:0, format:v=>v+'s', onChange:v=>{LMIC.lmPreroll=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Loop & Sequence'));
          const loopModeOpts=[{value:'single',label:'Single'},{value:'all',label:'All'},{value:'random',label:'Random'},{value:'off',label:'Off'}];
          contentWrap.appendChild(buildSelect({ label:'Loop Mode', options:loopModeOpts, value:'single', onChange:v=>{LMIC.lmLoopMode=v;if(MP3.audio)MP3.audio.loop=v!=='off'} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Shuffle Mode', sub:'Randomize playback order', checked:false, onChange:v=>{LMIC.lmShuffle=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('play'), label:'Auto Play', sub:'Play next track automatically', checked:true, onChange:v=>{LMIC.lmAutoPlay=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Crossfade Time', icon:ICON('wave'), min:0, max:10, step:0.5, value:0, format:v=>v+'s', onChange:v=>{LMIC.lmCrossfadeTime=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Detection & Analysis'));
          contentWrap.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'Skip Silence', sub:'Auto-skip silent passages', checked:false, onChange:v=>{LMIC.lmSkipSilence=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Silence Threshold', icon:ICON('shade'), min:-80, max:-20, step:1, value:-50, format:v=>v+'dB', onChange:v=>{LMIC.lmSilenceThreshold=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('music'), label:'BPM Detection', sub:'Auto-detect song tempo', checked:false, onChange:v=>{LMIC.lmBpmDetect=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Manual BPM', icon:ICON('speed'), min:40, max:220, step:1, value:120, format:v=>Math.round(v)+' BPM', onChange:v=>{LMIC.lmBpm=Math.round(v)} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('music'), label:'Key Detection', sub:'Detect musical key', checked:false, onChange:v=>{LMIC.lmKeyDetect=v} }).el);

          contentWrap.appendChild(el('div','bc-section-title','Visualization'));
          const specModeOpts=[{value:'bar',label:'Bar'},{value:'line',label:'Line'},{value:'circle',label:'Circle'},{value:'wave',label:'Waveform'}];
          contentWrap.appendChild(buildSelect({ label:'Spectrum Mode', options:specModeOpts, value:'bar', onChange:v=>{LMIC.lmSpecMode=v} }).el);
          contentWrap.appendChild(buildToggleRow({ icon:ICON('visual'), label:'Show Spectrum', sub:'Display frequency spectrum', checked:true, onChange:v=>{LMIC.lmShowSpectrum=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Spectrum Smoothing', icon:ICON('pulse'), min:0, max:100, step:1, value:70, format:v=>v+'%', onChange:v=>{LMIC.lmSpecSmooth=v} }).el);
          const meterTypeOpts2=[{value:'vu',label:'VU'},{value:'peak',label:'Peak'},{value:'ppm',label:'PPM'},{value:'rms',label:'RMS'}];
          contentWrap.appendChild(buildSelect({ label:'Meter Type', options:meterTypeOpts2, value:'vu', onChange:v=>{LMIC.lmMeterType=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Meter Decay', icon:ICON('speed'), min:100, max:3000, step:100, value:300, format:v=>v+'ms', onChange:v=>{LMIC.lmMeterDecay=v} }).el);
          contentWrap.appendChild(buildSlider({ label:'Peak Hold Time', icon:ICON('time'), min:500, max:10000, step:500, value:2000, format:v=>(v/1000).toFixed(1)+'s', onChange:v=>{LMIC.lmMeterPeakHold=v} }).el);
          break;
        }

        case 'Presets': {
          contentWrap.appendChild(el('div','bc-section-title','Music Presets'));
          const musicPresets = [
            { name:'CLUB / EDM',      icon:'🎧', eq:[2,2,3,1,0,-1,-1,0,1,3,3,2,1,0,-1,-2,-2,-1,0,1,2,3,3,2,1,0,0,0,0,0,0] },
            { name:'CLASSICAL',       icon:'🎻', eq:[1,1,1,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,-1,-1,-1,-1,0,0,0,0,0,0,0,0] },
            { name:'ROCK / METAL',    icon:'🎸', eq:[4,3,2,1,0,-1,-1,-1,0,1,2,3,3,2,1,0,0,0,0,1,2,3,4,4,3,2,1,0,0,0,0] },
            { name:'HIP-HOP',         icon:'🎤', eq:[4,4,3,2,1,0,0,0,0,1,2,3,3,2,1,0,-1,-2,-2,-1,0,1,1,1,2,2,2,1,0,0,0] },
            { name:'JAZZ',            icon:'🎷', eq:[2,2,1,1,0,0,-1,-1,0,1,2,2,2,2,1,0,-1,-1,-1,0,0,0,-1,-1,-1,0,0,0,0,0,0] },
            { name:'POP',             icon:'🎵', eq:[1,1,1,0,0,1,2,2,2,1,0,-1,-1,-1,0,1,2,2,2,1,0,-1,-1,0,1,2,2,1,0,0,0] },
            { name:'REGGAE',          icon:'🌴', eq:[3,3,2,1,0,0,0,0,0,0,-1,-2,-3,-3,-2,-1,0,1,2,3,3,2,1,0,0,0,0,0,0,0,0] },
            { name:'R&B / SOUL',      icon:'💛', eq:[3,3,2,1,0,0,0,0,1,2,3,3,2,1,0,-1,-1,0,1,2,3,3,2,1,0,0,0,0,0,0,0] },
            { name:'ACOUSTIC',        icon:'🎵', eq:[2,1,1,0,0,1,2,2,2,2,1,0,-1,-1,0,1,2,2,2,1,0,-1,-1,0,0,0,0,0,0,0,0] },
            { name:'BASS BOOST',      icon:'🔊', eq:[6,6,5,4,3,2,1,0,0,0,0,0,0,-1,-1,-2,-2,-2,-2,-2,-2,-2,-2,-1,0,0,0,0,0,0,0] },
            { name:'TREBLE BOOST',    icon:'✨', eq:[-2,-2,-1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,5,5,5,5,5,4,4,3,2,1,0] },
            { name:'VOCAL',           icon:'🎙️', eq:[-1,-1,0,1,2,3,4,4,3,2,2,2,3,4,4,3,2,1,0,-1,-1,-2,-2,-2,-2,-1,0,0,0,0,0] },
            { name:'MIDNIGHT',        icon:'🌙', eq:[3,3,2,1,0,-1,-2,-3,-3,-2,-1,0,1,2,3,3,2,1,0,-1,-2,-3,-3,-2,-1,0,1,2,3,3,3] },
            { name:'GAMING',          icon:'🎮', eq:[2,2,1,0,0,-1,-1,0,1,2,3,3,2,1,0,-1,-1,0,1,2,3,3,2,1,0,0,0,1,2,2,2] },
            { name:'CINEMA',          icon:'🎬', eq:[2,2,1,0,-1,-2,-2,-1,0,1,2,3,3,2,1,0,-1,-1,0,1,2,3,3,2,1,0,0,0,0,0,0] },
            { name:'PODCAST',         icon:'🎙️', eq:[-2,-2,-1,0,1,2,3,4,4,3,2,1,0,-1,-1,-1,-1,0,1,2,2,1,0,-1,-2,-2,-2,-1,0,0,0] },
            { name:'DEEP BASS',       icon:'⚡', eq:[8,8,7,6,5,4,3,2,1,0,-1,-2,-3,-4,-4,-3,-2,-1,0,0,0,0,0,0,0,0,0,0,0,0,0] },
            { name:'CRYSTAL CLEAR',   icon:'💎', eq:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,5,5,4,3,2,1,0,-1,-1,-1] },
            { name:'WARM',            icon:'🔥', eq:[2,2,2,2,1,0,0,0,0,0,0,0,0,0,-1,-2,-3,-3,-3,-3,-3,-3,-2,-1,0,0,0,0,0,0,0] },
            { name:'BRIGHT',          icon:'☀️', eq:[-1,-1,0,0,0,0,0,0,0,1,2,3,4,4,4,4,3,2,1,0,0,1,2,3,4,4,4,3,2,1,0] },
            { name:'NEUTRAL',         icon:'⚖️', eq:new Array(31).fill(0) },
            { name:'FOCUS',           icon:'🎯', eq:[-1,-1,0,1,2,3,4,4,3,2,1,0,-1,-1,0,1,2,2,1,0,-1,-2,-2,-1,0,0,0,0,0,0,0] },
            { name:'ENERGY',          icon:'⚡', eq:[3,3,2,1,0,-1,-1,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,0,1,2] },
            { name:'PARTY',           icon:'🎉', eq:[4,4,3,2,1,0,0,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,0,1,2] },
            { name:'CHILL',           icon:'❄️', eq:[2,2,1,0,-1,-2,-2,-2,-1,0,1,1,0,-1,-2,-2,-1,0,1,2,2,2,1,0,-1,-1,0,0,0,0,0] },
            { name:'NATURE',          icon:'🌿', eq:[0,0,0,1,1,2,2,1,0,-1,-2,-2,-2,-2,-1,0,1,2,2,2,1,0,-1,-1,-1,0,0,0,0,0,0] },
            { name:'AMBIENT',         icon:'🌊', eq:[1,1,1,1,0,0,-1,-2,-3,-3,-3,-2,-1,0,1,2,3,3,2,1,0,-1,-2,-2,-1,0,0,0,0,0,0] },
            { name:'RELAXATION',      icon:'😌', eq:[2,2,1,0,-1,-2,-3,-3,-3,-2,-1,0,1,2,2,2,1,0,-1,-2,-2,-2,-1,0,1,1,1,0,0,0,0] },
            { name:'SPEECH CLARITY',  icon:'🗣️', eq:[-3,-3,-2,-1,0,1,2,3,4,5,5,5,4,3,2,1,0,-1,-2,-3,-3,-3,-2,-1,0,0,0,0,0,0,0] },
            { name:'SUPER BASS LIVE', icon:'💣', eq:[8,8,8,7,6,5,4,3,2,1,0,0,0,-1,-2,-3,-4,-4,-3,-2,-1,0,0,0,0,0,0,0,0,0,0] },
            { name:'TRAP BEAT',       icon:'🎶', eq:[6,6,5,5,4,3,2,1,0,0,0,0,0,-1,-2,-3,-3,-2,-1,0,1,2,3,3,3,2,1,0,0,0,0] },
          ];
          const presetGrid = el('div'); presetGrid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:4px;';
          musicPresets.forEach(p => {
            const btn = el('div'); btn.style.cssText='display:flex;align-items:center;gap:6px;padding:7px 8px;background:rgba(255,215,0,.01);border:1px solid rgba(255,215,0,.06);border-radius:7px;cursor:pointer;transition:all .2s;';
            btn.innerHTML = `<span style="font-size:14px;">${p.icon}</span><div><div style="font-size:8px;font-weight:600;color:#FFD700;letter-spacing:.5px;">${p.name}</div></div>`;
            btn.addEventListener('mouseenter',()=>btn.style.background='rgba(255,215,0,.05)');
            btn.addEventListener('mouseleave',()=>btn.style.background='rgba(255,215,0,.01)');
            btn.addEventListener('click',()=>{ LMIC.eq31=[...p.eq]; LMIC.lmActivePreset=p.name; btn.style.borderColor='rgba(255,215,0,.4)'; setTimeout(()=>btn.style.borderColor='rgba(255,215,0,.06)',800); });
            presetGrid.appendChild(btn);
          });
          contentWrap.appendChild(presetGrid);
          break;
        }

        default: break;
      }
    }

    subCats.forEach(cat => {
      const btn = el('button','bc-lmic-subbtn', cat === activeSubCat ? cat : cat);
      btn.dataset.cat = cat;
      if (cat === activeSubCat) btn.classList.add('active');
      btn.addEventListener('click', () => renderSubcat(cat));
      subtabWrap.appendChild(btn);
    });

    root.appendChild(subtabWrap);
    root.appendChild(contentWrap);
    renderSubcat('Input');
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     SETTINGS TAB — 100+ UI/behavior settings
     ═══════════════════════════════════════════════════════ */
  function buildSettingsTab() {
    const root = el('div','bc-section');

    root.appendChild(el('div','bc-section-title','Panel Appearance'));
    root.appendChild(buildSlider({ label:'Panel Width', icon:ICON('visual'), min:320, max:500, step:10, value:SETT.panelWidth, format:v=>Math.round(v)+'px', onChange:v=>{SETT.panelWidth=Math.round(v);if(panelEl)panelEl.style.width=v+'px'} }).el);
    root.appendChild(buildSlider({ label:'Panel Opacity', icon:ICON('shade'), min:60, max:100, step:1, value:SETT.panelOpacity, format:v=>v+'%', onChange:v=>{SETT.panelOpacity=v;if(panelEl)panelEl.style.background=`rgba(8,7,0,${v/100})`} }).el);
    root.appendChild(buildSlider({ label:'Background GIF Opacity', icon:ICON('sunflower'), min:0, max:100, step:1, value:SETT.gifOpacity, format:v=>v+'%', onChange:v=>{SETT.gifOpacity=v;const bg=document.querySelector('.bc-gif-bg');if(bg)bg.style.opacity=v/100;} }).el);
    root.appendChild(buildSlider({ label:'Background Blur', icon:ICON('shade'), min:0, max:20, step:1, value:SETT.gifBlur, format:v=>v+'px', onChange:v=>{SETT.gifBlur=v;const bg=document.querySelector('.bc-gif-bg');if(bg)bg.style.filter=`blur(${v}px) saturate(1.2)`;} }).el);
    root.appendChild(buildSlider({ label:'Border Radius', icon:ICON('visual'), min:0, max:24, step:2, value:SETT.borderRadius, format:v=>v+'px', onChange:v=>{SETT.borderRadius=v;if(panelEl)panelEl.style.borderRadius=v+'px'} }).el);
    root.appendChild(buildSlider({ label:'Glow Intensity', icon:ICON('star'), min:0, max:100, step:5, value:SETT.glowIntensity, format:v=>v+'%', onChange:v=>{SETT.glowIntensity=v} }).el);

    const animSpeedOpts=[{value:'slow',label:'Slow'},{value:'normal',label:'Normal'},{value:'fast',label:'Fast'},{value:'instant',label:'Instant'}];
    root.appendChild(buildSelect({ label:'Animation Speed', options:animSpeedOpts, value:SETT.animSpeed, onChange:v=>{SETT.animSpeed=v} }).el);
    const fontSizeOpts=[{value:'small',label:'Small'},{value:'medium',label:'Medium'},{value:'large',label:'Large'}];
    root.appendChild(buildSelect({ label:'Font Size', options:fontSizeOpts, value:SETT.fontSize, onChange:v=>{SETT.fontSize=v} }).el);
    const panelPosOpts=[{value:'bottom-right',label:'Bottom Right'},{value:'bottom-left',label:'Bottom Left'},{value:'top-right',label:'Top Right'},{value:'top-left',label:'Top Left'}];
    root.appendChild(buildSelect({ label:'Panel Position', options:panelPosOpts, value:SETT.panelPosition, onChange:v=>{SETT.panelPosition=v} }).el);
    const headerStyleOpts=[{value:'full',label:'Full'},{value:'compact',label:'Compact'},{value:'minimal',label:'Minimal'}];
    root.appendChild(buildSelect({ label:'Header Style', options:headerStyleOpts, value:SETT.headerStyle, onChange:v=>{SETT.headerStyle=v} }).el);

    root.appendChild(el('div','bc-section-title','Behavior'));
    root.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Remember Last Tab', sub:'Restore last opened tab', checked:SETT.rememberTab, onChange:v=>{SETT.rememberTab=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('visual'), label:'Show Tooltips', sub:'Display info tooltips', checked:SETT.showTooltips, onChange:v=>{SETT.showTooltips=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Auto-Apply Changes', sub:'Apply settings immediately', checked:SETT.autoApply, onChange:v=>{SETT.autoApply=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('sound'), label:'Sound Feedback', sub:'Audio feedback on actions', checked:SETT.soundFeedback, onChange:v=>{SETT.soundFeedback=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Confirm Reset', sub:'Ask before resetting settings', checked:SETT.confirmReset, onChange:v=>{SETT.confirmReset=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('save'), label:'Save on Exit', sub:'Auto-save settings on close', checked:SETT.saveOnExit, onChange:v=>{SETT.saveOnExit=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('hotkeys'), label:'Hotkeys Enable', sub:'Enable keyboard shortcuts', checked:SETT.hotkeysEnabled, onChange:v=>{SETT.hotkeysEnabled=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('visual'), label:'Compact Mode', sub:'Compact panel layout', checked:SETT.compactMode, onChange:v=>{SETT.compactMode=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('stats'), label:'Show Level Meter', sub:'Display input level meter', checked:SETT.showMeter, onChange:v=>{SETT.showMeter=v;const m=document.querySelector('.bc-meter-wrap');if(m)m.style.display=v?'':'none'} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Tab Icons Only', sub:'Hide tab text labels', checked:SETT.tabIconOnly, onChange:v=>{SETT.tabIconOnly=v} }).el);

    root.appendChild(el('div','bc-section-title','Performance'));
    const updateRateOpts=[{value:30,label:'30 FPS'},{value:60,label:'60 FPS'},{value:120,label:'120 FPS'}];
    root.appendChild(buildSelect({ label:'UI Update Rate', options:updateRateOpts, value:60, onChange:v=>{SETT.updateRate=parseInt(v)} }).el);
    const bufferSizeOpts=[{value:64,label:'64 (Ultra Low)'},{value:128,label:'128 (Low)'},{value:256,label:'256 (Medium)'},{value:512,label:'512 (High)'},{value:1024,label:'1024 (Ultra High)'}];
    root.appendChild(buildSelect({ label:'Buffer Size', options:bufferSizeOpts, value:256, onChange:v=>{SETT.bufferSize=parseInt(v)} }).el);
    const cpuPriorityOpts=[{value:'low',label:'Low'},{value:'normal',label:'Normal'},{value:'high',label:'High'}];
    root.appendChild(buildSelect({ label:'CPU Priority', options:cpuPriorityOpts, value:'normal', onChange:v=>{SETT.cpuPriority=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'Low Latency Mode', sub:'Minimize audio latency', checked:false, onChange:v=>{SETT.lowLatencyMode=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'GPU Acceleration', sub:'Use GPU for animations', checked:true, onChange:v=>{SETT.gpuAccel=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Reduced Motion', sub:'Reduce animations', checked:false, onChange:v=>{SETT.reducedMotion=v} }).el);

    root.appendChild(el('div','bc-section-title','Hotkeys'));
    const hotkeyDefs = [
      { label:'Toggle Panel',   key:'hkTogglePanel',  default:'Alt+B' },
      { label:'Toggle Mute',    key:'hkToggleMute',   default:'Alt+M' },
      { label:'Play/Pause',     key:'hkPlayPause',    default:'Alt+Space' },
      { label:'Chaos Mode',     key:'hkChaosMode',    default:'Alt+C' },
      { label:'Volume Up',      key:'hkVolumeUp',     default:'Alt+=' },
      { label:'Volume Down',    key:'hkVolumeDown',   default:'Alt+-' },
      { label:'Next Preset',    key:'hkPresetNext',   default:'Alt+]' },
      { label:'Prev Preset',    key:'hkPresetPrev',   default:'Alt+[' },
      { label:'Reset All',      key:'hkReset',        default:'Alt+R' },
      { label:'Show Stats',     key:'hkStats',        default:'Alt+S' },
      { label:'Voice Preset 1', key:'hkVoice1',       default:'Alt+1' },
      { label:'Voice Preset 2', key:'hkVoice2',       default:'Alt+2' },
    ];
    hotkeyDefs.forEach(hk => {
      const row = el('div','bc-hotkey-row');
      const lbl = el('div','bc-hotkey-lbl',hk.label);
      const key = el('div','bc-hotkey-key', SETT[hk.key] || hk.default);
      row.appendChild(lbl); row.appendChild(key);
      key.addEventListener('click',()=>{ key.textContent='Press key...'; key.style.color='#FF8C00'; const onKey=(e)=>{ e.preventDefault(); const combo=(e.altKey?'Alt+':'')+(e.ctrlKey?'Ctrl+':'')+(e.shiftKey?'Shift+':'')+e.key; SETT[hk.key]=combo; key.textContent=combo; key.style.color='#FFD700'; document.removeEventListener('keydown',onKey); }; document.addEventListener('keydown',onKey); });
      root.appendChild(row);
    });

    const rowEnd = el('div','bc-row-end');
    const saveBtn = el('button','bc-btn bc-btn-primary', ICON('save')+' Save Settings');
    saveBtn.addEventListener('click',()=>{try{localStorage.setItem('blakecord-v4-settings',JSON.stringify(SETT));saveBtn.innerHTML=ICON('check')+' Saved!';setTimeout(()=>{saveBtn.innerHTML=ICON('save')+' Save Settings'},1500);}catch(e){}});
    const resetBtn2 = el('button','bc-btn bc-btn-ghost', ICON('reset')+' Defaults');
    rowEnd.appendChild(resetBtn2); rowEnd.appendChild(saveBtn);
    root.appendChild(rowEnd);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     VISUAL TAB — 50+ visual customization settings
     ═══════════════════════════════════════════════════════ */
  function buildVisualTab() {
    const root = el('div','bc-section');

    root.appendChild(el('div','bc-section-title','Color Theme'));
    const colorDefs = [
      { label:'Primary Gold',    key:'themeAccent',  default:'#FFD700' },
      { label:'Background',      key:'themeBg',      default:'#000000' },
      { label:'Glow Color',      key:'themeGlow',    default:'#FFD700' },
    ];
    colorDefs.forEach(c => {
      const row = el('div','bc-color-row');
      const lbl = el('div','bc-slider-name',c.label);
      const swatch = el('div','bc-color-swatch'); swatch.style.background=SETT[c.key]||c.default;
      const inp = document.createElement('input'); inp.type='color'; inp.value=SETT[c.key]||c.default;
      inp.addEventListener('input',()=>{ SETT[c.key]=inp.value; swatch.style.background=inp.value; });
      swatch.addEventListener('click',()=>inp.click());
      row.appendChild(lbl); row.appendChild(swatch); row.appendChild(inp);
      root.appendChild(row);
    });

    root.appendChild(el('div','bc-section-title','Preset Themes'));
    const themes = [
      { name:'Black & Gold',  primary:'#FFD700', bg:'#000000' },
      { name:'Dark Amber',    primary:'#FFC107', bg:'#080400' },
      { name:'Deep Yellow',   primary:'#FFEB3B', bg:'#000' },
      { name:'Sunflower',     primary:'#F4D03F', bg:'#030200' },
      { name:'Neon Gold',     primary:'#FFE55C', bg:'#000' },
      { name:'Royal Gold',    primary:'#CFB53B', bg:'#000' },
    ];
    const themeGrid = el('div'); themeGrid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:8px;';
    themes.forEach(t => {
      const btn = el('div'); btn.style.cssText=`padding:8px 6px;background:${t.bg};border:1px solid ${t.primary}30;border-radius:7px;cursor:pointer;text-align:center;transition:all .2s;`;
      btn.innerHTML = `<div style="width:20px;height:20px;border-radius:50%;background:${t.primary};margin:0 auto 4px;box-shadow:0 0 8px ${t.primary}60;"></div><div style="font-size:7px;letter-spacing:.5px;color:${t.primary};font-weight:600;">${t.name}</div>`;
      btn.addEventListener('click',()=>{ SETT.themeAccent=t.primary; SETT.themeBg=t.bg; });
      themeGrid.appendChild(btn);
    });
    root.appendChild(themeGrid);

    root.appendChild(el('div','bc-section-title','Animations'));
    root.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'Glow Animations', sub:'Panel glow pulsing effects', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('wave'), label:'Float Animation', sub:'Launcher floating bob effect', checked:true, onChange:v=>{if(!v&&launcherEl)launcherEl.style.animation='none'} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('star'), label:'Text Glow Effect', sub:'Animated header glow', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'Tab Transition', sub:'Smooth tab switch fade', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Button Hover FX', sub:'Button animation on hover', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Animation Speed Mul.', icon:ICON('speed'), min:0.5, max:3, step:0.1, value:1, format:v=>v.toFixed(1)+'×', onChange:v=>{} }).el);

    root.appendChild(el('div','bc-section-title','GIF Background'));
    root.appendChild(buildToggleRow({ icon:ICON('sunflower'), label:'Show Background GIF', sub:'Animated sunflower background', checked:true, onChange:v=>{const bg=document.querySelector('.bc-gif-bg');if(bg)bg.style.display=v?'':'none';} }).el);
    root.appendChild(buildSlider({ label:'GIF Saturation', icon:ICON('star'), min:0, max:200, step:10, value:120, format:v=>v+'%', onChange:v=>{const bg=document.querySelector('.bc-gif-bg');if(bg)bg.style.filter=`blur(${SETT.gifBlur}px) saturate(${v/100})`;} }).el);
    root.appendChild(buildSlider({ label:'GIF Brightness', icon:ICON('amplify'), min:50, max:150, step:5, value:100, format:v=>v+'%', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'GIF Contrast', icon:ICON('depth'), min:50, max:150, step:5, value:100, format:v=>v+'%', onChange:v=>{} }).el);

    root.appendChild(el('div','bc-section-title','Layout'));
    root.appendChild(buildSlider({ label:'Tab Font Size', icon:ICON('visual'), min:8, max:13, step:0.5, value:11, format:v=>v+'px', onChange:v=>{document.querySelectorAll('.bc-tab span').forEach(t=>t.style.fontSize=v+'px')} }).el);
    root.appendChild(buildSlider({ label:'Body Padding', icon:ICON('visual'), min:4, max:20, step:2, value:10, format:v=>v+'px', onChange:v=>{if(bodyEl)bodyEl.style.padding=v+'px'} }).el);
    root.appendChild(buildSlider({ label:'Card Border Radius', icon:ICON('visual'), min:4, max:16, step:2, value:8, format:v=>v+'px', onChange:v=>{document.querySelectorAll('.bc-slider-block,.bc-toggle-row,.bc-card').forEach(c=>c.style.borderRadius=v+'px')} }).el);
    root.appendChild(buildSlider({ label:'Slider Thumb Size', icon:ICON('visual'), min:10, max:20, step:1, value:15, format:v=>v+'px', onChange:v=>{} }).el);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     ADVANCED TAB — 80+ deep audio chain settings
     ═══════════════════════════════════════════════════════ */
  function buildAdvancedTab() {
    const root = el('div','bc-section');

    root.appendChild(el('div','bc-section-title','Audio Context'));
    root.appendChild(buildSlider({ label:'Sample Rate', icon:ICON('engine'), min:22050, max:96000, step:4410, value:48000, format:v=>(v/1000).toFixed(1)+'kHz', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Buffer Size', icon:ICON('engine'), min:64, max:4096, step:64, value:256, format:v=>v+' samples', onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Lookahead', icon:ICON('time'), min:0, max:50, step:1, value:0, format:v=>v+'ms', onChange:v=>{} }).el);
    const latencyOpts=[{value:'interactive',label:'Interactive (Low)'},{value:'balanced',label:'Balanced'},{value:'playback',label:'Playback (Quality)'}];
    root.appendChild(buildSelect({ label:'Latency Hint', options:latencyOpts, value:'interactive', onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'Context Suspend', sub:'Suspend context when idle', checked:true, onChange:v=>{} }).el);

    root.appendChild(el('div','bc-section-title','Audio Chain Nodes'));
    root.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'Pre-Amp Node', sub:'Input gain stage', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('eq'), label:'10-Band EQ Node', sub:'Voice equalizer', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('pitch'), label:'Pitch Shifter Node', sub:'Pitch shifting worklet', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('fx'), label:'Effects Node', sub:'FX processor', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('reverb'), label:'Reverb Node', sub:'Convolver reverb', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('comp'), label:'Compressor Node', sub:'Dynamics compressor', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('shade'), label:'Gate Node', sub:'Noise gate', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('wider'), label:'Wider Node', sub:'Stereo widener', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('amplify'), label:'Clarity Node', sub:'Presence boost filter', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('gain'), label:'Master Gain Node', sub:'Final output gain', checked:true, onChange:v=>{} }).el);

    root.appendChild(el('div','bc-section-title','DSP Processing'));
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'Anti-Aliasing', sub:'Prevent aliasing', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'Oversampling 4x', sub:'4x oversample for better quality', checked:false, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'DC Blocking', sub:'Remove DC offset', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'Noise Shaping', sub:'High-frequency noise shaping', checked:false, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'Inter-Sample Peaks', sub:'ISP detection and prevention', checked:false, onChange:v=>{} }).el);
    const noiseShapeOpts=[{value:'none',label:'None'},{value:'e-weighted',label:'E-Weighted'},{value:'f-weighted',label:'F-Weighted'},{value:'mod-e',label:'Modified E'},{value:'ges',label:'Gerzon/Craven'}];
    root.appendChild(buildSelect({ label:'Noise Shaping Mode', options:noiseShapeOpts, value:'none', onChange:v=>{} }).el);

    root.appendChild(el('div','bc-section-title','Routing Matrix'));
    root.appendChild(buildToggleRow({ icon:ICON('route'), label:'Chain → Discord', sub:'Route processed audio to Discord', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('route'), label:'MP3 → Chain', sub:'Route music through voice chain', checked:true, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('route'), label:'Chain → Monitor', sub:'Monitor processed output', checked:false, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('route'), label:'Chain → Record', sub:'Record processed audio', checked:false, onChange:v=>{} }).el);
    root.appendChild(buildSlider({ label:'Mic/Music Mix', icon:ICON('mixer'), min:0, max:100, step:1, value:50, format:v=>'Mic '+(100-v)+'% / Music '+v+'%', onChange:v=>{} }).el);

    root.appendChild(el('div','bc-section-title','Debug & Diagnostics'));
    root.appendChild(buildToggleRow({ icon:ICON('stats'), label:'Advanced Stats', sub:'Show CPU/memory usage', checked:false, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('engine'), label:'Audio Graph View', sub:'Show node connection graph', checked:false, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('pulse'), label:'Signal Inspector', sub:'Real-time signal analysis', checked:false, onChange:v=>{} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('visual'), label:'Debug Overlay', sub:'Show debug information', checked:false, onChange:v=>{} }).el);

    const rowEnd = el('div','bc-row-end');
    const rebuildBtn = el('button','bc-btn bc-btn-primary', ICON('reset')+' Rebuild Chain');
    rebuildBtn.addEventListener('click',()=>{ if(activeChain){try{activeChain.stop()}catch(e){};activeChain=null;} rebuildBtn.innerHTML=ICON('check')+' Rebuilt!'; setTimeout(()=>{rebuildBtn.innerHTML=ICON('reset')+' Rebuild Chain'},1500); });
    rowEnd.appendChild(rebuildBtn);
    root.appendChild(rowEnd);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     PROFILES TAB — Save/load setting profiles
     ═══════════════════════════════════════════════════════ */
  function buildProfilesTab() {
    const root = el('div','bc-section');

    root.appendChild(el('div','bc-section-title','Quick Profiles'));
    const quickProfiles = [
      { name:'Loud Mic God',     icon:'⚡', desc:'Max loudmic settings', state:{ masterGain:5, preAmp:8, godGain:0.8, hyperBoost:0.5 } },
      { name:'Crystal Voice',    icon:'💎', desc:'Clear broadcast voice', state:{ masterGain:1.5, preAmp:2.5, clarityMode:true, presenceBoost:6 } },
      { name:'Deep Bass God',    icon:'🔊', desc:'Sub frequencies maxed', state:{ masterGain:2, preAmp:3, eqBands:[10,8,6,4,2,0,0,0,8,0] } },
      { name:'Chipmunk Fun',     icon:'🐿️', desc:'High-pitched fun voice', state:{ pitch:7, effect:'chipmunk', masterGain:1.5 } },
      { name:'Radio Broadcast',  icon:'📻', desc:'Classic radio sound', state:{ effect:'radio', masterGain:1.5, reverb:{wetMix:0.1,decay:1,roomSize:1,dry:false} } },
      { name:'Echo Chamber',     icon:'🌀', desc:'Deep reverb echo', state:{ effect:'echo', reverb:{wetMix:0.7,decay:5,roomSize:4,dry:false}, masterGain:1.3 } },
      { name:'Robot Voice',      icon:'🤖', desc:'Digital robot effect', state:{ effect:'robot', masterGain:1.4, reverb:{wetMix:0.2,decay:1.5,roomSize:1.5,dry:false} } },
      { name:'Alien Being',      icon:'👽', desc:'Extraterrestrial sound', state:{ effect:'alien', reverb:{wetMix:0.3,decay:2,roomSize:2,dry:false}, godGain:0.2 } },
    ];
    quickProfiles.forEach(p => {
      const card = el('div','bc-profile-card');
      card.innerHTML = `<span style="font-size:18px;">${p.icon}</span><div style="flex:1;"><div class="bc-profile-card-name">${p.name}</div><div class="bc-profile-card-date">${p.desc}</div></div><span style="color:rgba(255,215,0,.3);font-size:10px;">›</span>`;
      card.addEventListener('click',()=>{ Object.assign(STATE, p.state); applyState(); if(activeChain){activeChain.rebuildEffect();activeChain.rebuildReverb();activeChain.rebuildReverbImpulse();} card.style.borderColor='rgba(255,215,0,.5)'; setTimeout(()=>card.style.borderColor='',800); });
      root.appendChild(card);
    });

    root.appendChild(el('div','bc-section-title','Save / Load'));
    const saveRow = el('div','bc-row-end');
    const saveBtn = el('button','bc-btn bc-btn-primary', ICON('save')+' Save Current');
    saveBtn.addEventListener('click',()=>{
      const name = `Profile ${PROFILES.saved.length+1} — ${new Date().toLocaleTimeString()}`;
      const profile = { name, state: JSON.parse(JSON.stringify(STATE)), lmic: JSON.parse(JSON.stringify(LMIC)), ts: Date.now() };
      PROFILES.saved.push(profile);
      try { localStorage.setItem('blakecord-v4-profiles', JSON.stringify(PROFILES.saved)); } catch(e){}
      saveBtn.innerHTML = ICON('check')+' Saved!';
      setTimeout(()=>{ saveBtn.innerHTML=ICON('save')+' Save Current'; renderTab(); }, 1500);
    });
    saveRow.appendChild(saveBtn); root.appendChild(saveRow);

    if (PROFILES.saved.length > 0) {
      root.appendChild(el('div','bc-section-title','Saved Profiles'));
      PROFILES.saved.forEach((p, idx) => {
        const card = el('div','bc-profile-card');
        card.innerHTML = `<span style="font-size:18px;">${ICON('profiles')}</span><div style="flex:1;"><div class="bc-profile-card-name">${p.name}</div><div class="bc-profile-card-date">${new Date(p.ts).toLocaleDateString()}</div></div>`;
        const loadBtn = el('button','bc-btn bc-btn-ghost','Load'); loadBtn.style.fontSize='8px'; loadBtn.style.padding='2px 8px';
        const delBtn  = el('button','bc-btn bc-btn-danger','Del');  delBtn.style.fontSize='8px';  delBtn.style.padding='2px 8px';
        loadBtn.addEventListener('click',()=>{ Object.assign(STATE, p.state); Object.assign(LMIC, p.lmic||{}); applyState(); if(activeChain){activeChain.rebuildEffect();activeChain.rebuildReverb();}});
        delBtn.addEventListener('click',()=>{ PROFILES.saved.splice(idx,1); try{localStorage.setItem('blakecord-v4-profiles',JSON.stringify(PROFILES.saved))}catch(e){}; renderTab(); });
        card.appendChild(loadBtn); card.appendChild(delBtn);
        root.appendChild(card);
      });
    }

    root.appendChild(el('div','bc-section-title','Import / Export'));
    const impExpRow = el('div','bc-row-end');
    const exportBtn = el('button','bc-btn bc-btn-ghost', ICON('download')+' Export JSON');
    exportBtn.addEventListener('click',()=>{
      const data = JSON.stringify({ state:STATE, lmic:LMIC, sett:SETT, profiles:PROFILES.saved }, null, 2);
      const blob = new Blob([data], {type:'application/json'});
      const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='blakecord-v4-settings.json'; a.click();
    });
    impExpRow.appendChild(exportBtn); root.appendChild(impExpRow);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     BROADCAST TAB — Streaming / Recording settings
     ═══════════════════════════════════════════════════════ */
  function buildBroadcastTab() {
    const root = el('div','bc-section');

    const statusEl = el('div','bc-bcast-status');
    const dot = el('div', 'bc-bcast-dot' + (BCAST.streamEnabled ? ' live' : ''));
    const label = el('div','bc-bcast-label', BCAST.streamEnabled ? 'BROADCASTING LIVE' : 'OFFLINE');
    statusEl.appendChild(dot); statusEl.appendChild(label);
    root.appendChild(statusEl);

    root.appendChild(el('div','bc-section-title','Stream Output'));
    root.appendChild(buildToggleRow({ icon:ICON('broadcast'), label:'Stream Enable', sub:'Enable audio streaming output', checked:BCAST.streamEnabled, onChange:v=>{ BCAST.streamEnabled=v; dot.classList.toggle('live',v); label.textContent=v?'BROADCASTING LIVE':'OFFLINE'; } }).el);
    const qualityOpts=[{value:'low',label:'Low (96kbps)'},{value:'medium',label:'Medium (160kbps)'},{value:'high',label:'High (320kbps)'},{value:'lossless',label:'Lossless (WAV)'}];
    root.appendChild(buildSelect({ label:'Stream Quality', options:qualityOpts, value:BCAST.streamQuality, onChange:v=>{BCAST.streamQuality=v} }).el);
    root.appendChild(buildSlider({ label:'Stream Bitrate', icon:ICON('engine'), min:32, max:320, step:32, value:BCAST.streamBitrate, format:v=>v+'kbps', onChange:v=>{BCAST.streamBitrate=v} }).el);
    const fmtOpts=[{value:'opus',label:'Opus'},{value:'mp3',label:'MP3'},{value:'aac',label:'AAC'},{value:'flac',label:'FLAC'},{value:'wav',label:'WAV'}];
    root.appendChild(buildSelect({ label:'Stream Format', options:fmtOpts, value:BCAST.streamFormat, onChange:v=>{BCAST.streamFormat=v} }).el);
    root.appendChild(buildSlider({ label:'Mix Level', icon:ICON('mixer'), min:0, max:100, step:1, value:BCAST.streamMix, format:v=>v+'%', onChange:v=>{BCAST.streamMix=v} }).el);

    root.appendChild(el('div','bc-section-title','Recording'));
    root.appendChild(buildToggleRow({ icon:ICON('circle'), label:'Record Enable', sub:'Record processed audio', checked:BCAST.recEnabled, onChange:v=>{BCAST.recEnabled=v} }).el);
    const recFmtOpts=[{value:'wav',label:'WAV (Lossless)'},{value:'mp3',label:'MP3'},{value:'ogg',label:'OGG'},{value:'flac',label:'FLAC'}];
    root.appendChild(buildSelect({ label:'Record Format', options:recFmtOpts, value:BCAST.recFormat, onChange:v=>{BCAST.recFormat=v} }).el);
    root.appendChild(buildSlider({ label:'Record Bitrate', icon:ICON('engine'), min:96, max:1411, step:64, value:BCAST.recBitrate, format:v=>v+'kbps', onChange:v=>{BCAST.recBitrate=v} }).el);
    const recSrOpts=[{value:44100,label:'44.1kHz'},{value:48000,label:'48kHz'},{value:88200,label:'88.2kHz'},{value:96000,label:'96kHz'}];
    root.appendChild(buildSelect({ label:'Record Sample Rate', options:recSrOpts, value:BCAST.recSampleRate, onChange:v=>{BCAST.recSampleRate=parseInt(v)} }).el);

    root.appendChild(el('div','bc-section-title','Voice Activity Detection'));
    root.appendChild(buildToggleRow({ icon:ICON('voice'), label:'VAD Enable', sub:'Voice activity detection', checked:BCAST.vadEnabled, onChange:v=>{BCAST.vadEnabled=v} }).el);
    root.appendChild(buildSlider({ label:'VAD Threshold', icon:ICON('threshold'), min:-80, max:-20, step:1, value:BCAST.vadThreshold, format:v=>v+'dB', onChange:v=>{BCAST.vadThreshold=v} }).el);

    root.appendChild(el('div','bc-section-title','Processing (Broadcast)'));
    root.appendChild(buildToggleRow({ icon:ICON('shade'), label:'Noise Suppression', sub:'AI-powered noise removal', checked:BCAST.noiseSuppression, onChange:v=>{BCAST.noiseSuppression=v} }).el);
    root.appendChild(buildSlider({ label:'NS Amount', icon:ICON('shade'), min:0, max:100, step:1, value:BCAST.nsAmount, format:v=>v+'%', onChange:v=>{BCAST.nsAmount=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('echo'), label:'Echo Cancellation', sub:'Remove echo and feedback', checked:BCAST.echoCancellation, onChange:v=>{BCAST.echoCancellation=v} }).el);
    root.appendChild(buildSlider({ label:'EC Amount', icon:ICON('echo'), min:0, max:100, step:1, value:BCAST.ecAmount, format:v=>v+'%', onChange:v=>{BCAST.ecAmount=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('voice'), label:'Stream AGC', sub:'Auto gain for broadcast', checked:BCAST.agcStream, onChange:v=>{BCAST.agcStream=v} }).el);
    root.appendChild(buildSlider({ label:'AGC Target', icon:ICON('threshold'), min:-30, max:0, step:1, value:BCAST.agcStreamTarget, format:v=>v+'dBFS', onChange:v=>{BCAST.agcStreamTarget=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('comp'), label:'Broadcast Compressor', sub:'Compress for broadcast', checked:BCAST.broadcastCompEnabled, onChange:v=>{BCAST.broadcastCompEnabled=v} }).el);
    root.appendChild(buildSlider({ label:'Comp Threshold', icon:ICON('threshold'), min:-40, max:0, step:1, value:BCAST.broadcastCompThreshold, format:v=>v+'dBFS', onChange:v=>{BCAST.broadcastCompThreshold=v} }).el);
    root.appendChild(buildSlider({ label:'Comp Ratio', icon:ICON('ratio'), min:1, max:20, step:0.5, value:BCAST.broadcastCompRatio, format:v=>v.toFixed(1)+':1', onChange:v=>{BCAST.broadcastCompRatio=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('hyper'), label:'Broadcast Limiter', sub:'Hard brick-wall limiter', checked:BCAST.broadcastLimEnabled, onChange:v=>{BCAST.broadcastLimEnabled=v} }).el);
    root.appendChild(buildSlider({ label:'Limiter Ceiling', icon:ICON('threshold'), min:-6, max:0, step:0.5, value:BCAST.broadcastLimThreshold, format:v=>v+'dBFS', onChange:v=>{BCAST.broadcastLimThreshold=v} }).el);

    root.appendChild(el('div','bc-section-title','Monitor & Loopback'));
    root.appendChild(buildToggleRow({ icon:ICON('voice'), label:'Monitor Enable', sub:'Hear your own processed audio', checked:BCAST.monitorEnabled, onChange:v=>{BCAST.monitorEnabled=v;if(activeChain){const ctx=getCtx();if(ctx&&v)try{activeChain.dest.stream.getAudioTracks().forEach(()=>{});}catch(e){}}} }).el);
    root.appendChild(buildSlider({ label:'Monitor Volume', icon:ICON('gain'), min:0, max:1, step:0.01, value:BCAST.monitorVolume, format:v=>(v*100).toFixed(0)+'%', onChange:v=>{BCAST.monitorVolume=v} }).el);
    root.appendChild(buildToggleRow({ icon:ICON('route'), label:'Loopback Enable', sub:'Route output back as input', checked:BCAST.loopbackEnabled, onChange:v=>{BCAST.loopbackEnabled=v} }).el);
    root.appendChild(buildSlider({ label:'Loopback Gain', icon:ICON('gain'), min:0, max:2, step:0.05, value:BCAST.loopbackGain, format:v=>v.toFixed(2)+'×', onChange:v=>{BCAST.loopbackGain=v} }).el);

    root.appendChild(el('div','bc-section-title','Stream Metadata'));
    root.appendChild(buildToggleRow({ icon:ICON('settings'), label:'Embed Metadata', sub:'Include stream metadata tags', checked:BCAST.streamMetadata, onChange:v=>{BCAST.streamMetadata=v} }).el);
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     ABOUT TAB
     ═══════════════════════════════════════════════════════ */
  function buildAboutTab() {
    const root = el('div','bc-section');
    root.innerHTML = `
      <div class="bc-wider-display" style="text-align:center;padding:24px 16px;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.2;background:url(${GIFS.sunflower}) center/cover no-repeat;"></div>
        <div style="position:relative;z-index:1;">
          <div style="font-size:36px;margin-bottom:12px;color:#FFD700;">${ICON('sunflower')}</div>
          <div style="font-size:20px;font-weight:900;letter-spacing:6px;color:#FFD700;text-shadow:0 0 20px rgba(255,215,0,.6);">BLAKECORD</div>
          <div style="font-size:10px;letter-spacing:4px;color:rgba(255,215,0,.4);margin-top:4px;">BLACK & GOLD EDITION · V4</div>
          <div style="font-size:9px;letter-spacing:2px;color:rgba(255,215,0,.25);margin-top:8px;">🌻 Sunflower Edition</div>
        </div>
      </div>
      <div class="bc-card" style="text-align:center;">
        <div class="bc-section-title" style="justify-content:center;margin-top:0;">CREATOR</div>
        <div style="font-size:20px;font-weight:900;color:#FFD700;text-shadow:0 0 14px rgba(255,215,0,.5);letter-spacing:3px;margin:4px 0;">BLAKE</div>
        <div style="font-size:9px;color:rgba(255,215,0,.35);letter-spacing:2px;">BLACK & GOLD EDITION</div>
      </div>
      <div class="bc-card" style="text-align:center;">
        <div style="font-size:9px;color:rgba(255,215,0,.3);letter-spacing:1px;text-transform:uppercase;">Premium Voice Engine for Discord</div>
        <div style="font-size:8px;color:rgba(255,215,0,.2);margin-top:8px;letter-spacing:.8px;line-height:1.8;">
          88 Voice Effects · 20 Presets · 12 Voice Tones<br>
          31-Band EQ · Reverb · CHAOS Engine<br>
          Loudmic Engine · 500+ Settings<br>
          Profiles · Broadcast · Visual Themes<br>
          🌻 Sunflower GIF Background
        </div>
      </div>
      <div class="bc-stats-grid">
        <div class="bc-stat-card"><div class="bc-stat-label">Effects</div><div class="bc-stat-val">88</div></div>
        <div class="bc-stat-card"><div class="bc-stat-label">Presets</div><div class="bc-stat-val">20</div></div>
        <div class="bc-stat-card"><div class="bc-stat-label">Settings</div><div class="bc-stat-val">500+</div></div>
        <div class="bc-stat-card"><div class="bc-stat-label">Loudmic Fx</div><div class="bc-stat-val">∞</div></div>
      </div>
      <div style="text-align:center;padding:8px;font-size:8px;color:rgba(255,215,0,.15);letter-spacing:3px;text-transform:uppercase;margin-top:8px;">BLAKECORD V4 · MADE BY BLAKE · 🌻</div>
    `;
    return root;
  }

  /* ═══════════════════════════════════════════════════════
     TABS DEFINITION
     ═══════════════════════════════════════════════════════ */
  const TABS = [
    { id:'Mixer',     icon:ICON('mixer')     },
    { id:'Voice',     icon:ICON('voice')     },
    { id:'FX',        icon:ICON('fx')        },
    { id:'EQ',        icon:ICON('eq')        },
    { id:'Reverb',    icon:ICON('reverb')    },
    { id:'Spatial',   icon:ICON('spatial')   },
    { id:'Player',    icon:ICON('player')    },
    { id:'Engine',    icon:ICON('engine')    },
    { id:'Presets',   icon:ICON('presets')   },
    { id:'Stats',     icon:ICON('stats')     },
    { id:'Loudmic',   icon:ICON('loudmic')   },
    { id:'Settings',  icon:ICON('settings')  },
    { id:'Visual',    icon:ICON('visual')    },
    { id:'Advanced',  icon:ICON('advanced')  },
    { id:'Profiles',  icon:ICON('profiles')  },
    { id:'Broadcast', icon:ICON('broadcast') },
    { id:'About',     icon:ICON('diamond')   },
  ];

  function renderTab() {
    if (!bodyEl) return;
    bodyEl.innerHTML = '';
    if (statsInterval) { clearInterval(statsInterval); statsInterval = null; }
    const tabInfo = TABS.find(t => t.id === activeTab) || TABS[0];
    const title = el('div','bc-section-title');
    title.innerHTML = tabInfo.icon + ' ' + tabInfo.id;
    bodyEl.appendChild(title);
    let content;
    switch (activeTab) {
      case 'Mixer':     content = buildMixerTab();          break;
      case 'Voice':     content = buildVoiceChangerTab();   break;
      case 'FX':        content = buildEffectsTab();        break;
      case 'EQ':        content = buildEqTab();             break;
      case 'Reverb':    content = buildReverbTab();         break;
      case 'Engine':    content = buildPowerTab();          break;
      case 'Presets':   content = buildPresetsTab();        break;
      case 'Stats':     content = buildStatsTab();          break;
      case 'Spatial':   content = buildWiderTab();          break;
      case 'Player':    content = buildMp3Tab();            break;
      case 'Loudmic':   content = buildLoudmicTab();        break;
      case 'Settings':  content = buildSettingsTab();       break;
      case 'Visual':    content = buildVisualTab();         break;
      case 'Advanced':  content = buildAdvancedTab();       break;
      case 'Profiles':  content = buildProfilesTab();       break;
      case 'Broadcast': content = buildBroadcastTab();      break;
      case 'About':     content = buildAboutTab();          break;
      default:          content = buildMixerTab();
    }
    bodyEl.appendChild(content);
  }

  function updateLauncher() {
    if (!launcherEl) return;
    launcherEl.style.borderColor = chainReady ? 'rgba(255,215,0,.7)' : 'rgba(255,215,0,.3)';
    launcherEl.style.boxShadow   = chainReady ? '0 0 30px rgba(255,215,0,.3),0 4px 20px rgba(0,0,0,.7)' : '0 0 20px rgba(255,215,0,.1),0 4px 20px rgba(0,0,0,.7)';
  }

  /* ═══════════════════════════════════════════════════════
     BUILD FULL UI
     ═══════════════════════════════════════════════════════ */
  function buildUI() {
    rootEl = el('div'); rootEl.id = 'bc-root';

    launcherEl = el('div'); launcherEl.id = 'bc-launcher';
    launcherEl.style.backgroundImage = 'url(' + GIFS.sunflower + ')';
    launcherEl.style.backgroundSize  = 'cover';
    launcherEl.style.backgroundPosition = 'center';
    launcherEl.innerHTML = '';
    launcherEl.addEventListener('click', togglePanel);

    panelEl = el('div'); panelEl.id = 'bc-panel'; panelEl.classList.add('hidden');

    // Background GIF layer
    const gifBg = el('div','bc-gif-bg');
    gifBg.style.backgroundImage    = 'url(' + GIFS.sunflower + ')';
    gifBg.style.backgroundSize     = 'cover';
    gifBg.style.backgroundPosition = 'center';
    panelEl.appendChild(gifBg);
    panelEl.appendChild(el('div','bc-gif-bg-overlay'));

    // Header
    const hdr = el('div','bc-hdr');
    hdr.innerHTML = `
      <div class="bc-hdr-icon">${ICON('sunflower')}</div>
      <div class="bc-hdr-info">
        <div class="bc-hdr-title">BlakeCord V4</div>
        <div class="bc-hdr-made">Black & Gold Edition · Made by Blake</div>
      </div>
      <div class="bc-hdr-ver">v4.0</div>
      <div class="bc-hdr-close">${ICON('close')}</div>
    `;
    hdr.querySelector('.bc-hdr-close').addEventListener('click', togglePanel);

    // Level meter
    const meterWrap = el('div','bc-meter-wrap');
    meterWrap.innerHTML = `
      <div class="bc-meter-lbl">LVL</div>
      <div class="bc-meter"><div class="bc-meter-fill" id="bc-level-fill"></div></div>
      <div class="bc-meter-val" id="bc-level-val">-∞</div>
    `;

    // Tabs
    const tabsEl = el('div','bc-tabs');
    TABS.forEach(({ id, icon }) => {
      const tab = el('div','bc-tab' + (id === activeTab ? ' active' : ''));
      tab.innerHTML = icon + ' <span>' + id + '</span>';
      tab.addEventListener('click', () => {
        activeTab = id;
        tabsEl.querySelectorAll('.bc-tab').forEach(x => x.classList.remove('active'));
        tab.classList.add('active');
        renderTab();
      });
      tabsEl.appendChild(tab);
    });

    bodyEl = el('div','bc-body');

    panelEl.appendChild(hdr);
    panelEl.appendChild(meterWrap);
    panelEl.appendChild(tabsEl);
    panelEl.appendChild(bodyEl);

    rootEl.appendChild(launcherEl);
    rootEl.appendChild(panelEl);
    document.body.appendChild(rootEl);

    levelFill = document.getElementById('bc-level-fill');
    levelVal  = document.getElementById('bc-level-val');

    makeDraggable(panelEl, hdr);

    window.addEventListener('blakecord:levels', (e) => {
      const db  = e.detail.db;
      const pct = Math.max(0, Math.min(1, (db + 60) / 60)) * 100;
      if (levelFill) { levelFill.style.width = pct + '%'; levelFill.classList.toggle('clip', db > -3); }
      if (levelVal) levelVal.textContent = fmtDb(db);
    });

    window.addEventListener('blakecord:ready', () => { chainReady = true; updateLauncher(); });

    // Try to load saved profiles
    try { const sp = localStorage.getItem('blakecord-v4-profiles'); if(sp) PROFILES.saved = JSON.parse(sp); } catch(e) {}
    try { const ss = localStorage.getItem('blakecord-v4-settings'); if(ss) Object.assign(SETT, JSON.parse(ss)); } catch(e) {}

    renderTab();
  }

  /* ── Panel toggle ── */
  function togglePanel() {
    panelVisible = !panelVisible;
    panelEl.classList.toggle('hidden', !panelVisible);
    if (panelVisible && audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
    if (panelVisible) getCtx();
  }

  /* ── Draggable ── */
  function makeDraggable(target, handle) {
    let startX, startY, origLeft, origTop, dragging = false;
    handle.addEventListener('mousedown', (e) => {
      dragging=true; startX=e.clientX; startY=e.clientY;
      const rect=target.getBoundingClientRect(); origLeft=rect.left; origTop=rect.top;
      target.style.right='auto'; target.style.left=origLeft+'px'; target.style.top=origTop+'px';
      document.body.classList.add('bc-dragging'); e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => { if(!dragging)return; target.style.left=Math.max(0,origLeft+e.clientX-startX)+'px'; target.style.top=Math.max(0,origTop+e.clientY-startY)+'px'; });
    document.addEventListener('mouseup',  () => { if(dragging){dragging=false;document.body.classList.remove('bc-dragging');} });
    handle.addEventListener('touchstart', (e) => { dragging=true; const t=e.touches[0]; startX=t.clientX; startY=t.clientY; const rect=target.getBoundingClientRect(); origLeft=rect.left; origTop=rect.top; target.style.right='auto'; target.style.left=origLeft+'px'; target.style.top=origTop+'px'; }, { passive:true });
    document.addEventListener('touchmove', (e) => { if(!dragging)return; const t=e.touches[0]; target.style.left=Math.max(0,origLeft+t.clientX-startX)+'px'; target.style.top=Math.max(0,origTop+t.clientY-startY)+'px'; }, { passive:true });
    document.addEventListener('touchend', () => { dragging=false; });
  }

  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    injectStyles();
    showBoot(() => { buildUI(); });
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);

  window.__BLAKECORD_STATE__ = STATE;
  window.__BLAKECORD_LMIC__  = LMIC;
  window.__BLAKECORD_SETT__  = SETT;

})();
