const data = {
    newQuizData: {},
    quizNames: [],
    docData: {},
    isLikedQuizzes: JSON.parse(localStorage.getItem('isLikedQuizzes')),
}

data.isLikedQuizzes = data.isLikedQuizzes ? 
data.isLikedQuizzes : (function() { 
    localStorage.setItem('isLikedQuizzes', JSON.stringify([])) 
    return []
})();


const config = {
    darkThemeColors: [
        ['#3b3b3b', 'default'],
        ['#FF3500', 'red'],
        ['#FF9500', 'orange'],
        ['#00C734', 'green'],
        ['#00BFE6', 'cyan'],
        ['#BB86FC', 'violet'],
        ['#FF66B3', 'pink'],
        ['#FF66B3', 'rainbow'],
    ],
    answerOptions: 'abcdefghijklmnopqrstuvwxyz',
    maxAnwerOptions: 26, // answerOptions.length
    itemsPerPage: 30,
    currentScreen: 'start',
    currentQuiz: 0,
    score: 0,
}


// check dark theme prefers
const themeLink = document.querySelector(`#themeLink`)
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
localStorage.getItem('theme') ? null : prefersDarkTheme ? 
	localStorage.setItem('theme', 'dark-default') : 
	localStorage.setItem('theme', 'light');

localStorage.getItem('theme') == 'light' ? 
themeLink.setAttribute('href', 'assets/css/themes/light/theme-light.css') :
themeLink.setAttribute('href', `assets/css/themes/dark/theme-${localStorage.getItem('theme')}.css`)



class QuizData {
	constructor({name, id, quiz, likes}) {
		this.name = name
		this.id = id
		this.quiz = quiz
		this.likes = likes
	}
	plusLikes () {
		data.isLikedQuizzes.push(this.id)
		localStorage.setItem('isLikedQuizzes', JSON.stringify(data.isLikedQuizzes))

		let thatObject = {
			name: this.name,
			id: this.id,
			quiz: this.quiz,
			likes: this.likes + 1,
		}

		_quizzes.doc(`${this.id}`).update(thatObject)
		.then(console.log('liked'))
		.catch(err => alert(`An error occurred on the server.
		Please try again later.`)&&console.log(`An error occurred on the server: ${err}.
		Please try again later.`))
	}
}



// DOM vars
const body = document.body
const loader = document.querySelector('.loader__wrapper')
const quizContainer = document.querySelector('.quiz__container')
const selectQuizContainer = document.querySelector('.select__quiz-container')
const mainScreenBtns = document.getElementById('mainScreenBtns')
const modalWrapper = document.getElementById('modal')
const burgerBtn = document.getElementById('burgerBtn')
const settingsBtn = document.getElementById('settingsBtn')



// burger and settings button functional
burgerBtn.addEventListener('click', () => {
	const createBtn = document.querySelector('#btn__create')
	if (burgerBtn.classList.contains('active')) {
		unlockBody()
		burgerBtn.disabled = true
		settingsBtn.classList.remove('active')
		createBtn.classList.remove('dn')
		selectQuizContainer.classList.add('slideOut-left-nav')
		setTimeout(() => {
			selectQuizContainer.classList.add('dn')
			selectQuizContainer.classList.remove('slideOut-left-nav')
			burgerBtn.disabled = false
		}, 750);
		burgerBtn.classList.remove('active')
	} else {
		lockBody()
		selectQuizContainer.classList.remove('dn')
		settingsBtn.classList.add('active')
		createBtn.classList.add('dn')
		burgerBtn.classList.add('active')
		burgerBtn.disabled = true
		setTimeout(() => {
			burgerBtn.disabled = false
		}, 750);
	}
})

settingsBtn.addEventListener('click', () => {
	loadModal('settings')
	const modal = document.getElementById('modal')
	toggleElem(modal)
})




// additional functions

// func for creating DOM elements
const getElement = (tagName, classNames, attributes) => {
	const element = document.createElement(tagName)

	if (classNames) {
		element.classList.add(...classNames)
	}

	if (attributes) {
		for (const attribute in attributes) {
			element[attribute] = attributes[attribute]
		}
	}

	return element
}

function checkBurgerBtn() {
	if (config.currentScreen == 'start') {
		burgerBtn.classList.remove('dn')
	} else {
		burgerBtn.classList.add('dn')
	}
}

function toggleElem(elem) {
	if (elem) {
		if (elem.classList.contains('dn')) {
			elem.classList.remove('dn')
		} else {
			elem.classList.add('dn')
		}
	}
}

function inputValidation(form) {
	const formInputs = form.querySelectorAll('input') 
	let errors = 0
	formInputs.forEach(item => {
		if (item.value.trim() && !item.validity.patternMismatch  && item.value.trim().length >= item.minLength) {
			item.classList.remove('_error')
		} else {
			item.classList.add('_error')
			errors++
		}
	})
	return errors == 0
}

function lockBody() {
	body.style.overflow = 'hidden'
}
function unlockBody() {
	body.style.overflow = ''
}