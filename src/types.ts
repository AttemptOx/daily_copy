/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoodScore = -2 | -1 | 0 | 1 | 2;

export interface MoodRecord {
  id: string; // Unique ID (timestamp or UUID)
  date: string; // YYYY-MM-DD for grouping
  time: string; // HH:mm for display
  mood_score: MoodScore;
  tags: string[];
  note: string;
  sleep_hours: number;
  exercise_mins: number;
  study_hours: number;
  timestamp: number;
}

export interface AppSettings {
  language: string;
}
