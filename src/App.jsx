import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion'
import './App.css'

/* ═══════════════════════════════════════════════════════
   HOOKS & VARIANTS
   ═══════════════════════════════════════════════════════ */

function useScrollReveal(once = true) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-80px' })
  return [ref, inView]
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 16 } }
}

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

function ScrollReveal({ children, variants = fadeUp, className = '' }) {
  const [ref, inView] = useScrollReveal()
  return (
    <motion.div ref={ref} className={className}
      initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants}>
      {children}
    </motion.div>
  )
}

function AnimatedCounter({ value, suffix = '', duration = 2.2 }) {
  const [count, setCount] = useState('0')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  useEffect(() => {
    if (!inView) return
    const isFloat = value.toString().includes('.')
    const end = parseFloat(value)
    let startTime = null
    const animate = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = (ts - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = ease * end
      setCount(isFloat ? current.toFixed(2) : Math.floor(current).toLocaleString())
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration, inView])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const FEATURES = [
  { icon: 'zap', title: 'One-Click Automations', desc: 'Connect your repo and deploy in seconds. Automated tests, preview deployments, and zero-downtime rolling upgrades.' },
  { icon: 'activity', title: 'Real-time Observability', desc: 'End-to-end latency, throughput, error rates, and custom metrics — all out of the box.' },
  { icon: 'grid', title: 'Isolated Environments', desc: 'Full sandbox replicas for every branch. Test confidently before merging to production.' },
  { icon: 'terminal', title: 'Declarative CI/CD', desc: 'Type-safe pipeline configs in JavaScript. No brittle YAML, just clean, maintainable code.' },
  { icon: 'globe', title: 'Global Edge Network', desc: 'Automatic CDN caching and static generation. Push compute closer to users for single-digit ms TTFB.' },
  { icon: 'shield', title: 'Intelligent Security', desc: 'Credential leak detection, runtime anomaly alerts, and dependency vulnerability scanning.' },
]

const STATS = [
  { value: '12000', suffix: '+', label: 'Active Projects' },
  { value: '99.99', suffix: '%', label: 'Guaranteed Uptime' },
  { value: '8900000', suffix: '+', label: 'Deploys Completed' },
  { value: '140', suffix: '+', label: 'Countries Served' },
]

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Begin building and testing with essential tools.',
    features: ['3 projects', '100 deploys/month', 'Community support', 'Basic analytics', '1 team member'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$29',
    desc: 'Scale your team with advanced features and priority support.',
    features: ['50 projects', 'Unlimited deploys', 'Priority support 24/7', 'Advanced analytics', 'Up to 10 members', 'Preview environments', 'Custom domains'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    desc: 'Full power for large organizations with custom needs.',
    features: ['Unlimited projects', 'Unlimited deploys', 'Dedicated account manager', 'SLA guarantee', 'Unlimited members', 'Custom integrations', 'SSO & SAML'],
    cta: 'Contact Sales',
    popular: false,
  },
]

const TESTIMONIALS = [
  { name: 'Ana Silva', role: 'CTO at TechNova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', quote: 'DevForge completely reshaped how we handle deployments. Our average rollout time fell from days to under four minutes. Massive multiplier for our engineering velocity.' },
  { name: 'Lucas Mendes', role: 'Lead Engineer at DataFlow', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', quote: 'The analytics engine is exceptional. Instant alerts on runtime anomalies give us confidence to ship major updates even during peak hours.' },
  { name: 'Carla Oliveira', role: 'Architect at CloudFlex', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80', quote: 'Every interaction is beautifully refined. Clean Linear-inspired aesthetic, flawless developer tooling, and unmatched speed. This is what modern DevOps should feel like.' },
]

const FAQ = [
  { q: 'How do I get started with DevForge?', a: 'Sign up for a free account — no credit card required. Our onboarding wizard sets up your first project in under 2 minutes, complete with a demo deployment.' },
  { q: 'Can I use my existing CI/CD configuration?', a: 'Yes! DevForge supports all major CI/CD providers. You can import your existing workflow or build a new one using our declarative JavaScript-based pipeline DSL.' },
  { q: 'What kind of support do you offer?', a: 'Starter plans include community support via Discord. Professional plans add 24/7 priority email and chat. Enterprise plans include a dedicated account manager with custom SLA.' },
  { q: 'Is there a free tier?', a: 'Yes! Our Starter plan is completely free and includes 3 projects, 100 deploys per month, and community support. No time limit, no credit card required.' },
  { q: 'How does pricing scale?', a: 'As your team grows, you can upgrade seamlessly from Starter to Professional, or from Professional to Enterprise. All upgrades take effect immediately with no downtime.' },
]

/* ═══════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════ */

function Nav({ scrolled, menuOpen, setMenuOpen, scrollTo }) {
  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container nav__inner">
          <a href="#" className="nav__logo" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#5e6ad2" />
              <path d="M7 15L11 19L21 9" stroke="#f7f8f8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>DevForge</span>
          </a>
          <div className="nav__links">
            {NAV_LINKS.map(l => (
              <a key={l.href} className="nav__link" onClick={() => scrollTo(l.href.slice(1))}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav__actions">
            <a href="#" className="btn btn--ghost" onClick={(e) => e.preventDefault()}>Sign In</a>
            <motion.a href="#" className="btn btn--primary" onClick={(e) => e.preventDefault()}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Get Started
            </motion.a>
          </div>
          <button className={`nav__hamburger${menuOpen ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="nav__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map(l => (
              <a key={l.href} onClick={() => scrollTo(l.href.slice(1))}>{l.label}</a>
            ))}
            <div className="nav__mobile-actions">
              <a href="#" className="btn btn--ghost btn--block">Sign In</a>
              <a href="#" className="btn btn--primary btn--block">Get Started</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {menuOpen && <div className="nav__overlay" onClick={() => setMenuOpen(false)} />}
    </>
  )
}

function Hero() {
  const heroRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 25 })
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 25 })

  const handleMouse = (e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start end', 'end start'] })
  const rotateX = useTransform(scrollYProgress, [0, 0.75], [15, 0])
  const imgScale = useTransform(scrollYProgress, [0, 0.75], [0.9, 1])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1])

  return (
    <section ref={heroRef} id="hero" className="hero" onMouseMove={handleMouse} onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}>
      <motion.div className="hero__glow" style={{ x: glowX, y: glowY }} />
      <div className="container hero__content">
        <motion.div className="hero__badge" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="hero__badge-dot" /> Now in open beta
        </motion.div>
        <motion.h1 className="hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          Build software with <br /><span className="text-accent">speed and absolute precision</span>
        </motion.h1>
        <motion.p className="hero__sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          DevForge is the developer platform that transforms your ideas into performant production code. Integrate, monitor, and scale effortlessly.
        </motion.p>
        <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <motion.a href="#pricing" className="btn btn--primary btn--lg"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Start For Free</motion.a>
          <motion.a href="#showcase" className="btn btn--outline btn--lg"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Watch Demo</motion.a>
        </motion.div>
        <motion.div className="hero__stats-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <span><strong>12k+</strong> Developers</span><span className="sep">•</span>
          <span><strong>500+</strong> Teams</span><span className="sep">•</span>
          <span><strong>99.99%</strong> Uptime</span>
        </motion.div>
      </div>
      <div className="hero__mockup-wrap">
        <motion.div className="hero__mockup" style={{ rotateX, scale: imgScale, opacity: imgOpacity }}>
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80" alt="DevForge Dashboard" loading="lazy" />
        </motion.div>
      </div>
    </section>
  )
}

function SocialProof() {
  const partners = [
    { name: 'Stripe', path: 'M12.4 12c0-1.8 1.4-2.5 3.7-2.5 2.1 0 4.5.7 6 1.6V5.4c-1.8-.7-4.1-1-6.2-1C9.6 4.4 5.3 7 5.3 12.6c0 6.9 9.5 5.8 9.5 8.9 0 2-1.8 2.6-4.1 2.6-2.5 0-5.1-1-6.8-2v5.8c1.9.8 4.6 1.2 7 1.2 6.5 0 10.7-2.7 10.7-8.3 0-7.3-9.2-6-9.2-8.8z' },
    { name: 'Vercel', path: 'M12.3 22.8c-2.4 0-4.4-1.9-4.4-4.4 0-2.4 2-4.4 4.4-4.4s4.4 2 4.4 4.4c0 2.4-2 4.4-4.4 4.4zm0-12.8c-4.7 0-8.4 3.7-8.4 8.4s3.7 8.4 8.4 8.4c4.6 0 8.4-3.7 8.4-8.4s-3.8-8.4-8.4-8.4zm22 12.8c-2.4 0-4.4-1.9-4.4-4.4 0-2.4 2-4.4 4.4-4.4s4.4 2 4.4 4.4c0 2.4-2 4.4-4.4 4.4zm0-12.8c-4.7 0-8.4 3.7-8.4 8.4s3.7 8.4 8.4 8.4 8.4-3.7 8.4-8.4-3.8-8.4-8.4-8.4z' },
    { name: 'Linear', path: 'M10 22.8c-2.4 0-4.4-1.9-4.4-4.4 0-2.4 2-4.4 4.4-4.4s4.4 2 4.4 4.4c0 2.4-2 4.4-4.4 4.4zm0-12.8C5.3 10 1.6 13.7 1.6 18.4S5.3 26.8 10 26.8c4.6 0 8.4-3.7 8.4-8.4S14.6 10 10 10zm16.5 12.8c-2.4 0-4.4-1.9-4.4-4.4 0-2.4 2-4.4 4.4-4.4s4.4 2 4.4 4.4c0 2.4-2 4.4-4.4 4.4zm0-12.8c-4.7 0-8.4 3.7-8.4 8.4s3.7 8.4 8.4 8.4 8.4-3.7 8.4-8.4-3.8-8.4-8.4-8.4z' },
    { name: 'GitHub', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.82-.26.82-.58v-2.17c-3.34.72-4.04-1.4-4.04-1.4-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 5.8c1.02 0 2.05.14 3.01.4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z' },
    { name: 'Slack', path: 'M11.6 15c-1.8 0-3.3 1.5-3.3 3.3 0 1.8 1.5 3.3 3.3 3.3 1.8 0 3.3-1.5 3.3-3.3v-3.3h-3.3zm0-8.3c0 1.8-1.5 3.3-3.3 3.3h-3.3c-1.8 0-3.3-1.5-3.3-3.3S3.2 3.4 5 3.4h3.3c1.8 0 3.3 1.5 3.3 3.3v1.7zm6.7 5c0 1.8-1.5 3.3-3.3 3.3h-3.3V6.7h3.3c1.8 0 3.3 1.5 3.3 3.3v1.7z' },
  ]
  return (
    <section className="social">
      <div className="container social__inner">
        <span className="social__label">Trusted by high-velocity engineering teams</span>
        <div className="social__logos">
          {partners.map((p, i) => (
            <div key={i} className="social__logo" title={p.name}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="24"><path d={p.path} /></svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, desc }) {
  const cardRef = useRef(null)
  const handleMove = (e) => {
    const c = cardRef.current; if (!c) return
    const r = c.getBoundingClientRect()
    c.style.setProperty('--mx', `${e.clientX - r.left}px`)
    c.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const icons = {
    zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>,
    terminal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  }
  return (
    <motion.div ref={cardRef} className="feature__card" onMouseMove={handleMove}
      variants={staggerItem} whileHover={{ y: -5 }}>
      <div className="feature__card-glow" />
      <div className="feature__icon">{icons[icon]}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  )
}

function TestimonialCard({ t }) {
  return (
    <motion.div className="testimonial__card" variants={staggerItem}>
      <div className="testimonial__stars">
        {[...Array(5)].map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" fill="#f5a623" width="15"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        ))}
      </div>
      <p className="testimonial__quote">"{t.quote}"</p>
      <div className="testimonial__author">
        <img src={t.avatar} alt={t.name} loading="lazy" />
        <div><strong>{t.name}</strong><span>{t.role}</span></div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */

export default function App() {
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
      const top = el.getBoundingClientRect().top + window.scrollY - 70
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="app">
      <Nav {...{ scrolled, menuOpen, setMenuOpen, scrollTo }} />
      <Hero />
      <SocialProof />

      {/* Features */}
      <section id="features" className="section features">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">FEATURES</span>
              <h2 className="section__title">Everything you need to ship software</h2>
              <p className="section__desc">DevForge bundles CI/CD, real-time observability, and global routing in a single workspace.</p>
            </div>
          </ScrollReveal>
          <motion.div className="features__grid"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <motion.div className="stats__grid"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {STATS.map((s, i) => (
              <motion.div key={i} className="stats__card" variants={staggerItem}>
                <span className="stats__num"><AnimatedCounter value={s.value} suffix={s.suffix} /></span>
                <span className="stats__label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="section showcase">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">SHOWCASE</span>
              <h2 className="section__title">Crafted for modern teams</h2>
              <p className="section__desc">DevForge optimizes your workflow, offering perfect parity between local and production environments.</p>
            </div>
          </ScrollReveal>
          <div className="showcase__grid">
            <ScrollReveal variants={scaleIn} className="showcase__visual">
              <div className="showcase__glow" />
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80" alt="DevForge Dashboard" loading="lazy" />
            </ScrollReveal>
            <ScrollReveal className="showcase__content">
              <span className="showcase__tag">Ultimate Control</span>
              <h3>Declarative configurations</h3>
              <p>Model environment provisioning, build hooks, routes, and custom headers inside JavaScript files.</p>
              <div className="showcase__features">
                {[
                  { title: 'Instant Rollback', desc: 'Atomic history tracking. Revert to any build in under 2 seconds.' },
                  { title: 'Branch Previews', desc: 'Preview builds on every commit for developers and stakeholders.' },
                ].map((item, i) => (
                  <div key={i} className="showcase__feat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">TESTIMONIALS</span>
              <h2 className="section__title">Trusted by industry leaders</h2>
              <p className="section__desc">See how engineering teams use DevForge to accelerate delivery and improve reliability.</p>
            </div>
          </ScrollReveal>
          <motion.div className="testimonials__grid"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section pricing">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">PRICING</span>
              <h2 className="section__title">Simple, transparent pricing</h2>
              <p className="section__desc">No hidden fees. Cancel anytime. All plans include community support.</p>
            </div>
          </ScrollReveal>

          <div className="pricing__toggle">
            <span className={billing === 'monthly' ? 'is-active' : ''} onClick={() => setBilling('monthly')}>Monthly</span>
            <button className={`pricing__toggle-track${billing === 'yearly' ? ' is-yearly' : ''}`}
              onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')} aria-label="Toggle billing">
              <motion.div className="pricing__toggle-thumb" layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </button>
            <span className={billing === 'yearly' ? 'is-active' : ''} onClick={() => setBilling('yearly')}>
              Yearly <span className="pricing__badge">2 months free</span>
            </span>
          </div>

          <div className="pricing__grid">
            {PLANS.map((plan, i) => (
              <motion.div key={i} className={`pricing__card${plan.popular ? ' is-popular' : ''}`}
                variants={staggerItem} initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -6 }}>
                {plan.popular && <span className="pricing__popular-badge">Most Popular</span>}
                <h3 className="pricing__name">{plan.name}</h3>
                <div className="pricing__price">
                  <AnimatePresence mode="wait">
                    <motion.span className="pricing__value" key={billing}
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                      {plan.price}
                    </motion.span>
                  </AnimatePresence>
                  {plan.price !== 'Free' && <span className="pricing__period">/{billing === 'monthly' ? 'mo' : 'mo'}</span>}
                </div>
                <p className="pricing__desc">{plan.desc}</p>
                <ul className="pricing__features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.a href="#" className={`btn btn--block ${plan.popular ? 'btn--primary' : 'btn--outline'}`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={(e) => e.preventDefault()}>{plan.cta}</motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faq">
        <div className="container faq__container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__label">FAQ</span>
              <h2 className="section__title">Frequently asked questions</h2>
              <p className="section__desc">Can't find what you're looking for? Reach out to our support team.</p>
            </div>
          </ScrollReveal>
          <div className="faq__list">
            {FAQ.map((item, i) => (
              <motion.div key={i} className={`faq__item${activeFaq === i ? ' is-open' : ''}`}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <button className="faq__q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <motion.svg animate={{ rotate: activeFaq === i ? 180 : 0 }} viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div className="faq__a" initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta__inner">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Ready to ship faster?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.15 }}>
            Start for free. No credit card required. Deploy your first project in minutes.
          </motion.p>
          <motion.div className="cta__actions" initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <motion.a href="#" className="btn btn--white btn--lg"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={(e) => e.preventDefault()}>Start For Free</motion.a>
            <motion.a href="#" className="btn btn--ghost-white btn--lg"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={(e) => e.preventDefault()}>Talk to Sales</motion.a>
          </motion.div>
        </div>
        <div className="cta__glow" />
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#5e6ad2" />
              <path d="M7 15L11 19L21 9" stroke="#f7f8f8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div><span className="footer__logo-text">DevForge</span><span className="footer__tagline">Modern developer platform.</span></div>
          </div>
          <div className="footer__grid">
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'] },
              { title: 'Platform', links: ['API Reference', 'Documentation', 'SDKs', 'Status', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
            ].map((col, i) => (
              <div key={i} className="footer__col">
                <h4>{col.title}</h4>
                {col.links.map((l, j) => <a key={j} href="#">{l}</a>)}
              </div>
            ))}
            <div className="footer__col">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">GDPR</a>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© 2026 DevForge. All rights reserved.</span>
            <div className="footer__socials">
              {['GitHub', 'Twitter', 'LinkedIn', 'Discord'].map((s, i) => (
                <a key={i} href="#" aria-label={s}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
