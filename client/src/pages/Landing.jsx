import { Link } from 'react-router-dom';
import {
  IoCheckmarkCircle, IoLayersOutline, IoSparkles, IoShieldCheckmark,
  IoTrendingUp, IoPeopleOutline, IoCalendarOutline, IoArrowForward,
  IoFlashOutline, IoColorPaletteOutline, IoCodeSlash, IoStar
} from 'react-icons/io5';
import styles from './Landing.module.css';

const FEATURES = [
  {
    icon: <IoLayersOutline />,
    title: 'Kanban Boards',
    desc: 'Organize tasks visually across To Do, In Progress, and Done columns with intuitive drag-and-drop.',
    color: '#6366f1'
  },
  {
    icon: <IoSparkles />,
    title: 'AI Effort Estimation',
    desc: 'Let Gemini AI analyze your tasks and suggest realistic effort sizes and due dates automatically.',
    color: '#e879a0'
  },
  {
    icon: <IoTrendingUp />,
    title: 'Progress Analytics',
    desc: 'Beautiful charts and stats to track your team\'s velocity and project completion rates.',
    color: '#10b981'
  },
  {
    icon: <IoShieldCheckmark />,
    title: 'Secure Auth',
    desc: 'JWT-based authentication ensures your data stays private and scoped to your account only.',
    color: '#f59e0b'
  },
  {
    icon: <IoCalendarOutline />,
    title: 'Due Date Tracking',
    desc: 'Set deadlines, get overdue alerts, and filter tasks by priority and completion status.',
    color: '#8b5cf6'
  },
  {
    icon: <IoPeopleOutline />,
    title: 'Multi-Board Projects',
    desc: 'Create unlimited boards for different projects, all from one clean, unified dashboard.',
    color: '#06b6d4'
  }
];

const STEPS = [
  {
    num: '01',
    title: 'Create Your Board',
    desc: 'Sign up and create a project board in seconds. Name it, and your Kanban workspace is ready.',
  },
  {
    num: '02',
    title: 'Add & Organize Tasks',
    desc: 'Add tasks with titles, descriptions, priorities, and due dates. Drag them across columns as work progresses.',
  },
  {
    num: '03',
    title: 'Let AI Guide You',
    desc: 'Use the AI Suggest button to get effort estimates and smart due dates. Accept or override — you decide.',
  }
];

const TECH = [
  { name: 'React 18', icon: <IoCodeSlash /> },
  { name: 'Node.js', icon: <IoFlashOutline /> },
  { name: 'MongoDB', icon: <IoLayersOutline /> },
  { name: 'Gemini AI', icon: <IoSparkles /> },
  { name: 'JWT Auth', icon: <IoShieldCheckmark /> },
  { name: 'Express.js', icon: <IoColorPaletteOutline /> },
];

