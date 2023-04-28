import icons from 'url:../../img/icons.svg';
import View from './View';
class previewView extends View {
  _generateMarkup() {
    const id  = window.location.hash.slice(1)
    return `
      <li class="preview ${this._data.id == id ? `preview__link--active` : ``}">
        <a class="preview__link" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <div class="recipe__user-generated ${this._data.key ? `` : `hidden`}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}
export default new previewView();