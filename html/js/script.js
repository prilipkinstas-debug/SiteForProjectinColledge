/* =========================================================
   ВЕКТОР — MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    const header = document.getElementById("header");

    const updateHeader = () => {

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    window.addEventListener("scroll", updateHeader);

    updateHeader();


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const burger = document.getElementById("burger");
    const navigation = document.getElementById("navigation");

    if (burger && navigation) {

        burger.addEventListener("click", () => {

            const isOpen =
                navigation.classList.toggle("active");

            burger.classList.toggle(
                "active",
                isOpen
            );

            burger.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });


        /* Закрытие меню при клике на ссылку */

        navigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    navigation.classList.remove("active");

                    burger.classList.remove("active");

                    burger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );

                });

            });

    }


    /* =====================================================
       DROPDOWN MENU
    ===================================================== */

    const dropdownItems =
        document.querySelectorAll(
            ".navigation__item--dropdown"
        );

    dropdownItems.forEach(item => {

        const button =
            item.querySelector(
                ".navigation__link--button"
            );

        if (!button) return;

        button.addEventListener("click", event => {

            /*
                На мобильных устройствах
                открываем подменю по клику.
            */

            if (window.innerWidth <= 992) {

                event.preventDefault();

                dropdownItems.forEach(other => {

                    if (other !== item) {
                        other.classList.remove(
                            "dropdown-open"
                        );
                    }

                });

                item.classList.toggle(
                    "dropdown-open"
                );

            }

        });

    });


    /* =====================================================
       CLOSE DROPDOWNS OUTSIDE
    ===================================================== */

    document.addEventListener("click", event => {

        if (window.innerWidth > 992) return;

        if (
            !event.target.closest(
                ".navigation__item--dropdown"
            )
        ) {

            dropdownItems.forEach(item => {

                item.classList.remove(
                    "dropdown-open"
                );

            });

        }

    });


    /* =====================================================
       INSURANCE SLIDER
    ===================================================== */

    const slider =
        document.getElementById(
            "insuranceSlider"
        );

    if (slider) {

        const slides =
            slider.querySelectorAll(".slide");

        const dots =
            slider.querySelectorAll(".slider__dot");

        const previousButton =
            document.getElementById(
                "sliderPrev"
            );

        const nextButton =
            document.getElementById(
                "sliderNext"
            );

        let currentSlide = 0;

        let autoplayTimer = null;

        const AUTOPLAY_TIME = 6000;


        /* -----------------------------------------------
           SHOW SLIDE
        ------------------------------------------------ */

        const showSlide = index => {

            if (!slides.length) return;

            if (index < 0) {
                index = slides.length - 1;
            }

            if (index >= slides.length) {
                index = 0;
            }

            currentSlide = index;


            slides.forEach((slide, i) => {

                slide.classList.toggle(
                    "slide--active",
                    i === currentSlide
                );

            });


            dots.forEach((dot, i) => {

                dot.classList.toggle(
                    "slider__dot--active",
                    i === currentSlide
                );

            });

        };


        /* -----------------------------------------------
           NEXT
        ------------------------------------------------ */

        const nextSlide = () => {

            showSlide(
                currentSlide + 1
            );

        };


        /* -----------------------------------------------
           PREVIOUS
        ------------------------------------------------ */

        const previousSlide = () => {

            showSlide(
                currentSlide - 1
            );

        };


        /* -----------------------------------------------
           BUTTONS
        ------------------------------------------------ */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    nextSlide();

                    restartAutoplay();

                }
            );

        }


        if (previousButton) {

            previousButton.addEventListener(
                "click",
                () => {

                    previousSlide();

                    restartAutoplay();

                }
            );

        }


        /* -----------------------------------------------
           DOTS
        ------------------------------------------------ */

        dots.forEach((dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    showSlide(index);

                    restartAutoplay();

                }
            );

        });


        /* -----------------------------------------------
           AUTOPLAY
        ------------------------------------------------ */

        const startAutoplay = () => {

            stopAutoplay();

            autoplayTimer =
                setInterval(
                    nextSlide,
                    AUTOPLAY_TIME
                );

        };


        const stopAutoplay = () => {

            if (autoplayTimer) {

                clearInterval(
                    autoplayTimer
                );

                autoplayTimer = null;

            }

        };


        const restartAutoplay = () => {

            startAutoplay();

        };


        /* -----------------------------------------------
           PAUSE ON HOVER
        ------------------------------------------------ */

        slider.addEventListener(
            "mouseenter",
            stopAutoplay
        );

        slider.addEventListener(
            "mouseleave",
            startAutoplay
        );


        /* -----------------------------------------------
           TOUCH SWIPE
        ------------------------------------------------ */

        let touchStartX = 0;
        let touchEndX = 0;


        slider.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );


        slider.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;

                const distance =
                    touchStartX - touchEndX;


                if (Math.abs(distance) < 50) {
                    return;
                }


                if (distance > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }

                restartAutoplay();

            },
            { passive: true }
        );


        /* -----------------------------------------------
           KEYBOARD
        ------------------------------------------------ */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "ArrowRight"
                ) {

                    nextSlide();

                    restartAutoplay();

                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    previousSlide();

                    restartAutoplay();

                }

            }
        );


        showSlide(0);

        startAutoplay();

    }


    /* =====================================================
       REVIEWS SLIDER
    ===================================================== */

    const reviewsSlider =
        document.getElementById(
            "reviewsSlider"
        );

    if (reviewsSlider) {

        const reviews =
            reviewsSlider.querySelectorAll(
                ".review"
            );

        const previous =
            document.getElementById(
                "reviewPrev"
            );

        const next =
            document.getElementById(
                "reviewNext"
            );

        let currentReview = 0;


        const showReview = index => {

            if (index < 0) {
                index = reviews.length - 1;
            }

            if (index >= reviews.length) {
                index = 0;
            }

            currentReview = index;


            reviews.forEach(
                (review, i) => {

                    review.classList.toggle(
                        "review--active",
                        i === currentReview
                    );

                }
            );

        };


        if (previous) {

            previous.addEventListener(
                "click",
                () => {

                    showReview(
                        currentReview - 1
                    );

                }
            );

        }


        if (next) {

            next.addEventListener(
                "click",
                () => {

                    showReview(
                        currentReview + 1
                    );

                }
            );

        }


        showReview(0);

    }


    /* =====================================================
       SCROLL TO TOP
    ===================================================== */

    const scrollTop =
        document.getElementById(
            "scrollTop"
        );

    if (scrollTop) {

        const toggleScrollTop = () => {

            if (window.scrollY > 500) {

                scrollTop.classList.add(
                    "visible"
                );

            } else {

                scrollTop.classList.remove(
                    "visible"
                );

            }

        };


        window.addEventListener(
            "scroll",
            toggleScrollTop
        );


        scrollTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        toggleScrollTop();

    }


    /* =====================================================
       CONSULTATION FORM
    ===================================================== */

    const form =
        document.getElementById(
            "consultationForm"
        );

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "name"
                    );


                const existingSuccess =
                    form.querySelector(
                        ".form-success"
                    );


                if (existingSuccess) {
                    existingSuccess.remove();
                }


                const success =
                    document.createElement(
                        "div"
                    );

                success.className =
                    "form-success";


                const userName =
                    name && name.value.trim()
                        ? name.value.trim()
                        : "клиент";


                success.textContent =
                    `Спасибо, ${userName}! Заявка отправлена. Мы свяжемся с вами в ближайшее время.`;


                form.prepend(success);


                form.reset();


                setTimeout(() => {

                    success.remove();

                }, 6000);

            }
        );

    }


    /* =====================================================
       PHONE MASK
    ===================================================== */

    const phone =
        document.getElementById(
            "phone"
        );

    if (phone) {

        phone.addEventListener(
            "input",
            event => {

                let value =
                    event.target.value
                        .replace(/\D/g, "");


                if (value.startsWith("8")) {
                    value =
                        "7" +
                        value.slice(1);
                }


                if (!value.startsWith("7")) {
                    value =
                        "7" +
                        value;
                }


                value =
                    value.slice(0, 11);


                let formatted =
                    "+7";


                if (value.length > 1) {

                    formatted +=
                        " (" +
                        value.slice(1, 4);

                }


                if (value.length >= 4) {

                    formatted +=
                        ") " +
                        value.slice(4, 7);

                }


                if (value.length >= 7) {

                    formatted +=
                        "-" +
                        value.slice(7, 9);

                }


                if (value.length >= 9) {

                    formatted +=
                        "-" +
                        value.slice(9, 11);

                }


                event.target.value =
                    formatted;

            }
        );

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                event => {

                    const targetId =
                        anchor
                            .getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const position =
                        target.offsetTop -
                        headerHeight;


                    window.scrollTo({
                        top: position,
                        behavior: "smooth"
                    });


                    /*
                       Закрываем мобильное меню.
                    */

                    if (navigation) {

                        navigation.classList.remove(
                            "active"
                        );

                    }

                    if (burger) {

                        burger.classList.remove(
                            "active"
                        );

                        burger.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                    document.body.classList.remove(
                        "menu-open"
                    );

                }
            );

        });


    /* =====================================================
       INTERSECTION OBSERVER
       Плавное появление секций
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".advantage, .product-card, .news-card, .consultation__box"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach(
            element => {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translateY(25px)";

                element.style.transition =
                    "opacity .7s ease, transform .7s ease";

                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            /*
               При переходе с mobile на desktop
               очищаем состояние мобильного меню.
            */

            if (window.innerWidth > 992) {

                if (navigation) {
                    navigation.classList.remove(
                        "active"
                    );
                }

                if (burger) {

                    burger.classList.remove(
                        "active"
                    );

                    burger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

                document.body.classList.remove(
                    "menu-open"
                );

                dropdownItems.forEach(
                    item => {

                        item.classList.remove(
                            "dropdown-open"
                        );

                    }
                );

            }

        }
    );

});