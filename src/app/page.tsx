import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect users to the first lesson immediately
  redirect('/lesson/page1_your_first_python_program');
}
