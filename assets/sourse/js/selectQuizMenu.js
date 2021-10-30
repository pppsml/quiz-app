class SelectQuizMenu {
    constructor() {
        this.totalPages = Math.ceil(data.quizNames.length / config.itemsPerPage)
        this.currentPage = 0
        this.selectedPage = 1

        this.loadMenu()
    }

    loadMenu() {
        selectQuizContainer.innerHTML = ''
        if (this.totalPages) {
            const pageContainer = this.createPages()
			selectQuizContainer.append(pageContainer)
			selectQuizContainer.append(this.createToolbar())
            this.updatePage(pageContainer)
            this.toggleQuizData(pageContainer)
        }
    }

    createPages() {
        const pageContainer = getElement('div', ['select__quiz-page__container'])
        for (this.currentPage ; this.currentPage < this.totalPages; this.currentPage++) {
			const selectPage = this.createSelectPage()
			let totalPageItems = data.quizNames.length - config.itemsPerPage * this.currentPage
			totalPageItems > config.itemsPerPage ? config.itemsPerPage : totalPageItems

			for (let i = 0; i < totalPageItems; i++) {
				selectPage.append(this.createSelectOption(i))
			}
            pageContainer.append(selectPage)
		}
        return pageContainer
    }

    createSelectPage() {
        return getElement('ul', ['select__page'])
    }

    createSelectOption(count) {
        const quiz = data.docData[data.quizNames[config.itemsPerPage * this.currentPage + count]]
        const name = quiz.name,
            id = quiz.id, 
            likes = quiz.likes,
            isLiked = data.isLikedQuizzes.indexOf(id) >= 0

        const selectOption = getElement('li', ['text'], {
            textContent: `${name}`,
            id: `${id}`,
        })

        selectOption.append(getElement('div', ['text-minimal', 'select__id'], {
            innerHTML: `<span>id: ${id}</span>`,
        }))
        selectOption.append(getElement('div', ['row', 'text-minimal', 'select__likes'], {
            innerHTML: `<i class="fas fa-heart select__likes-icon"></i><span>${likes}</span>`,
        }))

        if (isLiked) {
            selectOption.append(getElement('div', ['isLiked'], {
                innerHTML: '<i class="fas fa-heart"></i>',
            }))
        }
        return selectOption
    }

    createToolbar() {
        const selectToolbar = getElement('div', ['select__quiz-toolbar'])

        selectToolbar.append(getElement('p', ['text'], {
            id: 'currentPage',
            textContent: `${this.selectedPage}/${this.totalPages}`,
        }))
        const prevPageBtn = getElement('button', ['btn__styled', 'btn__small'], {
            id: 'prevPageBtn',
            textContent: 'Prev page',
        })
        const nextPageBtn = getElement('button', ['btn__styled', 'btn__small'], {
            id: 'nextPageBtn',
            textContent: 'Next page',
        })

        prevPageBtn.addEventListener('click', this.decreasePage)
        nextPageBtn.addEventListener('click', this.increasePage)
        
        selectToolbar.append(prevPageBtn)
        selectToolbar.append(nextPageBtn)
        return selectToolbar
    }

    toggleQuizData(pageContainer) {
        const selectedQuizText = document.querySelector('.quiz__container>p.text')
		const liEls = pageContainer.querySelectorAll('li.text')
		const firstLiEl = liEls[0]

		selectedQuizText.textContent = `Selected quiz: ${firstLiEl.firstChild.textContent}`	
		data.currentQuizData = data.docData[firstLiEl.id].quiz
		data.currentQuizId = data.docData[firstLiEl.id].id
		firstLiEl.classList.add('active')

        pageContainer.addEventListener('click', event => {
			if (event && 
				event.target.tagName == 'LI' || 
				event.target.tagName == 'DIV' || 
				event.target.tagName == 'I' || 
				event.target.tagName == 'SPAN') {
                    
				let target = event.target
				switch (target.tagName) {
					case 'DIV': target = target.parentElement
					break
					case 'I': target = target.parentElement.parentElement
					break
					case 'SPAN': target = target.parentElement.parentElement
				}
				liEls.forEach(liEl => {
					liEl.classList.remove('active')
					target.classList.add('active')
				})
				selectedQuizText.textContent = `Selected quiz: ${target.firstChild.textContent}`
				data.currentQuizData = data.docData[target.id].quiz
				data.currentQuizId = data.docData[target.id].id
			} else {
				return
			}
		})
    }

    increasePage() {
        this.selectedPage++
        this.updatePage()
    }

    decreasePage() {
        this.selectedPage++
        this.updatePage()
    }

    updatePage(pageContainer) {
        const prevPageBtn = document.getElementById('prevPageBtn')
        const nextPageBtn = document.getElementById('nextPageBtn')

        const toolbarText = document.getElementById('currentPage')
        // const pageContainer = document.querySelector('.select__quiz-page__container')
        const pageW = pageContainer.offsetWidth

        toolbarText.textContent = `${this.selectedPage}/${this.totalPages}`
        pageContainer.style.transform = `translateX(-${pageW * (this.selectedPage - 1)}px)`

        this.selectedPage > 1 ? prevPageBtn.disabled = false : prevPageBtn.disabled = true
        this.selectedPage < this.totalPages ? nextPageBtn.disabled = false : nextPageBtn.disabled = true
    }
}