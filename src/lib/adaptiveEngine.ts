import { DifficultyLevel, AnswerVerdict, TopicMastery, AnswerRecord, PressureIntensity } from './types';

export interface AdaptiveState {
  currentDifficulty: DifficultyLevel;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  topicMasteries: Record<string, { correct: number; total: number; score: number }>;
  nextTargetTopic: string | null;
  pressure: number; // 0 to 100
}

export function initializeAdaptiveState(topics: string[], initialDifficulty: DifficultyLevel = 'applied'): AdaptiveState {
  const masteries: Record<string, { correct: number; total: number; score: number }> = {};
  topics.forEach((t) => {
    masteries[t] = { correct: 0, total: 0, score: 50 }; // start neutral 50%
  });

  return {
    currentDifficulty: initialDifficulty,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    topicMasteries: masteries,
    nextTargetTopic: topics[0] || null,
    pressure: 20
  };
}

export function updateAdaptiveState(
  prevState: AdaptiveState,
  currentTopic: string,
  verdict: AnswerVerdict,
  currentDifficulty: DifficultyLevel,
  intensity: PressureIntensity,
  allTopics: string[]
): AdaptiveState {
  const isCorrect = verdict === 'correct';
  const isPartial = verdict === 'partially_correct';
  const isWrong = verdict === 'incorrect';

  // 1. Update Streaks
  let consecutiveCorrect = prevState.consecutiveCorrect;
  let consecutiveIncorrect = prevState.consecutiveIncorrect;

  if (isCorrect) {
    consecutiveCorrect += 1;
    consecutiveIncorrect = 0;
  } else if (isWrong) {
    consecutiveIncorrect += 1;
    consecutiveCorrect = 0;
  } else {
    // Partial reset streak
    consecutiveCorrect = 0;
    consecutiveIncorrect = 0;
  }

  // 2. Adaptive Difficulty Rules:
  // - Two correct in a row -> promote difficulty
  // - Two incorrect in a row -> demote difficulty and revisit same topic at foundation level
  let nextDifficulty = currentDifficulty;
  let nextTargetTopic: string | null = null;

  if (consecutiveCorrect >= 2) {
    if (currentDifficulty === 'foundation') nextDifficulty = 'applied';
    else if (currentDifficulty === 'applied') nextDifficulty = 'expert';
  } else if (consecutiveIncorrect >= 2) {
    if (currentDifficulty === 'expert') nextDifficulty = 'applied';
    else if (currentDifficulty === 'applied') nextDifficulty = 'foundation';
    // Revisit same topic at foundation level
    nextTargetTopic = currentTopic;
  }

  // 3. Update Topic Mastery
  const updatedMasteries = { ...prevState.topicMasteries };
  const currentRecord = updatedMasteries[currentTopic] || { correct: 0, total: 0, score: 50 };
  
  const newTotal = currentRecord.total + 1;
  const newCorrect = currentRecord.correct + (isCorrect ? 1 : isPartial ? 0.5 : 0);

  // Difficulty weighting: Expert questions grant more mastery, foundation grants less
  const weight = currentDifficulty === 'expert' ? 25 : currentDifficulty === 'applied' ? 18 : 12;
  let delta = 0;
  if (isCorrect) delta = weight;
  else if (isPartial) delta = Math.round(weight * 0.3);
  else delta = -weight;

  const newScore = Math.max(5, Math.min(100, currentRecord.score + delta));

  updatedMasteries[currentTopic] = {
    correct: newCorrect,
    total: newTotal,
    score: newScore
  };

  // 4. Topic Selection Rule:
  // Repeated failure in one topic -> prioritize that topic next
  if (!nextTargetTopic) {
    const sortedWeakest = Object.entries(updatedMasteries)
      .filter(([t]) => allTopics.includes(t))
      .sort((a, b) => a[1].score - b[1].score);

    // If weakest topic is below 55% and was not just asked twice in a row, test it
    if (sortedWeakest.length > 0 && sortedWeakest[0][1].score < 55 && sortedWeakest[0][0] !== currentTopic) {
      nextTargetTopic = sortedWeakest[0][0];
    } else {
      // Rotate to next topic in list
      const currentIndex = allTopics.indexOf(currentTopic);
      const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % allTopics.length : 0;
      nextTargetTopic = allTopics[nextIndex] || currentTopic;
    }
  }

  // 5. Calculate Pressure Meter (0 - 100%)
  const intensityMultiplier = intensity === 'brutal' ? 1.4 : intensity === 'gentle' ? 0.7 : 1.0;
  const diffBase = nextDifficulty === 'expert' ? 50 : nextDifficulty === 'applied' ? 30 : 15;
  const wrongPenalty = consecutiveIncorrect * 20;
  const correctRelief = consecutiveCorrect * 5;

  const rawPressure = (diffBase + wrongPenalty - correctRelief) * intensityMultiplier;
  const pressure = Math.max(10, Math.min(100, Math.round(rawPressure)));

  return {
    currentDifficulty: nextDifficulty,
    consecutiveCorrect,
    consecutiveIncorrect,
    topicMasteries: updatedMasteries,
    nextTargetTopic,
    pressure
  };
}

export function formatTopicMasteryList(
  topicMap: Record<string, { correct: number; total: number; score: number }>,
  allTopics: string[]
): TopicMastery[] {
  return allTopics.map((topic) => {
    const record = topicMap[topic] || { correct: 0, total: 0, score: 50 };
    return {
      topic,
      mastery: record.score,
      questionsAnswered: record.total,
      correctCount: Math.round(record.correct)
    };
  });
}
