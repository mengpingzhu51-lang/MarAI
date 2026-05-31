import React from 'react';
import dynamic from 'next/dynamic';

const MainApp = dynamic(() => import('../src/App'), { ssr: false });

export default function Home() {
  return <MainApp />;
}
