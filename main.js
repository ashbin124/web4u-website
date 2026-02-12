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
        var toggleBtn = document.querySelector(".theme-toggle");
        if (toggleBtn) {
            toggleBtn.textContent = theme === "dark" ? "Light" : "Dark";
            toggleBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
        }
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

    if (navLinks) {
        var toggle = navLinks.querySelector(".theme-toggle");
        if (!toggle) {
            toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "theme-toggle";
            toggle.textContent = "Dark";
            toggle.setAttribute("aria-label", "Toggle dark mode");
            navLinks.appendChild(toggle);
        }

        if (toggle.dataset.toggleBound !== "true") {
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
        }
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
