import { Link } from 'react-router-dom';
import {
  IoCheckmarkCircle, IoLayersOutline, IoSparkles, IoShieldCheckmark,
  IoTrendingUp, IoPeopleOutline, IoCalendarOutline, IoArrowForward,
  IoFlashOutline, IoColorPaletteOutline, IoCodeSlash, IoStar,
  IoCheckmark, IoRocketOutline, IoBarChartOutline
} from 'react-icons/io5';
import ThemeToggle from '../components/UI/ThemeToggle';
import styles from './Landing.module.css';
import logoSvg from '../assets/logo.svg';
import workflowDemo from '../assets/workflow_demo.webp';
import stepCreateBoard from '../assets/step_create_board.png';
import stepOrganizeTasks from '../assets/step_organize_tasks.png';
import stepShipAi from '../assets/step_ship_ai.png';

const FEATURES = [
  {
    icon: <IoLayersOutline />,
    title: 'Fluid Kanban Boards',
    desc: 'Visualize your sprints across custom workflows. Drag and drop tasks with high-fidelity, real-time visual feedback.',
    color: '#6366f1'
  },
  {
    icon: <IoSparkles />,
    title: 'Gemini AI Sizing',
    desc: 'Get instant, context-aware effort estimates, complexity mapping, and hour projections powered by Google Gemini.',
    color: '#e879a0'
  },
  {
    icon: <IoBarChartOutline />,
    title: 'Velocity Analytics',
    desc: 'Track workspace completion velocity and project load metrics with clean, interactive charts rendered in real time.',
    color: '#10b981'
  }
];

const STEPS = [
  {
    num: '01',
    image: stepCreateBoard,
    title: 'Create a Board',
    desc: 'Sign up and build your workspace in under 30 seconds. Define your project scope and organize your sprints instantly.',
  },
  {
    num: '02',
    image: stepOrganizeTasks,
    title: 'Organize Tasks',
    desc: 'Create, edit, and track tasks dynamically on your Kanban board. Customize priorities, assign dates, and drag items smoothly.',
  },
  {
    num: '03',
    image: stepShipAi,
    title: 'Ship with AI Sizing',
    desc: 'Leverage Gemini AI estimation models to dynamically size tasks, calibrate development hours, and hit deadlines with confidence.',
  }
];

const TECH = [
  { name: 'React 19', icon: <IoCodeSlash /> },
  { name: 'Node.js', icon: <IoFlashOutline /> },
  { name: 'MongoDB', icon: <IoLayersOutline /> },
  { name: 'Gemini AI', icon: <IoSparkles /> },
  { name: 'JWT Auth', icon: <IoShieldCheckmark /> },
  { name: 'Express.js', icon: <IoColorPaletteOutline /> },
];

