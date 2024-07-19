import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  const { ...rest } = props;
  return <input className='w-full p-2 border border-black' {...rest} />;
}
