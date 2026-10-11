/* =========================================================
   NGONGOTĀHĀ AFC WEBSITE
   SHARED JAVASCRIPT
   File: java.js

   Handles:
   - Navbar scroll behaviour
   - Teams dropdown (positioned under the button on phones)
   - News article popups
   - Gallery slideshow and keyboard controls
   - Sponsor slider

   Safe to load on pages that do not contain these features.
========================================================= */

"use strict";


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function initialiseNavbar() {
    const navbar = document.getElementById("navbar");

    if (!navbar) {
        return;
    }

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();
}


/* =========================================================
   TEAMS DROPDOWN
========================================================= */

function initialiseDropdown() {
    const dropdown = document.querySelector(".dropdown");
    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownMenu = document.querySelector(".dropdown-content");
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelector(".nav-links");

    if (!dropdown || !dropdownButton || !dropdownMenu) {
        return;
    }

    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const GAP = 6; // space between the button and the menu on phones

    function positionDropdown() {
        // Desktop: let the CSS handle it (opens flush under the button)
        if (!mobileQuery.matches) {
            dropdownMenu.style.top = "";
            dropdownMenu.style.left = "";
            dropdownMenu.style.transform = "";
            return;
        }

        const buttonRect = dropdownButton.getBoundingClientRect();
        const navRect = navbar ? navbar.getBoundingClientRect() : buttonRect;
        const menuWidth = dropdownMenu.offsetWidth || 190;

        // Always below the button (and below the navbar edge)
        const top = Math.max(buttonRect.bottom, navRect.bottom) + GAP;

        // Centre under the button, but keep on screen
        let left = buttonRect.left + buttonRect.width / 2 - menuWidth / 2;
        left = Math.max(10, Math.min(left, window.innerWidth - menuWidth - 10));

        dropdownMenu.style.top = top + "px";
        dropdownMenu.style.left = left + "px";
        dropdownMenu.style.transform = "none";
    }

    function openDropdown() {
        dropdown.classList.add("mobile-open");
        dropdownButton.setAttribute("aria-expanded", "true");
        positionDropdown();
    }

    function closeDropdown() {
        dropdown.classList.remove("mobile-open");
        dropdownButton.setAttribute("aria-expanded", "false");
    }

    dropdownButton.setAttribute("aria-expanded", "false");

    dropdownButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (dropdown.classList.contains("mobile-open")) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    // Desktop hover: make sure the position is reset/correct
    dropdown.addEventListener("mouseenter", positionDropdown);

    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target)) {
            closeDropdown();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeDropdown();
        }
    });

    dropdown.querySelectorAll(".dropdown-content a").forEach(function (link) {
        link.addEventListener("click", closeDropdown);
    });

    // Keep it in the right place if the phone rotates / resizes
    window.addEventListener("resize", positionDropdown);

    // If the nav bar is swiped sideways, the button moves, so close the menu
    if (navLinks) {
        navLinks.addEventListener("scroll", closeDropdown, { passive: true });
    }
}


/* =========================================================
   NEWS ARTICLES
========================================================= */

