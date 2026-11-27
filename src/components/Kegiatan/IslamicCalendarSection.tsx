'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Activity } from '@/lib/types';
import {
  getHijriDate,
  getIslamicEventsForDate,
  getUpcomingRecurringSchedules,
  IslamicEventCategory,
} from '@/lib/islamic-calendar';

interface Props {
  activities: Activity[];
}

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCategoryStyle(category: IslamicEventCategory) {
  switch (category) {
    case 'puasa':
      return {
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
        dot: 'bg-emerald-500',
        label: 'Puasa',
      };
    case 'ibadah':
      return {
        badge: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30',
        dot: 'bg-sky-500',
        label: 'Amalan Rutin',
      };
    case 'hari-besar':
      return {
        badge: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
        dot: 'bg-amber-500',
        label: 'Hari Besar Islam',
      };
  }
}

export default function IslamicCalendarSection({ activities }: Props) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const todayKey = toDateKey(today);
  const selectedKey = toDateKey(selectedDate);
  const todayHijri = useMemo(() => getHijriDate(today), [today]);

  // Index SKRT MEDIA activities by YYYY-MM-DD
  const activitiesByDate = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const act of activities) {
      if (!act.date) continue;
      const d = new Date(act.date);
      if (Number.isNaN(d.getTime())) continue;
      const key = toDateKey(d);
      const list = map.get(key) || [];
      list.push(act);
      map.set(key, list);
    }
    return map;
  }, [activities]);

  // Build calendar grid for viewYear / viewMonth
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ date: Date | null }> = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ date: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ date: new Date(viewYear, viewMonth, day) });
    }
    return cells;
  }, [viewYear, viewMonth]);

  // Hijri month range label for current view month
  const hijriMonthRangeLabel = useMemo(() => {
    const first = getHijriDate(new Date(viewYear, viewMonth, 1));
    const last = getHijriDate(new Date(viewYear, viewMonth + 1, 0));
    if (first.month === last.month && first.year === last.year) {
      return `${first.monthName} ${first.year} H`;
    }
    if (first.year === last.year) {
      return `${first.monthName} – ${last.monthName} ${first.year} H`;
    }
    return `${first.monthName} ${first.year} H – ${last.monthName} ${last.year} H`;
  }, [viewYear, viewMonth]);

  const monthTitle = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
  }, [viewYear, viewMonth]);

  const selectedHijri = useMemo(() => getHijriDate(selectedDate), [selectedDate]);
  const selectedIslamicEvents = useMemo(
    () => getIslamicEventsForDate(selectedDate),
    [selectedDate]
  );
  const selectedSkrtActivities = activitiesByDate.get(selectedKey) || [];

  const recurringSchedules = useMemo(() => getUpcomingRecurringSchedules(today), [today]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today);
  };

  return (
    <section aria-label="Kalender Ibadah dan Kegiatan Muslim Berulang" className="mx-auto max-w-6xl space-y-10">
      {/* Today Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 dark:border-primary/30 dark:bg-primary/10 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase dark:text-sky-400">
            Kalender Masehi &amp; Hijriah Hari Ini
          </p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            {today.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="mt-0.5 text-sm font-medium text-primary dark:text-sky-300">
            {todayHijri.formatted}
          </p>
        </div>
        <button
          type="button"
          onClick={goToToday}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-primary/90"
        >
          Kembali ke Hari Ini
        </button>
      </div>

      {/* Interactive Calendar + Selected Day Detail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calendar Card */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark sm:p-6 lg:col-span-7">
          {/* Month Navigation */}
          <div className="mb-5 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold capitalize text-gray-900 dark:text-white sm:text-xl">
                {monthTitle}
              </h2>
              <p className="text-xs font-medium text-body-color dark:text-body-color-dark">
                {hijriMonthRangeLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPrevMonth}
                aria-label="Bulan sebelumnya"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-gray-300"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="Bulan berikutnya"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-gray-300"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-body-color dark:text-body-color-dark">
            {DAY_NAMES.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarDays.map((cell, idx) => {
              if (!cell.date) {
                return <div key={`empty-${idx}`} className="h-14 sm:h-16" />;
              }

              const date = cell.date;
              const key = toDateKey(date);
              const isToday = key === todayKey;
              const isSelected = key === selectedKey;
              const hijri = getHijriDate(date);
              const islamicEvents = getIslamicEventsForDate(date);
              const skrtEvents = activitiesByDate.get(key) || [];

              const hasPuasa = islamicEvents.some((e) => e.category === 'puasa');
              const hasIbadah = islamicEvents.some((e) => e.category === 'ibadah');
              const hasHariBesar = islamicEvents.some((e) => e.category === 'hari-besar');
              const hasSkrt = skrtEvents.length > 0;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`flex h-14 flex-col items-center justify-between rounded-xl border p-1.5 text-center transition sm:h-16 ${
                    isSelected
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : isToday
                        ? 'border-primary/50 bg-primary/5 text-primary dark:bg-primary/15 dark:text-sky-300'
                        : 'border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:border-white/10 dark:hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`text-sm font-bold leading-none ${
                      isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <span
                    className={`text-[10px] leading-none ${
                      isSelected
                        ? 'text-blue-100'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {hijri.day}
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    {hasSkrt && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-primary'
                        }`}
                      />
                    )}
                    {hasPuasa && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? 'bg-emerald-200' : 'bg-emerald-500'
                        }`}
                      />
                    )}
                    {hasHariBesar && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? 'bg-amber-200' : 'bg-amber-500'
                        }`}
                      />
                    )}
                    {hasIbadah && !hasPuasa && !hasHariBesar && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? 'bg-sky-200' : 'bg-sky-500'
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-xs text-body-color dark:border-white/10 dark:text-body-color-dark">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Kegiatan SKRT
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Puasa Sunnah / Wajib
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Amalan Jumat
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Hari Besar Islam
            </span>
          </div>
        </div>

        {/* Selected Date Detail Panel */}
        <div className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-gray-dark sm:p-6 lg:col-span-5">
          <div className="mb-5 border-b border-gray-100 pb-4 dark:border-white/10">
            <p className="text-xs font-semibold tracking-wider text-primary uppercase dark:text-sky-400">
              Agenda Tanggal Dipilih
            </p>
            <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {selectedDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
              {selectedHijri.formatted}
            </p>
          </div>

          <div className="flex-1 space-y-3">
            {/* SKRT MEDIA Events on this date */}
            {selectedSkrtActivities.map((act) => (
              <Link
                key={act.id}
                href={`/kegiatan/${act.id}`}
                className="block rounded-xl border border-primary/25 bg-primary/5 p-4 transition hover:border-primary dark:bg-primary/15"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Kegiatan SKRT
                  </span>
                  {act.time && (
                    <span className="text-xs text-body-color dark:text-gray-300">
                      {act.time}
                    </span>
                  )}
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{act.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-body-color dark:text-gray-300">
                  {act.description}
                </p>
              </Link>
            ))}

            {/* Recurring Muslim Activities on this date */}
            {selectedIslamicEvents.map((ev) => {
              const style = getCategoryStyle(ev.category);
              return (
                <div
                  key={ev.id}
                  className="rounded-xl border border-gray-200/80 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${style.badge}`}
                    >
                      {style.label}
                    </span>
                    <span className="text-[11px] font-medium text-body-color dark:text-body-color-dark">
                      {ev.recurrence}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">{ev.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-body-color dark:text-body-color-dark">
                    {ev.description}
                  </p>
                </div>
              );
            })}

            {selectedSkrtActivities.length === 0 && selectedIslamicEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center dark:border-white/10">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tidak ada jadwal khusus pada tanggal ini
                </p>
                <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                  Tetap semangat menjaga shalat berjamaah, dzikir pagi-petang, dan tilawah harian.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recurring Muslim Activities Directory */}
      <div>
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Pengingat Ibadah Rutin
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Kegiatan Muslim Berulang
            </h2>
          </div>
          <p className="text-xs text-body-color dark:text-body-color-dark">
            Tanggal Hijriah dihitung otomatis (kalender Ummul Qura, dapat berbeda ±1 hari sesuai rukyatul hilal).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recurringSchedules.map((item) => {
            const style = getCategoryStyle(item.category);
            return (
              <article
                key={item.id}
                onClick={() => {
                  setViewYear(item.nextDate.getFullYear());
                  setViewMonth(item.nextDate.getMonth());
                  setSelectedDate(item.nextDate);
                }}
                className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style.badge}`}
                    >
                      {style.label}
                    </span>
                    <span className="text-xs font-medium text-body-color dark:text-body-color-dark">
                      {item.schedule}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-body-color dark:text-body-color-dark">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-3 dark:border-white/10">
                  <p className="text-[11px] font-medium text-body-color uppercase dark:text-body-color-dark">
                    Jadwal Terdekat
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                    {item.nextDate.toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-primary dark:text-sky-400">
                    {item.nextHijri.formatted}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
