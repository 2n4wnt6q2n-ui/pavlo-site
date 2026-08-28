(function () {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.documentElement.prepend(progress);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  function refresh() {
    document.querySelectorAll(".reveal, .card, .chapter, .spread, .look-hero .copy, .section-label").forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.transform = "scaleX(" + Math.min(1, pct / 100) + ")";
    const header = document.querySelector(".site-header");
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.PavloScroll = { refresh };
  document.addEventListener("DOMContentLoaded", () => {
    refresh();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  });
})();
