export interface HijriDate {
  day: number;
  month: number; // 1-12
  year: number;
  monthName: string;
  formatted: string;
}

export type IslamicEventCategory = 'puasa' | 'ibadah' | 'hari-besar';

export interface IslamicCalendarEvent {
  id: string;
  title: string;
  category: IslamicEventCategory;
  recurrence: 'Mingguan' | 'Bulanan (Hijriah)' | 'Tahunan';
  description: string;
  note?: string;
}

export const HIJRI_MONTHS_ID = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  "Sya'ban",
  'Ramadhan',
  'Syawal',
  "Dzulqa'dah",
  'Dzulhijjah',
];

let hijriFormatter: Intl.DateTimeFormat | null = null;

function getHijriFormatter(): Intl.DateTimeFormat {
  if (!hijriFormatter) {
    try {
      hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    } catch {
      hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    }
  }
  return hijriFormatter;
}

export function getHijriDate(date: Date): HijriDate {
  try {
    const parts = getHijriFormatter().formatToParts(date);
    const day = parseInt(parts.find((p) => p.type === 'day')?.value || '1', 10);
    const month = parseInt(parts.find((p) => p.type === 'month')?.value || '1', 10);
    const year = parseInt(parts.find((p) => p.type === 'year')?.value || '1447', 10);
    const monthName = HIJRI_MONTHS_ID[month - 1] || `Bulan ${month}`;
    return {
      day,
      month,
      year,
      monthName,
      formatted: `${day} ${monthName} ${year} H`,
    };
  } catch {
    return {
      day: 1,
      month: 1,
      year: 1448,
      monthName: 'Muharram',
      formatted: '1 Muharram 1448 H',
    };
  }
}

export function isFastingForbidden(hijri: HijriDate): boolean {
  // Idul Fitri (1 Syawal), Idul Adha (10 Dzulhijjah), Hari Tasyrik (11-13 Dzulhijjah)
  if (hijri.month === 10 && hijri.day === 1) return true;
  if (hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13) return true;
  return false;
}

