// Готовая защитная механика. Не изменяйте эту функцию.
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

let resultCount
let resultList

function selectAttempts(filter) {
  const attempts = window.reportData.attempts

  if (filter === 'all') {
    return attempts
  }

  if (filter === 'passed') {
    return attempts.filter((attempt) => attempt.passed === true)
  }

  if (filter === 'failed') {
    return attempts.filter((attempt) => attempt.passed === false)
  }

  return []
}

function renderAttempts(attempts) {
  let html = ''

  attempts.forEach((attempt) => {
    const status = attempt.passed ? 'Порог пройден' : 'Порог не пройден'

    html += `
      <li class="result-item">
        <span class="result-name">${escapeHtml(attempt.name)}</span>
        <span>${attempt.score} из ${window.reportData.questionCount} (${attempt.percentage}%) - ${status}</span>
      </li>`
  })

  resultList.innerHTML = html
  resultCount.textContent = `Показано: ${attempts.length} из ${window.reportData.attempts.length}`
}

function startFilter() {
  const form = document.querySelector('#filter-form')
  const filter = document.querySelector('#filter')
  resultCount = document.querySelector('#result-count')
  resultList = document.querySelector('#result-list')

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const attempts = selectAttempts(filter.value)
    renderAttempts(attempts)
  })

  renderAttempts(selectAttempts(filter.value))
}

startFilter()