const newsArticles = {

    history: {
        image: "drone.jpg",
        kicker: "60 YEARS OF NGONGOTAHĀ AFC",
        date: "1966 → 2026",
        title: "A Club Built on Football, Community and Generations",

        story: `
            <p>
                Ngongotahā AFC is celebrating its 60th year jubilee in
                2026, and what a 60 years it has been.
            </p>

            <p>
                Founded in 1966, Ngongotahā Football Club has grown
                alongside the community it represents. What began as a
                local football club has developed into one of Rotorua's
                longstanding football institutions, providing a place
                for generations of players to learn the game, make
                friendships and pull on the Ngongotahā colours.
            </p>

            <p>
                Over the decades, the club has competed across the
                regional and national football landscape. Ngongotahā
                spent many years competing in the Northern League era,
                including football as high as the second division.
                The club has also enjoyed memorable cup and championship
                campaigns, with the 2011 season bringing a Federation
                Championship title and promotion.
            </p>

            <p>
                In 2014, Ngongotahā reached the round of 16 in the
                Chatham Cup, creating another memorable chapter in the
                club's history. Two years later came another milestone
                when the club claimed its first Waikato-Bay of Plenty
                Federation Premiership title, completing an unbeaten
                championship campaign.
            </p>

            <p>
                But the story of Ngongotahā AFC is about much more than
                league tables and trophies. It is about the volunteers
                preparing the grounds, coaches giving their time,
                families standing on the sideline, juniors discovering
                football for the first time, and players returning to
                the club year after year.
            </p>

            <p>
                As the club celebrates 60 years in 2026, the focus is
                both on remembering the people and moments that built
                Ngongotahā AFC and looking forward to the next generation.
                From Little Dribblers and junior football through to
                senior, women's and community football, the next chapter
                is already being written.
            </p>
        `
    },


    walking: {
        image: "cr2.jpg",
        kicker: "COMMUNITY FOOTBALL",
        date: "8 MAY",
        title: "Walking Football Launches in Rotorua",

        story: `
            <p>
                Ngongotahā AFC has helped launch Walking Football in
                Rotorua, opening another pathway for people to enjoy
                the game in a relaxed and welcoming environment.
            </p>

            <p>
                The programme is designed for the over-55 community and
                offers a slower-paced version of football without running
                or contact.
            </p>

            <p>
                It provides an accessible way to stay active, meet people
                and continue enjoying the game regardless of previous
                football experience or current fitness level.
            </p>

            <p>
                The programme is being led by Head Coach Marvin Koeppen,
                with sessions taking place in partnership with Parksyde
                Community Centre.
            </p>

            <p>
                It is another example of how football can provide a place
                for people at different stages of life to stay connected
                to the game and to their local community.
            </p>
        `
    },


    preseason: {
        image: "mens.jpg",
        kicker: "SENIOR FOOTBALL",
        date: "9 JAN",
        title: "Preseason 2026 Gets Underway",

        story: `
            <p>
                The First Team and U23s began preparations for the
                2026 season with preseason training at Stembridge Road.
            </p>

            <p>
                With another season ahead and plenty to build towards,
                the club welcomed new players to join the group and
                become part of the Ngongotahā senior football pathway.
            </p>

            <p>
                The first training session marked the beginning of the
                work towards the new season, with players and coaches
                getting back together and preparing for the challenges
                ahead.
            </p>

            <p>
                The session also included a club barbecue, bringing
                players, coaches and the wider football community together
                as the new season began.
            </p>

            <p>
                With the senior pathway continuing to grow, preseason
                provides another opportunity for players to put their
                hands up, become part of the group and help shape the
                2026 season.
            </p>
        `
    },


    whanau: {
        image: "cr1.jpg",
        kicker: "COMMUNITY",
        date: "30 JAN",
        title: "Football Meets the Community at Fun Whānau Days",

        story: `
            <p>
                Ngongotahā AFC took football into the community during
                a series of Fun Whānau Days across Rotorua.
            </p>

            <p>
                The club brought football stations, small goals, cones
                and plenty of footballs to local parks, giving tamariki
                and whānau the chance to get involved in a fun and
                informal setting.
            </p>

            <p>
                The events included community sessions at Ngongotahā
                Domain, Karenga Park in Te Koutu and Linton Park in
                East Mangakakahi.
            </p>

            <p>
                The focus was on making football accessible, welcoming
                and enjoyable for everyone, with young players able to
                get involved without the pressure of a formal training
                environment.
            </p>

            <p>
                The days are part of the club's continued commitment to
                making football accessible throughout the Rotorua
                community and helping more tamariki discover the game.
            </p>
        `
    }

};


/* =========================================================
   NEWS POPUP ELEMENTS
========================================================= */

let newsModal;
let newsModalImage;
let newsModalKicker;
let newsModalDate;
let newsModalTitle;
let newsModalStory;

let previouslyFocusedElement = null;


/* =========================================================
   OPEN NEWS POPUP

   Attached to window because index.html calls these using
   onclick attributes.
========================================================= */

function openNews(articleName) {
    const article = newsArticles[articleName];

    if (!article || !newsModal) {
        return;
    }

    previouslyFocusedElement = document.activeElement;

    newsModalImage.src = article.image;
    newsModalImage.alt = article.title;

    newsModalKicker.textContent = article.kicker;
    newsModalDate.textContent = article.date;
    newsModalTitle.textContent = article.title;

    newsModalStory.innerHTML = article.story;

    newsModal.classList.add("open");
    newsModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("news-modal-open");

    const closeButton = newsModal.querySelector(".news-modal-close");

    if (closeButton) {
        closeButton.focus();
    }
}


/* =========================================================
   CLOSE NEWS POPUP
========================================================= */

function closeNews() {
    if (!newsModal) {
        return;
    }

    newsModal.classList.remove("open");
    newsModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("news-modal-open");

    if (
        previouslyFocusedElement &&
        typeof previouslyFocusedElement.focus === "function"
    ) {
        previouslyFocusedElement.focus();
    }
}


/* =========================================================
   GALLERY SLIDESHOW
========================================================= */

let slideIndex = 0;
let slideTimeout = null;
let slides = [];


function showSlide(index) {
    if (!slides.length) {
        return;
    }

    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    } else {
        slideIndex = index;
    }

    slides.forEach(function (slide, indexNumber) {
        slide.classList.toggle(
            "active",
            indexNumber === slideIndex
        );
    });

    clearTimeout(slideTimeout);

    slideTimeout = setTimeout(function () {
        changeSlide(1);
    }, 8000);
}


/* =========================================================
   MANUAL GALLERY CONTROLS
========================================================= */

function changeSlide(amount) {
    if (!slides.length) {
        return;
    }

    showSlide(slideIndex + amount);
}


/* =========================================================
   GALLERY KEYBOARD CONTROLS
========================================================= */

