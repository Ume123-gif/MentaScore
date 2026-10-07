/**
 * wellnessEngine.js
 * Rule-based, explainable wellness suggestions derived from the same
 * factors the model weighs. Deliberately simple and transparent — this is
 * an awareness tool, not a clinical recommendation engine.
 */

export function getWellnessSuggestions(values) {
  const suggestions = []

  if (Number(values.sleepHoursPerNight) < 6.5) {
    suggestions.push({
      title: 'Protect a longer sleep window',
      detail:
        'Your reported sleep sits below the range associated with steadier scores in this dataset. Aim to shift bedtime earlier by 30–45 minutes rather than changing wake time.',
      tag: 'Sleep',
    })
  }

  if (Number(values.avgDailyUsageHours) > 6) {
    suggestions.push({
      title: 'Trim high-usage stretches',
      detail:
        'Daily usage above ~6 hours tracks with lower scores here. Try setting app timers on the one or two apps that account for most of your screen time.',
      tag: 'Screen time',
    })
  }

  if (Number(values.dailyUnlocks) > 180) {
    suggestions.push({
      title: 'Reduce phone check frequency',
      detail:
        'A high unlock count often reflects reactive checking rather than intentional use. Batching notifications into 2–3 windows a day can cut this down.',
      tag: 'Digital habits',
    })
  }

  if (values.stressLevel === 'High' || values.stressLevel === 'Very High') {
    suggestions.push({
      title: 'Build in short stress resets',
      detail:
        'Reported stress is a strong factor in this model. Brief, regular breaks — a walk, breathing exercise, or stepping away from screens — tend to help more than one long break.',
      tag: 'Stress',
    })
  }

  if (Number(values.physicalActivityHours) < 1) {
    suggestions.push({
      title: 'Add light movement to your day',
      detail:
        'Even 20–30 minutes of daily activity is associated with meaningfully higher scores in this dataset, regardless of intensity.',
      tag: 'Activity',
    })
  }

  if (Number(values.studyHours) < 2 && values.academicLevel !== 'High School') {
    suggestions.push({
      title: 'Structure focused study blocks',
      detail:
        'Low study hours combined with high usage can point to fragmented focus. Two or three uninterrupted 45-minute blocks often beat unstructured screen-adjacent studying.',
      tag: 'Study',
    })
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: 'Your habits look well balanced',
      detail:
        'Sleep, stress, activity and usage all fall in ranges associated with steadier scores in this dataset. Keep an eye on this mix rather than any single number.',
      tag: 'Overall',
    })
  }

  return suggestions.slice(0, 4)
}

export function getScoreVerdict(score) {
  if (score >= 7.5) {
    return {
      label: 'Strong well-being signal',
      tone: 'positive',
      description: 'Your inputs align with the higher end of scores seen in this dataset.',
    }
  }
  if (score >= 6) {
    return {
      label: 'Steady, with room to improve',
      tone: 'neutral',
      description: 'A solid baseline — a few adjustments below could move this higher.',
    }
  }
  if (score >= 4.5) {
    return {
      label: 'Some strain showing',
      tone: 'caution',
      description: 'A few factors are pulling your score down. Small, consistent changes tend to help most.',
    }
  }
  return {
    label: 'Notable strain showing',
    tone: 'alert',
    description:
      'Several factors here are associated with lower scores. Consider talking to someone you trust, alongside the suggestions below.',
  }
}
