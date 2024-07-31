const BASE_URL = "https://webdev.alphacamp.io/"
const INDEX_URL = BASE_URL + "api/movies/"
const Poster_URL = BASE_URL + "posters/"
const movie_pre_page = 12

const movies = []
let fitleredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data){
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
}

function renderPagintor(amount) {
  // Math.ceil >>無條件進位
  const numberOfPage = Math.ceil(amount / movie_pre_page)
  let rawHTML = ''

  for(let page = 1; page <= numberOfPage; page++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//回傳page這頁該有的電影資料
function getMoviesBypage(page) {
  //Page 1 >> movies 0~11
  //Page 2 >> movies 12~23
  //Page 3 >> movies 24~35
  //...
  //如果fitleredMovies有東西就代表使用者有收尋，那就要顯示fitleredMovies，若他是空陣列的話就是回傳movies，利用3元運算子
  const data = fitleredMovies.length ? fitleredMovies : movies
  const startIndex = (page - 1) * movie_pre_page
  return data.slice(startIndex, startIndex + movie_pre_page)  
}

function showMoiveModal(id) {
  const movieModaltitle = document.querySelector('#movie-modal-title')
  const movieModalimage = document.querySelector('#movie-modal-image')
  const movieModaldate = document.querySelector('#movie-modal-date')
  const movieModaldescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) =>{
    const data = response.data.results
    movieModaltitle.innerText = data.title
    movieModaldate.innerText = 'Release date:' + data.release_date
    movieModaldescription.innerText = data.description
    movieModalimage.innerHTML = `<img src="${Poster_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}


//LocalStorage用法:
// 常見的操作方法有：
//                  存入資料 - localStorage.setItem('key', 'value')
//                  取出資料 - localStorage.getItem('key')
//                  移除資料 - localStorage.removeItem('key')

// key 和 value 都需要是字串(string)，這是一種類似 JSON 格式的設計。
// 因此，實務上把資料存入 local storage 時，會利用以下兩個方法操作：
//                  JSON.stringify() ：存入時，將資料轉為 JSON 格式的字串。
//                  JSON.parse()：取出時，將 JSON 格式的字串轉回 JavaScript 原生物件。

//這裡的順序可以注意!!:
// 1.讀取收藏清單：從 localStorage 中取得目前的收藏清單。如果 localStorage 中沒有資料，會回傳 null，然後用空陣列 [] 來初始化 list。
// 2.查找電影：在 movies 陣列中查找 ID 與傳入的 id 相符的電影。
// 3.檢查是否已在收藏清單中：使用 some 方法檢查電影是否已經在收藏清單中。如果是，顯示提示訊息並結束函式。
// 4.加入收藏清單
// 5.更新 localStorage：將收藏清單存回 localStorage。
// 為什麼要先讀取再更新？
//                 確保資料一致性：
//                 必須先從 localStorage 讀取目前的收藏清單，這樣你才能在現有的資料上進行操作。如果不先讀取，直接更新的話會覆蓋掉 localStorage 中的舊資料。
// 防止重複收藏：
//                 先讀取收藏清單才能檢查電影是否已經在收藏清單中，避免重複添加。

function addToFavorite(id) {
  //list 是收藏清單。我們用localStorage.getItem去取目前在 local storage 的資料，放進收藏清單。
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  //使用find函式去找尋我們的收藏id和movies id是否一樣
  //find使用方法 >>它們的參數一樣都是一個條件函式、一樣會進去陣列裡面一一比對，不過 find 在找到第一個符合條件的 item 後就會停下來回傳該 item。
  const movie = movies.find((movie) => movie.id === id)
  //some使用方法 >>和find類似，不過 some 只會回報「陣列裡有沒有 item 通過檢查條件」，有的話回傳 true ，到最後都沒有就回傳 false。
  if (list.some((movie) => movie.id === id)){
    return alert('電影已在收藏清單中!')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies',JSON.stringify(list))
}

 
// 製作點選More Button、+ Button事件監聽器
// dataset 需要先在More Btton 上加入 data-id="${item.id}"才可以做使用
dataPanel.addEventListener('click',function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')){
    showMoiveModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')){
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 製作點選Page Button事件監聽器
// dataset 需要先在Page Btton 上加入 data-id="${item.id}"才可以做使用，這邊綁定在a超連結上面
paginator.addEventListener('click',function onPaginatorClicked(event) {
  //因為我們事件是綁在超連結上面<a></a>，所以直接使用tagName來收尋假如不是超連結的btn就return不跑此函式了
  if(event.target.tagName !== "A") return

  // 將Number(event.target.dataset.page)設成變數
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesBypage(page))
})

// 製作點選Search Button事件監聽器
searchForm.addEventListener('submit',function onSearchFromSubmitted(event) {
  // 預防瀏覽器預設行為(按一下會重整畫面)，需要新增preventDefault
  event.preventDefault()
  const keyWord = searchInput.value.trim().toLowerCase()
  //建立一個收尋後的電影資料陣列
  

  // 如何將篩選齁電影資料放入fitleredMovies陣列:

  // 方法一 >> 使用for of迴圈+includes(包含)
  // for(const movie of movies){
  //   if (movie.title.toLowerCase().includes(keyWord)) {
  //     fitleredMovies.push(movie)
  //   }
  // }
  // renderMovieList(fitleredMovies)
  //方法二 >> 使用fitler函式，filter 需要的參數是一個條件函式，只有通過這個條件函式檢查的項目，才會被 filter 保留並回傳一個新的陣列。
  fitleredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyWord)
  )
  renderPagintor(fitleredMovies.length)
  renderMovieList(getMoviesBypage(1))

  //假如keyword的長度等於0就跳出警告字樣以及未收尋到的字串
  if (fitleredMovies.length === 0) {
    return alert('Can not found string:' + keyWord)
  }
})

axios.get(INDEX_URL).then((response) => {
  // console.log(response.data.results)
  // 將陣列所有元素放入置movies裏頭

  // 方法一 >> 使用for of迴圈
  // for (const movie of response.data.results){
  //   movies.push(movie)
  // }
  // console.log(movies)

  // 方法二 >> 直接在responese.data.results前面加上...
  movies.push(...response.data.results)
  // console.log(movies)
  renderPagintor(movies.length)
  renderMovieList(getMoviesBypage(1))
})


