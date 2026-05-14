
/// <reference types="vite/client" />

declare module 'echarts-wordcloud';

declare module '*.csv?raw' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
