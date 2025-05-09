'use client';
import { loginLogic } from '@/utilies/LoginHelper';
import { useEffect, useState } from 'react';

export function useLoginFormTrigger() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const shouldShow = loginLogic.getShouldShowLogin();

    if (shouldShow) {
      setShowLogin(true);
    }
  }, []);

  return showLogin;
}
