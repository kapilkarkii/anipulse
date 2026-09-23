const paths = {
  library: <><rect x="3" y="4" width="5" height="16" rx="1"/><path d="M12 4v16M16 4l5 15"/></>,
  play: <path d="m9 5 11 7-11 7Z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  bookmark: <path d="M6 4h12v17l-6-4-6 4Z"/>,
  pause: <><path d="M8 5v14M16 5v14"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  minus: <path d="M5 12h14"/>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  bell: <><path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4Zm5 4h4"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  list: <path d="M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>,
  device: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
};

export function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.library}</svg>;
}
