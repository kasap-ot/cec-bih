let currentIndex = 0;

function moveSlide(direction) {
    const track = document.getElementById('carousel-track');
    const slides = track.children;
    const totalSlides = slides.length;

    currentIndex += direction;

    if (currentIndex < 0) currentIndex = totalSlides - 1;
    if (currentIndex >= totalSlides) currentIndex = 0;

    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
}