/* ================================================================
   NGONGOTĀHĀ AFC CLUB SHOP
   shop.js

   Front-end shopping bag for the club website.

   This is a browser-only prototype:
   - No payments are processed.
   - No customer details are collected.
   - No real orders are created.
   - No emails are sent.
   - The shopping bag is saved in browser storage.

   A secure server and payment integration will be needed for
   the live shop.
   ================================================================ */

(function () {
    "use strict";

    /* ============================================================
       CONFIGURATION
       ============================================================ */

    const STORAGE_KEY = "ngongotahaAfcShopBag";
    const CURRENCY = "NZD";

    /*
       Product prices are examples.

       Update these values to the club's confirmed prices before
       making the shop available for real purchases.
    */

    const PRODUCTS = {
        shirt: {
            id: "shirt",
            name: "Club Playing Shirt",
            price: 55,
            image: "shirt.jpg",
            category: "matchwear",
            hasSize: true
        },

        shorts: {
            id: "shorts",
            name: "Club Playing Shorts",
            price: 35,
            image: "shorts.jpg",
            category: "matchwear",
            hasSize: true
        },

        socks: {
            id: "socks",
            name: "Club Football Socks",
            price: 18,
            image: "socks.jpg",
            category: "accessories",
            hasSize: true
        },

        hoodie: {
            id: "hoodie",
            name: "Club Hoodie",
            price: 65,
            image: "hoodie.jpg",
            category: "supporter-gear",
            hasSize: true
        },

        "training-top": {
            id: "training-top",
            name: "Training Top",
            price: 40,
            image: "training-top.jpg",
            category: "matchwear",
            hasSize: true
        },

        jacket: {
            id: "jacket",
            name: "Club Training Jacket",
            price: 80,
            image: "jacket.jpg",
            category: "matchwear",
            hasSize: true
        },

        beanie: {
            id: "beanie",
            name: "Club Beanie",
            price: 25,
            image: "beanie.jpg",
            category: "supporter-gear",
            hasSize: false,
            defaultSize: "One Size"
        },

        scarf: {
            id: "scarf",
            name: "Supporter Scarf",
            price: 30,
            image: "scarf.jpg",
            category: "supporter-gear",
            hasSize: false,
            defaultSize: "One Size"
        },

        cap: {
            id: "cap",
            name: "Club Cap",
            price: 28,
            image: "cap.jpg",
            category: "supporter-gear",
            hasSize: false,
            defaultSize: "One Size"
        }
    };


    /* ============================================================
       ELEMENTS
       ============================================================ */

    const elements = {
        productGrid: document.getElementById("shopProductGrid"),

        searchInput: document.getElementById("shopSearchInput"),

        filterButtons: document.querySelectorAll(
            ".shop-filter-button"
        ),

        productCards: document.querySelectorAll(
            ".shop-product-card"
        ),

        emptyResults: document.getElementById("shopEmptyResults"),

        openBagButton: document.getElementById("shopOpenBag"),

        bagCount: document.getElementById("shopBagCount"),

        drawer: document.getElementById("shopDrawer"),

        drawerOverlay: document.getElementById(
            "shopDrawerOverlay"
        ),

        closeBagButton: document.getElementById("shopCloseBag"),

        continueShoppingButton: document.getElementById(
            "shopContinueShopping"
        ),

        cartItems: document.getElementById("shopCartItems"),

        cartSubtotal: document.getElementById("shopCartSubtotal"),

        checkoutButton: document.getElementById(
            "shopCheckoutButton"
        ),

        checkoutModal: document.getElementById(
            "shopCheckoutModal"
        ),

        closeCheckoutButton: document.getElementById(
            "shopCloseCheckout"
        ),

        returnToBagButton: document.getElementById(
            "shopReturnToBag"
        ),

        toast: document.getElementById("shopToast"),

        toastMessage: document.getElementById(
            "shopToastMessage"
        ),

        heroImage: document.getElementById("shopHeroImage"),

        heroFallback: document.getElementById(
            "shopHeroFallback"
        ),

        openSizeGuideButton: document.getElementById(
            "shopOpenSizeGuide"
        ),

        sizeGuideModal: document.getElementById(
            "shopSizeGuideModal"
        ),

        closeSizeGuideButton: document.getElementById(
            "shopCloseSizeGuide"
        )
    };


    /* ============================================================
       STATE
       ============================================================ */

    let cart = loadCart();

    let activeFilter = "all";

    let toastTimer = null;

    let previousFocusedElement = null;


    /* ============================================================
       HELPERS
       ============================================================ */

    /**
     * Format an amount as New Zealand dollars.
     */
    function formatMoney(amount) {
        return new Intl.NumberFormat("en-NZ", {
            style: "currency",
            currency: CURRENCY
        }).format(amount);
    }


    /**
     * Safely escape text before inserting it into HTML.
     */
    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /**
     * Return the total quantity of all items in the bag.
     */
    function getCartQuantity() {
        return cart.reduce(function (total, item) {
            return total + item.quantity;
        }, 0);
    }


    /**
     * Return the subtotal of all items in the bag.
     */
    function getCartSubtotal() {
        return cart.reduce(function (total, item) {
            return total + item.price * item.quantity;
        }, 0);
    }


    /**
     * Find a product using its ID.
     */
    function getProduct(productId) {
        return PRODUCTS[productId] || null;
    }


    /**
     * Create a unique key for a product and its size.
     *
     * This means a junior shirt and an adult shirt can be stored
     * as separate lines in the shopping bag.
     */
    function getCartItemKey(productId, size) {
        return productId + "::" + size;
    }


    /* ============================================================
       BROWSER STORAGE
       ============================================================ */

    /**
     * Load the bag from localStorage.
     *
     * The bag remains saved in this browser after refreshing
     * the page or returning to the shop later.
     *
     * It is not an order or a server-side record.
     */
    function loadCart() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return [];
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed.filter(function (item) {
                if (!item || typeof item !== "object") {
                    return false;
                }

                const product = PRODUCTS[item.productId];

                if (!product) {
                    return false;
                }

                if (
                    typeof item.size !== "string" ||
                    !item.size.trim()
                ) {
                    return false;
                }

                if (
                    !Number.isInteger(item.quantity) ||
                    item.quantity < 1 ||
                    item.quantity > 99
                ) {
                    return false;
                }

                return true;
            }).map(function (item) {
                const product = PRODUCTS[item.productId];

                /*
                 * Always use the current configured product price.
                 * Do not trust an old price stored in the browser.
                 */

                return {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: item.size,
                    quantity: item.quantity
                };
            });

        } catch (error) {
            console.warn(
                "The saved shopping bag could not be loaded.",
                error
            );

            return [];
        }
    }


    /**
     * Save the current bag in this browser for future visits.
     */
    function saveCart() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cart)
            );
        } catch (error) {
            console.warn(
                "The shopping bag could not be saved.",
                error
            );
        }
    }


    /* ============================================================
       PRODUCT FILTERS AND SEARCH
       ============================================================ */

    /**
     * Filter products using the selected category and search text.
     */
    function filterProducts() {
        const searchTerm = elements.searchInput
            ? elements.searchInput.value
                .trim()
                .toLowerCase()
            : "";

        let visibleProducts = 0;

        elements.productCards.forEach(function (card) {
            const category = card.dataset.category || "";

            const searchableText = (
                (card.dataset.search || "") +
                " " +
                card.textContent
            ).toLowerCase();

            const matchesCategory =
                activeFilter === "all" ||
                category === activeFilter;

            const matchesSearch =
                searchTerm === "" ||
                searchableText.includes(searchTerm);

            const isVisible =
                matchesCategory && matchesSearch;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleProducts++;
            }
        });

        if (elements.emptyResults) {
            elements.emptyResults.classList.toggle(
                "visible",
                visibleProducts === 0
            );
        }
    }


    /**
     * Set the active category filter.
     */
    function setActiveFilter(filter) {
        activeFilter = filter;

        elements.filterButtons.forEach(function (button) {
            const isActive = button.dataset.filter === filter;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        filterProducts();
    }


    /* ============================================================
       ADDING PRODUCTS
       ============================================================ */

    /**
     * Read the selected size from a product card.
     */
    function getSelectedSize(productId) {
        const product = getProduct(productId);

        if (!product) {
            return null;
        }

        if (!product.hasSize) {
            return product.defaultSize || "One Size";
        }

        const sizeSelect = document.querySelector(
            '[data-size-for="' + productId + '"]'
        );

        if (!sizeSelect) {
            return null;
        }

        return sizeSelect.value || null;
    }


    /**
     * Add a product to the shopping bag.
     */
    function addToCart(productId) {
        const product = getProduct(productId);

        if (!product) {
            return;
        }

        const size = getSelectedSize(productId);

        if (!size) {
            showToast("Please choose a size first.");

            const sizeSelect = document.querySelector(
                '[data-size-for="' + productId + '"]'
            );

            if (sizeSelect) {
                sizeSelect.focus();
            }

            return;
        }

        const existingItem = cart.find(function (item) {
            return (
                item.productId === productId &&
                item.size === size
            );
        });

        if (existingItem) {
            if (existingItem.quantity >= 99) {
                showToast(
                    "You can add a maximum of 99 of each item."
                );

                return;
            }

            existingItem.quantity += 1;

        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: 1
            });
        }

        saveCart();

        renderCart();

        showToast(product.name + " added to your bag.");

        /*
         * Open the shopping bag after adding a product.
         * The bag icon also becomes visible at this point.
         */
        openCart();
    }


    /* ============================================================
       QUANTITY AND REMOVAL
       ============================================================ */

    /**
     * Update the quantity of a cart item.
     */
    function changeQuantity(productId, size, change) {
        const item = cart.find(function (cartItem) {
            return (
                cartItem.productId === productId &&
                cartItem.size === size
            );
        });

        if (!item) {
            return;
        }

        const newQuantity = item.quantity + change;

        if (newQuantity < 1) {
            removeFromCart(productId, size);
            return;
        }

        if (newQuantity > 99) {
            showToast(
                "You can add a maximum of 99 of each item."
            );

            return;
        }

        item.quantity = newQuantity;

        saveCart();

        renderCart();
    }


    /**
     * Remove a product and size combination from the bag.
     */
    function removeFromCart(productId, size) {
        cart = cart.filter(function (item) {
            return !(
                item.productId === productId &&
                item.size === size
            );
        });

        saveCart();

        renderCart();

        showToast("Item removed from your bag.");
    }


    /* ============================================================
       DRAWING THE SHOPPING BAG
       ============================================================ */

    /**
     * Create the HTML for one cart item.
     */
    function createCartItemHTML(item) {
        const safeName = escapeHTML(item.name);
        const safeSize = escapeHTML(item.size);
        const safeImage = escapeHTML(item.image);
        const safeProductId = escapeHTML(item.productId);

        const lineTotal = item.price * item.quantity;

        return `
            <article class="shop-cart-item">

                <div class="shop-cart-item-image">

                    <img
                        src="${safeImage}"
                        alt="${safeName}"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >

                </div>


                <div>

                    <h3>${safeName}</h3>

                    <div class="shop-cart-item-meta">
                        Size: ${safeSize}
                    </div>

                    <div class="shop-cart-item-price">
                        ${formatMoney(lineTotal)}
                    </div>


                    <div class="shop-cart-item-controls">

                        <div
                            class="shop-quantity-control"
                            aria-label="Change quantity"
                        >

                            <button
                                type="button"
                                data-cart-action="decrease"
                                data-product-id="${safeProductId}"
                                data-size="${safeSize}"
                                aria-label="Decrease quantity of ${safeName}"
                            >
                                −
                            </button>

                            <span>${item.quantity}</span>

                            <button
                                type="button"
                                data-cart-action="increase"
                                data-product-id="${safeProductId}"
                                data-size="${safeSize}"
                                aria-label="Increase quantity of ${safeName}"
                            >
                                +
                            </button>

                        </div>


                        <button
                            type="button"
                            class="shop-remove-item"
                            data-cart-action="remove"
                            data-product-id="${safeProductId}"
                            data-size="${safeSize}"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            </article>
        `;
    }


    /**
     * Update the shopping bag icon, contents and subtotal.
     */
    function renderCart() {
        const totalQuantity = getCartQuantity();

        const subtotal = getCartSubtotal();


        /*
         * Only show the bag icon once the bag contains an item.
         */
        if (elements.openBagButton) {
            elements.openBagButton.classList.toggle(
                "visible",
                totalQuantity > 0
            );

            elements.openBagButton.setAttribute(
                "aria-label",
                "Open shopping bag, " +
                totalQuantity +
                (totalQuantity === 1 ? " item" : " items")
            );
        }


        if (elements.bagCount) {
            elements.bagCount.textContent = totalQuantity;
        }


        if (elements.cartSubtotal) {
            elements.cartSubtotal.textContent =
                formatMoney(subtotal);
        }


        if (elements.checkoutButton) {
            elements.checkoutButton.disabled =
                cart.length === 0;
        }


        if (!elements.cartItems) {
            return;
        }


        if (cart.length === 0) {
            elements.cartItems.innerHTML = `
                <div class="shop-cart-empty">

                    <div
                        class="shop-cart-empty-icon"
                        aria-hidden="true"
                    >
                        🛍
                    </div>

                    <h3>Your bag is empty</h3>

                    <p>
                        Have a look through the club collection
                        and add something you like.
                    </p>

                </div>
            `;

            return;
        }


        elements.cartItems.innerHTML = cart
            .map(createCartItemHTML)
            .join("");
    }


    /* ============================================================
       OPENING AND CLOSING THE SHOPPING BAG
       ============================================================ */

    /**
     * Open the shopping bag drawer.
     */
    function openCart() {
        if (!elements.drawer || !elements.drawerOverlay) {
            return;
        }

        previousFocusedElement = document.activeElement;

        elements.drawer.classList.add("open");

        elements.drawerOverlay.classList.add("open");

        elements.drawer.setAttribute("aria-hidden", "false");

        elements.drawer.inert = false;

        elements.drawerOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        if (elements.openBagButton) {
            elements.openBagButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        document.body.style.overflow = "hidden";

        window.setTimeout(function () {
            if (elements.closeBagButton) {
                elements.closeBagButton.focus();
            }
        }, 50);
    }


    /**
     * Close the shopping bag drawer.
     */
    function closeCart() {
        if (!elements.drawer || !elements.drawerOverlay) {
            return;
        }

        elements.drawer.classList.remove("open");

        elements.drawerOverlay.classList.remove("open");

        elements.drawer.setAttribute("aria-hidden", "true");

        elements.drawer.inert = true;

        elements.drawerOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        if (elements.openBagButton) {
            elements.openBagButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        document.body.style.overflow = "";

        if (
            previousFocusedElement &&
            typeof previousFocusedElement.focus === "function"
        ) {
            previousFocusedElement.focus();
        }
    }


    /* ============================================================
       CHECKOUT MESSAGE
       ============================================================ */

    /**
     * Open the checkout work-in-progress message.
     *
     * No order is submitted, no personal details are requested,
     * and no payment provider is contacted.
     */
    function openCheckoutMessage() {
        if (cart.length === 0) {
            showToast("Your shopping bag is empty.");
            return;
        }

        if (!elements.checkoutModal) {
            showToast(
                "Checkout is not available yet."
            );

            return;
        }

        closeCart();

        elements.checkoutModal.classList.add("open");

        elements.checkoutModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

        window.setTimeout(function () {
            if (elements.closeCheckoutButton) {
                elements.closeCheckoutButton.focus();
            }
        }, 50);
    }


    /**
     * Close the checkout message.
     */
    function closeCheckoutMessage() {
        if (!elements.checkoutModal) {
            return;
        }

        elements.checkoutModal.classList.remove("open");

        elements.checkoutModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

        if (elements.openBagButton) {
            elements.openBagButton.focus();
        }
    }


    /**
     * Close checkout and return to the shopping bag.
     */
    function returnToBag() {
        if (!elements.checkoutModal) {
            return;
        }

        elements.checkoutModal.classList.remove("open");

        elements.checkoutModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

        openCart();
    }


    /* ============================================================
       TOAST MESSAGES
       ============================================================ */

    /**
     * Show a small notification when a product is added or removed.
     */
    function showToast(message) {
        if (!elements.toast || !elements.toastMessage) {
            return;
        }

        elements.toastMessage.textContent = message;

        elements.toast.classList.add("visible");

        if (toastTimer) {
            window.clearTimeout(toastTimer);
        }

        toastTimer = window.setTimeout(function () {
            elements.toast.classList.remove("visible");
        }, 2800);
    }


    /* ============================================================
       EVENT LISTENERS
       ============================================================ */

    /**
     * Product buttons.
     */
    document.querySelectorAll(
        ".shop-product-add"
    ).forEach(function (button) {
        button.addEventListener("click", function () {
            const productId = button.dataset.productId;

            addToCart(productId);
        });
    });


    /**
     * Category filter buttons.
     */
    elements.filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            setActiveFilter(button.dataset.filter);
        });
    });


    /**
     * Search field.
     */
    if (elements.searchInput) {
        elements.searchInput.addEventListener(
            "input",
            filterProducts
        );
    }


    /**
     * Open bag.
     */
    if (elements.openBagButton) {
        elements.openBagButton.addEventListener(
            "click",
            openCart
        );
    }


    /**
     * Close bag.
     */
    if (elements.closeBagButton) {
        elements.closeBagButton.addEventListener(
            "click",
            closeCart
        );
    }


    /**
     * Close bag by clicking outside the drawer.
     */
    if (elements.drawerOverlay) {
        elements.drawerOverlay.addEventListener(
            "click",
            closeCart
        );
    }


    /**
     * Continue shopping.
     */
    if (elements.continueShoppingButton) {
        elements.continueShoppingButton.addEventListener(
            "click",
            closeCart
        );
    }


    /**
     * Cart quantity buttons and remove buttons.
     *
     * Event delegation means this also works for cart items
     * created after the page initially loads.
     */
    if (elements.cartItems) {
        elements.cartItems.addEventListener(
            "click",
            function (event) {
                const button = event.target.closest(
                    "[data-cart-action]"
                );

                if (!button) {
                    return;
                }

                const action = button.dataset.cartAction;

                const productId = button.dataset.productId;

                const size = button.dataset.size;

                if (!productId || !size) {
                    return;
                }

                if (action === "increase") {
                    changeQuantity(productId, size, 1);
                }

                if (action === "decrease") {
                    changeQuantity(productId, size, -1);
                }

                if (action === "remove") {
                    removeFromCart(productId, size);
                }
            }
        );
    }


    /**
     * Checkout button.
     */
    if (elements.checkoutButton) {
        elements.checkoutButton.addEventListener(
            "click",
            openCheckoutMessage
        );
    }


    /**
     * Close checkout message.
     */
    if (elements.closeCheckoutButton) {
        elements.closeCheckoutButton.addEventListener(
            "click",
            closeCheckoutMessage
        );
    }


    /**
     * Return to the shopping bag from the checkout message.
     */
    if (elements.returnToBagButton) {
        elements.returnToBagButton.addEventListener(
            "click",
            returnToBag
        );
    }


    /**
     * Clicking the dark area around the checkout modal closes it.
     */
    if (elements.checkoutModal) {
        elements.checkoutModal.addEventListener(
            "click",
            function (event) {
                if (event.target === elements.checkoutModal) {
                    closeCheckoutMessage();
                }
            }
        );
    }


    /* ============================================================
       SIZE GUIDE POPUP
       ============================================================ */

    /**
     * Open the size guide.
     */
    function openSizeGuide() {
        if (!elements.sizeGuideModal) {
            return;
        }

        elements.sizeGuideModal.classList.add("open");

        elements.sizeGuideModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

        if (elements.closeSizeGuideButton) {
            elements.closeSizeGuideButton.focus();
        }
    }


    /**
     * Close the size guide.
     */
    function closeSizeGuide() {
        if (!elements.sizeGuideModal) {
            return;
        }

        elements.sizeGuideModal.classList.remove("open");

        elements.sizeGuideModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

        if (elements.openSizeGuideButton) {
            elements.openSizeGuideButton.focus();
        }
    }


    /**
     * Open size guide button.
     */
    if (elements.openSizeGuideButton) {
        elements.openSizeGuideButton.addEventListener(
            "click",
            openSizeGuide
        );
    }


    /**
     * Close size guide button.
     */
    if (elements.closeSizeGuideButton) {
        elements.closeSizeGuideButton.addEventListener(
            "click",
            closeSizeGuide
        );
    }


    /**
     * Clicking outside the size guide closes it.
     */
    if (elements.sizeGuideModal) {
        elements.sizeGuideModal.addEventListener(
            "click",
            function (event) {
                if (event.target === elements.sizeGuideModal) {
                    closeSizeGuide();
                }
            }
        );
    }


    /* ============================================================
       ESCAPE KEY
       ============================================================ */

    /**
     * Escape closes the topmost open panel.
     */
    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        if (
            elements.sizeGuideModal &&
            elements.sizeGuideModal.classList.contains("open")
        ) {
            closeSizeGuide();
            return;
        }

        if (
            elements.checkoutModal &&
            elements.checkoutModal.classList.contains("open")
        ) {
            closeCheckoutMessage();
            return;
        }

        if (
            elements.drawer &&
            elements.drawer.classList.contains("open")
        ) {
            closeCart();
        }
    });


    /* ============================================================
       HERO IMAGE FALLBACK
       ============================================================ */

    /**
     * If the transparent hero image has not been added yet,
     * display a helpful placeholder rather than a broken image.
     */
    if (elements.heroImage) {
        elements.heroImage.addEventListener(
            "error",
            function () {
                elements.heroImage.style.display = "none";

                if (elements.heroFallback) {
                    elements.heroFallback.style.display = "block";
                }
            }
        );
    }


    /* ============================================================
       INITIALISE
       ============================================================ */

    function initialiseShop() {
        renderCart();

        filterProducts();

        /*
         * The bag icon stays hidden when the bag is empty.
         * If an item is already in browser storage,
         * renderCart() makes the icon visible.
         */
    }


    initialiseShop();

})();
