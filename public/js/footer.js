const backToTop = document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            backToTop.classList.remove("hidden");
            backToTop.classList.add("flex");

        } else {

            backToTop.classList.add("hidden");
            backToTop.classList.remove("flex");

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

}