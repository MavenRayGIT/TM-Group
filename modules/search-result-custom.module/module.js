var hsResultsPage = function(_resultsClass) {
	function buildResultsPage(_instance) {
		var resultTemplate = _instance.querySelector(
			'.hs-search-results__template'
		);
		var resultsSection = _instance.querySelector('.hs-search-results__listing');
		var searchPath = _instance
		.querySelector('.results-pagination-container')
		.getAttribute('data-search-path');
		var prevLink = _instance.querySelector('.hs-search-results__prev-page');
		var nextLink = _instance.querySelector('.hs-search-results__next-page');

		var searchParams = new URLSearchParams(window.location.search.slice(1));

		/**
     * v1 of the search input module uses the `q` param for the search query.
     * This check is a fallback for a mixed v0 of search results and v1 of search input.
     */

		if (searchParams.has('q')) {
			searchParams.set('term', searchParams.get('q'));
			searchParams.delete('q');
		}

		function getTerm() {
			return searchParams.get('term') || '';
		}

		function getOffset() {
			return parseInt(searchParams.get('offset')) || 0;
		}

		function getLimit() {
			return parseInt(searchParams.get('limit'));
		}

		function addResult(title, url, description, featuredImage) {
			var newResult = document.importNode(resultTemplate.content, true);
			const imgDiv = newResult.querySelector('.result-featured-image > img');

			if (featuredImage === 'Fallback') {
				imgDiv.src = "https://pages.backofhouse.io/hs-fs/hubfs/spaghetti-fork.png?width=119&height=168&name=spaghetti-fork.png";
				imgDiv.classList.add('fallback-image');
			} else {
				imgDiv.src = featuredImage;
				imgDiv.classList.add('cover-image');
			}

			newResult.querySelector('.result-card-title').innerHTML = title;
			newResult.querySelector('.result-card').href = url;
			newResult.querySelector(
				'.result-card-description'
			).innerHTML = description;

			resultsSection.appendChild(newResult);
		}

		function fillResults(results) {
			results.results.forEach(function(result, i) {
				addResult(
					result.title,
					result.url,
					result.description,
					result.featuredImageUrl ? result.featuredImageUrl : 'Fallback'
				);
			});
		}

		function fillStats(results) {
			const resultStats = document.querySelector('.result-stats');
			const resultOffset = resultStats.querySelector('.result-offset');
			const pageResults = resultStats.querySelector('.page-results');
			const resultTotal = resultStats.querySelector('.result-total');

			resultOffset.innerHTML = results.offset + 1
			pageResults.innerHTML = results.offset + results.results.length;
			resultTotal.innerHTML = results.total

			resultStats.style.display = 'block';
		}

		function emptyPagination() {
			prevLink.innerHTML = '';
			nextLink.innerHTML = '';
		}

		function emptyResults(searchedTerm) {
			resultsSection.innerHTML =
				'<div class="hs-search__no-results"><p>Sorry. There are no results for "' +
				searchedTerm +
				'"</p>' +
				'<p>Try rewording your query, or browse through our site.</p></div>';
		}

		function setSearchBarDefault(searchedTerm) {
			var searchBars = document.querySelectorAll('.hs-search-field__input');
			Array.prototype.forEach.call(searchBars, function(el) {
				el.value = searchedTerm;
			});
		}

		function httpRequest(term, offset) {
			var SEARCH_URL = '/_hcms/search?';
			var requestUrl = SEARCH_URL + searchParams + '&analytics=true';
			var request = new XMLHttpRequest();

			request.open('GET', requestUrl, true);
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					var data = JSON.parse(request.responseText);
					setSearchBarDefault(data.searchTerm);
					if (data.total > 0) {
						// 						console.log(data);
						fillResults(data);
						fillStats(data);
						paginate(data);
					} else {
						emptyResults(data.searchTerm);
						emptyPagination();
					}
				} else {
					console.error('Server reached, error retrieving results.');
				}
			};
			request.onerror = function() {
				console.error('Could not reach the server.');
			};
			request.send();
		}

		function paginate(results) {
			var updatedLimit = getLimit() || results.limit;
			const totalPages = Math.ceil(results.total / updatedLimit)
			const paginationContainer = document.querySelector('.results-pagination-container');
			const numberPaginationFlex = document.querySelector('.number-pagination-flex');
			const pageNumber = results.page;
			
			paginationContainer.style.display = "flex";

			if (results.page > 1) {
				const prevParams = new URLSearchParams(searchParams.toString());
				prevParams.set(
					'offset',
					results.page * updatedLimit - parseInt(updatedLimit)
				);
				prevLink.href = '/' + searchPath + '?' + prevParams;
			} else {
				prevLink.classList.add('disabled');
			}

			// Page numbers
			for (let i = 1; i <= totalPages - 1; i++) {
				const pageParams = new URLSearchParams(searchParams.toString());
				pageParams.set('offset', i * updatedLimit);
				
				if (i == 1 || i == totalPages - 1 || (i >= pageNumber - 2 && i <= pageNumber + 2)) {
					// First, last, and two pages around the current page
					const pageButton = document.createElement('a');
					pageButton.className = 'pagination-number-button';
					pageButton.textContent = i;
					pageButton.href = `/${searchPath}?${pageParams}`;
					numberPaginationFlex.appendChild(pageButton);
					if (i == pageNumber || (i == 1 && pageNumber == 0)) pageButton.classList.add('active');
				} else if (i == 2 || i == totalPages - 2) {
					// Ellipsis
					const ellipsisSpan = document.createElement('span');
					ellipsisSpan.textContent = '...';
					numberPaginationFlex.appendChild(ellipsisSpan);
				}
			}

			if (results.offset <= results.total - updatedLimit) {
				var nextParams = new URLSearchParams(searchParams.toString());
				nextParams.set(
					'offset',
					results.page * updatedLimit + parseInt(updatedLimit)
				);
				nextLink.href = '/' + searchPath + '?' + nextParams;
			} else {
				nextLink.classList.add('disabled');
			}
		}

		var getResults = (function() {
			if (getTerm()) {
				httpRequest(getTerm(), getOffset());
			} else {
				emptyPagination();
			}
		})();
	}
	(function() {
		var searchResults = document.querySelectorAll(_resultsClass);
		Array.prototype.forEach.call(searchResults, function(el) {
			buildResultsPage(el);
		});
	})();
};

if (
	document.attachEvent
	? document.readyState === 'complete'
	: document.readyState !== 'loading'
) {
	var resultsPages = hsResultsPage('.hs-search-results');
} else {
	document.addEventListener('DOMContentLoaded', function() {
		var resultsPages = hsResultsPage('.hs-search-results');
	});
}
