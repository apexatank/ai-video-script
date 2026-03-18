declare module 'langs' {
  interface LangData {
    name: string;
    local?: string;
    '1'?: string;
    '2'?: string;
    '2T'?: string;
    '2B'?: string;
    '3': string;
  }

  function where(type: '1' | '2' | '2T' | '2B' | '3', code: string): LangData | undefined;

  const langs: {
    where: typeof where;
  };

  export = langs;
}
