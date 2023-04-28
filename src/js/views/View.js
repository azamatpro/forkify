import icons from 'url:../../img/icons.svg';
class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const murkup = this._generateMarkup();

    if (!render) return murkup; // To 
    this._clearAndRenderMarkup(murkup);
  }

  renderSpinner() {
    const murkup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clearAndRenderMarkup(murkup);
  }
  renderError(message = this._errorMessage) {
    const murkup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clearAndRenderMarkup(murkup);
  }
  renderMessage(message = this._message) {
    const murkup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clearAndRenderMarkup(murkup);
  }

  _clearAndRenderMarkup(murkup) {
    this._parentElement.innerHTML = ``;
    this._parentElement.insertAdjacentHTML('afterbegin', murkup);
  }
}
export default View;
