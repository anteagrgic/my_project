import { HelmetOptions } from 'helmet';

export function getHelmetOptions(isDev: boolean): Readonly<HelmetOptions> {
  const devContentSecurityPolicy = {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'wasm-unsafe-eval'",
        'https://cdn.jsdelivr.net',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
      connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      workerSrc: ["'self'", 'blob:'],
    },
  };
  return {
    contentSecurityPolicy: isDev ? devContentSecurityPolicy : undefined,
  };
}