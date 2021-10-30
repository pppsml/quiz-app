class ConstructorScreen {
    constructor() {
        this.currentAnswer = 0
        this.currentConstuctorQuestion = data.newQuizData.quiz.length + 1
        config.currentScreen = 'constructor'

        quizContainer.append(this.loadScreen())
        checkBurgerBtn()
    }
    loadScreen() {
        const createQuizBtn = document.getElementById('btn__create')
        const startScreenBtn = document.getElementById('btn__startScreen')
        createQuizBtn.classList.add('dn')
        startScreenBtn.classList.remove('dn')
    
        selectQuizContainer.innerHTML = ''

        quizContainer.innerHTML = ''

        const constructorContainer = getElement('form', [], {
            id: '_constructor',
        })
        constructorContainer.addEventListener('submit', event => {
            event.preventDefault()
        })


        // title
        constructorContainer.append(getElement('h2', ['title'],{
            textContent: 'Quiz constructor',
        }))


        // instruction
        constructorContainer.append(getElement('p', ['text', 'text-minimal'], {
            textContent: '(fill in all the fields)',
        }))
        constructorContainer.append(getElement('p', ['text', 'text-minimal'], {
            textContent: '(press on create quiz button after creating question)',
        }))


        // Question number + input
        const questionRow = getElement('div', ['row'])
        constructorContainer.append(getElement('p', ['text', 'tal'], {
            textContent: `Question №${this.currentConstuctorQuestion}: `,
        }))
        questionRow.append(getElement('input', ['text', 'tal'], {
            type: 'text',
            name: 'question',
            autocomplete: 'off',
            placeholder: '(min 8, max 150)',
            minLength: '8',
            maxLength: '150',
            required: 'true',
        }))
        constructorContainer.append(questionRow)

        // Inputs for answer options
        constructorContainer.append(getElement('p', ['text', 'tal'], {
            textContent: 'Answers:',
        }))
        constructorContainer.append(getElement('p', ['text', 'text-minimal', 'tal'], {
            textContent: `(min: 3, max: ${config.maxAnwerOptions})`,
        }))
        const answerContainer = getElement('div', ['answer__container'], {
            id: 'answerContainer',
        })
        constructorContainer.append(answerContainer)


        // buttons for add and remove inputs for answer options
        const btnContainer = getElement('div', ['row', 'row__btns'])
        this.addAnswerBtn = getElement('button', ['btn__styled', 'btn__circle'], {
            type: 'button',
            alt: 'Add more answer option',
            title: 'Add more answer option',
            textContent: '+',
        })
        this.removeAnswerBtn = getElement('button', ['btn__styled', 'btn__circle'], {
            type: 'button',
            alt: 'Remove last answer option',
            title: 'Remove last answer option',
            textContent: '-',
        })
        this.addAnswerBtn.addEventListener('click', () => answerContainer.append(this.createAnswerInput()))
        this.removeAnswerBtn.addEventListener('click', () => this.removeAnswerInput())
        btnContainer.append(this.addAnswerBtn)
        btnContainer.append(this.removeAnswerBtn)
        constructorContainer.append(btnContainer)


        // create default 3 inputs
        for (let i = 0; i < 3; i++) {
            answerContainer.append(this.createAnswerInput())
        }

        // input for correct answer option
        const correctAnswerRow = getElement('div', ['row'])
        const correctText = getElement('p', ['text'], {
            textContent: 'Correct: ',
        })
        correctText.style.flexBasis = '40%'
        correctAnswerRow.append(correctText)
        correctAnswerRow.append(getElement('input', ['text', 'tal'], {
            type: 'text',
            name: 'correct',
            placeholder: `From "${config.answerOptions[0]}" to "${config.answerOptions[2]}"`,
            autocomplete: 'off',
            required: 'true',
            minLength: '1',
            maxLength: '1',
            pattern: `[${config.answerOptions[0]}-${config.answerOptions[2]}]`,
        }))
        constructorContainer.append(correctAnswerRow)
    

        // buttons for creating quiz and new question
        const dataStatus = data.newQuizData.quiz.length == 0
        const newQuizBtn = getElement('button', ['btn__styled', 'btn__big'], {
            type: 'submit',
            textContent: 'Create quiz',
            disabled: dataStatus,
        })
        newQuizBtn.addEventListener('click', (event) => {
            this.newQuiz(event)
        })

        const newQuestionBtn = getElement('button', ['btn__styled', 'btn__big'], {
            type: 'submit',
            textContent: 'New question',
        })
        newQuestionBtn.addEventListener('click', this.newQuestion)

        const btn__container = getElement('div', ['row', 'big__btn-container'])

        btn__container.append(newQuizBtn)
        btn__container.append(newQuestionBtn)
        constructorContainer.append(btn__container)

        return constructorContainer
    }

	newQuiz(event) {
        event.preventDefault()
		if (data.newQuizData.quiz.length > 0) {
            loadModal('newQuiz')
			const modal = document.getElementById('modal')
			toggleElem(modal)
            const newQuizBtn = document.getElementById('newQuizBtn')

			const formModal = document.forms['_modal']
			formModal.addEventListener('submit', (event) => {
                newQuizBtn.disabled = true
				event.preventDefault()
                
				const modalInput = formModal.querySelector('input[name="quizName"]')
				const quizName = modalInput.value.trim()
				const id = +(new Date)
				data.newQuizData.name = quizName
				data.newQuizData.id = id
				data.newQuizData.likes = 0

				// Add a new field in doc "QuizData"
				_quizzes.doc(`${id}`)
				.withConverter(quizConverter)
				.set(data.newQuizData)
				.then(() => {
					alert("Quiz successfully created!");
					localStorage.setItem('newQuizData', '')
					location.reload()
				})
				.catch((error) => {
					console.error("Error creating quiz: ", error);
					alert('Error creating quiz: ', error)
                    newQuizBtn.disabled = false
				});
			})
		}
	}

	newQuestion() {
		const form = document.forms['_constructor']
		if (inputValidation(form)) {
			const answerValues = []

            const spaceRegEx = / +/g

			const questionText = form.querySelector('input[name="question"]').value.trim().replace(spaceRegEx, ' ')
			const answers = form.querySelectorAll('input[name="answer"]')
			const correctText = form.querySelector('input[name="correct"]').value.trim().replace(spaceRegEx, ' ')
			
			answers.forEach(answerInput => answerValues.push(answerInput.value.trim().replace(spaceRegEx, ' ')))


			let newData = {
				question: `${questionText}`,
				answers: [...answerValues],
				correct: `${correctText}`,
			}

			data.newQuizData.quiz.push(newData)
			localStorage.setItem('newQuizData', JSON.stringify(data.newQuizData.quiz))
			this.currentConstuctorQuestion++
			new ConstructorScreen()
		}
	}



    createAnswerInput() {
        const row = getElement('div', ['row', 'answer__option'])
        const text = getElement('p', ['text'], {
            textContent: `${config.answerOptions[this.currentAnswer]}:`,
        })
        const input = getElement('input', ['text', 'tal'], {
            name: 'answer',
            autocomplete: 'off',
            placeholder: '(min 2, max 85)',
            minLength: '2',
            maxLength: '85',
            required: 'true',
        })
        this.currentAnswer++
        
        row.append(text)
        row.append(input)
        this.updateBtn()

        return row
    }

    removeAnswerInput() {
        const answerRows = document.querySelectorAll('.answer__option')
        answerRows[this.currentAnswer-1].remove()
        this.currentAnswer--
        this.updateBtn()
    }

    updateBtn() {
        // check count of inputs

		this.addAnswerBtn.disabled = this.currentAnswer > config.maxAnwerOptions - 1 ? true : false
		this.removeAnswerBtn.disabled = this.currentAnswer < 4 ? true : false

		const correctAnswerInput = document.querySelector('input[name="correct"]')
		if (correctAnswerInput) {
			correctAnswerInput.placeholder = `From "${config.answerOptions[0]}" to "${config.answerOptions[this.currentAnswer - 1]}"`
			correctAnswerInput.pattern = `[${config.answerOptions[0]}-${config.answerOptions[this.currentAnswer - 1]}]`
		}
	}
}