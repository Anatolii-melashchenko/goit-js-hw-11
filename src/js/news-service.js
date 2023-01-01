import axios from 'axios';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchArticles() {
    const key = '32447548-ed7836316881b22e9c049cde5';
    const url = `https://pixabay.com/api/?key=${key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;

    const response = await axios.get(url);

    // const data = await response.json();
    this.incrementPage();

    return response.data;

    // return fetch(url)
    //   .then(r => r.json())
    //   .then(data => {
    //     this.incrementPage();

    //     return data;
    //   });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
