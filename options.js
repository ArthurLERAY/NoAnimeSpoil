let debounceTimer;
function searchAnime(query) {
    console.log(query.length);
    if (query.length < 3) return;

    fetch(`https://api.jikan.moe/v4/anime?q=${query.toLowerCase()}&limit=5`)
        .then(response => response.json())
        .then(data => {
            const suggestions = document.getElementById('suggestions');
            suggestions.innerHTML = '';

            data.data.forEach(anime => {
                const li = document.createElement('li');
                li.textContent = anime.title;
                li.onclick = function() {
                    addAnimeToList(anime.title);
                    suggestions.innerHTML = '';
                };
                suggestions.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}


function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}


document.addEventListener('DOMContentLoaded', function() {
    const animeInput = document.getElementById('animeInput');

    animeInput.addEventListener('input', (e) => {
        const query = e.target.value;
        debounce(() => searchAnime(query), 500);
    });

    updateAnimeListDisplay();
});


function addAnimeToList(animeTitle) {
    chrome.storage.sync.get({ animeList: [] }, function(data) {
        const animeList = new Set(data.animeList);
        animeList.add(animeTitle);
        chrome.storage.sync.set({ animeList: Array.from(animeList) }, function() {
            updateAnimeListDisplay();
        });
    });
}


function updateAnimeListDisplay() {
    const listElement = document.getElementById('animeList').querySelector('tbody');
    listElement.innerHTML = '';

    chrome.storage.sync.get({ animeList: [] }, function(data) {
        data.animeList.forEach(anime => {
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = anime;

            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remove';
            deleteButton.classList.add('remove-btn');
            deleteButton.addEventListener('click', function() {
                removeAnimeFromList(anime);
            });
            actionCell.appendChild(deleteButton);

            row.appendChild(titleCell);
            row.appendChild(actionCell);
            listElement.appendChild(row);
        });
    });
}


function removeAnimeFromList(animeTitle) {
    chrome.storage.sync.get({ animeList: [] }, function(data) {
        const updatedList = data.animeList.filter(anime => anime !== animeTitle);
        chrome.storage.sync.set({ animeList: updatedList }, function() {
            updateAnimeListDisplay();
        });
    });
}