const TESTIMONIALS = [
  {
    text: "TaskFlow transformed how I manage my freelance projects. The AI suggestions save me so much time estimating.",
    name: "Arjun Mehta",
    role: "Freelance Developer",
    stars: 5
  },
  {
    text: "Finally a task manager that looks as good as it works. The Kanban board is buttery smooth.",
    name: "Priya Sharma",
    role: "Product Designer",
    stars: 5
  },
  {
    text: "Deployed it in minutes. Clean API, solid auth, and the AI feature is genuinely useful.",
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
            <span className={styles.navLogoIcon}>🌸</span>
            <span className={styles.navLogoText}>TaskFlow</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#tech" className={styles.navLink}>Tech Stack</a>
          </div>
          <div className={styles.navActions}>
            <Link to="/login" className={styles.navLoginBtn}>Sign In</Link>
            <Link to="/register" className={styles.navRegisterBtn}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroBgOrb1} />
          <div className={styles.heroBgOrb2} />
          <div className={styles.heroBgOrb3} />
          <div className={styles.heroBgGrid} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <IoSparkles /> &nbsp; AI-Powered Task Management
          </div>
          <h1 className={styles.heroTitle}>
            Your Work,<br />
            <span className={styles.heroAccent}>Beautifully</span><br />
            Organized
          </h1>
          <p className={styles.heroSubtitle}>
            TaskFlow blends the elegance of Japanese minimalism with powerful project management.
            Kanban boards, AI estimates, real-time analytics — all in one stunning interface.
          </p>
          <div className={styles.heroCta}>
            <Link to="/register" className={styles.heroCtaPrimary}>
              Start for Free <IoArrowForward />
            </Link>
            <a href="#features" className={styles.heroCtaSecondary}>
              See Features
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>3</span>
              <span className={styles.heroStatLabel}>Kanban Columns</span>
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
              <span className={styles.mockupUrl}>localhost:5173 — TaskFlow</span>
            </div>
            <div className={styles.mockupBoard}>
              {[
                { col: 'To Do', color: '#6366f1', tasks: ['Design landing page', 'Write API docs'] },
                { col: 'In Progress', color: '#e879a0', tasks: ['Build Kanban UI'] },
                { col: 'Done', color: '#10b981', tasks: ['Set up MongoDB', 'JWT Auth'] },
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
                        <span className={styles.mockupDate}>Jun 30</span>
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
            <div className={styles.statsBarLabel}>API Endpoints</div>
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
          <div className={styles.sectionTag}>What's Included</div>
          <h2 className={styles.sectionTitle}>
            Everything You Need to <span className={styles.accentUnderlineIndigo}>Ship Faster</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A complete project management suite — built from scratch with a real backend, database, and AI.
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
          <div className={`${styles.sectionTag} ${styles.sectionTagAmber}`}>Simple Process</div>
          <h2 className={styles.sectionTitle}>
            Up and Running in <span className={styles.accentUnderlineAmber}>3 Steps</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            No complex setup. No steep learning curve. Just clean, intuitive project management.
          </p>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={step.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepConnector} style={{ opacity: i < STEPS.length - 1 ? 1 : 0 }} />
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
                Powered by Google Gemini
              </div>
              <h2 className={styles.sectionTitle} style={{textAlign:'left'}}>
                AI That Actually <span className={styles.accentUnderlinePink}>Helps You Plan</span>
              </h2>
              <p className={styles.aiDesc}>
                Stop guessing how long tasks will take. TaskFlow's built-in AI analyzes your task title
                and description, then suggests a realistic effort size (S/M/L), estimated hours, and a
                smart due date — all in under 2 seconds.
              </p>
              <ul className={styles.aiList}>
                {[
                  'Effort sizing: Small, Medium, or Large',
                  'Hour estimates based on task complexity',
                  'Smart due date suggestions',
                  'Reasoning explained in plain language',
                  'Accept or override — always your choice',
                ].map(item => (
                  <li key={item} className={styles.aiListItem}>
                    <IoCheckmarkCircle className={styles.aiCheck} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={styles.heroCtaPrimary} style={{display:'inline-flex', marginTop:'2rem'}}>
                Try AI Estimation Free <IoArrowForward />
              </Link>
            </div>
            <div className={styles.aiRight}>
              <div className={styles.aiMockup}>
                <div className={styles.aiMockupHeader}>
                  <IoSparkles style={{color:'#e879a0'}} />
                  <span>AI Estimate — Gemini</span>
                </div>
                <div className={styles.aiMockupTask}>
                  <div className={styles.aiMockupLabel}>Task</div>
                  <div className={styles.aiMockupValue}>"Build user authentication flow"</div>
                </div>
                <div className={styles.aiMockupGrid}>
                  <div className={styles.aiMockupMetric}>
                    <div className={styles.aiMockupMetricLabel}>Effort</div>
                    <div className={styles.aiMockupMetricValue} style={{color:'#f59e0b'}}>M</div>
                  </div>
                  <div className={styles.aiMockupMetric}>
                    <div className={styles.aiMockupMetricLabel}>Hours</div>
                    <div className={styles.aiMockupMetricValue} style={{color:'#e879a0'}}>8h</div>
                  </div>
                  <div className={styles.aiMockupMetric}>
                    <div className={styles.aiMockupMetricLabel}>Due Date</div>
                    <div className={styles.aiMockupMetricValue} style={{color:'#10b981', fontSize:'0.95rem'}}>Jun 28</div>
                  </div>
                </div>
                <div className={styles.aiMockupReasoning}>
                  💡 "User auth involves login, register, JWT tokens, and protected routes — a medium complexity feature typically completed in a sprint day."
                </div>
                <div className={styles.aiMockupActions}>
                  <button className={styles.aiMockupAccept}>✓ Accept Suggestion</button>
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
          <div className={`${styles.sectionTag} ${styles.sectionTagCyan}`}>Built With</div>
          <h2 className={styles.sectionTitle}>
            A Modern <span className={styles.accentUnderlineTeal}>Full-Stack</span> Architecture
          </h2>
          <p className={styles.sectionSubtitle}>
            Every layer is hand-crafted — no low-code, no shortcuts. Real REST API, real database, real auth.
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
              <div className={styles.archBoxItems}>React 18 · Vite · CSS Modules · React Router · Axios · @dnd-kit · Recharts</div>
            </div>
            <div className={styles.archArrow}>⟷</div>
            <div className={styles.archBox} style={{borderColor:'#10b98133', background:'#10b98108'}}>
              <div className={styles.archBoxTitle} style={{color:'#10b981'}}>Backend</div>
              <div className={styles.archBoxItems}>Node.js · Express · JWT · Bcrypt · Joi · MongoDB · Mongoose</div>
            </div>
            <div className={styles.archArrow}>⟷</div>
            <div className={styles.archBox} style={{borderColor:'#e879a033', background:'#e879a008'}}>
              <div className={styles.archBoxTitle} style={{color:'#e879a0'}}>AI Layer</div>
              <div className={styles.archBoxItems}>Google Gemini API · gemini-2.0-flash · Structured JSON output</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionTag} ${styles.sectionTagCoral}`}>Reviews</div>
          <h2 className={styles.sectionTitle}>
            Loved by <span className={styles.accentUnderlineCoral}>Developers</span> & Teams
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
        <div className={styles.ctaBg}>
          <div className={styles.ctaOrb1} />
          <div className={styles.ctaOrb2} />
        </div>
        <div className={styles.ctaContent}>
          <div className={styles.ctaEmoji}>🌸</div>
          <h2 className={styles.ctaTitle}>Start Organizing Today</h2>
          <p className={styles.ctaSubtitle}>
            Free forever. No credit card. Full-stack app running on your machine in minutes.
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
            <span>🌸</span>
            <span className={styles.footerLogoText}>TaskFlow</span>
          </div>
          <p className={styles.footerTagline}>
            Beautiful task management, inspired by Japanese minimalism.
          </p>
          <div className={styles.footerLinks}>
            <Link to="/login" className={styles.footerLink}>Sign In</Link>
            <Link to="/register" className={styles.footerLink}>Register</Link>
            <a href="#features" className={styles.footerLink}>Features</a>
            <a href="#tech" className={styles.footerLink}>Tech Stack</a>
          </div>
          <p className={styles.footerCopy}>
            © 2026 TaskFlow · Built with React, Node.js & MongoDB · Powered by Gemini AI
          </p>
        </div>
      </footer>

    </div>
  );
}
