import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector(`.upload`);

  _window = document.querySelector(`.add-recipe-window`);
  _overlay = document.querySelector(`.overlay`);
  _btnOpen = document.querySelector(`.nav__btn--add-recipe`);
  _btnClose = document.querySelector(`.btn--close-modal`);
  _message = `Recipe uploaded successfully :)`

  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }
  toggleWindow() {
    this._window.classList.toggle(`hidden`);
    this._overlay.classList.toggle(`hidden`);
  }
  _addHandlerShowModal() {
    this._btnOpen.addEventListener(`click`, this.toggleWindow.bind(this));
  }
  _addHandlerHideModal() {
    this._btnClose.addEventListener(`click`, this.toggleWindow.bind(this));
    this._overlay.addEventListener(`click`, this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // To get all data of form
      const data = Object.fromEntries(dataArr); // To make grabbed data obj
      handler(data);
    });
  }
  generateMarkup() {}
}
export default new AddRecipeView();
