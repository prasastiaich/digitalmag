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

import { getArticleMeta } from '@/data/articles';

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug;
    const article = getArticleMeta(slug);
    const { user, isAdmin, signIn } = useAuth();

    // ---- Voting State ----
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [userVote, setUserVote] = useState(null);
    const [voteAnim, setVoteAnim] = useState(null); // 'up' | 'down' | null

    // ---- Comments State ----
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [posting, setPosting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // comment ID pending delete

    // Real-time vote listener
    useEffect(() => {
        const voteRef = doc(db, 'articles', slug);
        const unsub = onSnapshot(voteRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                // Count votes from the voters map
                const voters = data.voters || {};
                let up = 0, down = 0;
                Object.values(voters).forEach(v => { if (v === 'up') up++; else if (v === 'down') down++; });
                setUpvotes(up);
                setDownvotes(down);
                if (user) {
                    setUserVote(voters[user.uid] || null);
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
    async function confirmDelete() {
        if (!isAdmin || !deleteTarget) return;
        try {
            await deleteDoc(doc(db, 'articles', slug, 'comments', deleteTarget));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
        setDeleteTarget(null);
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
                            if (block.type === 'references') {
                                return (
                                    <ol key={i} className="article-references">
                                        {block.links.map((ref, j) => (
                                            <li key={j}>
                                                <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.label}</a>
                                            </li>
                                        ))}
                                    </ol>
                                );
                            }
                            return <p key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
                        })}
                    </div>

                    {slug === 'infusion-pump-crisis' && (
                        <div className="article-author-byline">
                            <span className="author-name">Prasasti Aich</span>
                            <span className="author-title">Founder - The Variable &apos;H&apos;</span>
                        </div>
                    )}

                    {/* Voting — Simple Arrows */}
                    <div className="vote-arrows">
                        <div className="vote-arrow-group">
                            <button
                                className={`vote-arrow-btn vote-arrow-up${userVote === 'up' ? ' voted' : ''}${voteAnim === 'up' ? ' anim-burst' : ''}`}
                                onClick={() => castVote('up')}
                                aria-label="Upvote this article"
                            >
                                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="19" x2="12" y2="5"></line>
                                    <polyline points="5 12 12 5 19 12"></polyline>
                                </svg>
                            </button>
                            <span className={`vote-label${userVote === 'up' ? ' vote-label-up' : ''}`}>{upvotes}</span>
                        </div>

                        <div className="vote-arrow-group">
                            <button
                                className={`vote-arrow-btn vote-arrow-down${userVote === 'down' ? ' voted' : ''}${voteAnim === 'down' ? ' anim-shake' : ''}`}
                                onClick={() => castVote('down')}
                                aria-label="Downvote this article"
                            >
                                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <polyline points="19 12 12 19 5 12"></polyline>
                                </svg>
                            </button>
                            <span className={`vote-label${userVote === 'down' ? ' vote-label-down' : ''}`}>{downvotes}</span>
                        </div>
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
                                                onClick={() => setDeleteTarget(c.id)}
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

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Delete Comment</h3>
                        <p className="modal-text">Are you sure you want to remove this comment? This can&apos;t be undone.</p>
                        <div className="modal-actions">
                            <button className="modal-btn modal-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button className="modal-btn modal-btn-delete" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
