/* ================================================================
   NGONGOTĀHĀ AFC — MASTER JAVASCRIPT
   File: java.js

   Website-wide functionality:
   - Responsive navigation dropdown
   - Desktop hover support
   - Mobile tap support
   - Close dropdown when clicking elsewhere
   - Close dropdown with Escape
   - Accessible dropdown state
   - Safe to load on pages without every feature

   The club shop remains separate in shop.js.
   ================================================================ */

(function () {
    "use strict";

    /* ============================================================
       NAVIGATION DROPDOWN
       ============================================================ */

    function initialiseNavigation() {
        const dropdowns = document.querySelectorAll(".dropdown");

        if (!dropdowns.length) {
            return;
        }

        const mobileQuery = window.matchMedia("(max-width: 768px)");

        /*
         * Find the dropdown trigger.
         *
         * Supports common navigation markup using:
         * - A button
         * - An anchor
         * - A direct child with the "dropbtn" class
         *
         * The dropdown menu should use the "dropdown-content" class.
         */

        dropdowns.forEach(function (dropdown) {
            const trigger =
                dropdown.querySelector(".dropbtn") ||
                dropdown.querySelector(
                    ":scope > button, :scope > a"
                );

            const menu = dropdown.querySelector(".dropdown-content");

            if (!trigger || !menu) {
                return;
            }

            /*
             * Give the trigger and menu accessible attributes.
             */

            if (!trigger.hasAttribute("aria-expanded")) {
                trigger.setAttribute("aria-expanded", "false");
            }

            if (!menu.id) {
                menu.id =
                    "nav-dropdown-" +
                    Math.random().toString(36).slice(2, 10);
            }

            trigger.setAttribute("aria-controls", menu.id);

            /*
             * Track whether this dropdown has been opened by a tap.
             */

            let isOpen = false;

            function openDropdown() {
                isOpen = true;

                dropdown.classList.add("dropdown-open");

                trigger.setAttribute("aria-expanded", "true");

                menu.setAttribute("aria-hidden", "false");
            }

            function closeDropdown() {
                isOpen = false;

                dropdown.classList.remove("dropdown-open");

                trigger.setAttribute("aria-expanded", "false");

                menu.setAttribute("aria-hidden", "true");
            }

            function toggleDropdown() {
                if (isOpen) {
                    closeDropdown();
                } else {
                    openDropdown();
                }
            }

            /*
             * Initial state.
             */

            menu.setAttribute("aria-hidden", "true");

            /*
             * MOBILE:
             * Tap the trigger to open or close the dropdown.
             *
             * DESKTOP:
             * Allow the existing CSS hover behaviour to work.
             */

            trigger.addEventListener("click", function (event) {
                if (mobileQuery.matches) {
                    event.preventDefault();
                    event.stopPropagation();

                    toggleDropdown();
                }
            });

            /*
             * Close the dropdown when tapping outside it.
             */

            document.addEventListener("click", function (event) {
                if (!dropdown.contains(event.target)) {
                    closeDropdown();
                }
            });

            /*
             * Close the dropdown using Escape.
             */

            dropdown.addEventListener("keydown", function (event) {
                if (event.key === "Escape" && isOpen) {
                    closeDropdown();
                    trigger.focus();
                }
            });

            /*
             * Close the dropdown after selecting a team link.
             */

            menu.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", function () {
                    closeDropdown();
                });
            });

            /*
             * If the screen changes from phone to desktop or vice versa,
             * clear the mobile open state.
             */

            function handleScreenChange() {
                closeDropdown();
            }

            if (typeof mobileQuery.addEventListener === "function") {
                mobileQuery.addEventListener(
                    "change",
                    handleScreenChange
                );
            } else if (typeof mobileQuery.addListener === "function") {
                /* Compatibility with older browsers. */
                mobileQuery.addListener(handleScreenChange);
            }
        });
    }


    /* ============================================================
       MOBILE NAVIGATION SAFETY
       ============================================================ */

    function initialiseMobileNavigation() {
        /*
         * This function deliberately avoids changing the layout
         * of the navigation bar.
         *
         * Dropdown positioning and visual styling belong in CSS.
         * JavaScript controls only the interaction.
         */

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape") {
                return;
            }

            document.querySelectorAll(
                ".dropdown.dropdown-open"
            ).forEach(function (dropdown) {
                dropdown.classList.remove("dropdown-open");

                const trigger =
                    dropdown.querySelector(".dropbtn") ||
                    dropdown.querySelector(
                        ":scope > button, :scope > a"
                    );

                const menu = dropdown.querySelector(
                    ".dropdown-content"
                );

                if (trigger) {
                    trigger.setAttribute("aria-expanded", "false");
                }

                if (menu) {
                    menu.setAttribute("aria-hidden", "true");
                }
            });
        });
    }


    /* ============================================================
       INITIALISE WEBSITE
       ============================================================ */

    function initialiseWebsite() {
        initialiseNavigation();
        initialiseMobileNavigation();
    }

    /*
     * Run after the HTML has been parsed.
     */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialiseWebsite
        );
    } else {
        initialiseWebsite();
    }

})();