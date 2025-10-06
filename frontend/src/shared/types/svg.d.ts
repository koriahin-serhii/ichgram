declare module '*.svg' {
  const src: string;
  export default src;
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const Component: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default Component;
}
