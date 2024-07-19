'use client';

import { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

export interface SubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function SubmitButton(props: SubmitButtonProps) {
  const { ...rest } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className='w-full p-2 mt-4 text-white bg-black'
      disabled={pending}
      type='submit'
      {...rest}
    >
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
