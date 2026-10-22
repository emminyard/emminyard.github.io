document.addEventListener("DOMContentLoaded", function () {
    
    const track = document.getElementById("track");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pager = document.getElementById("pager");
    const slides = Array.from(track.querySelectorAll(".slide"));
    
    // Сколько картинок на экране
    function getSlidesPerView() {
        return window.innerWidth <= 768 ? 1 : 3;
    }
    
    let slidesPerView = getSlidesPerView();
    let totalPages = Math.ceil(slides.length / slidesPerView);
    let currentPage = 0;
    
    // Создаём пейджер
    function createPager() {
        pager.innerHTML = "";
        totalPages = Math.ceil(slides.length / slidesPerView);
        
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement("div");
            dot.classList.add("pager-dot");
            if (i === currentPage) dot.classList.add("active");
            
            dot.addEventListener("click", function () {
                currentPage = i;
                updateSlider();
            });
            pager.appendChild(dot);
        }
    }
    
    // Обновляем позицию ленты + активную точку
    function updateSlider() {
        track.style.transform = `translateX(-${currentPage * 100}%)`;
        
        const dots = pager.querySelectorAll(".pager-dot");
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === currentPage);
        });
    }
    
    // Кнопка «вперёд»
    nextBtn.addEventListener("click", function () {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateSlider();
        }
    });
    
    // Кнопка «назад»
    prevBtn.addEventListener("click", function () {
        if (currentPage > 0) {
            currentPage--;
            updateSlider();
        }
    });
    
    // При изменении размера — пересчёт
    window.addEventListener("resize", function () {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            slidesPerView = newSlidesPerView;
            currentPage = 0;
            createPager();
            updateSlider();
        }
    });
    
    // Инициализация
    createPager();
    updateSlider();
});