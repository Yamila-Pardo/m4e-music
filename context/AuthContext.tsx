import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../firebase';
import { Artist } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  followingArtistIds: string[];
  isFollowing: (artistId: string) => boolean;
  toggleFollowArtist: (artist: Artist) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [followingArtistIds, setFollowingArtistIds] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('sonus_following');
      return cached ? JSON.parse(cached) : ['luna-quinn', 'kairo', 'noah-rivers'];
    } catch {
      return ['luna-quinn', 'kairo', 'noah-rivers'];
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to following in Firestore when authenticated
  useEffect(() => {
    if (!user) return;
    const path = `users/${user.uid}/following`;
    const colRef = collection(db, 'users', user.uid, 'following');
    const unsub = onSnapshot(colRef, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach(doc => ids.push(doc.id));
      if (ids.length > 0) {
        setFollowingArtistIds(ids);
        localStorage.setItem('sonus_following', JSON.stringify(ids));
      }
    }, (error) => {
      console.warn("Following snapshot notice:", error);
    });

    return () => unsub();
  }, [user]);

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Login failure:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failure:", err);
    }
  };

  const isFollowing = (artistId: string) => {
    return followingArtistIds.includes(artistId);
  };

  const toggleFollowArtist = async (artist: Artist) => {
    const currentlyFollowing = isFollowing(artist.id);
    const updated = currentlyFollowing 
      ? followingArtistIds.filter(id => id !== artist.id)
      : [...followingArtistIds, artist.id];

    setFollowingArtistIds(updated);
    localStorage.setItem('sonus_following', JSON.stringify(updated));

    if (user) {
      const docRef = doc(db, 'users', user.uid, 'following', artist.id);
      try {
        if (currentlyFollowing) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            artistId: artist.id,
            artistName: artist.name,
            artistAvatar: artist.avatar,
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/following/${artist.id}`);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      followingArtistIds,
      isFollowing,
      toggleFollowArtist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
