export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className='flex justify-center p-8'>
      <p className='text-sm text-slate-800 dark:text-gray-400'>
        © {year} NSRBSG. All Rights Reserved.
      </p>
    </footer>
  );
}
