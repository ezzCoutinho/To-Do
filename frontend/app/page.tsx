import Link from 'next/link';
import React from 'react';
import TestAuthComponent from '../app/tests/TestAuthComponent';


const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Projeto to-do</h1>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <h1>Página Inicial</h1>
      <TestAuthComponent/>
    </div>
  );
}

export default HomePage;
