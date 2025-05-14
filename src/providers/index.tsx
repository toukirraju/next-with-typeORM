'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import MantineWrapper from './MantineWrapper';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <MantineWrapper>
        {children}
      </MantineWrapper>
    </SessionProvider>
  );
};

export default Providers;
