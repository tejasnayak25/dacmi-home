import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Layers, 
  Bell, 
  Calendar, 
  Zap, 
  FolderClosed, 
  Users, 
  Crosshair, 
  Send, 
  MoreHorizontal, 
  Check, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  SlidersHorizontal
} from 'lucide-react';

// Lightweight, dependency-free motion replacement compatible with Framer Motion props
const createMotionComponent = (Tag: string) => {
  const Component = React.forwardRef<any, any>(({
    initial,
    animate,
    whileInView,
    transition,
    viewport,
    style,
    className,
    children,
    ...props
  }, ref) => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isInView, setIsInView] = useState(!whileInView);
    const localRef = useRef<HTMLElement>(null);

    const setRefs = (node: any) => {
      (localRef as any).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as any).current = node;
    };

    useEffect(() => {
      const frame = requestAnimationFrame(() => setHasMounted(true));
      return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
      if (!whileInView || !localRef.current) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (viewport?.once) observer.disconnect();
        } else if (!viewport?.once) {
          setIsInView(false);
        }
      }, { threshold: 0.1 });

      observer.observe(localRef.current);
      return () => observer.disconnect();
    }, [whileInView, viewport?.once]);

    const target = whileInView 
      ? (isInView ? whileInView : initial)
      : (hasMounted ? animate : initial);

    const duration = transition?.duration ?? 0.6;
    const delay = transition?.delay ?? 0;
    const ease = typeof transition?.ease === 'string' ? transition.ease : 'cubic-bezier(0.22, 1, 0.36, 1)';

    const dynamicStyles: React.CSSProperties = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${duration}s`,
      transitionDelay: `${delay}s`,
      transitionTimingFunction: ease,
    };

    if (target) {
      if (target.opacity !== undefined) dynamicStyles.opacity = target.opacity;
      const transforms: string[] = [];
      if (target.y !== undefined) transforms.push(`translateY(${target.y}px)`);
      if (target.x !== undefined) transforms.push(`translateX(${target.x}px)`);
      if (target.scale !== undefined) transforms.push(`scale(${target.scale})`);
      if (transforms.length > 0) dynamicStyles.transform = transforms.join(' ');
    }

    return React.createElement(
      Tag,
      {
        ref: setRefs,
        style: { ...dynamicStyles, ...style },
        className,
        ...props,
      },
      children
    );
  });

  Component.displayName = `motion.${Tag}`;
  return Component;
};

export const motion = new Proxy({} as Record<string, any>, {
  get: (_, prop: string) => createMotionComponent(prop)
});

// High-performance imperceptible infinite loop engine
const SeamlessBackgroundVideo: React.FC<{ src: string }> = ({ src }) => {
  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const v0Ref = useRef<HTMLVideoElement>(null);
  const v1Ref = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<0 | 1>(0);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    activeRef.current = activePlayer;
  }, [activePlayer]);

  useEffect(() => {
    let animId: number;

    const checkLoop = () => {
      const activeVideo = activeRef.current === 0 ? v0Ref.current : v1Ref.current;
      const standbyVideo = activeRef.current === 0 ? v1Ref.current : v0Ref.current;

      if (activeVideo && activeVideo.duration > 0) {
        const remaining = activeVideo.duration - activeVideo.currentTime;

        // Initiate smooth cross-fade 1.8 seconds before the active video ends
        // so the incoming video is already playing at 60fps before the transition completes
        if (remaining <= 1.8 && !isTransitioningRef.current) {
          isTransitioningRef.current = true;

          if (standbyVideo) {
            standbyVideo.currentTime = 0.05; // bypass keyframe 0 seek latency
            const playPromise = standbyVideo.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  const nextActive = activeRef.current === 0 ? 1 : 0;
                  setActivePlayer(nextActive);
                  // Allow time for the CSS crossfade to finish before unlocking
                  setTimeout(() => {
                    isTransitioningRef.current = false;
                  }, 1200);
                })
                .catch(() => {
                  isTransitioningRef.current = false;
                });
            }
          }
        }
      }

      animId = requestAnimationFrame(checkLoop);
    };

    animId = requestAnimationFrame(checkLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0c0c0c]">
      <video
        ref={v0Ref}
        autoPlay
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none brightness-75 transition-opacity duration-1000 ease-linear ${
          activePlayer === 0 ? 'opacity-40' : 'opacity-0'
        }`}
        src={src}
      />
      <video
        ref={v1Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none brightness-75 transition-opacity duration-1000 ease-linear ${
          activePlayer === 1 ? 'opacity-40' : 'opacity-0'
        }`}
        src={src}
      />
    </div>
  );
};

export const DacmiLogoMark: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className="flex items-center gap-2.5 group cursor-pointer">
    <div className="relative flex items-center justify-center">
      {/* Exact translucent ribbon 'D' sculptural logo rendered as inline SVG */}
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]`}
      >
        <defs>
          {/* Subtle dark backdrop matching the artwork */}
          <radialGradient id="dBackdropGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1c22" />
            <stop offset="100%" stopColor="#08080a" />
          </radialGradient>

          {/* Deep inner cavity falloff */}
          <linearGradient id="innerCavityGrad" x1="120" y1="70" x2="260" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#07080a" />
            <stop offset="45%" stopColor="#12141a" />
            <stop offset="70%" stopColor="#252833" />
            <stop offset="100%" stopColor="#0a0b0e" />
          </linearGradient>

          {/* Rear folding inner contour */}
          <linearGradient id="innerRibbonFold" x1="160" y1="120" x2="350" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#40434d" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#686d7c" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#9da3b4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>

          {/* Main sweeping outer translucent white hood */}
          <linearGradient id="mainSweepingHood" x1="120" y1="70" x2="400" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="18%" stopColor="#f0f2f5" />
            <stop offset="55%" stopColor="#b4bac7" stopOpacity="0.88" />
            <stop offset="85%" stopColor="#e2e6ed" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Bottom returning swoosh */}
          <linearGradient id="bottomSwooshGrad" x1="120" y1="400" x2="360" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#c5cbd8" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#5d6373" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#181a20" stopOpacity="0.2" />
          </linearGradient>

          {/* Crisp highlight ridge */}
          <linearGradient id="crestRidge" x1="120" y1="70" x2="390" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d1d6e2" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer square background tile with smooth rounded corners */}
        <rect width="500" height="500" rx="44" fill="url(#dBackdropGlow)" />

        {/* Deep inner cavity behind the fold */}
        <path
          d="M125 72 H190 C190 72 260 180 270 245 C282 320 220 380 125 400 Z"
          fill="url(#innerCavityGrad)"
        />

        {/* Secondary inner contour reflection layer */}
        <path
          d="M190 72 C230 75 320 120 345 220 C365 295 315 365 225 396 C270 345 320 280 280 225 C245 175 190 145 190 72 Z"
          fill="url(#innerRibbonFold)"
        />

        {/* Main sweeping outer translucent white hood */}
        <path
          d="M125 72 C210 74 300 85 356 160 C400 218 395 305 348 360 C305 405 200 402 125 400 C155 385 240 340 270 260 C292 200 230 140 125 72 Z"
          fill="url(#mainSweepingHood)"
        />

        {/* Bottom folding return cusp */}
        <path
          d="M125 400 C175 398 250 355 272 262 C235 325 180 375 125 400 Z"
          fill="url(#bottomSwooshGrad)"
        />

        {/* Top sculpted crisp crest highlight */}
        <path
          d="M125 72 C215 74 305 85 362 165 C335 125 250 82 125 72 Z"
          fill="url(#crestRidge)"
          opacity="0.9"
        />

        {/* Outer perimeter rim highlight reflection */}
        <path
          d="M362 165 C404 222 398 306 350 362 C342 350 390 285 352 190 C340 160 320 135 300 115 C325 130 348 146 362 165 Z"
          fill="#ffffff"
          opacity="0.85"
        />
      </svg>
    </div>
    <span className="text-xl font-bold tracking-wider text-white">DACMI</span>
  </div>
);

