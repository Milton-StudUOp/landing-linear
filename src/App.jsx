import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

/* ── Counter hook ─────────────────────────────────── */
function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(!startOnView)
  const ref = useRef(null)

  useEffect(() => {
    if (!startOnView) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [startOnView])

  useEffect(() => {
    if (!started) return
    let startTime = null
    const step = (now) => {
      if (!startTime) startTime = now
      const progress = Math.min((now - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, end, duration])

  return { count, ref }
}

/* ── Pricing toggle ────────────────────────────────── */
const plans = [
  { name: 'Starter', monthly: 'Grátis', yearly: 'Grátis', desc: 'Para projetos pessoais e experimentação.', features: ['3 projetos', '1GB armazenamento', 'Comunidade', 'Analytics básico'] },
  { name: 'Pro', monthly: 'R$49', yearly: 'R$39', desc: 'Para times e startups em crescimento.', features: ['Projetos ilimitados', '50GB armazenamento', 'Suporte prioritário', 'Analytics avançado', 'API completa', 'Deploy automatizado'], popular: true },
  { name: 'Enterprise', monthly: 'R$199', yearly: 'R$159', desc: 'Para organizações com demandas críticas.', features: ['Tudo do Pro', 'Armazenamento ilimitado', 'SLA 99.99%', 'Gerente dedicado', 'On-premise opcional', 'SSO & RBAC'] },
]

/* ── Testimonials ──────────────────────────────────── */
const testimonials = [
  { name: 'Ana Silva', role: 'CTO, TechNova', avatar: 'AS', text: 'DevForge transformou nosso pipeline de deploy. Reduzimos o tempo de release de dias para minutos.' },
  { name: 'Lucas Mendes', role: 'Lead Developer, DataFlow', avatar: 'LM', text: 'A precisão das ferramentas de análise é impressionante. Finalmente confiamos 100% nos dados.' },
  { name: 'Carla Oliveira', role: 'Engenheira de Software, CloudFlex', avatar: 'CO', text: 'A interface é tão limpa quanto o Linear. Cada detalhe foi pensado para produtividade máxima.' },
]

/* ── Integrations ──────────────────────────────────── */
const integrations = [
  'Vercel', 'Railway', 'Supabase', 'PlanetScale', 'Render', 'Neon',
  'Cloudflare', 'AWS', 'Fly.io', 'Netlify'
]

/* ── Nav ────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#5e6ad2" />
            <path d="M8 14L12 18L20 10" stroke="#f7f8f8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>DevForge</span>
        </a>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <a href="#features">Funcionalidades</a>
          <a href="#pricing">Preços</a>
          <a href="#testimonials">Depoimentos</a>
          <a href="#footer">Contato</a>
        </div>

        <div className="nav-actions">
          <a href="#" className="btn btn-ghost">Entrar</a>
          <a href="#" className="btn btn-primary">Começar grátis</a>
        </div>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`hamb ${open ? 'active' : ''}`}><span></span><span></span><span></span></span>
        </button>
      </div>
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}
    </nav>
  )
}

/* ── Hero ────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bg-glow" />
      <div className="container hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Agora em beta público
        </div>
        <h1 className="hero-title">
          Construa produtos <span className="text-gradient">extraordinários</span>
        </h1>
        <p className="hero-subtitle">
          DevForge é a plataforma de desenvolvimento que transforma ideias em software com velocidade,
          precisão e elegância. Do protótipo à produção, em um só lugar.
        </p>
        <div className="hero-actions">
          <a href="#" className="btn btn-primary btn-lg">Começar grátis</a>
          <a href="#" className="btn btn-outline btn-lg">Ver demo</a>
        </div>
        <div className="hero-stats-mini">
          <span><strong>10k+</strong> desenvolvedores</span>
          <span className="dot">·</span>
          <span><strong>500+</strong> empresas</span>
          <span className="dot">·</span>
          <span><strong>99.9%</strong> uptime</span>
        </div>
      </div>
    </section>
  )
}

/* ── Features ────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Deploy em um clique',
    desc: 'Conecte seu repositório e publique automaticamente em qualquer nuvem. Builds paralelos e rollback instantâneo.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: 'Analytics em tempo real',
    desc: 'Métricas de performance, erros e uso dos seus serviços com dashboards customizáveis e alertas inteligentes.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: 'Ambientes isolados',
    desc: 'Preview environments automáticos para cada branch. Teste em produção antes de fazer merge.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Pipeline visual',
    desc: 'Construa CI/CD com uma interface drag-and-drop. Sem YAML, sem complexidade desnecessária.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
    title: 'Métricas de performance',
    desc: 'Monitore latency, throughput e erros de cada endpoint. Trace requests completos com OpenTelemetry.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Automação inteligente',
    desc: 'Regras de automação baseadas em eventos. Escale recursos, dispare notificações e execute scripts.',
  },
]

function Features() {
  return (
    <section id="features" className="section features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Tudo que você precisa para construir</h2>
          <p className="section-subtitle">
            Uma plataforma completa com ferramentas precisas para times de desenvolvimento modernos.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Stats ────────────────────────────────────────────── */
function Stats() {
  const { count: projects, ref: projectsRef } = useCountUp(12453, 2500)
  const { count: developers, ref: devsRef } = useCountUp(10780, 2500)
  const { count: deploys, ref: deploysRef } = useCountUp(892341, 3000)
  const { count: companies, ref: compsRef } = useCountUp(523, 2000)

  return (
    <section className="section stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card" ref={projectsRef}>
            <span className="stat-number">{projects.toLocaleString()}+</span>
            <span className="stat-label">Projetos criados</span>
          </div>
          <div className="stat-card" ref={devsRef}>
            <span className="stat-number">{developers.toLocaleString()}+</span>
            <span className="stat-label">Desenvolvedores</span>
          </div>
          <div className="stat-card" ref={deploysRef}>
            <span className="stat-number">{deploys.toLocaleString()}+</span>
            <span className="stat-label">Deploys realizados</span>
          </div>
          <div className="stat-card" ref={compsRef}>
            <span className="stat-number">{companies}+</span>
            <span className="stat-label">Empresas confiam</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Integrations ────────────────────────────────────── */
function Integrations() {
  return (
    <section className="section integrations-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Integrações nativas</h2>
          <p className="section-subtitle">Conecte-se com as ferramentas que você já usa no seu dia a dia.</p>
        </div>
        <div className="integrations-bar">
          {integrations.map((name, i) => (
            <div key={i} className="integration-chip">{name}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Code Preview ─────────────────────────────────────── */
const codeExample = `// deploy.config.js
import { defineConfig } from 'devforge'

export default defineConfig({
  project: 'meu-app',
  region: 'sao-paulo',
  framework: 'react',
  build: {
    command: 'npm run build',
    output: 'dist',
  },
  env: {
    NODE_VERSION: '20',
  },
  // Preview environments automáticos
  preview: {
    enabled: true,
    autoDelete: true,
  },
})`

function CodePreview() {
  return (
    <section className="section code-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Configuração declarativa</h2>
          <p className="section-subtitle">Menos boilerplate, mais código que importa. Configure tudo com poucas linhas.</p>
        </div>
        <div className="code-panel">
          <div className="code-header">
            <div className="code-dots">
              <span className="dot-red" /><span className="dot-yellow" /><span className="dot-green" />
            </div>
            <span className="code-filename">deploy.config.js</span>
          </div>
          <pre className="code-body"><code>{codeExample}</code></pre>
        </div>
      </div>
    </section>
  )
}

/* ── Testimonials ────────────────────────────────────── */
function Testimonials() {
  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">O que nossos usuários dizem</h2>
          <p className="section-subtitle">Milhares de desenvolvedores já transformaram seus workflows com DevForge.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-avatar">{t.avatar}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Pricing ──────────────────────────────────────────── */
function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="section pricing-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Preços simples e previsíveis</h2>
          <p className="section-subtitle">Escolha o plano ideal para o seu time. Sem taxas escondidas.</p>
        </div>

        <div className="pricing-toggle">
          <span className={!yearly ? 'active' : ''}>Mensal</span>
          <button className={`toggle-track ${yearly ? 'yearly' : ''}`} onClick={() => setYearly(!yearly)} aria-label="Alternar periodicidade">
            <span className="toggle-thumb" />
          </button>
          <span className={yearly ? 'active' : ''}>
            Anual <span className="save-badge">Economize 20%</span>
          </span>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <span className="popular-badge">Mais popular</span>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-value">{yearly ? plan.yearly : plan.monthly}</span>
                {plan.name !== 'Starter' && <span className="price-period">/{yearly ? 'mês' : 'mês'}</span>}
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <ul className="plan-features">
                {plan.features.map((feat, j) => (
                  <li key={j}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8l3 3 5-6" stroke="#5e6ad2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <a href="#" className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                {plan.name === 'Starter' ? 'Começar grátis' : 'Assinar agora'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#" className="nav-logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#5e6ad2" />
              <path d="M8 14L12 18L20 10" stroke="#f7f8f8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>DevForge</span>
          </a>
          <p className="footer-desc">Plataforma de desenvolvimento moderna para times que querem construir produtos extraordinários.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Produto</h4>
            <a href="#">Funcionalidades</a>
            <a href="#">Preços</a>
            <a href="#">Changelog</a>
            <a href="#">Status</a>
          </div>
          <div className="footer-col">
            <h4>Recursos</h4>
            <a href="#">Documentação</a>
            <a href="#">API</a>
            <a href="#">Blog</a>
            <a href="#">Comunidade</a>
          </div>
          <div className="footer-col">
            <h4>Empresa</h4>
            <a href="#">Sobre</a>
            <a href="#">Carreiras</a>
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} DevForge. Todos os direitos reservados.</p>
        <div className="footer-social">
          <a href="#" aria-label="GitHub"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="1.5"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg></a>
          <a href="#" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="1.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg></a>
          <a href="#" aria-label="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg></a>
        </div>
      </div>
    </footer>
  )
}

/* ── App ──────────────────────────────────────────────── */
function App() {
  return (
    <div className="app">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Integrations />
        <CodePreview />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

export default App