function initialiseGalleryKeyboard() {
    document.addEventListener("keydown", function (event) {
        if (
            newsModal &&
            newsModal.classList.contains("open")
        ) {
            return;
        }

        if (event.key === "ArrowLeft") {
            changeSlide(-1);
        }

        if (event.key === "ArrowRight") {
            changeSlide(1);
        }
    });
}


/* =========================================================
   SPONSOR SLIDER

   Moves through the sponsor cards and reverses direction at
   the end, rather than relying on conflicting CSS animations.
========================================================= */

function initialiseSponsorSlider() {
    const sponsorBoard = document.querySelector(".sponsors-board");
    const sponsorTrack = document.querySelector(".sponsors-track");
    const sponsorGroup = document.querySelector(".sponsors-group");

    if (!sponsorBoard || !sponsorTrack || !sponsorGroup) {
        return;
    }

    const sponsors = Array.from(
        sponsorGroup.querySelectorAll(".sponsor-item")
    );

    if (sponsors.length < 2) {
        return;
    }

    let sponsorIndex = 0;
    let sponsorDirection = 1;
    let sponsorTimer = null;
    let resizeTimer = null;

    function getSponsorPositions() {
        const boardWidth = sponsorBoard.clientWidth;
        const groupWidth = sponsorGroup.scrollWidth;

        const maxMovement = Math.max(
            0,
            groupWidth - boardWidth
        );

        return sponsors.map(function (sponsor) {
            let position = sponsor.offsetLeft;

            const sponsorWidth = sponsor.offsetWidth;

            if (position + sponsorWidth > boardWidth) {
                position = position + sponsorWidth - boardWidth;
            }

            return Math.max(
                0,
                Math.min(position, maxMovement)
            );
        });
    }

    function moveSponsor() {
        const positions = getSponsorPositions();

        if (!positions.length) {
            return;
        }

        sponsorTrack.style.transform =
            "translateX(-" + positions[sponsorIndex] + "px)";
    }

    function nextSponsor() {
        if (sponsorDirection === 1) {
            if (sponsorIndex >= sponsors.length - 1) {
                sponsorDirection = -1;
                sponsorIndex = Math.max(0, sponsorIndex - 1);
            } else {
                sponsorIndex++;
            }
        } else {
            if (sponsorIndex <= 0) {
                sponsorDirection = 1;
                sponsorIndex = Math.min(
                    sponsors.length - 1,
                    sponsorIndex + 1
                );
            } else {
                sponsorIndex--;
            }
        }

        moveSponsor();
    }

    function startSponsorSlider() {
        clearInterval(sponsorTimer);

        sponsorTimer = setInterval(function () {
            nextSponsor();
        }, 3000);
    }

    function updateSponsorPositions() {
        const positions = getSponsorPositions();

        if (sponsorIndex >= positions.length) {
            sponsorIndex = Math.max(0, positions.length - 1);
        }

        moveSponsor();
    }

    /* Initialise the sponsor slider. */

    sponsorTrack.style.animation = "none";
    sponsorTrack.style.webkitAnimation = "none";

    sponsorTrack.style.transform = "translateX(0)";
    sponsorTrack.style.webkitTransform = "translateX(0)";

    sponsorIndex = 0;
    sponsorDirection = 1;

    moveSponsor();
    startSponsorSlider();

    /* Recalculate when the screen changes size. */

    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            updateSponsorPositions();
        }, 150);
    });

    /* Pause on hover for desktop mice; touch devices keep moving. */

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        sponsorBoard.addEventListener("mouseenter", function () {
            clearInterval(sponsorTimer);
        });

        sponsorBoard.addEventListener("mouseleave", function () {
            startSponsorSlider();
        });
    }
}


/* =========================================================
   INITIALISE WEBSITE
========================================================= */

function initialiseWebsite() {

    initialiseNavbar();
    initialiseDropdown();

    /* News popup elements. */

    newsModal = document.getElementById("newsModal");
    newsModalImage = document.getElementById("newsModalImage");
    newsModalKicker = document.getElementById("newsModalKicker");
    newsModalDate = document.getElementById("newsModalDate");
    newsModalTitle = document.getElementById("newsModalTitle");
    newsModalStory = document.getElementById("newsModalStory");

    /* Close the news popup with Escape. */

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            newsModal &&
            newsModal.classList.contains("open")
        ) {
            closeNews();
        }
    });

    /* Gallery. */

    slides = Array.from(
        document.querySelectorAll(".gallery-slide")
    );

    if (slides.length) {
        showSlide(0);
    }

    initialiseGalleryKeyboard();

    /* Sponsors. */

    initialiseSponsorSlider();
}


/* =========================================================
   START WHEN HTML IS READY
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initialiseWebsite
    );
} else {
    initialiseWebsite();
}


/* =========================================================
   EXPOSE FUNCTIONS FOR HTML ONCLICK ATTRIBUTES
========================================================= */

window.openNews = openNews;
window.closeNews = closeNews;
window.changeSlide = changeSlide;
