/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);

//Media Fetch request for Today Section

document.querySelector('article#today button').addEventListener('click', fetchToday())

function fetchToday() {
	const url = 'https://api.nasa.gov/planetary/apod?api_key=Mca2TXDuufNxqkgw8DU9vcyTGvJnR3oRVUbUEfqt'

	fetch(url)
		.then(res => res.json()) //parse response as JSON
		.then(data => {
			document.querySelector('article#today img').src = data.hdurl
			document.querySelector('article#today h3').innerText = data.title
			document.querySelector('article#today p').innerText = data.explanation
		})
}


//Media Fetch request for Select Section

document.querySelector('article#select button').addEventListener('click', fetchSelect)

function fetchSelect() {
	const choice = document.querySelector('input.explore').value
	console.log(choice)
	const url = `https://api.nasa.gov/planetary/apod?api_key=Mca2TXDuufNxqkgw8DU9vcyTGvJnR3oRVUbUEfqt&date=${choice}`

	fetch(url) 
		.then(res => res.json()) //parse response as JSON
		.then(data => { 
			console.log(data)
			if(data.media_type === 'image'){
			//hide image and video before each new request using none and block
			document.querySelector('article#select iframe').style.display = 'none'
			document.querySelector('article#select div').style.display = 'none'
			document.querySelector('article#select img').style.display = 'block'
        	document.querySelector('article#select p').style.display = 'block'
			document.querySelector('article#select img').src = data.hdurl
			document.querySelector('article#select h3').innerText = data.title
			document.querySelector('article#select p').innerText = data.explanation
		
		} else if (data.media_type === 'video'){
			document.querySelector('article#select img').style.display = 'none'
			document.querySelector('article#select iframe').style.display = 'block'
			document.querySelector('article#select div').style.display = 'block'
			document.querySelector('article#select iframe').src = data.url
			document.querySelector('article#select h3').innerText = data.title
			document.querySelector('article#select p').innerText = data.explanation
        	// document.querySelector('article#explore p').style.display = 'block'
		}
		}) 
		.catch(err => {
			console.log(`error ${err}`)
		});
}

// Media Fetch request for Random Section

document.querySelector('article#random button').addEventListener('click', fetchRandom)

function fetchRandom(){
	//Function to generate random number
	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//Check if leap year, including the case fro century years
	function isLeapYear(year) {
		return ((year % 4 ===0) && (year % 100 !== 0)) || (year % 400 === 0);
	}

	//Get Random Date
	function getRandomDate() {
		let randomMonth = Math.round(randomNumber(1, 12));
		let currentYear = new Date().getFullYear();
		let randomYear =  Math.round(randomNumber(1995, currentYear));
		let lastDay = (randomMonth === 2) ? (isLeapYear(randomYear) ? 29 : 28) : ([4, 6, 9, 11].includes(randomMonth) ? 30 : 31);
		let randomDay = Math.round(randomNumber(1, lastDay));
		//Format date according to API documentation 'YYYY-MM-DD"
		let randomDate = `${randomYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;
		return randomDate
	}

const url = `https://api.nasa.gov/planetary/apod?api_key=Mca2TXDuufNxqkgw8DU9vcyTGvJnR3oRVUbUEfqt&date=${getRandomDate()}`;

fetch(url)
	.then(res => res.json()) //parse response as JSON
	.then(data => {
		console.log(data)
		if (data.media_type === 'image') {
			document.querySelector('article#random span.date').style.display = 'block'
			document.querySelector('article#random div').style.display = 'none'
			document.querySelector('article#random span.date').innerText = data.date
			document.querySelector('article#random iframe').style.display = 'block'
			document.querySelector('article#random img').src = data.hdurl
			document.querySelector('article#random h3').innerText = data.title
			document.querySelector('article#random p').innerText = data.explanation
		
		} else if (data.media_type === 'video') {
			document.querySelector('article#random span.date').style.display = 'block'
			document.querySelector('article#random span.date').innerText = data.date
			document.querySelector('article#random img').style.display = 'none'
			document.querySelector('article#random iframe').style.display = 'block'
			document.querySelector('article#random div').style.display = 'block'
			document.querySelector('article#random iframe').src = data.url
			document.querySelector('article#random h3').innerText = data.title
		  	document.querySelector('article#random p').innerText = data.explanation
			document.querySelector('article#random p').style.display = 'block'
		}
		})
		.catch(err => {
			console.log(`error ${err}`)
	})
}