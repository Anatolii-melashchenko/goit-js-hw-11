import './css/styles.css';
import { Notify } from 'notiflix';
import NewsApiService from './js/news-service';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  articlesContainer: document.querySelector('.gallery'),
  loadMoreBt: document.querySelector('.load-more'),
};

let simpleLightbox;

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBt.addEventListener('click', onLoadMore);

refs.loadMoreBt.classList.add('is-hidden');

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value;
  if (!newsApiService.query) {
    Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  newsApiService.resetPage();
  refs.loadMoreBt.classList.remove('is-hidden');
  clearArticlesContainer();
  newsApiService
    .fetchArticles()
    .then(data => {
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      createMarkup(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      }).refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    })
    .catch(error => console.log(error));
}

function onLoadMore(e) {
  e.preventDefault();

  simpleLightBox.destroy();
  newsApiService
    .fetchArticles()
    .then(data => {
      createMarkup(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      }).refresh();
      if (data.hits.length === 0) {
        refs.loadMoreBt.classList.add('is-hidden');
        Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      }
    })
    .catch(error => console.log(error));
}

function createMarkup(hits) {
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
      <div class="photo-card">
       <img src="${webformatURL}" alt="${tags}" width = "300" height="200" loading="lazy" />
         <div class="info">
         <p class="info-item"><b>Likes</b>${likes}</p>
         <p class="info-item"><b>Views</b>${views}</p>
         <p class="info-item"><b>Comments</b>${comments}</p>
         <p class="info-item"><b>Downloads</b>${downloads}</p>
         </div>
      </div>
    </a>`;
      }
    )
    .join('');
  refs.articlesContainer.insertAdjacentHTML('beforeend', markup);
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}
