import { redirect } from 'next/navigation';

export default function CreateTripRedirectPage() {
  redirect('/trips/create');
}
