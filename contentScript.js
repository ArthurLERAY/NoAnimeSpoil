function hideSpoilers() {
    chrome.storage.sync.get('animeList', function(data) {
        const animeList = data.animeList || [];
        console.log(animeList);
        const videoTitles = document.querySelectorAll('#video-title');

        videoTitles.forEach(videoTitle => {
            const titleText = videoTitle.textContent || videoTitle.innerText;
            animeList.forEach(anime => {
                if (titleText.toLowerCase().includes(anime.toLowerCase()) || titleText.toLowerCase().replaceAll(' ', '').includes(anime.toLowerCase().replaceAll(' ', ''))) {
                    const videoContainer = videoTitle.closest('ytd-video-renderer, ytd-rich-grid-media, ytd-compact-video-renderer');
                    if (videoContainer) {
                        videoContainer.remove();
                    }
                }
            });
        });
    });
}


function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            hideSpoilers();
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}


hideSpoilers();
observeDOMChanges();
