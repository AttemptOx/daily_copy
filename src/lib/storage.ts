import { MoodRecord, AppSettings } from '../types';

const STORAGE_KEY = 'mood_sensor_records';
const SETTINGS_KEY = 'mood_sensor_settings';

export const storage = {
  getRecords: (): MoodRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRecord: (record: MoodRecord) => {
    const records = storage.getRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { language: 'zh' };
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  exportToCSV: (records: MoodRecord[]) => {
    const headers = ['date', 'time', 'mood', 'tags', 'sleep', 'exercise', 'study', 'note'];
    const rows = records.map(r => [
      r.date,
      r.time,
      r.mood_score,
      `"${r.tags.join(', ')}"`,
      r.sleep_hours,
      r.exercise_mins,
      r.study_hours,
      `"${r.note.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    // Add BOM to fix Excel encoding issues
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mood_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
