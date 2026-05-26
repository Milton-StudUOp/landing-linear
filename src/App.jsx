import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import './App.css'

/* ═══════════════════════════════════════════════════════
   HOOKS & VARIANTS
   ═══════════════════════════════════════════════════════ */

/**
 * Hook to trigger animations when element enters viewport
 * @param {boolean} once - Should animation only play once
 * @returns {[React.RefObject, boolean]} Ref to attach to element and inView boolean
 */
function useScrollReveal(once = true) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-100px' })
  return [ref, inView]
}

/**
 * Hook to track mouse position for glow effects
 * @returns {object} {x, y} motion values with spring physics applied
 */
function useMouseGlow() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glowX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const glowY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  useEffect(() => {
    const updateMouse = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', updateMouse)
    return () => window.removeEventListener('mousemove', updateMouse)
  }, [mouseX, mouseY])

  return { glowX, glowY }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 70, damping: 15 } }
}

/**
 * Wrapper component that applies scroll-reveal animation
 */
function ScrollReveal({ children, variants = fadeUp, className = '' }) {
  const [ref, inView] = useScrollReveal()
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants}>
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   PREMIUM COMPONENTS
   ═══════════════════════════════════════════════════════ */

/**
 * Initial Splash Loading Screen
 */
function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="loader-wrap"
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8, ease: 'easeInOut' } }}
    >
      <div className="loader-logo">
        <svg viewBox="0 0 28 28" fill="none">
          <rect className="rect" width="28" height="28" rx="6" fill="var(--accent)" />
          <path className="path" d="M7 15L11 19L21 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  )
}

/**
 * Custom global cursor with glow
 */
function CursorGlow() {
  const { glowX, glowY } = useMouseGlow()
  return (
    <>
      <div className="cursor-dot" />
      <motion.div className="cursor-glow" style={{ left: glowX, top: glowY }} />
    </>
  )
}

