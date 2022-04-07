import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '24457855-696bd2eff11a5d8607ee7122f';

export default class ImagesAPIService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
    this.totalHits = null;
    this.totalPages = null;
    this.endOfHits = false;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  getOptions() {
    const options = new URLSearchParams({
      key: `${API_KEY}`,
      q: `${this.searchQuery}`,
      page: `${this.page}`,
      per_page: `${this.PER_PAGE}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    return options;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetEndOfHits() {
    this.endOfHits = false;
  }

  async fetchImages() {
    try {
      const options = this.getOptions();
      const response = await axios.get(`?${options}`);
      const data = await response.data;
     
      this.totalHits = data.totalHits;
      this.totalPages = Math.ceil(this.totalHits / this.PER_PAGE);
      this.resetEndOfHits();
    
        if (data.total === 0) {
        throw new Error('На жаль, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз.');
      }
      
        const images = await data.hits;
        this.notificationOnFirstPage();
        this.notificationForEndHits();
        this.incrementPage();
        return images;
    } catch {
      Notify.failure(error.message);
     } 
  }

  
  notificationOnFirstPage() {
    if (this.page === 1) {
      Notify.success(`Ми знайшли ${this.totalHits} зображень.`);
    }
  }

  notificationForEndHits() {
    if (this.page === this.totalPages) {
      this.endOfHits = true;
      Notify.info("Вибачте, але ви досягли кінця результатів пошуку.");
    }
  }
}