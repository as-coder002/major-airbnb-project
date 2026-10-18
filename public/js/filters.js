const filtersContainer = document.getElementById("filtersContainer");
const scrollLeftBtn = document.getElementById("scrollLeft");
const scrollRightBtn = document.getElementById("scrollRight");
const filterBar = document.getElementById("filterBar");

let lastScrollY = window.scrollY;

if (filtersContainer && scrollLeftBtn && scrollRightBtn) {

    const scrollAmount = 350;

    // Right Button
    scrollRightBtn.addEventListener("click", () => {

        filtersContainer.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });

        setTimeout(updateArrowVisibility, 350);

    });

    // Left Button
    scrollLeftBtn.addEventListener("click", () => {

        filtersContainer.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });

        setTimeout(updateArrowVisibility, 350);

    });

    // Update arrows while scrolling
    filtersContainer.addEventListener("scroll", updateArrowVisibility);

    // Check arrow visibility on page load
    updateArrowVisibility();

    // Automatically show active filter
    scrollToActiveFilter();

}

function updateArrowVisibility() {

    const maxScroll =
        filtersContainer.scrollWidth - filtersContainer.clientWidth;

    // Left Arrow
    if (filtersContainer.scrollLeft <= 5) {

        scrollLeftBtn.style.opacity = "0";
        scrollLeftBtn.style.pointerEvents = "none";

    } else {

        scrollLeftBtn.style.opacity = "1";
        scrollLeftBtn.style.pointerEvents = "auto";

    }

    // Right Arrow
    if (filtersContainer.scrollLeft >= maxScroll - 5) {

        scrollRightBtn.style.opacity = "0";
        scrollRightBtn.style.pointerEvents = "none";

    } else {

        scrollRightBtn.style.opacity = "1";
        scrollRightBtn.style.pointerEvents = "auto";

    }

}


// ACTIVE FILTER AUTO SCROLL
function scrollToActiveFilter() {

    const activeFilter =
        filtersContainer.querySelector(".border-rose-500");

    if (!activeFilter) {
        return;
    }

    activeFilter.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    });

}


window.addEventListener("scroll", () => {

    // User page-er top-er kache ache
    if (window.scrollY <= 120) {

        filterBar.style.transform = "translateY(0)";
        filterBar.style.opacity = "1";

    }

    // User niche scroll koreche
    else {

        filterBar.style.transform = "translateY(-120%)";
        filterBar.style.opacity = "0";

    }

});