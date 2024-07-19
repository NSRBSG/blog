import Input from '@/app/components/input';
import SubmitButton from '@/app/components/submit-button';
import { authentication } from '@/app/actions';

export default async function Page() {
  return (
    <div className='flex flex-1 items-center justify-center p-2'>
      <form className='w-full max-w-[652px]' action={authentication}>
        <Input hidden type='text' autoComplete='username' />
        <Input
          type='password'
          name='password'
          required
          autoComplete='current-password'
        />
        <SubmitButton />
      </form>
    </div>
  );
}
