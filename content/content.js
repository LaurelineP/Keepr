const INIT_SCROLL_Y = window.scrollY;


function getProgressBarValue () {
	let scrollHeight = document.body.scrollHeight;
	const progressBarDiv = document.querySelector('.progress-bar');

	const remainingPercent = ((((scrollHeight - window.scrollY) /  scrollHeight )) * 100 ) - 10;
	const value = remainingPercent === 100 ? 0 : 100 - remainingPercent;
	return { progressBarDiv, value }
}


const INITIAL_VALUE = getProgressBarValue().value


const Features = {
	reading: {
		/**
		 * Creates and injects the progress bar on current page
		 * @returns { progressBarDiv, value }
		 */
		setProgressBar: () => {

			// Adds progress bar to pages
			const div = document.createElement('div');
			div.classList.add('progress-bar');
			div.style.width = `${INITIAL_VALUE}%`
			document.body.append(div);
	
			// OnScroll: calculates the width of the progress bar
			function onScroll () {
				const {progressBarDiv, value} = getProgressBarValue()
				progressBarDiv.style.width = `${value}%`;
			}
	
			return document.addEventListener('scroll', onScroll)
		},
		/**
		 * Creates and injects reading time estimation for the current page
		 * @param {*} tags 
		 */
		setDuration: (tags) => {
			// Gets all articles' text content
			const text = tags.reduce(( acc, tag ) => {
				return acc.concat(` ${tag.innerText }`)
			}, "" );

			// Estimates reading time based on words count ( about 150 words at worth / min )
			const words = text.split(/\W/).filter( t => !!t );
			const readingTimeMinutes = Math.round( words.length / 150 );

			const readingMsg = `⏱️ ~ ${readingTimeMinutes} minutes read`;
			
			// Creates element text element
			const readingTimeSpan = document.createElement('span');
			readingTimeSpan.textContent = readingMsg;
			readingTimeSpan.classList.add('reading-time');

			// Injects text element into page
			const progressBar = getProgressBarValue().progressBarDiv;

			// Display reading time on page only if more than 1 min
			!!readingTimeMinutes && progressBar.insertAdjacentElement('afterend', readingTimeSpan )
		},
		setReadingFeature: () => {},
		readText: () => {

		}
	}

}




/**
 * Init toolings
 * - reading tooling
 */
async function initTool () {

	// Gets text elements content
	const tagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']
	const textContent = tagNames
		.map( tagName =>[ ...document.getElementsByTagName(tagName)].flat()).flat()
		.filter( element => !!element );

	// Checks for readable content
	const isReadingPageMaterial = !window.location.search;
	const hasTextContent = !!textTags.length;

	// If content is readable displays progress bar and reading duration
	if( isReadingPageMaterial && hasTextContent ){
		try {
			await Features.reading.setProgressBar();
			await Features.reading.setDuration(textContent);
		} catch( e ){
			throw new Error("[Keepr] Extension could not load correctly")
		}
	}
}



// When script loads, execute the initialize tool
window.addEventListener("load", initTool);