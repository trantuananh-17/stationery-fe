'use client';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Thay cả root layout khi lỗi xảy ra ngoài phạm vi [locale], nên không có
 * NextIntlClientProvider — text ở đây buộc phải viết cứng, không qua t().
 */
export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang='vi'>
      <body
        style={{
          display: 'flex',
          minHeight: '100dvh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Đã xảy ra lỗi / Something went wrong</h1>

        {error.digest && <p style={{ fontSize: '0.75rem', color: '#666' }}>Mã lỗi: {error.digest}</p>}

        <button
          type='button'
          onClick={reset}
          style={{
            cursor: 'pointer',
            borderRadius: '0.5rem',
            border: '1px solid #d4d4d8',
            padding: '0.5rem 1rem'
          }}
        >
          Thử lại / Try again
        </button>
      </body>
    </html>
  );
}
