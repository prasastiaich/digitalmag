'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function ContributePage() {
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setSending(true);

        const formData = new URLSearchParams(new FormData(e.target));

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });
            await res.json();
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            setSending(false);
        }
    }

    function handleReset() {
        setSubmitted(false);
    }

    return (
        <>
            <Header />
            <main className="contribute-page">
                <div className="form-container">
                    <h1 className="form-title">Join the Conversation</h1>
                    <p className="form-subtitle">Whether you have a story to tell or a question to ask, we&apos;re here to listen.</p>

                    {!submitted ? (
                        <form className="h-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" name="name" required placeholder="John Doe" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="designation">Current Designation</label>
                                <input type="text" id="designation" name="designation" required placeholder="e.g. UX Researcher" />
                                <span className="field-hint">Tell us about your professional background.</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <div className="select-wrapper">
                                    <select id="subject" name="subject" required defaultValue="">
                                        <option value="" disabled>Select an option</option>
                                        <option value="article">Article Submission</option>
                                        <option value="enquiry">Enquiry about page</option>
                                        <option value="donate">Want to donate</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <i className="custom-arrow"></i>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" rows="6" required placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="submit" className={`submit-button${sending ? ' deactivated' : ''}`} disabled={sending}>
                                {sending ? 'Sending...' : 'Submit Message'}
                            </button>

                            <p className="form-footer-note">
                                We value the &quot;H&quot; in every interaction. We will reach out within 3 business days.
                            </p>
                        </form>
                    ) : (
                        <div className="success-state">
                            <div className="success-icon">✓</div>
                            <h2>Message Sent Successfully!</h2>
                            <p>Thank you for reaching out. Your perspective matters to us.</p>
                            <p className="form-footer-note">
                                We value the &quot;H&quot; in every interaction. We will reach out within 3 business days.
                            </p>
                            <button className="secondary-button" onClick={handleReset}>Submit Another Message</button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
