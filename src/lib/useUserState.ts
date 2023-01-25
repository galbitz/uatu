import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

export const useUserState = (): {
  userLoading: boolean;
  loggedIn: boolean;
  authUser: User | null;
  userVerified: boolean;
} => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userVerified, setUserVerified] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUserLoading(false);
      setAuthUser(user);
      setLoggedIn(user !== null);
      setUserVerified(user !== null && user.emailVerified);
    });
    return unsub;
  }, []);

  return { userLoading, loggedIn, authUser, userVerified: userVerified };
};