export function getIslamicEventsForDate(date: Date): IslamicCalendarEvent[] {
  const events: IslamicCalendarEvent[] = [];
  const hijri = getHijriDate(date);
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, 4=Thu, 5=Fri
  const forbiddenFasting = isFastingForbidden(hijri);
  const isRamadhan = hijri.month === 9;

  // --- Annual Islamic Days & Fasting ---
  if (hijri.month === 1 && hijri.day === 1) {
    events.push({
      id: 'tahun-baru-islam',
      title: 'Tahun Baru Islam (1 Muharram)',
      category: 'hari-besar',
      recurrence: 'Tahunan',
      description: 'Momentum muhasabah dan hijrah menuju pribadi yang lebih bertakwa.',
    });
  }
  if (hijri.month === 1 && hijri.day === 9) {
    events.push({
      id: 'puasa-tasua',
      title: "Puasa Sunnah Tasu'a (9 Muharram)",
      category: 'puasa',
      recurrence: 'Tahunan',
      description: 'Puasa sunnah yang dianjurkan sebelum Puasa Asyura.',
    });
  }
  if (hijri.month === 1 && hijri.day === 10) {
    events.push({
      id: 'puasa-asyura',
      title: 'Puasa Sunnah Asyura (10 Muharram)',
      category: 'puasa',
      recurrence: 'Tahunan',
      description: 'Menghapus dosa setahun yang lalu (HR. Muslim).',
    });
  }
  if (hijri.month === 3 && hijri.day === 12) {
    events.push({
      id: 'maulid-nabi',
      title: 'Maulid Nabi Muhammad SAW',
      category: 'hari-besar',
      recurrence: 'Tahunan',
      description: 'Memperbanyak shalawat dan meneladani akhlak Rasulullah SAW.',
    });
  }
  if (hijri.month === 7 && hijri.day === 27) {
    events.push({
      id: 'isra-miraj',
      title: "Isra Mi'raj Nabi Muhammad SAW",
      category: 'hari-besar',
      recurrence: 'Tahunan',
      description: 'Peringatan perjalanan agung dan perintah shalat lima waktu.',
    });
  }
  if (hijri.month === 8 && hijri.day === 15) {
    events.push({
      id: 'nisfu-syaban',
      title: "Nisfu Sya'ban",
      category: 'ibadah',
      recurrence: 'Tahunan',
      description: 'Pertengahan bulan Sya\'ban, memperbanyak istighfar dan persiapan menyambut Ramadhan.',
    });
  }
  if (isRamadhan) {
    events.push({
      id: 'puasa-ramadhan',
      title: `Puasa Wajib Ramadhan (Hari ke-${hijri.day})`,
      category: 'puasa',
      recurrence: 'Tahunan',
      description: 'Menjalankan ibadah puasa Ramadhan, tadarus Al-Qur\'an, dan shalat Tarawih.',
    });
  }
  if (hijri.month === 10 && hijri.day === 1) {
    events.push({
      id: 'idul-fitri',
      title: 'Hari Raya Idul Fitri (1 Syawal)',
      category: 'hari-besar',
      recurrence: 'Tahunan',
      description: 'Hari kemenangan umat Islam. Dilarang berpuasa pada hari ini.',
    });
  }
  if (hijri.month === 10 && hijri.day >= 2 && hijri.day <= 7) {
    events.push({
      id: 'puasa-syawal',
      title: 'Anjuran Puasa 6 Hari Syawal',
      category: 'puasa',
      recurrence: 'Tahunan',
      description: 'Berpuasa Ramadhan diikuti 6 hari di bulan Syawal seperti berpuasa setahun penuh (HR. Muslim).',
    });
  }
  if (hijri.month === 12 && hijri.day === 9) {
    events.push({
      id: 'puasa-arafah',
      title: 'Puasa Sunnah Arafah (9 Dzulhijjah)',
      category: 'puasa',
      recurrence: 'Tahunan',
      description: 'Menghapus dosa setahun yang lalu dan setahun yang akan datang (HR. Muslim).',
    });
  }
  if (hijri.month === 12 && hijri.day === 10) {
    events.push({
      id: 'idul-adha',
      title: 'Hari Raya Idul Adha (10 Dzulhijjah)',
      category: 'hari-besar',
      recurrence: 'Tahunan',
      description: 'Hari Raya Qurban. Dilarang berpuasa pada hari ini.',
    });
  }
  if (hijri.month === 12 && hijri.day >= 11 && hijri.day <= 13) {
    events.push({
      id: 'hari-tasyrik',
      title: 'Hari Tasyrik',
      category: 'hari-besar',
      recurrence: 'Tahunan',
      description: 'Hari makan, minum, dan berdzikir. Dilarang berpuasa pada hari Tasyrik.',
    });
  }

  // --- Monthly Recurring: Puasa Ayyamul Bidh (13, 14, 15 Hijriah) ---
  if (!isRamadhan && !forbiddenFasting && hijri.day >= 13 && hijri.day <= 15) {
    events.push({
      id: 'ayyamul-bidh',
      title: `Puasa Sunnah Ayyamul Bidh (${hijri.day} ${hijri.monthName})`,
      category: 'puasa',
      recurrence: 'Bulanan (Hijriah)',
      description: 'Puasa tiga hari setiap pertengahan bulan Hijriah (13, 14, 15), pahalanya seperti puasa sepanjang tahun.',
    });
  }

  // --- Weekly Recurring: Puasa Senin & Kamis ---
  if (!isRamadhan && !forbiddenFasting && (dayOfWeek === 1 || dayOfWeek === 4)) {
    const dayLabel = dayOfWeek === 1 ? 'Senin' : 'Kamis';
    events.push({
      id: `puasa-${dayLabel.toLowerCase()}`,
      title: `Puasa Sunnah Hari ${dayLabel}`,
      category: 'puasa',
      recurrence: 'Mingguan',
      description:
        dayOfWeek === 1
          ? 'Hari kelahiran Rasulullah SAW dan hari diangkatnya amal-amal kepada Allah SWT.'
          : 'Hari diangkatnya catatan amal kepada Allah SWT; Rasulullah SAW senang beramal saat berpuasa.',
    });
  }

  // --- Weekly Recurring: Sunnah Hari Jumat ---
  if (dayOfWeek === 5) {
    events.push({
      id: 'sunnah-jumat',
      title: 'Amalan Hari Jumat (Al-Kahfi & Shalawat)',
      category: 'ibadah',
      recurrence: 'Mingguan',
      description: 'Membaca Surah Al-Kahfi, memperbanyak shalawat kepada Nabi SAW, dan bersedekah di hari Jumat.',
    });
  }

  return events;
}

