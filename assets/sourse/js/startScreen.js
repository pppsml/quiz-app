function startScreen() {
    quizContainer.innerHTML = ''
	quizContainer.style.minHeight = '200px'
	quizContainer.style.padding = '32px 32px calc(50px + 16px)'
    
	config.currentQuiz = 0
	config.score = 0
	config.currentScreen = 'start'

	let createQuizBtn = document.getElementById('btn__create')
	let startScreenBtn = document.getElementById('btn__startScreen')

	const selectedQuiz = getElement('p', ['text', 'title'], {
		textContent: `Selected quiz: ${data.quizNames[0]}`,
	})
	selectedQuiz.style.fontWeight = '500'
	const startQuizBtn = getElement('button', ['btn__styled', 'btn__big'], {
		textContent: 'Start quiz',
	})
	if (!createQuizBtn && !startScreenBtn) {
		createQuizBtn = getElement('button', ['btn__styled', 'btn__small', 'dn'], {
			textContent: 'Create your own quiz',
			id: 'btn__create',
			style: 'z-index: 1001;'
		})
		startScreenBtn = getElement('button', ['btn__styled', 'btn__small'], {
			textContent: 'Back to start screen',
			id: 'btn__startScreen',
			style: 'z-index: 1001;'
		})
		createQuizBtn.addEventListener('click', () => {
			if (!!localStorage.getItem('newQuizData')) {
				toggleElem(modalWrapper)
				loadModal('savedQuiz')
			} else {
				data.newQuizData = {name:'',quiz:[]}
				new ConstructorScreen()
			}
		})
		startScreenBtn.addEventListener('click', startScreen)

		mainScreenBtns.append(createQuizBtn)
		mainScreenBtns.append(startScreenBtn)
	}

	createQuizBtn.classList.remove('dn')
	startScreenBtn.classList.add('dn')

	quizContainer.append(selectedQuiz)
	quizContainer.append(startQuizBtn)

	startQuizBtn.addEventListener('click', () => new QuizScreen())

	new SelectQuizMenu()
	checkBurgerBtn()
}