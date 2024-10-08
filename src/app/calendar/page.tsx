'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/funcs';
import type { Setter } from '@/lib/types';
import { Clock, Globe, Info, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState, type ReactNode } from 'react';

function isEmailValid(email: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
}

function RequiredFieldError() {
  return (
    <p className="flex items-center gap-1 text-sm text-red-600">
      <Info className="size-3" />
      This field is required{' '}
    </p>
  );
}

export default function CalendarPage() {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const canConfirm = selectedTime && isEmailValid(email);
  const [showRequiredFieldErrors, setShowRequiredFieldErrors] = useState(false);
  const confirm = useCallback(() => {
    if (!canConfirm) return setShowRequiredFieldErrors(true);
  }, [canConfirm]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center">
      <div
        // TODO: transition dimensions
        className={cn('flex items-stretch divide-x rounded-md border shadow-lg')}
      >
        <Advisor />
        {!selectedTime ? (
          <TimeForm selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        ) : (
          <div>
            <div className="flex h-full min-w-64 flex-col gap-4 px-5 py-4">
              <Labelled label="Email *">
                <Input
                  placeholder="example@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!!showRequiredFieldErrors && <RequiredFieldError />}
              </Labelled>
              <Labelled label="Name">
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Labelled>
              <div className="flex-1" />
              <p className="text-xs font-light text-zinc-500">
                By proceeding you agree to our{' '}
                <Link href="/tos" className="underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="underline">
                  Privacy Policy
                </Link>
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTime(null)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button onClick={confirm} className="relative" disabled={isLoading}>
                  <span className={cn(isLoading && 'invisible')}>Confirm</span>
                  {isLoading && (
                    <LoaderCircle className="absolute left-auto right-auto size-4 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Advisor() {
  return (
    <div>
      <div className="flex flex-col gap-2 px-5 py-4">
        <Image
          src="https://thomasforbes.com/wine.png"
          className="size-10 rounded-full"
          width={80}
          height={80}
          alt="advisor photo"
        />
        <h2 className="font-bold">Leo Ledlow</h2>
        <p className="max-w-40 text-xs font-light text-zinc-600">
          Georgetown SFS student with a strong passion for public service, technology, and where
          they intersect. Background in software development, technical recruiting, consulting, and
          emergency response.{' '}
        </p>
        <div className="flex-1" />
        <p className="flex items-center gap-1 text-sm">
          <Clock className="size-4" />
          <span>15 min</span>
        </p>
        <p className="flex items-center gap-1 text-sm">
          <Globe className="size-4" />
          {/* TODO: */}
          <span>America/New York</span>
        </p>
      </div>
    </div>
  );
}

function Labelled({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}

function TimeForm({
  selectedTime,
  setSelectedTime,
}: {
  selectedTime: Date | null;
  setSelectedTime: Setter<Date | null>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const dates = [new Date(1728068027), new Date(1728018257)];
  return (
    <>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        onMonthChange={setSelectedDate}
      />
      <div>
        <div className="flex h-full flex-col gap-2 p-4">
          {dates.map((date, i) => (
            <TimeSlot key={i} date={date} onClick={() => setSelectedTime(date)} />
          ))}
        </div>
      </div>
    </>
  );
}

function TimeSlot({ date, ...props }: { date: Date } & ButtonProps) {
  const dateString = useMemo(
    () =>
      date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [date],
  );
  return (
    <Button variant="outline" className="min-w-32" {...props}>
      {dateString}
    </Button>
  );
}