export interface RecurringScheduleSummary {
  id: string;
  title: string;
  schedule: string;
  category: IslamicEventCategory;
  description: string;
  nextDate: Date;
  nextHijri: HijriDate;
}

export function getUpcomingRecurringSchedules(fromDate: Date = new Date()): RecurringScheduleSummary[] {
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());

  const findNext = (predicate: (d: Date, h: HijriDate) => boolean, maxDays = 400): Date => {
    for (let i = 0; i <= maxDays; i++) {
      const candidate = new Date(start);
      candidate.setDate(start.getDate() + i);
      const h = getHijriDate(candidate);
      if (predicate(candidate, h)) return candidate;
    }
    return start;
  };

  const nextSeninKamis = findNext(
    (d, h) => !isFastingForbidden(h) && h.month !== 9 && (d.getDay() === 1 || d.getDay() === 4)
  );
  const nextAyyamulBidh = findNext(
    (_d, h) => !isFastingForbidden(h) && h.month !== 9 && h.day >= 13 && h.day <= 15
  );
  const nextJumat = findNext((d) => d.getDay() === 5);
  const nextRamadhan = findNext((_d, h) => h.month === 9 && h.day === 1);
  const nextArafah = findNext((_d, h) => h.month === 12 && h.day === 9);
  const nextAsyura = findNext((_d, h) => h.month === 1 && h.day === 10);

  return [
    {
      id: 'senin-kamis',
      title: 'Puasa Sunnah Senin & Kamis',
      schedule: 'Setiap Senin & Kamis',
      category: 'puasa',
      description: 'Puasa sunnah mingguan untuk melatih ketakwaan dan mengikuti sunnah Rasulullah SAW.',
      nextDate: nextSeninKamis,
      nextHijri: getHijriDate(nextSeninKamis),
    },
    {
      id: 'ayyamul-bidh',
      title: 'Puasa Ayyamul Bidh',
      schedule: 'Tanggal 13, 14, 15 Hijriah',
      category: 'puasa',
      description: 'Puasa tiga hari setiap pertengahan bulan Hijriah yang pahalanya setara puasa sepanjang tahun.',
      nextDate: nextAyyamulBidh,
      nextHijri: getHijriDate(nextAyyamulBidh),
    },
    {
      id: 'sunnah-jumat',
      title: 'Amalan Hari Jumat',
      schedule: 'Setiap Hari Jumat',
      category: 'ibadah',
      description: 'Membaca Surah Al-Kahfi, memperbanyak shalawat, mandi Jumat, dan sedekah Jumat.',
      nextDate: nextJumat,
      nextHijri: getHijriDate(nextJumat),
    },
    {
      id: 'ramadhan',
      title: 'Awal Bulan Ramadhan',
      schedule: '1 Ramadhan (Tahunan)',
      category: 'puasa',
      description: 'Bulan suci penuh keberkahan, puasa wajib sebulan penuh, tarawih, dan tadarus Al-Qur\'an.',
      nextDate: nextRamadhan,
      nextHijri: getHijriDate(nextRamadhan),
    },
    {
      id: 'arafah',
      title: 'Puasa Sunnah Arafah',
      schedule: '9 Dzulhijjah (Tahunan)',
      category: 'puasa',
      description: 'Puasa utama sebelum Idul Adha yang menghapus dosa setahun lalu dan setahun mendatang.',
      nextDate: nextArafah,
      nextHijri: getHijriDate(nextArafah),
    },
    {
      id: 'asyura',
      title: "Puasa Tasu'a & Asyura",
      schedule: '9–10 Muharram (Tahunan)',
      category: 'puasa',
      description: 'Puasa sunnah di bulan Muharram yang sangat dianjurkan oleh Rasulullah SAW.',
      nextDate: nextAsyura,
      nextHijri: getHijriDate(nextAsyura),
    },
  ];
}
