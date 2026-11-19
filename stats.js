const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (typeof data !== 'object' || data === null || isArray(data)) {
    return false
  }

  if (typeof data.quizTitle !== 'string' || data.quizTitle.trim() === '') {
    return false
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  for (let index = 0; index < data.attempts.length; index += 1) {
    const attempt = data.attempts[index]

    if (typeof attempt !== 'object' || attempt === null || isArray(attempt)) {
      return false
    }

    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
      return false
    }

    if (!isArray(attempt.answers) || attempt.answers.length !== data.correctAnswers.length) {
      return false
    }
  }

  return true
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0

  correctAnswers.forEach((answer, index) => {
    if (attempt.answers[index] === answer) {
      score += 1
    }
  })

  const percentage = Math.round(score / correctAnswers.length * 100)

  return {
    name: attempt.name.trim(),
    score,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) => calculateAttempt(attempt, data.correctAnswers))
  const totalPercentage = attempts.reduce((total, attempt) => total + attempt.percentage, 0)
  const passedCount = attempts.filter((attempt) => attempt.passed).length
  let best = attempts[0]

  attempts.forEach((attempt) => {
    if (attempt.score > best.score) {
      best = attempt
    }
  })

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(totalPercentage / attempts.length),
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}
