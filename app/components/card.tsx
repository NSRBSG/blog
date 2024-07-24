import Link, { LinkProps } from 'next/link';

interface CardProps extends LinkProps {
  title: string;
  description: string;
  date: string;
}

export default function Card(props: CardProps) {
  const { ...rest } = props;

  return (
    <Link
      className='flex flex-col w-full max-w-[652px] py-6 border-b'
      {...rest}
    >
      <h2 className='text-2xl md:text-3xl font-bold mb-2'>{props.title}</h2>
      <p className='md:text-lg mb-4'>{props.description}</p>
      <time className='text-sm md:text-base'>{props.date}</time>
    </Link>
  );
}
