'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import {
    doc, getDoc, setDoc, updateDoc, onSnapshot, deleteDoc,
    collection, addDoc, query, orderBy, serverTimestamp,
    deleteField
} from 'firebase/firestore';

// Article metadata lookup
const ARTICLES = {
    'infusion-pump-crisis': {
        title: 'The Infusion Pump Crisis: A Study in Fatal Affordance',
        readTime: '6 min',
        category: 'The Medtech Archive',
        content: [
            { type: 'p', text: '<strong>This is a placeholder for the article body.</strong> When the actual content is written, it will go here. The text will flow naturally, maintaining an optimal line length for reading comfort.' },
            { type: 'p', text: "Human error is rarely a spontaneous event; it is almost always the inevitable endpoint of a system designed without the human in mind. In the high-stakes environment of an intensive care unit, where cognitive load is immense and alarms are ubiquitous, the design of a device interface isn't just a matter of convenience—it is a matter of life or death." },
            { type: 'h2', text: 'The Interface Flaw' },
            { type: 'p', text: 'Consider the interface. The contrast ratio of the screen, the haptic feedback of the buttons, the grouping of critical controls—all these variables dictate whether a tired nurse will confidently enter 1.5 mg or mistakenly enter 15 mg into the system.' },
        ],
    },
};

function getArticleMeta(slug) {
    if (ARTICLES[slug]) return ARTICLES[slug];
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return { title, readTime: '5 min', category: 'General', content: [{ type: 'p', text: 'Article content coming soon.' }] };
}

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug;
    const article = getArticleMeta(slug);
    const { user, isAdmin, signIn } = useAuth();

    // ---- Voting State ----
    const [userVote, setUserVote] = useState(null);
    const [voteAnim, setVoteAnim] = useState(null); // 'up' | 'down' | null

    // ---- Comments State ----
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [posting, setPosting] = useState(false);

    // Real-time vote listener
    useEffect(() => {
        const voteRef = doc(db, 'articles', slug);
        const unsub = onSnapshot(voteRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                if (user) {
                    setUserVote(data.voters?.[user.uid] || null);
                }
            }
        });
        return () => unsub();
    }, [slug, user]);

    // Real-time comments listener
    useEffect(() => {
        const commentsRef = collection(db, 'articles', slug, 'comments');
        const q = query(commentsRef, orderBy('timestamp', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const list = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setComments(list);
        });
        return () => unsub();
    }, [slug]);

    // Cast vote with animation
    async function castVote(type) {
        if (!user) { signIn(); return; }

        // Trigger animation
        setVoteAnim(type);
        setTimeout(() => setVoteAnim(null), 700);

        const voteRef = doc(db, 'articles', slug);
        const snap = await getDoc(voteRef);

        if (!snap.exists()) {
            await setDoc(voteRef, {
                voters: { [user.uid]: type },
            });
            return;
        }

        const data = snap.data();
        const currentVote = data.voters?.[user.uid] || null;
        const updates = {};

        if (currentVote === type) {
            updates[`voters.${user.uid}`] = deleteField();
        } else {
            updates[`voters.${user.uid}`] = type;
        }

        await updateDoc(voteRef, updates);
    }

    // Delete comment (admin only)
    async function deleteComment(commentId) {
        if (!isAdmin) return;
        if (!confirm('Delete this comment?')) return;
        try {
            await deleteDoc(doc(db, 'articles', slug, 'comments', commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
            alert('Could not delete comment.');
        }
    }

    // Post comment
    async function handleCommentSubmit(e) {
        e.preventDefault();
        if (!user) { signIn(); return; }
        if (!commentText.trim()) return;

        setPosting(true);
        try {
            const commentsRef = collection(db, 'articles', slug, 'comments');
            await addDoc(commentsRef, {
                authorName: user.displayName || 'Anonymous',
                authorUid: user.uid,
                authorPhoto: user.photoURL || '',
                text: commentText.trim(),
                timestamp: serverTimestamp(),
            });
            setCommentText('');
        } catch (err) {
            console.error('Failed to post comment:', err);
            alert('Could not post comment. Please try again.');
        } finally {
            setPosting(false);
        }
    }

    return (
        <>
            <Header />
            <main className="article-page">
                <nav className="breadcrumbs">
                    <Link href="/">Home</Link> &gt; <Link href="/library">Library</Link> &gt; <span>{article.title.split(':')[0]}</span>
                </nav>

                <article className="reading-container">
                    <header className="article-header">
                        <h1 className="story-title">{article.title}</h1>
                        <div className="story-meta">
                            <span className="meta-item">* Read Time: {article.readTime}</span>
                            <span className="meta-item">* Category: {article.category}</span>
                        </div>
                    </header>

                    <div className="story-content">
                        {article.content.map((block, i) => {
                            if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
                            return <p key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
                        })}
                    </div>

                    {/* Voting — Simple Arrows */}
                    <div className="vote-arrows">
                        <button
                            className={`vote-arrow-btn vote-arrow-up${userVote === 'up' ? ' voted' : ''}${voteAnim === 'up' ? ' anim-burst' : ''}`}
                            onClick={() => castVote('up')}
                            aria-label="Upvote this article"
                        >
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                        </button>

                        <button
                            className={`vote-arrow-btn vote-arrow-down${userVote === 'down' ? ' voted' : ''}${voteAnim === 'down' ? ' anim-shake' : ''}`}
                            onClick={() => castVote('down')}
                            aria-label="Downvote this article"
                        >
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                </article>

                {/* Comments */}
                <section className="comments-section">
                    <div className="comments-header">
                        <h2 className="comments-title">Discussion</h2>
                        <span className="comment-count-badge">
                            {comments.length === 1 ? '1 comment' : `${comments.length} comments`}
                        </span>
                    </div>

                    {user ? (
                        <form className="comment-form" onSubmit={handleCommentSubmit}>
                            <div className="comment-form-user">
                                <img src={user.photoURL} alt="" className="comment-form-avatar" referrerPolicy="no-referrer" />
                                <span className="comment-form-name">{user.displayName}</span>
                            </div>
                            <div className="comment-form-row">
                                <textarea
                                    placeholder="Share your thoughts on this article…"
                                    required
                                    maxLength={2000}
                                    rows={4}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="comment-submit-btn" disabled={posting}>
                                {posting ? 'Posting…' : 'Post Comment'}
                            </button>
                        </form>
                    ) : (
                        <div className="comment-sign-in-prompt">
                            <p>Sign in with Google to join the discussion.</p>
                            <button className="auth-btn auth-btn-sign-in comment-sign-in-btn" onClick={signIn}>
                                <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: '8px' }}>
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    )}

                    <div className="comments-list">
                        {comments.map((c) => {
                            const timeStr = c.timestamp
                                ? new Date(c.timestamp.toDate()).toLocaleString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit',
                                })
                                : 'Just now';

                            return (
                                <div className="comment-card" key={c.id}>
                                    <div className="comment-header">
                                        {c.authorPhoto && (
                                            <img src={c.authorPhoto} alt="" className="comment-avatar" referrerPolicy="no-referrer" />
                                        )}
                                        <span className="comment-author">{c.authorName}</span>
                                        <span className="comment-time">{timeStr}</span>
                                        {isAdmin && (
                                            <button
                                                className="comment-delete-btn"
                                                onClick={() => deleteComment(c.id)}
                                                title="Delete comment"
                                                aria-label="Delete comment"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <p className="comment-body">{c.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </>
    );
}
