// 'use client';

// import { getRefreshToken, getToken, makeRefreshToken } from '@/lib/auth';
// import { FetchWrapper } from '@/lib/fetch-wrapper';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// type UserProfile = {
//   userId: string;
//   role: string;
//   permissions: string[];
//   firstName: string;
//   lastName: string;
//   email: string;
// };

// type AppContext = {
//   accessToken: string | null;
//   refreshToken: string | null;
//   user: UserProfile | null;
//   isAuthLoading: boolean;
//   setToken: React.Dispatch<React.SetStateAction<string | null>>;
//   setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
//   setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
// };

// type ApiResponse<T> = {
//   message: string;
//   statusCode: number;
//   data: T;
//   processID: string;
//   duration: string;
// };

// const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

// export const AppContext = React.createContext({} as AppContext);

// export default function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
//   const [accessToken, setToken] = useState<string | null>(null);
//   const [refreshToken, setRefreshToken] = useState<string | null>(null);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);

//   const route = useRouter();

//   useEffect(() => {
//     const loadToken = async () => {
//       const token = await getToken();
//       const refresh = await getRefreshToken();

//       if (token) setToken(token);
//       if (refresh) setRefreshToken(refresh);

//       if (!token && !refresh) {
//         setIsAuthLoading(false);
//       }
//     };

//     loadToken();
//   }, []);

//   useEffect(() => {
//     const handleAuth = async () => {
//       if (!refreshToken) {
//         setIsAuthLoading(false);
//         return;
//       }

//       let currentToken = accessToken;

//       if (!currentToken) {
//         const newToken = await makeRefreshToken(refreshToken);

//         if (newToken) {
//           currentToken = newToken.accessToken;

//           await fetch('/api/cookie?key=token', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               value: currentToken,
//               maxAge: 60 * 15
//             })
//           });

//           setToken(currentToken);
//         } else {
//           route.push('/auth/log-out');
//           return;
//         }
//       }

//       const response = await fetchWrapper.get<ApiResponse<UserProfile>>('/users/get-profile', {
//         headers: {
//           Authorization: `Bearer ${currentToken}`
//         }
//       });

//       if (response.status === 401) {
//         const newToken = await makeRefreshToken(refreshToken);

//         if (newToken) {
//           await fetch('/api/cookie?key=token', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               value: newToken.accessToken,
//               maxAge: 60 * 15
//             })
//           });

//           setToken(newToken.accessToken);
//         } else {
//           route.push('/auth/log-out');
//         }

//         return;
//       }

//       if (response.data) {
//         setUser(response.data.data);
//       }

//       setIsAuthLoading(false);
//     };

//     handleAuth();
//   }, [accessToken, refreshToken]);

//   return (
//     <AppContext.Provider
//       value={{
//         accessToken,
//         refreshToken,
//         user,
//         isAuthLoading,
//         setToken,
//         setRefreshToken,
//         setUser
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

'use client';

import { getRefreshToken, getToken, makeRefreshToken } from '@/lib/auth';
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type UserProfile = {
  userId: string;
  role: string;
  permissions: string[];
  firstName: string;
  lastName: string;
  email: string;
};

type AppContext = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthLoading: boolean;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

type ApiResponse<T> = {
  message: string;
  statusCode: number;
  data: T;
  processID: string;
  duration: string;
};

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export const AppContext = React.createContext({} as AppContext);

export default function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [accessToken, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const route = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const token = await getToken();
        const refresh = await getRefreshToken();

        setToken(token);
        setRefreshToken(refresh);

        if (!token && !refresh) {
          setUser(null);
          setIsAuthLoading(false);
          return;
        }

        setIsAuthLoading(true);

        if (!token && !refresh) {
          setUser(null);
          return;
        }

        let currentToken = token;

        if (!currentToken && refresh) {
          const newToken = await makeRefreshToken(refresh);

          if (!newToken) {
            setUser(null);
            route.push('/auth/log-out');
            return;
          }

          currentToken = newToken.accessToken;

          await fetch('/api/cookie?key=token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              value: currentToken,
              maxAge: 60 * 15
            })
          });

          setToken(currentToken);
        }

        const response = await fetchWrapper.get<ApiResponse<UserProfile>>('/users/get-profile', {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });

        if (response.status === 401 && refresh) {
          const newToken = await makeRefreshToken(refresh);

          if (!newToken) {
            setUser(null);
            route.push('/auth/log-out');
            return;
          }

          await fetch('/api/cookie?key=token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              value: newToken.accessToken,
              maxAge: 60 * 15
            })
          });

          setToken(newToken.accessToken);

          const retryResponse = await fetchWrapper.get<ApiResponse<UserProfile>>('/users/get-profile', {
            headers: {
              Authorization: `Bearer ${newToken.accessToken}`
            }
          });

          if (retryResponse.data?.data) {
            setUser(retryResponse.data.data);
          }

          return;
        }

        if (response.data?.data) {
          setUser(response.data.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    handleAuth();
  }, [route]);

  return (
    <AppContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isAuthLoading,
        setToken,
        setRefreshToken,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
