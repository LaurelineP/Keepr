
/**
 * Creates, sets progress bar and returns its details
 * @returns object.element, object.size
 */
function getProgressBarValue () {
	const progressBarDiv 		= document.querySelector('.keepr_progress-bar');

	const height_scrollable 	= document.body.scrollHeight;
	const height_scrolled		= window.scrollY
	const height_screen 		= window.innerHeight;
	const height_scrollbar 		= height_screen / (height_scrollable / height_screen);
	const height_scrollableRest = height_scrollable - height_scrolled

	const percent_scrollbarSize 	= (height_scrollbar / height_screen) * 100;
	const percent_scrollableRest 	= (height_scrollableRest / height_scrollable ) * 100 
	const percent_scrollable 		= (percent_scrollableRest - percent_scrollbarSize );

	const percent_progressBar = 100 - percent_scrollable;
	return { element: progressBarDiv, size: percent_progressBar }
}


const INITIAL_VALUE = getProgressBarValue().size


const Features = {
	reading: {
		/**
		 * Creates and injects the progress bar on current page
		 * @returns { progressBarDiv, value }
		 */
		setProgressBar: () => {

			// Adds progress bar to pages
			const div = document.createElement('div');
			div.classList.add('keepr_progress-bar');
			div.style.width = `${INITIAL_VALUE}%`
			document.body.append(div);
	
			// Calculates the width of the progress bar
			function onScroll () {
				const {element: progressBarDiv, size} = getProgressBarValue()
				progressBarDiv.style.width = `${size}%`;
			}
			return document.addEventListener('scroll', onScroll)
		},
	
		/**
		 * Creates and injects reading time estimation for the current page
		 * @param {*} tags 
		 */
		setDuration: (tags) => {
			// Gets all text content
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
			readingTimeSpan.classList.add('keepr_reading-time');

			// Injects text element into page
			const progressBar = getProgressBarValue().element;

			// Display reading time on page only if more than 1 min
			!!readingTimeMinutes && progressBar.insertAdjacentElement('afterend', readingTimeSpan )
		},
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
	const hasTextContent = !!textContent.length;

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