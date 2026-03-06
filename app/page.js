import Header from '@/components/Header';

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="newspaper-content">
        <div className="article-section">
          <h1 className="article-title">Why does The Variable &apos;H&apos; exist?</h1>
          <div className="article-columns">
            <p>
              The variable H exists for people who want to explore the world of Human Factors, a rigorous blend of
              psychology and engineering. It is about looking at the human experience through a technical lens,
              and at the technical through a human one.
            </p>
            <p>
              In every complex system, the &quot;H&quot; is the most vital, resilient, and sophisticated component. While
              traditional metrics often focus on mechanical reliability, we recognize that human adaptability is
              the true safeguard of any high-stakes environment. This digital space has been a vision of mine
              because of the current high barrier of entry to the field. Despite its critical importance in
              medtech, aviation, and AI, a lack of widespread awareness has left many talented minds on the
              outside looking in.
            </p>
            <p>
              We are bringing the &quot;hidden&quot; science of safety and usability to the forefront, for the next
              generation of human factors applicators. Our goal is to create a space to learn, understand, and
              someday contribute to an ecosystem that values every human. Whether we are analyzing a decade-old
              medical device failure or the nuances of AI-driven healthcare, our focus remains on the person at
              the &quot;sharp end&quot; of the tool.
            </p>
            <p>
              We are all the &quot;H&quot; variables that contribute to the systems of tomorrow. By understanding ourselves,
              we engineer a more resilient future.
            </p>
          </div>
        </div>
        <div className="image-section">
          <img src="/assets/hero-image.svg" alt="The Variable H Graphic" className="hero-image" />
        </div>
      </main>

      {/* Nodes of Interaction */}
      <section className="nodes-section">
        <hr className="newspaper-separator" />
        <div className="nodes-intro">
          <h2>The Nodes of Interaction</h2>
          <p>We explore the &quot;H&quot; across the most safety-critical domains of our time.</p>
        </div>

        <div className="schematic-container">
          {/* Background wiring */}
          <div className="circuit-wiring">
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="circuit-lines">
              <path className="connection-line" d="M 500,340 L 250,150"></path>
              <path className="connection-line" d="M 500,340 L 750,150"></path>
              <path className="connection-line" d="M 500,340 L 250,650"></path>
              <path className="connection-line" d="M 500,340 L 750,650"></path>
              <path className="connection-line" d="M 500,340 L 500,900"></path>
            </svg>
          </div>

          <div className="center-node">
            <div className="node-icon">H</div>
          </div>

          <div className="schematic-card card-1">
            <h3>1. The Medtech Archive</h3>
            <span className="focus-label">Focus: Patient Safety &amp; Regulatory Wisdom</span>
            <p>
              We look back to move forward. By analyzing <strong>legacy systems</strong> and <strong>historical
                case studies</strong>, we uncover the root causes of device failure. From the evolution of
              surgical interfaces to the &quot;Swiss Cheese Model&quot; of medical errors, we bridge the gap between
              regulatory requirements and real-world clinical use.
            </p>
            <a href="/contribute" className="card-trigger">Have a story from this sector? [Submit a case]</a>
          </div>

          <div className="schematic-card card-2">
            <h3>2. The AI Frontier</h3>
            <span className="focus-label">Focus: Algorithmic Trust &amp; Hybrid Intelligence</span>
            <p>
              As healthcare automates, the role of the human shifts but remains central. We apply a Human Factors
              lens to <strong>Algorithmic Bias</strong>, <strong>Human-in-the-Loop</strong> systems, and the
              &quot;Black Box&quot; problem. How do clinicians maintain situational awareness when an AI is making the
              diagnosis?
            </p>
            <a href="/contribute" className="card-trigger">Have a story from this sector? [Submit a case]</a>
          </div>

          <div className="schematic-card card-3">
            <h3>3. The Engineer&apos;s Bridge</h3>
            <span className="focus-label">Focus: Hardware, Ergonomics &amp; Physicality</span>
            <p>
              The point where metal meets muscle. This node explores the <strong>Mechanical Engineer&apos;s
                perspective</strong>, focusing on physical ergonomics, control-display integration, and the
              tactile feedback of hardware. It&apos;s about the physics of interaction and the mechanical interfaces
              that dictate human performance.
            </p>
            <a href="/contribute" className="card-trigger">Have a story from this sector? [Submit a case]</a>
          </div>

          <div className="schematic-card card-4">
            <h3>4. The Aviation Vault</h3>
            <span className="focus-label">Focus: High-Stakes Cockpit Dynamics &amp; CRM</span>
            <p>
              Aviation is the birthplace of modern Human Factors. We examine flight deck design, <strong>Crew
                Resource Management (CRM)</strong>, and how pilots manage cognitive load during emergencies. We
              translate these aerospace &quot;Gold Standards&quot; into lessons for every other technical industry.
            </p>
            <a href="/contribute" className="card-trigger">Have a story from this sector? [Submit a case]</a>
          </div>

          <div className="schematic-card card-5">
            <h3>5. The Horizon</h3>
            <span className="focus-label">Focus: Cross-Industry Resilience</span>
            <p>
              The &quot;H&quot; variable is universal. We look toward emerging sectors like <strong>Nuclear Safety</strong>,
              <strong>Autonomous Transport</strong>, and <strong>Human-Robot Interaction</strong>, proving that
              whether you are on the ground or in the air, the principles of human-centric design remain the same.
            </p>
            <a href="/contribute" className="card-trigger">Have a story from this sector? [Submit a case]</a>
          </div>
        </div>
      </section>
    </>
  );
}
