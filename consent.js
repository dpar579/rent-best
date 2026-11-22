// 쿠키 동의 배너 + Google Consent Mode v2
// - 방문자가 선택하기 전에는 광고/분석 저장을 모두 "denied"로 둔다.
// - 선택값은 localStorage("cookieConsent")에 저장하고, 언어는 메인 사이트와 같은 "selectedLang"을 따른다.
// - 구글 승인(인증) CMP가 아니다. EEA/영국 방문자 대상 AdSense 광고는 AdSense의
//   "개인 정보 보호 및 메시지(Privacy & messaging)" GDPR 메시지를 함께 켜는 것을 권장한다.
(function () {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    var KEY = "cookieConsent";

    function readConsent() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function writeConsent(value) {
        try { localStorage.setItem(KEY, value); } catch (e) { }
    }

    function applyConsent(value) {
        gtag("consent", "update", {
            ad_storage: value,
            analytics_storage: value,
            ad_user_data: value,
            ad_personalization: value
        });
    }

    gtag("consent", "default", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500
    });

    var saved = readConsent();
    if (saved === "granted" || saved === "denied") applyConsent(saved);

    var TEXT = {
        ko: {
            msg: "RentBest는 사이트 분석과 광고를 위해 쿠키를 사용합니다. 동의하시면 맞춤 광고와 분석 쿠키를 사용합니다.",
            accept: "동의",
            reject: "거부",
            more: "자세히 보기"
        },
        en: {
            msg: "RentBest uses cookies for analytics and advertising. If you accept, we may use cookies for personalized ads and analytics.",
            accept: "Accept",
            reject: "Decline",
            more: "Learn more"
        },
        zh: {
            msg: "RentBest 使用 Cookie 进行分析和广告投放。若您同意,我们可能会使用 Cookie 展示个性化广告并进行分析。",
            accept: "同意",
            reject: "拒绝",
            more: "了解更多"
        }
    };

    function currentLang() {
        var l = "en";
        try { l = localStorage.getItem("selectedLang") || "en"; } catch (e) { }
        return TEXT[l] ? l : "en";
    }

    function injectStyle() {
        if (document.getElementById("cookie-banner-style")) return;
        var st = document.createElement("style");
        st.id = "cookie-banner-style";
        st.textContent =
            "#cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:720px;margin:0 auto;" +
            "background:#ffffff;color:#1e2a27;border:1px solid #d5dcd9;border-radius:14px;padding:14px 16px;" +
            "box-shadow:0 8px 28px rgba(0,0,0,.18);display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;" +
            "font-family:'Noto Sans KR',Arial,sans-serif;font-size:13px;line-height:1.5}" +
            "#cookie-banner p{margin:0;flex:1 1 260px}" +
            "#cookie-banner a{color:inherit;text-decoration:underline}" +
            "#cookie-banner .cb-btns{display:flex;gap:8px}" +
            "#cookie-banner button{width:auto;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;cursor:pointer;border:1px solid #bfc9c5}" +
            "#cookie-banner .cb-accept{background:var(--accent,#2f8f6b);border-color:var(--accent,#2f8f6b);color:#fff}" +
            "#cookie-banner .cb-reject{background:#f1f4f2;color:#1e2a27}";
        document.head.appendChild(st);
    }

    function renderBanner() {
        var t = TEXT[currentLang()];
        var el = document.getElementById("cookie-banner");
        if (!el) return;
        el.innerHTML =
            "<p>" + t.msg + ' <a href="privacy.html">' + t.more + "</a></p>" +
            '<div class="cb-btns">' +
            '<button type="button" class="cb-reject">' + t.reject + "</button>" +
            '<button type="button" class="cb-accept">' + t.accept + "</button>" +
            "</div>";
        el.querySelector(".cb-accept").onclick = function () { choose("granted"); };
        el.querySelector(".cb-reject").onclick = function () { choose("denied"); };
    }

    function choose(value) {
        writeConsent(value);
        applyConsent(value);
        var el = document.getElementById("cookie-banner");
        if (el) el.parentNode.removeChild(el);
    }

    function showBanner() {
        injectStyle();
        if (!document.getElementById("cookie-banner")) {
            var el = document.createElement("div");
            el.id = "cookie-banner";
            el.setAttribute("role", "dialog");
            el.setAttribute("aria-label", "Cookie consent");
            document.body.appendChild(el);
        }
        renderBanner();
    }

    // 푸터의 "쿠키 설정" 링크에서 다시 열 수 있다.
    window.openCookieSettings = showBanner;
    // 언어를 바꾸면 열려 있는 배너의 문구도 바꾼다.
    window.refreshCookieBannerLang = renderBanner;

    function init() {
        if (readConsent() !== "granted" && readConsent() !== "denied") showBanner();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
