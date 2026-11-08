import '@testing-library/jest-dom';

process.env.NEXT_PUBLIC_DEFAULT_ORG_ID = 'org_8492a158b';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4001';
process.env.NEXT_PUBLIC_DASHBOARD_URL = 'http://localhost:4000';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