/**
 * Lightweight canvas particle system for hero background
 */
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.1
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }
      draw() {
        ctx.fillStyle = `rgba(109, 123, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      resize()
      particles = Array.from({ length: 80 }, () => new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      
      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(109, 123, 255, ${0.1 - dist / 1000})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()
    window.addEventListener('resize', init)

    return () => {
      window.removeEventListener('resize', init)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" />
}

/**
 * Animated SVG arc counter
 */
function ArcCounter({ value, label, total = 100, isPercentage = false }) {
  const [ref, inView] = useScrollReveal()
  const [count, setCount] = useState(0)
  const radius = 64
  const circumference = 2 * Math.PI * radius
  
  useEffect(() => {
    if (!inView) return
    let start = null
    const end = value
    const duration = 2000
    
    const animate = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setCount(ease * end)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, value])

  const strokeDashoffset = circumference - (count / total) * circumference

  return (
    <motion.div ref={ref} className="stats__card" variants={staggerItem}>
      <div className="stats__circle">
        <svg width="140" height="140">
          <circle className="bg" cx="70" cy="70" r={radius} />
          <motion.circle 
            className="progress" cx="70" cy="70" r={radius} 
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: inView ? strokeDashoffset : circumference }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="stats__num" style={{ position: 'absolute' }}>
          {Math.floor(count)}{isPercentage ? '%' : '+'}
        </div>
      </div>
      <span className="stats__label">{label}</span>
    </motion.div>
  )
}

/**
 * 3D Tilt Feature Card
 */
function TiltFeatureCard({ icon, title, desc }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    cardRef.current.style.setProperty('--mx', `${mouseX}px`)
    cardRef.current.style.setProperty('--my', `${mouseY}px`)
    
    // 3D rotation logic
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    x.set((mouseY - centerY) / 15)
    y.set(-(mouseX - centerX) / 15)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const icons = {
    zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>,
    terminal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  }

  return (
    <motion.div className="feature__card-wrap" variants={staggerItem}>
      <motion.div 
        ref={cardRef} 
        className="feature__card" 
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: x, rotateY: y }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="feature__card-glow" />
        <div className="feature__content">
          <div className="feature__icon">{icons[icon]}</div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Platform', href: '#features' },
  { label: 'Solutions', href: '#showcase' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#faq' },
]

const FEATURES = [
  { icon: 'zap', title: 'Zero-Config Deployments', desc: 'Push to main and let DevForge handle the rest. Edge rendering, asset optimization, and CDN routing.' },
  { icon: 'activity', title: 'Deep Observability', desc: 'Real-time trace visualization, log drains, and anomaly detection with AI-driven insights.' },
  { icon: 'grid', title: 'Infinite Preview Envs', desc: 'Every PR gets a full-stack ephemeral environment. Share links instantly with stakeholders.' },
  { icon: 'terminal', title: 'Type-safe Infrastructure', desc: 'Define your entire infrastructure in TypeScript. Refactor servers and databases with confidence.' },
  { icon: 'globe', title: 'Global Edge Network', desc: 'Deploy your compute to 40+ regions globally within seconds. Achieve <10ms TTFB worldwide.' },
  { icon: 'shield', title: 'Enterprise Security', desc: 'SOC2 Type II compliance out of the box. Automated vulnerability scanning and WAF protection.' },
]

const PARTNER_LOGOS = [
  { 
    name: 'Vercel', 
    svg: <svg viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 2L24 22H0L12 2Z" fill="currentColor"/></svg> 
  },
  { 
    name: 'GitHub', 
    svg: <svg viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/></svg> 
  },
  { 
    name: 'Stripe', 
    svg: <svg viewBox="0 0 24 24" fill="none"><path d="M11.988 5.397c-2.783 0-3.81 1.511-3.81 3.235 0 2.375 2.162 2.879 4.398 3.239 1.487.239 2.508.575 2.508 1.439 0 .863-.827 1.583-2.651 1.583-1.488 0-2.928-.576-3.817-1.393l-1.343 3.166c1.39 1.152 3.164 1.776 5.11 1.776 3.02 0 4.1-1.63 4.1-3.475 0-2.42-2.11-2.924-4.346-3.237-1.44-.24-2.559-.575-2.559-1.486 0-.816.827-1.535 2.457-1.535 1.44 0 2.639.431 3.526 1.055l1.248-3.07a8.558 8.558 0 0 0-4.821-1.3z" fill="currentColor"/></svg> 
  },
  {
    name: 'React',
    svg: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.2" transform="rotate(150 12 12)"/></svg>
  },
  {
    name: 'GraphQL',
    svg: <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm0 18.2L3.5 15.3V8.7L12 3.8l8.5 4.9v6.6L12 20.2z" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="3.8" r="1.5" fill="currentColor"/><circle cx="12" cy="20.2" r="1.5" fill="currentColor"/><circle cx="4.8" cy="8" r="1.5" fill="currentColor"/><circle cx="4.8" cy="16" r="1.5" fill="currentColor"/><circle cx="19.2" cy="8" r="1.5" fill="currentColor"/><circle cx="19.2" cy="16" r="1.5" fill="currentColor"/></svg>
  },
  {
    name: 'Docker',
    svg: <svg viewBox="0 0 24 24" fill="none"><path d="M12.2 9h2.3v2h-2.3V9zm-2.8 0h2.3v2H9.4V9zm-2.8 0h2.3v2H6.6V9zm0-2.5h2.3v2H6.6v-2zm2.8 0h2.3v2H9.4v-2zm2.8 0h2.3v2h-2.3v-2zm-5.6-2.5h2.3v2H6.6v-2zm2.8 0h2.3v2H9.4v-2zm5.6 5h2.3v2H15V9zM3.8 9h2.3v2H3.8V9zm16.4 1.3c0-.1-.1-.1-.1-.1-.4-1.2-1.3-2-2.5-2.2.1-.8 0-1.6-.3-2.3-1.1-.1-2.1.4-2.8 1.1-.3-.1-.7-.1-1.1-.1v4.3h7c0-.2-.2-.5-.2-.7zM2.8 12.3c0 .1 0 .2.1.2.6 3.1 3 5.4 6 5.4h4.7c3.1 0 5.6-2.3 6.1-5.4 0-.1.1-.2.1-.2h-17z" fill="currentColor"/></svg>
  },
]

/* ═══════════════════════════════════════════════════════
   MAIN APP SECTIONS
   ═══════════════════════════════════════════════════════ */

function Nav({ scrolled, menuOpen, setMenuOpen, scrollTo }) {
  return (
    <>
      <motion.nav 
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container nav__inner">
          <a href="#" className="nav__logo" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
            <div className="nav__logo-icon">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M7 15L11 19L21 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            DevForge
          </a>
          <div className="nav__links">
            {NAV_LINKS.map(l => (
              <a key={l.href} className="nav__link" onClick={(e) => { e.preventDefault(); scrollTo(l.href.slice(1)) }}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav__actions">
            <a href="#" className="nav__link" onClick={(e) => e.preventDefault()}>Sign In</a>
            <button className="btn btn--white" onClick={() => scrollTo('pricing')}>Get Started</button>
          </div>
          <button className={`nav__hamburger${menuOpen ? ' is-active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="nav__mobile" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}>
            <div className="nav__mobile-links">
              {NAV_LINKS.map((l, i) => (
                <motion.a 
                  key={l.href} 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  onClick={() => scrollTo(l.href.slice(1))}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
            <div className="nav__mobile-actions">
              <button className="btn btn--outline btn--block btn--lg">Sign In</button>
              <button className="btn btn--primary btn--block btn--lg">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 20])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  return (
    <section ref={heroRef} id="hero" className="hero">
      <ParticleCanvas />
      <div className="hero__aurora" />
      
      <motion.div className="container hero__content" style={{ y, opacity }}>
        <motion.div 
          className="hero__badge"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.2, duration: 0.5 }}
        >
          <span className="hero__badge-dot" /> Introducing DevForge v2.0 AI
        </motion.div>
        
        <motion.h1 
          className="hero__title"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Build software with <br />
          <span className="text-accent">absolute precision.</span>
        </motion.h1>
        
        <motion.p 
          className="hero__sub"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4, duration: 0.8 }}
        >
          The enterprise-grade developer platform that transforms complex architecture into seamless production code. Ship faster, scale infinitely.
        </motion.p>
        
        <motion.div 
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 0.8 }}
        >
          <button className="btn btn--primary btn--lg">Start Building Free</button>
          <button className="btn btn--outline btn--lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Watch Keynote
          </button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="hero__mockup-wrap"
        initial={{ opacity: 0, y: 100, rotateX: 15 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 2.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, scale }}
      >
        <div className="hero__mockup-inner">
          <div className="hero__mockup-base">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=90" alt="DevForge Dashboard" />
          </div>
          
          <motion.div 
            className="hero__float-card left"
            animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="hero__float-icon success"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg></div>
            <div className="hero__float-text"><strong>Build Successful</strong><span>Production • 12s ago</span></div>
          </motion.div>

          <motion.div 
            className="hero__float-card right"
            animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="hero__float-icon accent"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
            <div className="hero__float-text"><strong>Traffic Spike</strong><span>Autoscaling activated</span></div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function TrustMarquee() {
  return (
    <section className="trust">
      <div className="section__header" style={{ marginBottom: '24px', opacity: 0.7 }}>
        <span className="section__label" style={{ background: 'transparent', border: 'none', margin: 0 }}>Trusted by absolute high-velocity engineering teams</span>
      </div>
      <div className="trust__inner">
        <div className="trust__group">
          {PARTNER_LOGOS.map((p, i) => (
            <div key={i} className="trust__logo" title={p.name}>
              <div style={{ width: '120px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ display: 'inline-block', width: '32px', height: '32px', marginRight: '10px' }}>
                  {p.svg}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>{p.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="trust__group">
          {PARTNER_LOGOS.map((p, i) => (
            <div key={`dup-${i}`} className="trust__logo" title={p.name}>
              <div style={{ width: '120px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ display: 'inline-block', width: '32px', height: '32px', marginRight: '10px' }}>
                  {p.svg}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>{p.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [billing, setBilling] = useState('monthly')
  const [activeFaq, setActiveFaq] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="app">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <CursorGlow />
      <Nav {...{ scrolled, menuOpen, setMenuOpen, scrollTo }} />
      <Hero />
      <TrustMarquee />

      {/* ════ FEATURES ════ */}
      <section id="features" className="section features">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}/> Platform</span>
              <h2 className="section__title">Infrastructure without the friction.</h2>
              <p className="section__desc">We've abstracted the complexity of cloud architecture so you can focus entirely on shipping product.</p>
            </div>
          </ScrollReveal>
          
          <motion.div className="features__grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
            {FEATURES.map((f, i) => <TiltFeatureCard key={i} {...f} />)}
          </motion.div>
        </div>
      </section>

      {/* ════ SHOWCASE ════ */}
      <section id="showcase" className="section showcase">
        <div className="container">
          <div className="showcase__grid">
            <ScrollReveal className="showcase__visual" variants={scaleIn}>
              <div className="showcase__visual-glow" />
              <div className="showcase__visual-main">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90" alt="Analytics Interface" />
              </div>
            </ScrollReveal>
            
            <ScrollReveal className="showcase__content">
              <div className="section__label">Observability</div>
              <h3>Know exactly what your code is doing.</h3>
              <p>Stop guessing. DevForge provides granular, real-time insights into your application's performance, from edge routing to database queries.</p>
              
              <div className="showcase__features">
                <div className="showcase__feat">
                  <div className="showcase__feat-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
                  <div>
                    <h4>Live Telemetry</h4>
                    <p>Millisecond-precision tracking across your entire distributed architecture.</p>
                  </div>
                </div>
                <div className="showcase__feat">
                  <div className="showcase__feat-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                  <div>
                    <h4>Anomaly Detection</h4>
                    <p>AI models automatically flag unusual latency spikes or error rates.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ════ PROCESS ════ */}
      <section className="section process">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <h2 className="section__title">From code to global edge in seconds.</h2>
            </div>
          </ScrollReveal>

          <div className="process__grid">
            <div className="process__line" />
            {[
              { title: 'Push to Git', desc: 'Commit your code. DevForge automatically detects the framework and provisions resources.' },
              { title: 'Atomic Build', desc: 'Isolated sandbox compiles, optimizes assets, and runs your test suite in parallel.' },
              { title: 'Global Deploy', desc: 'Artifacts are instantly distributed to our 40+ edge nodes via anycast routing.' }
            ].map((step, i) => (
              <ScrollReveal key={i} variants={fadeUp} className="process__step">
                <div className="process__num">0{i+1}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ STATS ════ */}
      <section className="stats">
        <div className="container">
          <motion.div className="stats__grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
            <ArcCounter value={99.99} label="Guaranteed Uptime" isPercentage={true} />
            <ArcCounter value={40} label="Global Edge Regions" />
            <ArcCounter value={12} label="ms Avg Latency" />
            <ArcCounter value={8} label="Million Daily Deploys" />
          </motion.div>
        </div>
      </section>

      {/* ════ PRICING ════ */}
      <section id="pricing" className="section pricing">
        <div className="pricing__glow" />
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">Pricing</span>
              <h2 className="section__title">Scale without surprises.</h2>
              <p className="section__desc">Predictable, transparent pricing that grows with your engineering team.</p>
            </div>
          </ScrollReveal>

          <div className="pricing__toggle">
            <span className={billing === 'monthly' ? 'is-active' : ''} onClick={() => setBilling('monthly')}>Monthly</span>
            <div className={`pricing__toggle-track${billing === 'yearly' ? ' is-yearly' : ''}`} onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}>
              <motion.div className="pricing__toggle-thumb" layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </div>
            <span className={billing === 'yearly' ? 'is-active' : ''} onClick={() => setBilling('yearly')}>
              Yearly <span className="pricing__badge">Save 20%</span>
            </span>
          </div>

          <div className="pricing__grid">
            {[
              { name: 'Starter', price: 'Free', desc: 'For hobbyists and side projects.', features: ['3 Projects', '100 Deployments / mo', 'Community Support', 'Shared Edge Network'] },
              { name: 'Professional', price: billing === 'monthly' ? '$39' : '$29', desc: 'For fast-moving production teams.', popular: true, features: ['Unlimited Projects', 'Unlimited Deployments', 'Priority 24/7 Support', 'Dedicated Edge IP', 'Advanced Telemetry', 'Custom Domains'] },
              { name: 'Enterprise', price: 'Custom', desc: 'For large organizations with compliance needs.', features: ['Unlimited Everything', 'Dedicated Account Manager', '99.99% SLA', 'SOC2 / HIPAA Compliance', 'SSO / SAML', 'On-premise Options'] }
            ].map((plan, i) => (
              <ScrollReveal key={i} variants={fadeUp} className={`pricing__card${plan.popular ? ' is-popular' : ''}`}>
                {plan.popular && <div className="pricing__popular-badge">Most Popular</div>}
                <h3 className="pricing__name">{plan.name}</h3>
                <div className="pricing__price">
                  <span className="pricing__value">{plan.price}</span>
                  {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="pricing__period">/mo</span>}
                </div>
                <p className="pricing__desc">{plan.desc}</p>
                <ul className="pricing__features">
                  {plan.features.map((f, j) => (
                    <li key={j}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>{f}</li>
                  ))}
                </ul>
                <button className={`btn btn--block ${plan.popular ? 'btn--primary' : 'btn--outline'}`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className="cta">
        <div className="cta__bg" />
        <div className="cta__glow" />
        <div className="container cta__inner">
          <ScrollReveal>
            <h2>Ready to rewrite your infrastructure?</h2>
            <p>Join thousands of high-velocity teams already shipping faster with DevForge. Deploy your first application in minutes.</p>
            <div className="cta__actions">
              <button className="btn btn--white btn--lg">Start Building Free</button>
              <button className="btn btn--outline btn--lg" style={{ background: 'transparent' }}>Talk to Sales</button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-icon">
                  <svg width="18" height="18" viewBox="0 0 28 28" fill="none"><path d="M7 15L11 19L21 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                DevForge
              </div>
              <p className="footer__tagline">The premium developer platform for modern software architecture. Built for absolute speed and precision.</p>
            </div>
            
            <div className="footer__grid">
              {[
                { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog', 'Docs'] },
                { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact', 'Partners'] },
                { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'DPA'] }
              ].map((col, i) => (
                <div key={i} className="footer__col">
                  <h4>{col.title}</h4>
                  {col.links.map(l => <a key={l} href="#">{l}</a>)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="footer__bottom">
            <span>© 2026 DevForge Inc. All rights reserved.</span>
            <div className="footer__socials">
              <a href="#" aria-label="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.82-.26.82-.58v-2.17c-3.34.72-4.04-1.4-4.04-1.4-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 5.8c1.02 0 2.05.14 3.01.4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/></svg></a>
              <a href="#" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
