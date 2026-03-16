/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BarChart2, 
  Settings as SettingsIcon,
  Plus,
  ChevronRight,
  ChevronLeft,
  Download,
  Check,
  Star,
  Sparkles,
  Circle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

import { MoodRecord, MoodScore } from './types';
import { storage } from './lib/storage';
import { cn, MOOD_COLORS, PRESET_TAGS, MOOD_EMOJIS } from './lib/utils';
import { COPY_DICT, getRandomText, generateGreeting, ROUTINE_TEXTS, getNonRepeatingText, getSmartFeedback } from './lib/copywriting';

// --- Components ---

const Typewriter = ({ text, speed = 50 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="whitespace-pre-wrap text-balance">{displayedText}</span>;
};

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/[0.03] px-10 pt-4 pb-6 flex justify-between items-center z-50">
    {[
      { id: 'home', icon: Home, label: '记录' },
      { id: 'stats', icon: BarChart2, label: '回顾' },
      { id: 'settings', icon: SettingsIcon, label: '设置' },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className="relative flex flex-col items-center gap-1.5 transition-all duration-300 px-4"
      >
        <motion.div
          animate={{
            color: activeTab === tab.id ? "rgb(82 82 91)" : "rgba(0, 0, 0, 0.2)",
            scale: activeTab === tab.id ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <tab.icon 
            size={22} 
            strokeWidth={activeTab === tab.id ? 2 : 1.8} 
          />
        </motion.div>
        
        <motion.span 
          animate={{
            color: activeTab === tab.id ? "rgb(82 82 91)" : "rgba(0, 0, 0, 0.2)",
            opacity: activeTab === tab.id ? 1 : 0.5,
          }}
          className="text-[10px] font-bold tracking-tight"
        >
          {tab.label}
        </motion.span>

        {activeTab === tab.id && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -bottom-2 w-1 h-1 bg-zinc-400 rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    ))}
  </nav>
);

const MoodFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [customTagInput, setCustomTagInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  
  // Calculate if it's the first record of today
  const isFirstRecordToday = useMemo(() => {
    const records = storage.getRecords();
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return records.filter(r => r.date === todayStr).length === 0;
  }, []);

  const [record, setRecord] = useState<Partial<MoodRecord>>({
    mood_score: 0,
    tags: [],
    note: '',
    sleep_hours: isFirstRecordToday ? 7 : 0,
    exercise_mins: 0,
    study_hours: 0,
  });

  // Lock random titles for each step to prevent re-render jumps
  const [step1Title] = useState(() => getRandomText(COPY_DICT.feeling));
  const [step2Title] = useState(() => getRandomText(COPY_DICT.tags));
  const [step3Title] = useState(() => getRandomText(COPY_DICT.note));
  const [step4Title] = useState(() => getRandomText(COPY_DICT.daily));

  const [sleepCopy] = useState(() => {
    const list = isFirstRecordToday ? ROUTINE_TEXTS.sleep.initial : ROUTINE_TEXTS.sleep.continuation;
    return getNonRepeatingText(list).text;
  });
  const [exerciseCopy] = useState(() => {
    const list = isFirstRecordToday ? ROUTINE_TEXTS.exercise.initial : ROUTINE_TEXTS.exercise.continuation;
    return getNonRepeatingText(list).text;
  });
  const [studyCopy] = useState(() => {
    const list = isFirstRecordToday ? ROUTINE_TEXTS.study.initial : ROUTINE_TEXTS.study.continuation;
    return getNonRepeatingText(list).text;
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSave = () => {
    const now = new Date();
    const finalRecord: MoodRecord = {
      id: Date.now().toString(),
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
      mood_score: record.mood_score as MoodScore,
      tags: record.tags || [],
      note: record.note || '',
      sleep_hours: record.sleep_hours || 0,
      exercise_mins: record.exercise_mins || 0,
      study_hours: record.study_hours || 0,
      timestamp: Date.now(),
    };
    storage.saveRecord(finalRecord);
    setFeedbackText(getSmartFeedback(finalRecord.mood_score));
    setIsSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 3500); // 增加时间以便阅读反馈
  };

  if (isSuccess) {
    const score = record.mood_score || 0;
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-10 px-10 text-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {score >= 1 ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-emerald-400"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Star size={64} fill="currentColor" fillOpacity={0.1} strokeWidth={1.5} />
              </motion.div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
              >
                <Sparkles size={24} className="text-emerald-300" />
              </motion.div>
            </motion.div>
          ) : score === 0 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-zinc-300"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Circle size={64} strokeWidth={1} fill="currentColor" fillOpacity={0.05} />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Check size={32} className="text-zinc-400" strokeWidth={2} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              {/* 呼吸光圈 */}
              <motion.div
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-rose-400/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 text-rose-300"
              >
                <Circle size={64} strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xl font-serif font-bold tracking-tight text-zinc-800 min-h-[3rem] whitespace-pre-wrap text-balance">
            <Typewriter text={feedbackText} speed={60} />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-8 py-12">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12 text-center"
          >
            <h2 className="text-2xl font-serif font-bold tracking-tight text-balance">{step1Title}</h2>
            <div className="flex w-full max-w-sm mx-auto justify-between items-center px-2 gap-2">
              {[-2, -1, 0, 1, 2].map((score) => (
                <motion.button
                  key={score}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setRecord({ ...record, mood_score: score as MoodScore });
                    nextStep();
                  }}
                  className="transition-transform"
                >
                  {MOOD_EMOJIS[score]}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-serif font-bold tracking-tight text-center text-balance">{step2Title}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {PRESET_TAGS.map((tag) => (
                <motion.button
                  key={tag}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const tags = record.tags || [];
                    if (tags.includes(tag)) {
                      setRecord({ ...record, tags: tags.filter(t => t !== tag) });
                    } else if (tags.length < 3) {
                      setRecord({ ...record, tags: [...tags, tag] });
                    }
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border",
                    record.tags?.includes(tag) 
                      ? "bg-zinc-100 text-zinc-800 border-zinc-200 shadow-sm" 
                      : "bg-white text-black/40 border-black/[0.03] hover:border-black/10"
                  )}
                >
                  {tag}
                </motion.button>
              ))}
              
              {/* Custom Tags already added */}
              {record.tags?.filter(t => !PRESET_TAGS.includes(t)).map((tag) => (
                <motion.button
                  key={tag}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setRecord({ ...record, tags: record.tags?.filter(t => t !== tag) });
                  }}
                  className="px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border bg-zinc-100 text-zinc-800 border-zinc-200 shadow-sm"
                >
                  {tag}
                </motion.button>
              ))}

              {/* Add Custom Tag Button */}
              {!showCustomInput && (record.tags?.length || 0) < 3 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCustomInput(true)}
                  className="px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border border-dashed border-black/10 text-black/30 hover:border-black/20"
                >
                  + 自定义
                </motion.button>
              )}

              {showCustomInput && (
                <div className="flex items-center gap-2">
                  <input 
                    autoFocus
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value.slice(0, 6))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customTagInput.trim()) {
                        const newTag = customTagInput.trim();
                        if (!record.tags?.includes(newTag)) {
                          setRecord({ ...record, tags: [...(record.tags || []), newTag] });
                        }
                        setCustomTagInput('');
                        setShowCustomInput(false);
                      }
                    }}
                    placeholder="标签名..."
                    className="px-4 py-2 rounded-xl text-sm border border-black/10 outline-none focus:border-zinc-900 w-24"
                  />
                  <button 
                    onClick={() => {
                      if (customTagInput.trim()) {
                        const newTag = customTagInput.trim();
                        if (!record.tags?.includes(newTag)) {
                          setRecord({ ...record, tags: [...(record.tags || []), newTag] });
                        }
                      }
                      setCustomTagInput('');
                      setShowCustomInput(false);
                    }}
                    className="text-xs font-bold text-zinc-900"
                  >
                    确定
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-8">
              <button onClick={prevStep} className="flex items-center gap-2 text-black/20 font-bold">
                <ChevronLeft size={20} /> 上一步
              </button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={nextStep} 
                className="flex items-center gap-2 font-bold bg-zinc-900/5 px-6 py-3 rounded-2xl"
              >
                下一步 <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-serif font-bold tracking-tight text-center text-balance">{step3Title}</h2>
            <textarea
              autoFocus
              value={record.note}
              onChange={(e) => setRecord({ ...record, note: e.target.value.slice(0, 50) })}
              placeholder="今天发生了什么？"
              className="w-full h-40 p-6 bg-gray-50/50 rounded-[2rem] border border-black/[0.03] focus:border-black/[0.08] focus:bg-white focus:ring-0 outline-none resize-none text-xl font-medium placeholder:text-black/10 transition-all duration-300"
            />
            <div className="text-right text-xs font-bold text-black/20">
              {record.note?.length}/50
            </div>
            <div className="flex justify-between items-center pt-4">
              <button onClick={prevStep} className="flex items-center gap-2 text-black/20 font-bold">
                <ChevronLeft size={20} /> 上一步
              </button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={nextStep} 
                className="flex items-center gap-2 font-bold bg-zinc-100 text-zinc-600 px-6 py-3 rounded-2xl border border-zinc-200/50"
              >
                下一步 <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <h2 className="text-2xl font-serif font-bold tracking-tight text-center text-balance">{step4Title}</h2>
            
            <div className="space-y-12 w-full max-w-xs mx-auto">
              {/* 睡眠模块 */}
              <div className="space-y-4">
                <div className="flex justify-between items-end h-10">
                  <div className="relative flex-1 h-full flex items-end">
                    <AnimatePresence mode="wait">
                      {record.sleep_hours === 0 ? (
                        <motion.span
                          key="guide"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute bottom-0 left-0 text-xs font-bold text-black/20 tracking-wide whitespace-pre-wrap text-balance"
                        >
                          {isFirstRecordToday ? ROUTINE_TEXTS.sleep.guide.initial : ROUTINE_TEXTS.sleep.guide.continuation}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-0 left-0 text-xs text-black/50 font-medium leading-relaxed whitespace-pre-wrap text-balance"
                        >
                          {sleepCopy}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-[10px] font-bold text-black/30 tabular-nums pb-0.5">
                    {isFirstRecordToday ? '' : '+'}{record.sleep_hours}h
                  </span>
                </div>
                <input 
                  type="range" min="0" max="12" step="0.5"
                  value={record.sleep_hours}
                  onChange={(e) => setRecord({...record, sleep_hours: parseFloat(e.target.value)})}
                  className="w-full accent-zinc-900"
                />
              </div>

              {/* 运动模块 */}
              <div className="space-y-4">
                <div className="flex justify-between items-end h-10">
                  <div className="relative flex-1 h-full flex items-end">
                    <AnimatePresence mode="wait">
                      {record.exercise_mins === 0 ? (
                        <motion.span
                          key="guide"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute bottom-0 left-0 text-xs font-bold text-black/20 tracking-wide whitespace-pre-wrap text-balance"
                        >
                          {isFirstRecordToday ? ROUTINE_TEXTS.exercise.guide.initial : ROUTINE_TEXTS.exercise.guide.continuation}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-0 left-0 text-xs text-black/50 font-medium leading-relaxed whitespace-pre-wrap text-balance"
                        >
                          {exerciseCopy}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-[10px] font-bold text-black/30 tabular-nums pb-0.5">
                    {isFirstRecordToday ? '' : '+'}{record.exercise_mins}m
                  </span>
                </div>
                <input 
                  type="range" min="0" max="120" step="5"
                  value={record.exercise_mins}
                  onChange={(e) => setRecord({...record, exercise_mins: parseInt(e.target.value)})}
                  className="w-full accent-zinc-900"
                />
              </div>

              {/* 学习模块 */}
              <div className="space-y-4">
                <div className="flex justify-between items-end h-10">
                  <div className="relative flex-1 h-full flex items-end">
                    <AnimatePresence mode="wait">
                      {record.study_hours === 0 ? (
                        <motion.span
                          key="guide"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute bottom-0 left-0 text-xs font-bold text-black/20 tracking-wide whitespace-pre-wrap text-balance"
                        >
                          {isFirstRecordToday ? ROUTINE_TEXTS.study.guide.initial : ROUTINE_TEXTS.study.guide.continuation}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-0 left-0 text-xs text-black/50 font-medium leading-relaxed whitespace-pre-wrap text-balance"
                        >
                          {studyCopy}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-[10px] font-bold text-black/30 tabular-nums pb-0.5">
                    {isFirstRecordToday ? '' : '+'}{record.study_hours}h
                  </span>
                </div>
                <input 
                  type="range" min="0" max="12" step="0.5"
                  value={record.study_hours}
                  onChange={(e) => setRecord({...record, study_hours: parseFloat(e.target.value)})}
                  className="w-full accent-zinc-900"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button onClick={prevStep} className="flex items-center gap-2 text-black/20 font-bold hover:text-black/40 transition-colors">
                <ChevronLeft size={20} /> 上一步
              </button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="bg-zinc-100 text-zinc-900 px-10 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
              >
                记下了
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard = () => {
  const records = useMemo(() => storage.getRecords(), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredRecords = useMemo(() => {
    if (!selectedDate) return records.slice(-10).reverse();
    return records.filter(r => r.date === selectedDate).reverse();
  }, [records, selectedDate]);

  const avgScore = records.length > 0 
    ? (records.reduce((acc, r) => acc + r.mood_score, 0) / records.length).toFixed(1)
    : '0.0';

  const dailyTotals = useMemo(() => {
    const targetDate = selectedDate || format(new Date(), 'yyyy-MM-dd');
    const dayRecords = records.filter(r => r.date === targetDate);
    return {
      sleep: dayRecords.reduce((sum, r) => sum + (r.sleep_hours || 0), 0),
      exercise: dayRecords.reduce((sum, r) => sum + (r.exercise_mins || 0), 0),
      study: dayRecords.reduce((sum, r) => sum + (r.study_hours || 0), 0),
    };
  }, [records, selectedDate]);

  return (
    <div className="px-6 py-12 space-y-10 pb-28">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-zinc-700 tracking-tighter">情绪地图</h1>
          <p className="text-black/20 text-[10px] font-bold uppercase tracking-[0.2em]">{format(today, 'MMMM yyyy')}</p>
        </div>
        {selectedDate && (
          <button 
            onClick={() => setSelectedDate(null)}
            className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 border border-zinc-200 px-3 py-1 rounded-full"
          >
            重置筛选
          </button>
        )}
      </header>

      <section className="space-y-4">
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayRecords = records.filter(r => r.date === dateStr);
            const avgDayScore = dayRecords.length > 0 
              ? Math.round(dayRecords.reduce((acc, r) => acc + r.mood_score, 0) / dayRecords.length)
              : null;

            return (
              <motion.button
                key={dateStr}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  "aspect-square rounded-lg transition-all border",
                  selectedDate === dateStr ? "border-zinc-400 scale-110 z-10 shadow-md" : "border-transparent"
                )}
                style={{ 
                  backgroundColor: avgDayScore !== null ? MOOD_COLORS[avgDayScore] : '#FFFFFF',
                  borderColor: avgDayScore !== null ? 'transparent' : '#F0F0F0'
                }}
              />
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-black/[0.02] p-6 rounded-[2rem] space-y-2 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">平均情绪</p>
          <p className="text-4xl font-bold text-zinc-700 tracking-tighter">{avgScore}</p>
        </div>
        <div className="bg-white border border-black/[0.02] p-6 rounded-[2rem] space-y-2 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">本月记录</p>
          <p className="text-4xl font-bold text-zinc-700 tracking-tighter">{records.filter(r => r.date.startsWith(format(today, 'yyyy-MM'))).length}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-bold text-gray-800 tracking-tight">
          {selectedDate || '今日'} 汇总
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/5 p-4 rounded-2xl text-center">
            <p className="text-[10px] font-bold text-black/30 uppercase">睡眠</p>
            <p className="text-xl font-black">{dailyTotals.sleep}h</p>
          </div>
          <div className="bg-zinc-900/5 p-4 rounded-2xl text-center">
            <p className="text-[10px] font-bold text-black/30 uppercase">活动</p>
            <p className="text-xl font-black">{dailyTotals.exercise}m</p>
          </div>
          <div className="bg-zinc-900/5 p-4 rounded-2xl text-center">
            <p className="text-[10px] font-bold text-black/30 uppercase">学习</p>
            <p className="text-xl font-black">{dailyTotals.study}h</p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-base font-bold text-gray-800 tracking-tight">
          {selectedDate ? `${selectedDate} 的记录` : '最近记录'}
        </h2>
        <div className="space-y-4">
          {filteredRecords.length > 0 ? filteredRecords.map((r) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={r.id} 
              className="flex items-center gap-5 bg-white border border-black/[0.03] p-5 rounded-[1.5rem] shadow-sm"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                <div className="flex-shrink-0 transform scale-[0.6] origin-center">
                  {MOOD_EMOJIS[r.mood_score]}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-black/80">{r.note || '无备注'}</p>
                <p className="text-[10px] font-bold text-black/20 uppercase tracking-wider">
                  {r.time} · {r.tags.join(' · ')}
                </p>
              </div>
            </motion.div>
          )) : (
            <div className="py-10 text-center text-black/10 font-bold italic">暂无记录</div>
          )}
        </div>
      </section>
    </div>
  );
};

const Settings = () => {
  const [saved, setSaved] = useState(false);

  const handleExport = () => {
    const records = storage.getRecords();
    if (records.length === 0) {
      alert('暂无数据可导出');
      return;
    }
    storage.exportToCSV(records);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-6 py-12 space-y-12 pb-24">
      <h1 className="text-3xl font-serif font-black tracking-tighter">设置</h1>

      <section className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-black/20 flex items-center gap-2">
          数据管理
        </h2>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="w-full flex items-center justify-between bg-white border border-black/[0.03] p-6 rounded-[2rem] shadow-sm hover:bg-zinc-900/5 transition-colors"
        >
          <span className="font-bold">导出为 CSV</span>
          {saved ? <Check size={20} className="text-green-500" /> : <Download size={20} className="text-black/20" />}
        </motion.button>
      </section>

      <section className="pt-24 text-center">
        <p className="text-[10px] font-black text-black/10 uppercase tracking-widest">Version 1.2.0</p>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showFlow, setShowFlow] = useState(false);

  const records = useMemo(() => storage.getRecords(), [showFlow]);
  const lastRecord = useMemo(() => records.length > 0 ? records[records.length - 1] : null, [records]);

  // Session-aware greeting logic
  const [greeting] = useState(() => {
    const hasSeenGreeting = sessionStorage.getItem('hasSeenGreeting');
    if (!hasSeenGreeting) {
      sessionStorage.setItem('hasSeenGreeting', 'true');
      return generateGreeting(null); // First time opening app in this session
    }
    return generateGreeting(lastRecord); // Subsequent opens
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-600 font-sans selection:bg-zinc-100 selection:text-zinc-900">
      <main className="max-w-md mx-auto min-h-screen relative">
        <AnimatePresence mode="wait">
          {showFlow ? (
            <motion.div
              key="flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MoodFlow onComplete={() => setShowFlow(false)} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {activeTab === 'home' && (
                <div className="flex flex-col h-full bg-gray-50/20 px-6 pt-16 pb-24">
                  {/* 头部：日期与状态感知问候 */}
                  <div className="mb-12">
                    <p className="text-xs font-bold tracking-widest text-zinc-300 uppercase mb-2">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' })}
                    </p>
                    <div className="flex flex-col gap-1">
                      <span className="text-3xl font-serif font-bold text-zinc-700 tracking-tight whitespace-pre-wrap text-balance">
                        {greeting.time}
                      </span>
                      <span className="text-xl font-serif font-medium text-zinc-400 leading-snug whitespace-pre-wrap text-balance">
                        {greeting.text}
                      </span>
                    </div>
                  </div>

                  {/* 留白核心区（占据中间大部分位置，这叫“呼吸感”） */}
                  <div className="flex-1 flex flex-col justify-center items-center">
                    {/* 这里不再放巨大的黑框，而是放一个极其优雅的悬浮按钮 */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowFlow(true)}
                      className="group relative flex items-center justify-center w-20 h-20 bg-white text-zinc-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-zinc-100"
                    >
                      <Plus size={32} strokeWidth={1.2} />
                      {/* 按钮底部的弥散光 */}
                      <div className="absolute -inset-4 bg-zinc-400/5 rounded-full blur-3xl -z-10 group-hover:bg-zinc-400/10 transition-all"></div>
                    </motion.button>
                    <span className="mt-8 text-[9px] font-bold text-zinc-300 uppercase tracking-[0.4em]">记录当下</span>
                  </div>
                </div>
              )}
              {activeTab === 'stats' && <Dashboard />}
              {activeTab === 'settings' && <Settings />}
            </motion.div>
          )}
        </AnimatePresence>

        {!showFlow && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
}
