import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/results.View';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODEL_CLOSE_SEC } from './config';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Subscriber
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // 1 Rendering spinner
    recipeView.renderSpinner();

    // 2 Loading recipe data
    await model.loadRecipe(id);

    // 3 Rendering recipe
    recipeView.render(model.state.recipe);

    // 4 Update search results to render 1st page of results and bookmars view
    resultsView.render(model.getSearchResultsPage());
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    console.log(`${error}✴✴✴`);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // 1 Getting query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // 3 getting data with query
    await model.loadSearchResults(query);
    // 4 Rendering results
    //  resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //  5 Rebder pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 1 Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2 Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the ricipe servings in state
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.render(model.state.recipe);
};
const controlBookmark = function () {
  // Sending current recipe to push bookmarks array // Add & delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Updating current recipe
  recipeView.render(model.state.recipe);
  // Rendering bookmark list
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  console.log(newRecipe);
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Render success message
    addRecipeView.renderMessage();
    // Change ID url
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);
    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
    // Render bookmark
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

(function () {
  recipeView.addHandlerBookmark(controlBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerRender(controlRecipe);
  paginationView.addHandlerClick(controlPagination);
  searchView.addHandlerSearch(controlSearchResult);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();
