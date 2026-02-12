function initWeb4U() {
    function trackEvent(name, params) {
        if (typeof window.gtag === "function") {
            window.gtag("event", name, params || {});
        }
    }

    var root = document.documentElement;
    var storedTheme = null;
    try {
        storedTheme = localStorage.getItem("theme");
    } catch (error) {
        storedTheme = null;
    }
    var preferredTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var activeTheme = storedTheme || preferredTheme;

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        var toggleButtons = document.querySelectorAll(".theme-toggle");
        toggleButtons.forEach(function (toggleBtn) {
            toggleBtn.textContent = theme === "dark" ? "Dark" : "Light";
            toggleBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
        });
    }

    applyTheme(activeTheme);

    function bindLinkTracking(selector, eventName) {
        var links = document.querySelectorAll(selector);
        links.forEach(function (link) {
            if (link.dataset.analyticsBound === "true") return;
            link.dataset.analyticsBound = "true";
            link.addEventListener("click", function () {
                trackEvent(eventName, { link_url: link.href });
            });
        });
    }

    var baseCallLink = document.querySelector('a[href^="tel:"]');
    var baseWhatsAppLink = document.querySelector('a[href*="wa.me/"]');
    var navLinks = document.querySelector(".nav-links");
    var nav = document.querySelector(".nav");

    if (navLinks) {
        if (nav) {
            nav.classList.add("has-mobile-menu");
        }

        if (!navLinks.id) {
            navLinks.id = "site-nav-links";
        }

        var menuToggle = nav ? nav.querySelector(".nav-menu-toggle") : null;
        if (nav && !menuToggle) {
            menuToggle = document.createElement("button");
            menuToggle.type = "button";
            menuToggle.className = "nav-menu-toggle";
            menuToggle.setAttribute("aria-controls", navLinks.id);
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open menu");
            menuToggle.innerHTML = "<span></span><span></span><span></span>";
            nav.insertBefore(menuToggle, navLinks);
        }

        var desktopThemeToggle = navLinks.querySelector(".theme-toggle");
        if (!desktopThemeToggle) {
            desktopThemeToggle = document.createElement("button");
            desktopThemeToggle.type = "button";
            desktopThemeToggle.className = "theme-toggle";
            desktopThemeToggle.textContent = "Dark";
            desktopThemeToggle.setAttribute("aria-label", "Toggle dark mode");
            navLinks.appendChild(desktopThemeToggle);
        }

        var mobileThemeToggle = nav ? nav.querySelector(".theme-toggle-mobile") : null;
        if (nav && !mobileThemeToggle) {
            mobileThemeToggle = document.createElement("button");
            mobileThemeToggle.type = "button";
            mobileThemeToggle.className = "theme-toggle theme-toggle-mobile";
            mobileThemeToggle.textContent = "Dark";
            mobileThemeToggle.setAttribute("aria-label", "Toggle dark mode");
            if (menuToggle) {
                nav.insertBefore(mobileThemeToggle, menuToggle);
            } else {
                nav.insertBefore(mobileThemeToggle, navLinks);
            }
        }

        var isMobileViewport = function () {
            if (window.matchMedia) return window.matchMedia("(max-width: 700px)").matches;
            return window.innerWidth <= 700;
        };

        var setMobileMenuOpen = function (isOpen) {
            navLinks.classList.toggle("is-open", isOpen);
            if (menuToggle) {
                menuToggle.classList.toggle("is-open", isOpen);
                menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
                menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
            }
        };

        if (menuToggle && menuToggle.dataset.menuBound !== "true") {
            menuToggle.dataset.menuBound = "true";
            menuToggle.addEventListener("click", function () {
                setMobileMenuOpen(!navLinks.classList.contains("is-open"));
            });
        }

        if (navLinks.dataset.mobileCloseBound !== "true") {
            navLinks.dataset.mobileCloseBound = "true";
            navLinks.addEventListener("click", function (event) {
                if (!isMobileViewport()) return;
                if (event.target.closest("a")) {
                    setMobileMenuOpen(false);
                }
            });
        }

        if (nav && nav.dataset.mobileOutsideBound !== "true") {
            nav.dataset.mobileOutsideBound = "true";
            document.addEventListener("click", function (event) {
                if (!isMobileViewport()) return;
                if (!navLinks.classList.contains("is-open")) return;
                if (!nav.contains(event.target)) {
                    setMobileMenuOpen(false);
                }
            });
        }

        if (nav && nav.dataset.mobileEscapeBound !== "true") {
            nav.dataset.mobileEscapeBound = "true";
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    setMobileMenuOpen(false);
                }
            });
        }

        if (nav && nav.dataset.mobileResizeBound !== "true") {
            nav.dataset.mobileResizeBound = "true";
            window.addEventListener("resize", function () {
                if (!isMobileViewport()) {
                    setMobileMenuOpen(false);
                }
            });
        }

        var toggles = document.querySelectorAll(".theme-toggle");
        toggles.forEach(function (toggle) {
            if (toggle.dataset.toggleBound === "true") return;
            toggle.dataset.toggleBound = "true";
            toggle.addEventListener("click", function () {
                activeTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
                try {
                    localStorage.setItem("theme", activeTheme);
                } catch (error) {
                    // Ignore storage errors, theme still works for current page view.
                }
                applyTheme(activeTheme);
                trackEvent("theme_toggle", { theme: activeTheme });
            });
        });
    }

    applyTheme(root.getAttribute("data-theme") || activeTheme);

    if (baseCallLink && baseWhatsAppLink && !document.querySelector(".mobile-cta")) {
        var mobileCta = document.createElement("div");
        mobileCta.className = "mobile-cta";
        mobileCta.innerHTML =
            '<a class="mobile-call" href="' + baseCallLink.getAttribute("href") + '">Call Now</a>' +
            '<a class="mobile-wa" href="' + baseWhatsAppLink.getAttribute("href") + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>';
        document.body.appendChild(mobileCta);
    }

    bindLinkTracking('a[href^="tel:"]', "call_click");
    bindLinkTracking('a[href*="wa.me/"]', "whatsapp_click");

    var form = document.querySelector(".contact-form");
    if (!form) return;
    var submitBtn = form.querySelector('button[type="submit"]');
    var note = document.getElementById("form-note");
    var phoneInput = form.querySelector('input[name="phone"]');
    var nextInput = form.querySelector('input[name="_next"]');

    if (submitBtn) {
        if (!submitBtn.dataset.defaultLabel) {
            submitBtn.dataset.defaultLabel = submitBtn.textContent;
        }
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.defaultLabel;
    }

    if (note) {
        note.textContent = "";
        note.style.color = "var(--muted)";
    }

    if (nextInput) {
        var configuredSiteUrl = "";
        var config = window.WEB4U_CONFIG || {};
        if (typeof config.siteUrl === "string" && /^https?:\/\//.test(config.siteUrl) && config.siteUrl !== "https://your-domain.com") {
            configuredSiteUrl = config.siteUrl.replace(/\/+$/, "");
        }
        if (configuredSiteUrl) {
            nextInput.value = configuredSiteUrl + "/thank-you.html";
        } else {
            try {
                nextInput.value = new URL("thank-you.html", window.location.href).toString();
            } catch (error) {
                nextInput.value = "thank-you.html";
            }
        }
    }

    if (form.dataset.formBound === "true") return;
    form.dataset.formBound = "true";

    function setNote(message, isError) {
        if (!note) return;
        note.textContent = message;
        note.style.color = isError ? "#b42318" : "var(--muted)";
    }

    form.addEventListener("submit", function (event) {
        if (phoneInput && phoneInput.value.trim() !== "") {
            var phoneValue = phoneInput.value.trim();
            var validPhone = /^[0-9+\-\s()]{8,20}$/.test(phoneValue);
            if (!validPhone) {
                event.preventDefault();
                setNote("Please enter a valid phone number (digits, +, -, spaces, or parentheses).", true);
                phoneInput.focus();
                return;
            }
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }
        trackEvent("form_submit", { form_name: "project_brief" });
        setNote("Submitting your project brief...", false);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWeb4U);
} else {
    initWeb4U();
}

window.addEventListener("pageshow", function () {
    initWeb4U();
});
