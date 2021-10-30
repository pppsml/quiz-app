function loadModal(type) {
	// close modal when clicked outside the modal
    // nice var name xDD
	modalWrapper.addEventListener('click', closeModalWhenClickOutsideTheModal)
    function closeModalWhenClickOutsideTheModal(event) {
        if (event.target.id == modalWrapper.id) {
            event.target.firstChild.classList.add('slideOut-top')
            setTimeout(() => {
                modalWrapper.classList.add('dn')
                burgerBtn.classList.contains('active') ? 
                null :
                unlockBody()
            }, 1000);
            this.removeEventListener('click', closeModalWhenClickOutsideTheModal)
        }
    }

	if (type == 'settings') {
		const burgerBtn = document.getElementById('burgerBtn')
		modalWrapper.innerHTML = ''
		lockBody()
		const modalEl = getElement('div', ['modal', 'slideIn-bottom', 'modal-settings'], {
			name: '_modal',
		})
		const closeBtn = getElement('button', ['btn__styled', 'btn__circle'], {
			type: 'button',
			textContent: '×',
			id: 'modal__closebtn',
		})
		closeBtn.addEventListener('click', () => {
			modalEl.classList.add('slideOut-top')
			setTimeout(() => {
				toggleElem(modalWrapper)
				burgerBtn.classList.contains('active') ? 
				null :
				unlockBody()
			}, 1000);
		})

		const toggleRow = getElement('div', ['row', 'jcc'], {
			id: 'togglerRow',
		})

		const changeThemeToggle = getElement('label', ['_toggler'], {
			htmlFor: 'themeCheckbox',
		})
		const toggleInput = getElement('input', [], {
			id: 'themeCheckbox',
			type: 'checkbox',
			checked: localStorage.getItem('theme') == 'light' ?
			false : true,
		})

		changeThemeToggle.append(toggleInput)
		changeThemeToggle.append(getElement('span', []))
		const darkThemeColorsRow = getElement('div', ['row', 'jcc'], {
			id: 'colorRow',
		})

		toggleInput.addEventListener('click', () => {
			if (toggleInput.checked) {
				localStorage.setItem('theme', 'dark-default')
				themeLink.setAttribute('href', 'assets/css/themes/dark/theme-dark-default.css')
				darkThemeColorsRow.innerHTML = ''	
				loadColorEls()	
			} else {
				darkThemeColorsRow.innerHTML = ''
				localStorage.setItem('theme', 'light')
				themeLink.setAttribute('href', 'assets/css/themes/light/theme-light.css')
			}
		})

		darkThemeColorsRow.addEventListener('click', event => {
			target = event.target
			if (target.tagName == 'BUTTON') {
				themeLink.setAttribute('href', `assets/css/themes/dark/theme-dark-${target.value}.css`)
				localStorage.setItem('theme', `dark-${target.value}`)
			}
		})
		for (let i = 0; i < config.darkThemeColors.length; i++) {
			if (localStorage.getItem('theme') == `dark-${config.darkThemeColors[i][1]}`) {
				loadColorEls()
			}
		}
		function loadColorEls() {
			for (let i = 0; i < config.darkThemeColors.length; i++) {
				const colorEl = getElement('button', ['colorThemeEl'], {
					type: 'button',
					value: config.darkThemeColors[i][1],
				})
				colorEl.style.backgroundColor = config.darkThemeColors[i][0]
				if (config.darkThemeColors[i][1] == 'rainbow') {
					colorEl.id = 'rainbow'
				}
				darkThemeColorsRow.append(colorEl)
			}
		}


		toggleRow.append(getElement('p', ['text'], {
			textContent: 'Light',
		}))
		toggleRow.append(changeThemeToggle)
		toggleRow.append(getElement('p', ['text'], {
			textContent: 'Dark',
		}))

		modalEl.append(toggleRow)
		modalEl.append(darkThemeColorsRow)
		modalEl.append(closeBtn)
		modalWrapper.append(modalEl)
	}

	if (type == 'savedQuiz') {
		modalWrapper.innerHTML = ''
		lockBody()
		const modalEl = getElement('div', ['modal', 'slideIn-bottom'], {
			name: '_modal',
		})

		const btnContainer = getElement('div', ['row', 'big__btn-container'])

		const createNewBtn = getElement('button', ['btn__styled', 'btn__big'], {
			textContent: 'Create new',
		})
		createNewBtn.addEventListener('click', () => {
			data.newQuizData = {name:'',quiz:[]}
			localStorage.setItem('newQuizData', '')
			toggleElem(modalWrapper)
			unlockBody()
			new ConstructorScreen()
		})

		const continueCreatingBtn = getElement('button', ['btn__styled', 'btn__big'], {
			textContent: 'Continue',
		})
		continueCreatingBtn.addEventListener('click', () => {
			if (!!localStorage.getItem('newQuizData') != false) {
				data.newQuizData = {name:'',quiz:JSON.parse(localStorage.getItem('newQuizData'))}
				toggleElem(modalWrapper)
				unlockBody()
				new ConstructorScreen()
			} else {
				alert('Not found quiz data')
			}
		})


		modalEl.append(getElement('p', ['text', 'title'], {
			textContent: 'There is saved data',
		}))
		modalEl.append(getElement('p', ['text'], {
			textContent: 'You can continue quiz creating or create new',
		}))

		btnContainer.append(createNewBtn)
		btnContainer.append(continueCreatingBtn)
		modalEl.append(btnContainer)
		modalWrapper.append(modalEl)
	}

	if (type == 'newQuiz') {
		modalWrapper.innerHTML = ''
		lockBody()
		const modalEl = getElement('form', ['modal', 'slideIn-bottom'], {
			name: '_modal',
		})
		const inputRow = getElement('div', ['row'])
		const btn = getElement('button', ['btn__styled', 'btn__big'], {
			id: 'newQuizBtn',
			textContent: 'Submit',
		})
		const closeBtn = getElement('button', ['btn__styled', 'btn__circle'], {
			type: 'button',
			textContent: '×',
			id: 'modal__closebtn',
		})
	
		closeBtn.addEventListener('click', () => {
			modalEl.classList.add('slideOut-top')
			setTimeout(() => {
				toggleElem(modalWrapper)
				unlockBody()
			}, 1000);
		})
		btn.addEventListener('click', () => {
			inputValidation(modalEl)
		})
	
		modalEl.append(getElement('h2', ['text', 'title'], {
			textContent: 'Enter quiz name:',
		}))
		inputRow.append(getElement('input', ['text'], {
			type: 'text',
			name: 'quizName',
			autocomplete: 'off',
			required: 'true',
			placeholder: 'Enter name (min 8, max 35)',
			minLength: '8',
			maxLength: '35',
		}))
		modalEl.append(inputRow)
		modalEl.append(btn)
		modalEl.append(closeBtn)
		modalWrapper.append(modalEl)
	}
}