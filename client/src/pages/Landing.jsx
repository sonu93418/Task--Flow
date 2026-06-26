import { Link } from 'react-router-dom';
import {
  IoCheckmarkCircle, IoLayersOutline, IoSparkles, IoShieldCheckmark,
  IoTrendingUp, IoPeopleOutline, IoCalendarOutline, IoArrowForward,
  IoFlashOutline, IoColorPaletteOutline, IoCodeSlash, IoStar,
  IoCheckmark, IoRocketOutline, IoBarChartOutline
} from 'react-icons/io5';
import ThemeToggle from '../components/UI/ThemeToggle';
import styles from './Landing.module.css';

const FEATURES = [
  {
    icon: <IoLayersOutline />,
    title: 'Kanban Boards',
    desc: 'Visualize your workflow across To Do, In Progress, and Done. Drag and drop tasks with fluid, real-time updates.',
    color: '#6366f1'
  },
  {
    icon: <IoSparkles />,
    title: 'AI Effort Estimation',
    desc: 'Powered by Google Gemini. Analyze task complexity and receive instant effort sizing, hour estimates, and due date recommendations.',
    color: '#e879a0'
  },
  {
    icon: <IoBarChartOutline />,
    title: 'Progress Analytics',
    desc: 'Track velocity, completion rates, and workload distribution with clear, actionable charts built directly into your dashboard.',
    color: '#10b981'
  },
  {
    icon: <IoShieldCheckmark />,
    title: 'Secure by Default',
    desc: 'JWT-based authentication with bcrypt password hashing. Your data is private, scoped, and never shared.',
    color: '#f59e0b'
  },
  {
    icon: <IoCalendarOutline />,
    title: 'Deadline Management',
    desc: 'Assign due dates, receive overdue alerts, and filter tasks by priority or status to stay ahead of every deadline.',
    color: '#8b5cf6'
  },
  {
    icon: <IoPeopleOutline />,
    title: 'Multi-Project Workspace',
    desc: 'Manage unlimited boards from a single unified dashboard. Each board is fully independent with its own tasks and analytics.',
    color: '#06b6d4'
  }
];

const STEPS = [
  {
    num: '01',
    title: 'Create a Board',
    desc: 'Sign up and create a project board in under 30 seconds. Name it, set a description, and your workspace is ready.',
  },
  {
    num: '02',
    title: 'Add and Organize Tasks',
    desc: 'Create tasks with titles, descriptions, priorities, and deadlines. Move them across columns as work progresses.',
  },
  {
    num: '03',
    title: 'Ship with Confidence',
    desc: 'Use AI suggestions for accurate effort estimates. Track progress with real-time analytics and hit every deadline.',
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

const TESTIMONIALS = [
  {
    text: "TaskFlow cut our sprint planning time in half. The AI estimation feature is genuinely accurate — it accounts for complexity in a way manual estimation never does.",
    name: "Arjun Mehta",
    role: "Engineering Lead",
    stars: 5
  },
  {
    text: "Clean interface, solid architecture, and the kanban drag-and-drop is buttery smooth. This is what modern project tooling should look like.",
    name: "Priya Sharma",
    role: "Product Designer",
    stars: 5
  },
  {
    text: "Deployed in minutes. The REST API is well-structured and the auth flow is production-ready out of the box. Exactly what I needed.",
    name: "Rohan Gupta",
    role: "Startup Founder",
    stars: 5
  }
];

export default function Landing() {
  return (
    <div className={styles.page}>

      {/* ── NAVBAR ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <div className={styles.navLogoMark}>
              <IoRocketOutline />
            </div>
            <span className={styles.navLogoText}>TaskFlow</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#tech" className={styles.navLink}>Tech Stack</a>
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
            <div className={styles.mockupBoard}>
              {[
                { col: 'To Do', color: '#6366f1', tasks: ['API rate limiting', 'Write unit tests'] },
                { col: 'In Progress', color: '#f59e0b', tasks: ['User dashboard'] },
                { col: 'Done', color: '#10b981', tasks: ['Database schema', 'JWT auth flow'] },
              ].map(col => (
                <div key={col.col} className={styles.mockupCol}>
                  <div className={styles.mockupColHeader}>
                    <span className={styles.mockupColDot} style={{background: col.color}} />
                    {col.col}
                  </div>
                  {col.tasks.map(t => (
                    <div key={t} className={styles.mockupCard}>
                      <div className={styles.mockupCardTitle}>{t}</div>
                      <div className={styles.mockupCardMeta}>
                        <span className={styles.mockupPriority}>medium</span>
                        <span className={styles.mockupDate}>Jul 4</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        <div className={styles.statsBarInner}>
          <div className={styles.statsBarItem}>
            <div className={styles.statsBarNum} style={{color:'#6366f1'}}>14</div>
            <div className={styles.statsBarLabel}>REST Endpoints</div>
          </div>
          <div className={styles.statsBarDivider} />
          <div className={styles.statsBarItem}>
            <div className={styles.statsBarNum} style={{color:'#14b8a6'}}>3</div>
            <div className={styles.statsBarLabel}>Kanban Columns</div>
          </div>
          <div className={styles.statsBarDivider} />
          <div className={styles.statsBarItem}>
            <div className={styles.statsBarNum} style={{color:'#ec4899'}}>AI</div>
            <div className={styles.statsBarLabel}>Gemini Powered</div>
          </div>
          <div className={styles.statsBarDivider} />
          <div className={styles.statsBarItem}>
            <div className={styles.statsBarNum} style={{color:'#f97316'}}>∞</div>
            <div className={styles.statsBarLabel}>Boards & Tasks</div>
          </div>
          <div className={styles.statsBarDivider} />
          <div className={styles.statsBarItem}>
            <div className={styles.statsBarNum} style={{color:'#f59e0b'}}>JWT</div>
            <div className={styles.statsBarLabel}>Secure Auth</div>
          </div>
        </div>
      </div>

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
            No complex setup. No steep learning curve. Create an account, build a board, and start shipping.
          </p>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={step.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
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

      {/* ── TESTIMONIALS ── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionTag} ${styles.sectionTagCoral}`}>Testimonials</div>
          <h2 className={styles.sectionTitle}>
            Trusted by <span className={styles.accentUnderlineCoral}>Developers & Teams</span>
          </h2>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {Array(t.stars).fill(0).map((_, i) => <IoStar key={i} style={{color:'#f59e0b'}} />)}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.name[0]}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
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
            <div className={styles.footerLogoMark}><IoRocketOutline /></div>
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