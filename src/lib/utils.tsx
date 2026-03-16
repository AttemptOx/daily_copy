import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MOOD_COLORS: Record<number, string> = {
  2: '#7ED957', // 开心 (Green)
  1: '#A0C4FF', // 平静 (Blue)
  0: '#E8E8E8', // 一般 (Light Gray)
  [-1]: '#FFB347', // 低落 (Orange)
  [-2]: '#FF7B7B', // 糟糕 (Red)
};

export const MOOD_EMOJIS: Record<number, React.ReactNode> = {
  2: ( // 极高：笑到眯起眼 (^ ^ + ⌣)
    <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors shadow-sm">
      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        {/* Eyes: ^ ^ (thinner lines, balanced spacing) */}
        <path d="M7.5 11.5l1.5-1.5 1.5 1.5M13.5 11.5l1.5-1.5 1.5 1.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Mouth: ⌣ (thinner line) */}
        <path d="M9 16c1 1 2 1.5 3 1.5s2-.5 3-1.5" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  ),
  1: ( // 不错：明亮的注视 (· · + ︶)
    <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center hover:bg-cyan-100 transition-colors shadow-sm">
      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        {/* Eyes: · · (larger dots, balanced spacing) */}
        <circle cx="9.2" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="14.8" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
        {/* Mouth: ︶ (thinner line) */}
        <path d="M9 15.5c1 1 2 1.5 3 1.5s2-.5 3-1.5" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  ),
  0: ( // 一般：禅意留白 (- - + ·)
    <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        {/* Eyes: - - (balanced spacing) */}
        <path d="M7.8 11h2.5M13.7 11h2.5" strokeWidth="1.2" strokeLinecap="round" />
        {/* Mouth: · (larger dot) */}
        <circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </div>
  ),
  [-1]: ( // 忧郁：低垂的重力 (| | + ︵)
    <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm">
      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        {/* Eyes: | | (thinner lines, balanced spacing) */}
        <path d="M9.2 9.5v3M14.8 9.5v3" strokeWidth="1.2" strokeLinecap="round" />
        {/* Mouth: ︵ */}
        <path d="M10 17c.5-.8 1.2-1.2 2-1.2s1.5.4 2 1.2" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  ),
  [-2]: ( // 糟糕：警示红 (原版 X)
    <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm">
      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  ),
};

export const PRESET_TAGS = [
  '学习', '压力', '运动', '社交', '恋人', 
  '孤独', '健康', '娱乐', '工作', '美食'
];