export default function Landing() {
  return (
    <div className={styles.page}>

      {/* ── NAVBAR ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <img src={logoSvg} className={styles.navLogoImg} alt="TaskFlow" />
            <span className={styles.navLogoText}>TaskFlow</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#tech" className={styles.navLink}>Architecture</a>
          </div>
          <div className={styles.navActions}>
            <ThemeToggle />
            <Link to="/login" className={styles.navLoginBtn}>Sign In</Link>
            <Link to="/register" className={styles.navRegisterBtn}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <IoSparkles /> &nbsp; Powered by Google Gemini AI
          </div>
          <h1 className={styles.heroTitle}>
            Project Management<br />
            <span className={styles.heroAccent}>Built for Teams</span><br />
            That Ship.
          </h1>
          <p className={styles.heroSubtitle}>
            TaskFlow is a full-stack project management platform with Kanban boards,
            AI-powered effort estimation, real-time analytics, and secure team workspaces.
            Everything you need to plan, track, and deliver — in one place.
          </p>
          <div className={styles.heroCta}>
            <Link to="/register" className={styles.heroCtaPrimary}>
              Start Free Today <IoArrowForward />
            </Link>
            <a href="#features" className={styles.heroCtaSecondary}>
              Explore Features
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>14</span>
              <span className={styles.heroStatLabel}>API Endpoints</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>∞</span>
              <span className={styles.heroStatLabel}>Boards & Tasks</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>AI</span>
              <span className={styles.heroStatLabel}>Smart Estimates</span>
            </div>
          </div>
        </div>

        {/* Hero mockup */}
        <div className={styles.heroMockup}>
          <div className={styles.mockupWindow}>
            <div className={styles.mockupBar}>
              <span className={styles.mockupDot} style={{background:'#ff5f57'}} />
              <span className={styles.mockupDot} style={{background:'#febc2e'}} />
              <span className={styles.mockupDot} style={{background:'#28c840'}} />
              <span className={styles.mockupUrl}>app.taskflow.io — Kanban Board</span>
            </div>
            <div className={styles.mockupVideoWrapper}>
              <img src={workflowDemo} className={styles.mockupVideo} alt="TaskFlow Workflow Demo" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>Core Features</div>
          <h2 className={styles.sectionTitle}>
            The Full Stack. <span className={styles.accentUnderlineIndigo}>No Shortcuts.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A complete project management platform built from scratch — real backend, real database, real AI. No abstractions, no low-code.
          </p>
          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: f.color + '18', color: f.color }}>
                  {f.icon}
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionTag} ${styles.sectionTagAmber}`}>Workflow</div>
          <h2 className={styles.sectionTitle}>
            Up and Running in <span className={styles.accentUnderlineAmber}>3 Steps</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A streamlined project workspace designed to get your team building immediately without overhead.
          </p>
          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.num} className={styles.stepCard}>
                <div className={styles.stepImageWrapper}>
                  <img src={step.image} className={styles.stepImage} alt={step.title} />
                </div>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>{step.num}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURE HIGHLIGHT ── */}
      <section className={styles.aiSection}>
        <div className={styles.sectionInner}>
          <div className={styles.aiContent}>
            <div className={styles.aiLeft}>
              <div className={`${styles.sectionTag} ${styles.sectionTagPink}`}>
                AI Estimation Engine
              </div>
              <h2 className={styles.sectionTitle} style={{textAlign:'left'}}>
                Stop Guessing.<br /><span className={styles.accentUnderlinePink}>Start Shipping.</span>
              </h2>
              <p className={styles.aiDesc}>
                TaskFlow's AI engine — powered by Google Gemini — analyzes your task title and description,
                then returns a structured estimate: effort size, expected hours, and a recommended due date.
                All in under 2 seconds. Accept it or override it — you remain in control.
              </p>
              <ul className={styles.aiList}>
                {[
                  'Effort sizing: Small, Medium, or Large',
                  'Hour estimates calibrated to task complexity',
                  'Smart due date recommendations',
                  'Plain-language reasoning for every suggestion',
                  'One-click accept or manual override',
                ].map(item => (
                  <li key={item} className={styles.aiListItem}>
                    <IoCheckmarkCircle className={styles.aiCheck} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={styles.heroCtaPrimary} style={{display:'inline-flex', marginTop:'2rem'}}>
                Try AI Estimation <IoArrowForward />
              </Link>
            </div>
            <div className={styles.aiRight}>
              <div className={styles.aiMockup}>
                <div className={styles.aiMockupHeader}>
                  <IoSparkles style={{color:'#e879a0'}} />
                  <span>AI Analysis — Gemini 2.0 Flash</span>
                </div>
                <div className={styles.aiMockupTask}>
                  <div className={styles.aiMockupLabel}>Task</div>
                  <div className={styles.aiMockupValue}>"Implement user authentication flow"</div>
                </div>
                <div className={styles.aiMockupGrid}>
                  <div className={styles.aiMockupMetric}>
                    <div className={styles.aiMockupMetricLabel}>Effort</div>
                    <div className={styles.aiMockupMetricValue} style={{color:'#f59e0b'}}>M</div>
                  </div>
                  <div className={styles.aiMockupMetric}>
                    <div className={styles.aiMockupMetricLabel}>Est. Hours</div>
                    <div className={styles.aiMockupMetricValue} style={{color:'#e879a0'}}>8h</div>
                  </div>
                  <div className={styles.aiMockupMetric}>
                    <div className={styles.aiMockupMetricLabel}>Due Date</div>
                    <div className={styles.aiMockupMetricValue} style={{color:'#10b981', fontSize:'0.95rem'}}>Jul 4</div>
                  </div>
                </div>
                <div className={styles.aiMockupReasoning}>
                  "Authentication requires login, registration, JWT issuance, refresh logic, and protected routes — medium complexity, typically a day of focused development."
                </div>
                <div className={styles.aiMockupActions}>
                  <button className={styles.aiMockupAccept}>
                    <IoCheckmark /> Accept Estimate
                  </button>
                  <button className={styles.aiMockupDismiss}>Edit Manually</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section id="tech" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionTag} ${styles.sectionTagCyan}`}>Architecture</div>
          <h2 className={styles.sectionTitle}>
            A Modern, <span className={styles.accentUnderlineTeal}>Production-Grade</span> Stack
          </h2>
          <p className={styles.sectionSubtitle}>
            Every layer is engineered for reliability. Real REST API, document database, token-based auth, and an AI integration layer — built without shortcuts.
          </p>
          <div className={styles.techGrid}>
            {TECH.map(t => (
              <div key={t.name} className={styles.techCard}>
                <span className={styles.techIcon}>{t.icon}</span>
                <span className={styles.techName}>{t.name}</span>
              </div>
            ))}
          </div>
          <div className={styles.archDiagram}>
            <div className={styles.archBox} style={{borderColor:'#6366f133', background:'#6366f108'}}>
              <div className={styles.archBoxTitle} style={{color:'#6366f1'}}>Frontend</div>
              <div className={styles.archBoxItems}>React 19 · Vite · CSS Modules · React Router · Axios · @dnd-kit · Recharts</div>
            </div>
            <div className={styles.archArrow}>⟷</div>
            <div className={styles.archBox} style={{borderColor:'#10b98133', background:'#10b98108'}}>
              <div className={styles.archBoxTitle} style={{color:'#10b981'}}>Backend</div>
              <div className={styles.archBoxItems}>Node.js · Express · JWT · Bcrypt · Joi Validation · MongoDB · Mongoose</div>
            </div>
            <div className={styles.archArrow}>⟷</div>
            <div className={styles.archBox} style={{borderColor:'#e879a033', background:'#e879a008'}}>
              <div className={styles.archBoxTitle} style={{color:'#e879a0'}}>AI Layer</div>
              <div className={styles.archBoxItems}>Google Gemini API · gemini-2.0-flash · Structured JSON output · Prompt engineering</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaBadge}>
            <IoCheckmark /> Free to Use · No Credit Card Required
          </div>
          <h2 className={styles.ctaTitle}>Ready to Take Control<br />of Your Projects?</h2>
          <p className={styles.ctaSubtitle}>
            Create an account in seconds. Build your first board, add tasks, and let AI handle the estimation.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.ctaPrimaryBtn}>
              Create Free Account <IoArrowForward />
            </Link>
            <Link to="/login" className={styles.heroCtaSecondary}>
              Sign In Instead
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <img src={logoSvg} className={styles.footerLogoImg} alt="TaskFlow" />
            <span className={styles.footerLogoText}>TaskFlow</span>
          </div>
          <p className={styles.footerTagline}>
            Professional project management for modern development teams.
          </p>
          <div className={styles.footerLinks}>
            <Link to="/login" className={styles.footerLink}>Sign In</Link>
            <Link to="/register" className={styles.footerLink}>Register</Link>
            <a href="#features" className={styles.footerLink}>Features</a>
            <a href="#tech" className={styles.footerLink}>Architecture</a>
          </div>
          <p className={styles.footerCopy}>
            © 2026 TaskFlow · Built with React 19, Node.js & MongoDB · Powered by Google Gemini AI
          </p>
        </div>
      </footer>

    </div>
  );
}