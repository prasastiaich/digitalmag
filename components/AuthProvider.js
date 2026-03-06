'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'prasastiaich167@gmail.com';

const AuthContext = createContext({
    user: null,
    loading: true,
    isAdmin: false,
    signIn: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            setIsAdmin(firebaseUser?.email === ADMIN_EMAIL);
            setLoading(false);

            // Store user info in Firestore on sign-in
            if (firebaseUser) {
                try {
                    await setDoc(doc(db, 'users', firebaseUser.uid), {
                        displayName: firebaseUser.displayName || '',
                        email: firebaseUser.email || '',
                        photoURL: firebaseUser.photoURL || '',
                        lastLogin: serverTimestamp(),
                    }, { merge: true });
                } catch (err) {
                    console.error('Failed to store user info:', err);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Sign-in error:', error);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
