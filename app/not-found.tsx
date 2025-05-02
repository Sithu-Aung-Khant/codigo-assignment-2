import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center'>
      <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
        <h1 className='text-4xl font-bold tracking-tight'>404</h1>
        <p className='mb-4 mt-2 text-lg text-muted-foreground'>
          This page could not be found.
        </p>
        <Button asChild>
          <Link href='/'>Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
