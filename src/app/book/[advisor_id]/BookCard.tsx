'use client';
import AdvisorPreview from '@/app/book/[advisor_id]/AdvisorPreview';
import SignUpForm from '@/app/book/[advisor_id]/SignUpForm';
import TimeForm from '@/app/book/[advisor_id]/TimeForm';
import { cn } from '@/lib/funcs';
import type { getAdvisorById } from '@/lib/queries';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';

export default function BookCard({
  advisor,
}: {
  advisor: Awaited<ReturnType<typeof getAdvisorById>>;
}) {
  const [selectedTime, setSelectedTime] = useQueryState('time', parseAsIsoDateTime);
  return (
    <div
      // TODO: transition dimensions
      className={cn('flex items-stretch divide-x rounded-md border shadow-lg [&>*]:w-72')}
    >
      <AdvisorPreview advisor={advisor} />
      {!selectedTime ? (
        <TimeForm selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
      ) : (
        <SignUpForm
          advisorId={advisor.advisor_id}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      )}
    </div>
  );
}
