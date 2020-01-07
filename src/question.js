export default class Question {
  static create(question) {
    return fetch('https://question-app-js.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">У вас нет прав или вы женщина!</p>')
    }
    return fetch(`https://question-app-js.firebaseio.com/questions.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`
        }
        return response ? Object.keys(response).map(key => ({
          ...response[key],
          id: key
        })) : []
      })
  }

  static renderList() {
    const questions = getFromLocalStorage();
    const html = questions.length
      ? questions.map(toHtmlCard).join('')
      : `<div class="mui--text-headline">Вы ничего не спрашивали</div>`;

    const list = document.getElementById('list');
    list.innerHTML = html;
  }

  static listToHtml(questions) {
    return questions.length
      ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
      : '<p>Вопросов нет</p>'
  }
}

function addToLocalStorage(question) {
  const all = getFromLocalStorage();
  all.push(question);
  localStorage.setItem('questions', JSON.stringify(all));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toHtmlCard(question) {
  return `
      <div class="mui--text-black-54">
        ${ new Date(question.date).toLocaleDateString() }
        ${ new Date(question.date).toLocaleTimeString() }
      </div>
      <div>${ question.text }</div>
      <br>
  `
}