export const AppleLogo: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 384 512" 
    fill="currentColor" 
    className={className} 
    aria-hidden="true"
  >
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

export const PrimaryButton: React.FC<{ label?: string; full?: boolean; onClick?: () => void; icon?: 'apple' | 'arrow' }> = ({ 
  label = "Get Started", 
  full = false,
  onClick,
  icon = "arrow"
}) => (
  <button
    onClick={onClick}
    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3 transition-all hover:bg-white/90 hover:shadow-[0_0_24px_rgba(56,189,248,0.4)] active:scale-[0.98] cursor-pointer ${full ? 'w-full' : ''}`}
  >
    {icon === 'apple' && <AppleLogo className="w-4 h-4 shrink-0" />}
    <span>{label}</span>
    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[2px]" />
  </button>
);

export const SectionEyebrow: React.FC<{ label: string; tag?: string }> = ({ label, tag }) => (
  <div className="inline-flex items-center gap-2.5">
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] animate-pulse" />
      <span className="text-xs uppercase tracking-widest text-[#38bdf8] font-bold">{label}</span>
    </div>
    {tag && (
      <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] uppercase tracking-wider text-white/60 bg-white/[0.04]">
        {tag}
      </span>
    )}
  </div>
);

const globalCustomStyles = `
  @keyframes shiny {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .animate-shiny {
    animation: shiny 6s linear infinite;
  }
  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(6px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.12);
    position: relative;
    overflow: hidden;
  }
  .liquid-glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(56, 189, 248, 0.5) 0%, rgba(255, 255, 255, 0.15) 25%,
      rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0) 55%,
      rgba(37, 99, 235, 0.2) 80%, rgba(56, 189, 248, 0.4) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .c3-pricing-section {
    position: relative;
    padding: 40px 20px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
  }
  .c3-watermark-container {
    position: relative;
    width: 100%;
    max-width: 1100px;
    text-align: center;
    margin-top: 40px;
    z-index: 2;
  }
  .c3-watermark-main {
    font-size: 8rem;
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.05em;
    filter: url(#c3-noise-pricing);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .c3-watermark-line-1 {
    color: #fff;
  }
  .c3-watermark-line-2 {
    background: linear-gradient(to right, #091020 0%, #0B2551 25%, #A4F4FD 65%, #00d2ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
  .c3-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    width: 100%;
    max-width: 1100px;
    margin-top: 60px;
    position: relative;
    z-index: 3;
  }
  .c3-card {
    background: linear-gradient(135deg, rgba(8, 15, 36, 0.8), rgba(6, 9, 19, 0.5));
    backdrop-filter: blur(14px) brightness(0.92);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 40px;
    padding: 48px 24px;
    min-height: 580px;
    display: flex;
    flex-direction: column;
    transition: all 0.6s cubic-bezier(.22,1,.36,1);
    overflow: hidden;
    position: relative;
  }
  .c3-card::before {
    content:'';
    position:absolute;
    inset:0;
    border-radius:inherit;
    background: linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(255,255,255,0) 50%);
    pointer-events:none;
  }
  .c3-card:hover {
    background: rgba(11, 21, 48, 0.7);
    border-color: rgba(56, 189, 248, 0.75);
    transform: translateY(-12px) scale(1.01);
    box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.35);
  }
  .c3-card-pro {
    background: linear-gradient(135deg, rgba(12, 24, 60, 0.85), rgba(7, 12, 28, 0.7));
    border-color: rgba(56, 189, 248, 0.5);
  }
  .c3-tier-small {
    font-size: 1.1rem;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
  }
  .c3-tier-large {
    font-size: 2.8rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #fff;
    margin-top: 8px;
  }
  .c3-desc {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.5);
    min-height: 3.2em;
    margin-top: 16px;
    margin-bottom: 36px;
    line-height: 1.5;
  }
  .c3-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .c3-list li {
    display:flex;
    align-items:flex-start;
    gap: 14px;
    font-size: 0.92rem;
    color: rgba(255,255,255,0.85);
    margin-bottom: 18px;
    line-height: 1.4;
  }
  .c3-check {
    width:26px;
    height:26px;
    border-radius:50%;
    background: rgba(56, 189, 248, 0.2);
    border: 1px solid rgba(56, 189, 248, 0.35);
    display:inline-flex;
    align-items:center;
    justify-content:center;
    flex-shrink:0;
  }
  .c3-btn {
    background:#fff;
    color:#000;
    padding: 10px 32px;
    border-radius: 100px;
    font-weight:600;
    font-size: 0.88rem;
    margin-top:auto;
    border:none;
    cursor:pointer;
    align-self:center;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
  }
  .c3-btn:hover {
    background:#e0f2fe;
    transform:scale(1.02);
    box-shadow: 0 8px 24px rgba(56, 189, 248, 0.35);
  }
  .c3-toggle-wrap {
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap:12px;
    width:100%;
    max-width:1100px;
    margin-top:32px;
    padding-right:20px;
  }
  .c3-toggle {
    width:52px;
    height:28px;
    background:#fff;
    border-radius:100px;
    position:relative;
    cursor:pointer;
    border:none;
    transition: background 0.3s cubic-bezier(.4,0,.2,1);
    padding:0;
  }
  .c3-toggle-knob {
    width:20px;
    height:20px;
    background:#080f24;
    border-radius:50%;
    position:absolute;
    top:4px;
    left:4px;
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
  }
  .c3-toggle.active {
    background: rgba(56, 189, 248, 0.3);
    border: 1px solid rgba(56, 189, 248, 0.4);
  }
  .c3-toggle.active .c3-toggle-knob {
    transform: translateX(24px);
    background:#38bdf8;
  }
  @media (max-width: 1024px) {
    .c3-watermark-main {
      font-size: 3.5rem;
      filter: none;
    }
    .c3-watermark-line-2 {
      background: none;
      -webkit-text-fill-color: #00d2ff;
      color: #00d2ff;
    }
    .c3-grid {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      width: 100vw;
      padding: 0 20px;
      gap: 16px;
      scrollbar-width: none;
    }
    .c3-grid::-webkit-scrollbar {
      display: none;
    }
    .c3-card {
      flex: 0 0 320px;
      scroll-snap-align: center;
    }
    .c3-toggle-wrap {
      justify-content: center;
      padding-right: 0;
    }
  }
