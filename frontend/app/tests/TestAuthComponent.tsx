"use client";

import React, { useEffect } from 'react';
import axios from 'axios';

const TestAuthComponent: React.FC = () => {
  useEffect(() => {
    const testAuth = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/test-auth`);
        console.log('Autenticação bem-sucedida:', response.data);
      } catch (error) {
        console.error('Erro na autenticação:', error);
      }
    };

    testAuth();
  }, []);

  return (
    <div>
      <h1>Testando Autenticação</h1>
    </div>
  );
};

export default TestAuthComponent;
