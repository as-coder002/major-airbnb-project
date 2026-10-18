// ===========================================
// Profile Dropdown
// ===========================================

const profileBtn = document.getElementById("profileBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const arrowIcon = document.getElementById("arrowIcon");

if (profileBtn && dropdownMenu && arrowIcon) {

    function openDropdown() {

        dropdownMenu.classList.remove(
            "opacity-0",
            "scale-95",
            "invisible"
        );

        dropdownMenu.classList.add(
            "opacity-100",
            "scale-100",
            "visible"
        );

        arrowIcon.classList.add("rotate-180");

    }

    function closeDropdown() {

        dropdownMenu.classList.remove(
            "opacity-100",
            "scale-100",
            "visible"
        );

        dropdownMenu.classList.add(
            "opacity-0",
            "scale-95",
            "invisible"
        );

        arrowIcon.classList.remove("rotate-180");

    }

    function toggleDropdown() {

        if (dropdownMenu.classList.contains("invisible")) {

            openDropdown();

        } else {

            closeDropdown();

        }

    }

    profileBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        toggleDropdown();

    });

    dropdownMenu.addEventListener("click", (e) => {

        e.stopPropagation();

    });

    document.addEventListener("click", () => {

        closeDropdown();

    });

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closeDropdown();

        }

    });

}


// ===========================================
// Navbar Scroll + Compact Search
// ===========================================

const navbar = document.getElementById("navbar");
const navbarContainer = document.getElementById("navbarContainer");

const searchBar = document.getElementById("searchBar");

const searchAnywhere = document.getElementById("searchAnywhere");
const searchWeek = document.getElementById("searchWeek");

const dividerOne = document.getElementById("dividerOne");
const dividerTwo = document.getElementById("dividerTwo");


if (
    navbar &&
    navbarContainer &&
    searchBar &&
    searchAnywhere &&
    searchWeek
) {

    window.addEventListener("scroll", () => {

        // ===========================================
        // COMPACT STATE
        // ===========================================

        if (window.scrollY > 80) {

            // Navbar
            navbar.classList.remove(
                "bg-white",
                "shadow-sm"
            );

            navbar.classList.add(
                "bg-white/70",
                "backdrop-blur-xl",
                "shadow-lg"
            );


            // Navbar Height
            navbarContainer.classList.remove("py-4");

            navbarContainer.classList.add("py-3");


            // ===========================================
            // SEARCH BAR
            // ===========================================

            searchBar.classList.remove("max-w-xl");

            searchBar.classList.add("max-w-xs");


            // ===========================================
            // REMOVE "ANYWHERE"
            // ===========================================

            searchAnywhere.classList.add(
                "opacity-0",
                "max-w-0",
                "px-0",
                "overflow-hidden"
            );


            // ===========================================
            // REMOVE "ADD DATES"
            // ===========================================

            searchWeek.classList.add(
                "opacity-0",
                "max-w-0",
                "px-0",
                "overflow-hidden"
            );


            // ===========================================
            // REMOVE DIVIDERS
            // ===========================================

            dividerOne.classList.add(
                "opacity-0",
                "w-0"
            );

            dividerTwo.classList.add(
                "opacity-0",
                "w-0"
            );

        }


        // ===========================================
        // FULL STATE
        // ===========================================

        else {

            // Navbar
            navbar.classList.remove(
                "bg-white/70",
                "backdrop-blur-xl",
                "shadow-lg"
            );

            navbar.classList.add(
                "bg-white",
                "shadow-sm"
            );


            // Navbar Height
            navbarContainer.classList.remove("py-3");

            navbarContainer.classList.add("py-4");


            // ===========================================
            // SEARCH BAR
            // ===========================================

            searchBar.classList.remove("max-w-xs");

            searchBar.classList.add("max-w-xl");


            // ===========================================
            // SHOW "ANYWHERE"
            // ===========================================

            searchAnywhere.classList.remove(
                "opacity-0",
                "max-w-0",
                "px-0",
                "overflow-hidden"
            );


            // ===========================================
            // SHOW "ADD DATES"
            // ===========================================

            searchWeek.classList.remove(
                "opacity-0",
                "max-w-0",
                "px-0",
                "overflow-hidden"
            );


            // ===========================================
            // SHOW DIVIDERS
            // ===========================================

            dividerOne.classList.remove(
                "opacity-0",
                "w-0"
            );

            dividerTwo.classList.remove(
                "opacity-0",
                "w-0"
            );

        }

    });

}