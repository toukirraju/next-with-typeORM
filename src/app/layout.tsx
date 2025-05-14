import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import './globals.css';
import { ColorSchemeScript, Container, mantineHtmlProps } from '@mantine/core';
import Providers from '@/providers';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Map-Portal',
  description: 'Map-Portal is a web application',
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <Providers>
          <Container size="xl">
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}

