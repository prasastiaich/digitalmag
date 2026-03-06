import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
    title: 'The Variable "H" - Bibliotheka',
    description: 'Explore the deep archive of Human Factors across various industries.',
};

export default function LibraryPage() {
    return (
        <>
            <Header />

            <main className="library-page">

                <section className="library-domain">
                    <div className="domain-intro">
                        <h2>The Medtech Archive</h2>
                        <p>
                            Navigating the complexities of patient safety, legacy device post-mortems, and the evolution of
                            regulatory design standards.
                        </p>
                    </div>
                    <div className="article-grid">
                        <Link href="/article/infusion-pump-crisis" className="article-card">
                            <h3 className="card-title">The Infusion Pump Crisis: A Study in Fatal Affordance</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 6 min</span>
                            </div>
                        </Link>
                        <Link href="/article/fda-draft-guidance-2024" className="article-card">
                            <h3 className="card-title">FDA Draft Guidance 2024: Moving Beyond the Formative</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 4 min</span>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="library-domain">
                    <div className="domain-intro">
                        <h2>The AI Frontier</h2>
                        <p>
                            Decoding the human-centric challenges of healthcare automation, algorithmic transparency, and the
                            future of hybrid intelligence.
                        </p>
                    </div>
                    <div className="article-grid">
                        <Link href="/article/black-box-robotic-surgery" className="article-card">
                            <h3 className="card-title">The &quot;Black Box&quot; Problem in Robotic Surgery</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 8 min</span>
                            </div>
                        </Link>
                        <Link href="/article/algorithmic-bias" className="article-card">
                            <h3 className="card-title">Algorithmic Bias: When ML Learns the Wrong Heuristics</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 5 min</span>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="library-domain">
                    <div className="domain-intro">
                        <h2>The Engineer&apos;s Bridge</h2>
                        <p>
                            Where physical hardware meets cognitive ergonomics; exploring the mechanical interfaces that define
                            human performance.
                        </p>
                    </div>
                    <div className="article-grid">
                        <Link href="/article/tactile-feedback-haptic" className="article-card">
                            <h3 className="card-title">Tactile Feedback in Haptic Actuators: A Review</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 12 min</span>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="library-domain">
                    <div className="domain-intro">
                        <h2>The Aviation Vault</h2>
                        <p>
                            Drawing from the gold standards of aerospace: Cockpit dynamics, Crew Resource Management, and
                            high-stakes error mitigation.
                        </p>
                    </div>
                    <div className="article-grid">
                        <Link href="/article/boeing-mcas-disaster" className="article-card">
                            <h3 className="card-title">The Boeing MCAS Disaster: A Human Factors Post-Mortem</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 15 min</span>
                            </div>
                        </Link>
                        <Link href="/article/crm-flight-protocols-er" className="article-card">
                            <h3 className="card-title">Crew Resource Management: Adapting Flight Protocols for the ER</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 7 min</span>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="library-domain">
                    <div className="domain-intro">
                        <h2>The Horizon</h2>
                        <p>
                            Exploring the universal &apos;H&apos; across emerging sectors, from nuclear resilience to the ethics of
                            human-robot interaction.
                        </p>
                    </div>
                    <div className="article-grid">
                        <Link href="/article/human-robot-teaming" className="article-card">
                            <h3 className="card-title">Human-Robot Teaming in Extreme Environments</h3>
                            <hr className="card-separator" />
                            <div className="card-meta">
                                <span>* Read Time: 9 min</span>
                            </div>
                        </Link>
                    </div>
                </section>

            </main>
        </>
    );
}
