import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector(`.pagination`);

  addHandlerClick(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest(`.btn--inline`);
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1)
      return this._generateNextButton();
    // Last pages
    if (this._data.page === numPages && numPages > 1)
      return this._generatePrevButton();
    // Other pages
    if (this._data.page < numPages) {
      return `${this._generatePrevButton()}${this._generateNextButton()}`;
    }
    // Page 1, and there are NO other pages
    return ``;
  }
  _generatePrevButton() {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        this._data.page - 1
      }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
      </button>
    `;
  }
  _generateNextButton() {
    return `
      <button class="btn--inline pagination__btn--next" data-goto="${
        this._data.page + 1
      }">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
     </button>
    `;
  }
}
export default new PaginationView();
