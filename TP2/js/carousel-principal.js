		const slider = document.querySelector(".items");
		const slides = document.querySelectorAll(".item");
		const button = document.querySelectorAll(".carousel-button");
		
		let current = 0;
		let prev = 4;
		let next = 1;

		for (let i = 0; i < button.length; i++) {
			button[i].addEventListener("click", () => i == 0 ? gotoPrev() : gotoNext());
		}

		// Delegate clicks on slides/buttons with class .next or .prev to navigate
		// Using delegation so it works when classes move between elements
		if (slider) {
			slider.addEventListener('click', (e) => {
				const target = e.target.closest('.next, .prev');
				if (!target) return;
				if (target.classList.contains('next')) {
					gotoNext();
				} else if (target.classList.contains('prev')) {
					gotoPrev();
				}
			});
		}

		const gotoPrev = () => current > 0 ? gotoNum(current - 1) : gotoNum(slides.length - 1);

		const gotoNext = () => current < 4 ? gotoNum(current + 1) : gotoNum(0);

		const gotoNum = number => {
			current = number;
			prev = current - 1;
			next = current + 1;

			for (let i = 0; i < slides.length; i++) {
				slides[i].classList.remove("active");
				slides[i].classList.remove("prev");
				slides[i].classList.remove("next");
			}

			if (next == 5) {
				next = 0;
			}

			if (prev == -1) {
				prev = 4;
			}

			slides[current].classList.add("active");
			slides[prev].classList.add("prev");
			slides[next].classList.add("next");
		}