`;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [activeSession, setActiveSession] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([
    "DACMI connected: Long-term memory synthesized from 18 workspace conversations."
  ]);

  const shinyGradientStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter: 'url(#c3-noise)',
  };

  const navLinks = ['Features', 'Intelligence', 'Workflows', 'Pricing', 'Vision'];

  const memoryContexts = [
    {
      id: 0,
      title: "Q3 Design & Strategy Roadmap",
      snippet: "Retained specifications for dark glass theme & Apple-grade feel...",
      category: "Memory Node",
      date: "9:41 AM",
      activeBadge: "High Confidence",
      details: [
        "Synthesized intent: The user prefers unified workspaces with persistent continuity.",
        "Synced tasks: 4 active deadlines extracted from team Slack & Linear briefs.",
        "Action items: Draft system design documentation before Friday."
      ]
    },
    {
      id: 1,
      title: "Client Contract & SLA Terms",
      snippet: "Cross-referenced privacy policies and encrypted storage stipulations...",
      category: "Knowledge Base",
      date: "8:12 AM",
      activeBadge: "Verified Context",
      details: [
        "Zero data retention by third-party LLMs enabled.",
        "Confidential corporate memory encrypted at rest using AES-256-GCM.",
        "Automatic NDA compliance tags assigned."
      ]
    },
    {
      id: 2,
      title: "Weekly Engineering Sprint Backlog",
      snippet: "Consolidated GitHub PR approvals, status updates, and blockers...",
      category: "Workflow Sync",
      date: "Yesterday",
      activeBadge: "Automated",
      details: [
        "18 pull requests triaged with automated code review summaries.",
        "Zero regressions detected across backend memory sync endpoints."
      ]
    },
    {
      id: 3,
      title: "Product Launch Strategy: Aura vs DACMI",
      snippet: "Comparative brand analysis with focus on persistent contextual recall...",
      category: "Strategic Plan",
      date: "Mon",
      activeBadge: "Strategic",
      details: [
        "Differentiator: DACMI builds persistent context without restarting prompts.",
        "Primary user base: High-output executives, architects, and operators."
      ]
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, `You: ${chatInput}`, `DACMI: Context updated. I've connected "${chatInput}" to your active workspace memory.`]);
    setChatInput('');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white font-sans antialiased selection:bg-[#38bdf8]/30">
      <style>{globalCustomStyles}</style>

      {/* Global Root SVG noise filter for shiny text */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      {/* Seamless Dual Crossfading Background Video */}
      <SeamlessBackgroundVideo 
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
      />

      {/* Fixed vertical guide lines */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* Section 1: Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-40 max-w-6xl mx-auto px-6 h-20 flex items-center justify-between"
      >
        <div className="flex items-center">
          <DacmiLogoMark />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="text-white/70 text-sm font-medium hover:text-sky-400 transition-colors"
            >
              {link}
            </motion.a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <PrimaryButton label="Get Started" />
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 z-50 bg-[#0c0c0c]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-sky-400 text-base font-medium py-1"
            >
              {link}
            </a>
          ))}
          <div className="pt-4 border-t border-white/10">
            <PrimaryButton full label="Get Started with DACMI" />
          </div>
        </div>
      )}

      {/* Section 2: Hero */}
      <section className="relative z-10 pt-16 md:pt-28 pb-20 text-center flex flex-col items-center max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4"
        >
          <SectionEyebrow label="Intelligence that remembers" tag="v2.4 Live" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95]"
        >
          <span className="block text-white mb-2">More than AI.</span>
          <span className="block animate-shiny pb-2" style={shinyGradientStyle}>
            An assistant that knows you.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-8 text-white/60 max-w-xl text-base leading-[1.6]"
        >
          Your ideas, your plans, your memories — all connected in one intelligent space. DACMI helps you think clearly, stay organized, and get more done without starting from scratch every time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <PrimaryButton label="Get Started Free" />
          <a
            href="#intelligence"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white hover:bg-white/5 transition"
          >
            <span>Explore Architecture</span>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
        
        <span className="mt-4 text-xs text-white/40 tracking-wide">
          Think smarter. Remember more. Do better.
        </span>
      </section>

      {/* Section 3: macOS menu bar strip */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="relative z-20 w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-white/70">
            <div className="w-3.5 h-3.5 rounded-full bg-sky-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>
            <span className="font-bold text-white tracking-wide">DACMI</span>
            {['Context', 'Synthesize', 'Memory Graph', 'Tasks', 'Security', 'Sync'].map((item, idx) => (
              <span 
                key={item} 
                className={`hover:text-white cursor-pointer transition ${
                  idx > 2 ? 'hidden sm:inline' : ''
                } ${idx > 3 ? 'hidden md:inline' : ''}`}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-white/50">
            <div className="flex items-center gap-1.5 text-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Neural Memory Active</span>
            </div>
            <span>Wed Oct 31 1:09 PM</span>
          </div>
        </div>
      </motion.div>

      {/* Section 4: Realistic DACMI Workspace Mockup */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#080d1b]/90 backdrop-blur-2xl shadow-2xl shadow-black/80"
        >
          {/* Title Bar */}
          <div className="h-10 bg-black/60 border-b border-white/10 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57] inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] inline-block shadow-xs" />
            </div>
            <div className="text-xs text-white/50 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>DACMI Assistant — Active Synapse</span>
            </div>
            <div className="w-12" />
          </div>

          {/* Assistant UI Grid */}
          <div className="grid grid-cols-12 h-[550px]">
            {/* Sidebar (col-span-3) */}
            <div className="col-span-12 md:col-span-3 border-r border-white/10 bg-black/40 p-4 flex flex-col justify-between">
              <div>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 text-white text-xs font-semibold px-3 py-2 shadow-lg shadow-blue-500/20 hover:opacity-95 transition">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Conversation</span>
                </button>

                <nav className="mt-5 space-y-1">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-medium">
                    <span className="flex items-center gap-2.5">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      Chat
                    </span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-full font-semibold">Active</span>
                  </button>

                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 text-xs font-medium transition">
                    <span className="flex items-center gap-2.5">
                      <Bell className="w-3.5 h-3.5 text-emerald-400" />
                      Reminders
                    </span>
                    <span className="text-[10px] text-white/40">4</span>
                  </button>

                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 text-xs font-medium transition">
                    <span className="flex items-center gap-2.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      Memory Graph
                    </span>
                    <span className="text-[10px] text-white/40">18 Nodes</span>
                  </button>

                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 text-xs font-medium transition">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Planning
                  </button>
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-3">Context Anchors</span>
                <div className="space-y-2 text-xs text-white/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Work Projects
                    </span>
                    <span className="text-[10px] text-white/40">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      Personal Knowledge
                    </span>
                    <span className="text-[10px] text-white/40">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Saved Decisions
                    </span>
                    <span className="text-[10px] text-white/40">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Context/Session list (col-span-4) */}
            <div className="col-span-12 md:col-span-4 border-r border-white/10 flex flex-col bg-black/20">
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50">
                  <Search className="w-3.5 h-3.5 text-white/40" />
                  <input 
                    type="text" 
                    readOnly 
                    placeholder="Search memories, topics & decisions" 
                    className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-white/40 cursor-default" 
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                {memoryContexts.map((node, idx) => (
                  <div 
                    key={node.id}
                    onClick={() => setActiveSession(idx)}
                    className={`p-3.5 cursor-pointer transition ${
                      activeSession === idx 
                        ? 'bg-blue-600/15 border-l-2 border-sky-400' 
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{node.title}</span>
                      <span className="text-[10px] text-white/40">{node.date}</span>
                    </div>
                    <div className="text-[11px] text-white/50 truncate leading-relaxed">{node.snippet}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-sky-300 font-medium">
                        {node.category}
                      </span>
                      <span className="text-[9px] text-emerald-400">{node.activeBadge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Interactive Synthesis View (col-span-5) */}
            <div className="hidden md:flex col-span-5 flex-col bg-black/30">
              <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <BrainCircuit className="w-4 h-4 text-sky-400" />
                  <span>Synthesizer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Auto-Learning
                  </span>
                  <button className="text-white/50 hover:text-white transition">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div className="liquid-glass rounded-xl p-3.5 border border-sky-400/20 bg-sky-950/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A4F4FD] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Memory Recall & Synthesis</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {memoryContexts[activeSession].snippet}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-white/70">
                  <div className="font-semibold text-white/90">Extracted Insights:</div>
                  {memoryContexts[activeSession].details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Interactive Dialogue</div>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`text-xs p-2 rounded-lg ${msg.startsWith('You:') ? 'bg-white/10 text-white ml-4' : 'bg-blue-900/30 text-sky-200 mr-4'}`}>
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Input Inside Mockup */}
              <div className="p-3 border-t border-white/10 bg-black/40">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask DACMI to remember or plan..." 
                    className="w-full bg-white/5 text-xs text-white placeholder:text-white/40 px-3 py-2 pr-9 rounded-lg border border-white/10 focus:outline-none focus:border-sky-400 transition"
                  />
                  <button type="submit" className="absolute right-2 text-sky-400 hover:text-white transition">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 5: FeatureTriage — Four Pillars of DACMI */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionEyebrow label="Continuous Memory" tag="AI That Remembers" />
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
              Everything you need, <br /> in one place.
            </h2>
            <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
              Most tools help you complete individual tasks. DACMI is designed to connect the dots between them so you spend less time re-explaining context and more time executing.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {['Less repetition', 'Better organization', 'More continuity', 'One connected experience'].map(chip => (
                <span 
                  key={chip} 
                  className="text-xs text-sky-300/80 px-3 py-1.5 rounded-full border border-sky-400/20 bg-sky-950/30"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Liquid-glass 4 Pillars */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="liquid-glass rounded-2xl p-5 border border-white/10 bg-black/40 space-y-3"
          >
            <div className="liquid-glass rounded-xl p-4 border border-white/10 bg-white/[0.02] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Intelligent Conversations</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Ask questions, explore ideas, solve problems, and get assistance through natural, high-resolution dialogues.
                </p>
              </div>
            </div>

            <div className="liquid-glass rounded-xl p-4 border border-white/10 bg-white/[0.02] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI That Remembers</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  DACMI connects important information across your interactions, helping you pick up right where you left off.
                </p>
              </div>
            </div>

            <div className="liquid-glass rounded-xl p-4 border border-white/10 bg-white/[0.02] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Smart Reminders</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Keep track of important tasks, deadlines, and plans without losing them across noisy chat histories.
                </p>
              </div>
            </div>

            <div className="liquid-glass rounded-xl p-4 border border-white/10 bg-white/[0.02] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">A More Organized Workflow</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Bring your thinking, planning, and everyday AI assistance into an effortless, unified experience.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 6: Workflow Step Sequencer */}
      <section id="workflows" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="liquid-glass rounded-3xl p-8 md:p-12 border border-white/10 bg-black/50">
          <div className="max-w-xl mb-10">
            <SectionEyebrow label="How It Works" tag="Frictionless" />
            <h3 className="text-2xl md:text-3xl font-semibold mt-3 text-white">
              Simple. Natural. <span className="text-sky-400">Powerful.</span>
            </h3>
            <p className="text-sm text-white/60 mt-2 leading-relaxed">
              Get started in just three quick steps and experience a genuinely connected intelligence partner.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                01
              </span>
              <h4 className="text-base font-semibold text-white mt-4 mb-2">Talk naturally</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Ask DACMI questions, share raw thoughts, or describe complex projects without worrying about rigid prompt formatting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                02
              </span>
              <h4 className="text-base font-semibold text-white mt-4 mb-2">Build your context</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                DACMI uses continuous semantic synthesis to preserve facts, priorities, and past decisions across sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                03
              </span>
              <h4 className="text-base font-semibold text-white mt-4 mb-2">Move forward</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Receive proactive reminders, auto-generated project plans, and context-aware answers that compound value every week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: LogoCloud */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center">
        <h4 className="text-xs uppercase tracking-widest text-white/40">
          Trusted by leading knowledge workers, founders & teams
        </h4>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
          {['Linear', 'Vercel', 'Figma', 'Stripe', 'Ramp', 'Notion', 'Cohere', 'Mercury'].map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="text-sm font-semibold tracking-tight text-white/50 hover:text-white transition cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 8: Testimonials */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.figure 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="liquid-glass rounded-2xl p-6 bg-black/40 flex flex-col justify-between"
          >
            <blockquote className="text-sm text-white/80 leading-[1.6]">
              "DACMI feels like having a chief of staff who actually remembers every conversation we had six months ago. No other AI tool comes close."
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <div className="text-sm font-semibold text-white">Elena Rostova</div>
              <div className="text-xs text-white/50">Partner & Head of Research</div>
              <div className="text-xs text-sky-400 font-semibold tracking-wide uppercase mt-1">NORDIC CAPITAL</div>
            </figcaption>
          </motion.figure>

          <motion.figure 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="liquid-glass rounded-2xl p-6 bg-black/40 flex flex-col justify-between"
          >
            <blockquote className="text-sm text-white/80 leading-[1.6]">
              "The ability to reference previous product roadmaps without copying & pasting documents has given my team 5 hours back each week."
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <div className="text-sm font-semibold text-white">Marcus Vance</div>
              <div className="text-xs text-white/50">VP of Engineering</div>
              <div className="text-xs text-sky-400 font-semibold tracking-wide uppercase mt-1">SCALEWORKS</div>
            </figcaption>
          </motion.figure>

          <motion.figure 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="liquid-glass rounded-2xl p-6 bg-black/40 flex flex-col justify-between"
          >
            <blockquote className="text-sm text-white/80 leading-[1.6]">
              "Context is everything in strategic consulting. DACMI is the only assistant that actually works like human memory."
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <div className="text-sm font-semibold text-white">Kareem Al-Sayed</div>
              <div className="text-xs text-white/50">Managing Director</div>
              <div className="text-xs text-sky-400 font-semibold tracking-wide uppercase mt-1">APEX VENTURES</div>
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* Section 9: Pricing with Watermark and C3 Styles */}
      <section id="pricing" className="c3-pricing-section">
        {/* Pricing specific SVG filter */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
          <filter id="c3-noise-pricing">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
            <feComponentTransfer><feFuncA type="linear" slope="0.075" /></feComponentTransfer>
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
          </filter>
        </svg>

        {/* Giant Watermark Headline */}
        <div className="c3-watermark-container">
          <div className="c3-watermark-main">
            <span className="c3-watermark-line-1">Intelligence that</span>
            <span className="c3-watermark-line-2">Remembers</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="c3-grid">
          {/* Free / Starter Plan */}
          <div className="c3-card">
            <span className="c3-tier-small">Starter</span>
            <span className="c3-tier-large">Free</span>
            <p className="c3-desc">For individuals seeking a personal AI that retains basic memory nodes.</p>
            <ul className="c3-list">
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Up to 50 active memory nodes</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Daily context synchronization</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Standard chat and reminder engine</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Web and mobile access</span>
              </li>
            </ul>
            <button className="c3-btn">Get Started</button>
          </div>

          {/* Professional Plan */}
          <div className="c3-card">
            <span className="c3-tier-small">Professional</span>
            <span className="c3-tier-large">{yearly ? '$16/m' : '$20/m'}</span>
            <p className="c3-desc">For builders, founders, and professionals who demand continuous context.</p>
            <ul className="c3-list">
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Unlimited neural memory nodes</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Sub-second cross-session recall</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Automated weekly executive briefing</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Priority inference speed & priority support</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Integrations with Slack, Notion, and Gmail</span>
              </li>
            </ul>
            <button className="c3-btn">Choose Professional</button>
          </div>

          {/* Enterprise / Team Pro */}
          <div className="c3-card c3-card-pro">
            <span className="c3-tier-small">Enterprise Workspace</span>
            <span className="c3-tier-large">{yearly ? '$40/m' : '$49/m'}</span>
            <p className="c3-desc">For high-growth teams and organizations requiring shared institutional memory.</p>
            <ul className="c3-list">
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Shared organizational memory graphs</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Enterprise encryption & zero-data-training SLA</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Role-based access & granular privacy permissions</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>Dedicated account engineer & custom connectors</span>
              </li>
              <li>
                <span className="c3-check"><Check className="w-3.5 h-3.5 text-sky-400" /></span>
                <span>SSO, SAML & SOC2 compliance report</span>
              </li>
            </ul>
            <button className="c3-btn">Contact Enterprise</button>
          </div>
        </div>

        {/* Toggle yearly/monthly */}
        <div className="c3-toggle-wrap">
          <span className="text-sm font-medium text-white/80">Yearly billing (Save 20%)</span>
          <button 
            type="button" 
            onClick={() => setYearly(!yearly)}
            className={`c3-toggle ${yearly ? 'active' : ''}`}
            aria-label="Toggle yearly billing"
          >
            <span className="c3-toggle-knob" />
          </button>
        </div>
      </section>

      {/* Section 10: Vision & Peak Trail CTA */}
      <section id="vision" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/10 bg-black/60 shadow-2xl"
        >
          {/* Radial glow background */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(600px circle at 50% 0%, rgba(56, 189, 248, 0.25), transparent 70%)',
              opacity: 0.35
            }}
          />

          <div className="relative z-10 max-w-md mx-auto mb-6">
            <svg 
              className="w-full h-24 mx-auto" 
              viewBox="0 0 320 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="glowTrail" x1="160" y1="10" x2="160" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.6" stopColor="#2563eb" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
              </defs>
              <polygon points="160,15 240,95 80,95" fill="#080f24" stroke="#1e293b" strokeWidth="1" />
              <path 
                d="M160 15 C155 35, 170 50, 150 70 C140 80, 180 90, 160 95" 
                stroke="url(#glowTrail)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              <circle cx="160" cy="15" r="3.5" fill="#ffffff" />
              <circle cx="160" cy="15" r="8" fill="#38bdf8" fillOpacity="0.4" />
            </svg>
          </div>

          <h2 className="relative z-10 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Ready for a smarter <br /> way to work?
          </h2>

          <p className="relative z-10 mt-6 text-white/60 max-w-lg mx-auto text-sm leading-[1.6]">
            Bring your thoughts, memories, and plans closer together with DACMI — intelligence that grows alongside your ambitions.
          </p>

          <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
            <PrimaryButton label="Get Started with DACMI" />
            <button className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-white text-sm font-medium px-6 py-3 hover:bg-white/5 transition-all">
              <span>Talk to sales</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 text-center text-xs text-white/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DacmiLogoMark className="w-5 h-5 opacity-80" />
            <span>&copy; {new Date().getFullYear()} DACMI Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#workflows" className="hover:text-white transition">Workflow</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#vision" className="hover:text-white transition">Vision</a>
          </div>
        </div>
      </footer>
    </div>
  );
}