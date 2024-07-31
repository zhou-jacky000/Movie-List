const BASE_URL = "https://webdev.alphacamp.io/"
const INDEX_URL = BASE_URL + "api/movies/"
const Poster_URL = BASE_URL + "posters/"

//  原本是空陣列，現在將movies改成localStorage存放的陣列資料
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    // 這個迴圈需要的是把title和image放進來
    // console.log(item) >> 先查看參數有沒有成功載入(這裡的item是匿名函數，用什麼都可以，但後面就需要都使用這個)
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${Poster_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <!-- 按鈕 -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
}

function showMoiveModal(id) {
  const movieModaltitle = document.querySelector('#movie-modal-title')
  const movieModalimage = document.querySelector('#movie-modal-image')
  const movieModaldate = document.querySelector('#movie-modal-date')
  const movieModaldescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    movieModaltitle.innerText = data.title
    movieModaldate.innerText = 'Release date:' + data.release_date
    movieModaldescription.innerText = data.description
    movieModalimage.innerHTML = `<img src="${Poster_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id){
  //findIndex使用方法 >>和find函數差不多，但FindIndex回傳的是這個元素的位置
  const movieIndex = movies.findIndex((movie) => movie.id === id)
    // num.splice使用方法 >>splice 的三個參數分別為：，若要刪除值不用帶入第三個參數
                                                  // 1.要發生變化的位置
                                                  // 2.要刪掉幾個數
                                                  // 3.要插入的值
  movies.splice(movieIndex,1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

// 製作點選More Button、X Button事件監聽器
// dataset 需要先在More Btton 上加入 data-id="${item.id}"才可以做使用
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMoiveModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)



