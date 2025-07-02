

import InterviewList from '@/components/admin/interview/InterviewList';
import Cookies from 'js-cookie';

export default function ScheduleInterview() {
  const emailUser = Cookies.get('userEmail') ?? '';

  return (
    <main className="min-h-screen bg-lightmode-background dark:bg-background
                     text-lightmode-text dark:text-light transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 py-10">
        <InterviewList adminEmail={emailUser} />
      </section>
    </main>
  );
}
