import type { SVGProps } from 'react';

export default function MatGoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h10" />
      <path d="M16 17.6c.3.2.6.4.8.6l1.6-1.6" />
      <path d="M3 17H2v-2" />
      <path d="M3 11V9" />
      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}
