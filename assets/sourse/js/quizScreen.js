class QuizScreen {
    constructor() {
        this.loadQuiz()
    }

    loadQuiz() {
        config.currentScreen = 'quiz'
        checkBurgerBtn()
        quizContainer.innerHTML = ''
        selectQuizContainer.innerHTML = ''
    
        const submitBtn = getElement('button', ['btn__styled', 'btn__big'], {
            id: 'submitBtn',
            type: 'submit',
            textContent: 'Submit',
        })
        submitBtn.addEventListener('click', () => this.submitAnswer())
        const nextQuizBtn = getElement('button', ['btn__styled', 'btn__big', 'dn'], {
            id: 'nextBtn',
            type: 'submit',
            textContent: 'Next',
        })
        nextQuizBtn.addEventListener('click', () => this.nextQuestion())
        
        quizContainer.append(getElement('h2', ['question', 'title', 'tal'], {
            id: 'question',
            textContent: `${config.currentQuiz+1}. ${data.currentQuizData[config.currentQuiz].question}`,
        }))
    
        let progressBar = document.querySelector('.progressBar')
        let bar = document.querySelector('.bar')
        if (!progressBar) {
            progressBar = getElement('div', ['progressBar'])
            bar = getElement('div', ['bar'])
            progressBar.append(bar)
        }
        let num = (config.currentQuiz + 1) / data.currentQuizData.length
        let barWidth = num.toFixed(4) * 100
        bar.style.width = `${barWidth}%`
        quizContainer.append(progressBar)
    
        quizContainer.append(this.loadAnswers())
        quizContainer.append(submitBtn)
        quizContainer.append(nextQuizBtn)
    }

    loadAnswers() {
        const answerContainer = getElement('ul', ['answer__container'])
    
        for (let i = 0; i < data.currentQuizData[config.currentQuiz].answers.length; i++) {
            const answerInput = getElement('input', ['answer__input'], {
                id: config.answerOptions[i],
                name: 'answer',
                type: 'radio',
            })
        
            const answerLabel = getElement('label', ['answer__label'], {
                htmlFor: config.answerOptions[i],
                id: `${config.answerOptions[i]}_text`,
                textContent: data.currentQuizData[config.currentQuiz].answers[i],
            })
    
            const answer = getElement('li', ['text', 'answer'], )
    
            answer.append(answerInput)
            answer.append(answerLabel)
    
            answerContainer.append(answer)
        }
    
        const marker = getElement('span', ['dn'], {
            id: 'marker',
        })
        answerContainer.append(marker)
        answerContainer.addEventListener('click', event => {
            if (event && event.target.tagName == 'LABEL') {
                const elHeight = event.target.offsetHeight
                const labelTopOffset = event.target.parentElement.offsetTop
                marker.classList.remove('dn')
                marker.style.transform = `translateY(${labelTopOffset + (elHeight / 2) - (marker.offsetHeight / 2)}px)`
            } else {
                return
            }
        })
        
        return answerContainer
    }

    loadResults() {
        quizContainer.innerHTML = ''
    
        quizContainer.append(getElement('h2', ['text', 'title'], {
            innerText: 'Congratulation!\nHave you finished the quiz!',
        }))
    
        quizContainer.append(getElement('p', ['text'], {
            textContent: `You have answered correctly to ${config.score}/${data.currentQuizData.length}`,
        }))
    
        const startScreenBtn = getElement('button', ['btn__styled', 'btn__big'], {
            type: 'submit',
            textContent: 'Return to start screen',
        })
        startScreenBtn.addEventListener('click', startScreen)
    
        data.isLikedQuizzes.length == 0 ? 
        createLikeRow() : 
        data.isLikedQuizzes.indexOf(data.currentQuizId) != -1 ? null : createLikeRow()
    
        quizContainer.append(startScreenBtn)
        function createLikeRow() {
            const likeRow = getElement('div', ['row', 'text', 'row__btns', 'm0'], {
                id: 'likeRow',
            })
            const likeBtn = getElement('button', ['btn__styled', 'btn__small'], {
                id: 'likeBtn',
                innerHTML: `Like<i class="fas fa-heart"></i>`,
            })
            likeBtn.addEventListener('click', () => {
                data.docData[data.currentQuizId].plusLikes()
            }, {once: true,})
        
            likeRow.append(getElement('p', [], {
                textContent: 'Did you like the quiz?',
            }))
            likeRow.append(likeBtn)
            quizContainer.append(likeRow)
        }
    }


    submitAnswer() {
        let answer = this.getSelected()
        const correct = data.currentQuizData[config.currentQuiz].correct
    
        if (answer) {
            if (answer == correct) {
                config.score++
            } else {
                const uncorrectInput = document.querySelector(`input[id="${answer}"]`)
                uncorrectInput.parentElement.classList.add('uncorrect')
            }
    
            const answerContainer = document.querySelector('.answer__container')
            const correctInput = answerContainer.querySelector(`input[id="${correct}"]`)
            const marker = document.querySelector('#marker')
    
            marker.style.display = 'none'
            correctInput.parentElement.classList.add('correct')
    
            const submitBtn = document.getElementById('submitBtn')
            const nextBtn = document.getElementById('nextBtn')
            toggleElem(submitBtn)
            toggleElem(nextBtn)
        }
    }

    nextQuestion() {
        config.currentQuiz++
        config.currentQuiz < data.currentQuizData.length ? 
        this.loadQuiz() : 
        this.loadResults()
    }

    getSelected() {
        const answerRadios = document.querySelectorAll('.answer__input')
        let answer = undefined
    
        answerRadios.forEach((answerEl) => {
            if (answerEl.checked === true) {
                answer = answerEl.id
                answerEl.checked = false
            }
        })
        if (answer) {
            for (let i = 0; i < answerRadios.length; i++) {
                answerRadios[i].parentElement.classList.add('disabled')
                answerRadios[i].disabled = true
            }
        }
        return answer
    }
}