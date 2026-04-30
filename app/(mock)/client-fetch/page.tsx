'use-client';

import { useFetch } from '@/hooks/use-fetch';
import React from 'react';

export default function Page() {
  const { fetchWrapper, status } = useFetch('/auths/get-profile');
  return <div>P</div>;
}
