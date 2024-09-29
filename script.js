const API_KEY = "d94e3175c2d845ceb738695cbcfa6f8b";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => {
    fetchNews("India");
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });

    // Adding audio icon
    const audioIcon = document.createElement('img');
    audioIcon.src = 'audio-icon.png'; // Path to your audio icon image
    audioIcon.alt = 'Read Aloud';
    audioIcon.style.cursor = 'pointer';
    audioIcon.style.width = '20px'; // Adjust size as needed
    audioIcon.style.marginLeft = '10px'; // Space between text and icon

    audioIcon.addEventListener('click', () => {
        readAloud(article.title + '. ' + article.description);
    });

    newsDesc.appendChild(audioIcon); // Append the audio icon to the news description
}

function readAloud(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US'; // Set the language
    speech.volume = 1; // Volume level (0 to 1)
    speech.rate = 1; // Speech speed (0.1 to 10)
    speech.pitch = 1; // Pitch level (0 to 2)
    
    // Speak the text
    window.speechSynthesis.speak(speech);
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
