import { getJSON, sendJSON } from './helper.js';
import { API_URL, KEY, RESULTS_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data;
  return {
    id: recipe.id,
    publisher: recipe.publisher,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const { data } = await getJSON(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const { data } = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (error) {
    console.error(error);
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // newQty = oldQty * newServings / oldServings
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ((ing.quantity * newServings) / state.recipe.servings).toFixed(2);
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false; // modifies the Bookmark btn
  persistBookmark();
};

(() => {
  const storage = localStorage.getItem(`bookmarks`);
  if (storage) state.bookmarks = JSON.parse(storage);
})();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith(`ingredient`) && entry[1] !== ``)
      .map(ing => {
        const ingsArr = ing[1].replaceAll(' ', '').split(`,`);
        if (ingsArr.length !== 3)
          throw new Error(
            `Wrong ingredient format! Please use right ingredient format :)`
          );
        const [quantity, unit, description] = ingsArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      ingredients,
    };

    const { data } = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    // state.recipe = {...createRecipeObject(data), key: data.recipe.key}
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
