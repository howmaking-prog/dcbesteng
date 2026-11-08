// 공통 헤더, 푸터, 메뉴 동작을 페이지에 넣는다.
(() => {
  const site = window.SITE;
  const page = document.body.dataset.page || "home";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));

  const header = () => {
    const nav = site.menu.map((item) => {
      const active = page === item.key ? " is-active" : "";
      return `<a class="${active.trim()}" href="${item.href}">${item.label}</a>`;
    }).join("");

    const columns = site.menu.map((item) => `
      <div class="mega-col">
        <a class="mega-title" href="${item.href}">${item.label}</a>
        ${item.items.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
      </div>
    `).join("");

    return `
      <header class="site-header" id="siteHeader">
        <div class="header-inner">
          <a class="brand" href="index.html">
            <img src="${esc(site.logo)}" alt="" width="36" height="36" />
            <span>${esc(site.name)}</span>
          </a>
          <nav class="nav" aria-label="주요 메뉴">${nav}</nav>
          <a class="btn btn--ghost header-cta" data-form="test" href="${esc(site.formBase)}">입학 테스트</a>
          <button class="menu-toggle" id="menuToggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="megaMenu">
            <span></span><span></span><span></span>
          </button>
        </div>
        <div class="mega" id="megaMenu">
          <div class="mega-inner">
            <div class="mega-actions">
              <a class="btn btn--primary" data-tel href="tel:${esc(site.phoneTel)}">전화 ${esc(site.phone)}</a>
              <a class="btn btn--ghost" data-form="test" href="${esc(site.formBase)}">입학테스트 신청</a>
            </div>
            <div class="mega-cols">${columns}</div>
          </div>
        </div>
      </header>
    `;
  };

  const footer = () => {
    const columns = site.menu.map((item) => `
      <div>
        <a class="footer-nav-title" href="${item.href}">${item.label}</a>
        ${item.items.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
      </div>
    `).join("");

    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand">
              <b>${esc(site.name)}</b>
              <p>대치동 영어 전문 · 초등부 · 중등부 · 고등부</p>
              <div class="footer-contact">
                <span>${esc(site.address)}</span>
                <a href="tel:${esc(site.phoneTel)}">${esc(site.phone)}</a>
                <span>${esc(site.hours)}</span>
                <span>대표 ${esc(site.owner)} · 학원등록번호 ${esc(site.registrationNo)} · 사업자등록번호 ${esc(site.bizNo)}</span>
              </div>
            </div>
            <nav class="footer-nav" aria-label="하단 메뉴">${columns}</nav>
          </div>
          <div class="footer-bottom">
            <span>© <span id="year"></span> ${esc(site.name)}. All rights reserved.</span>
            <a href="privacy.html">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    `;
  };

  const mount = (id, html) => {
    const node = document.getElementById(id);
    if (node) node.outerHTML = html;
  };

  mount("site-header", header());
  mount("site-footer", footer());

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // 페이지 문구는 js/content.js 한곳에서 덮어쓴다.
  const readPath = (root, path) => path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), root);
  if (window.CONTENT) {
    document.querySelectorAll("[data-c]").forEach((node) => {
      const value = readPath(window.CONTENT, node.dataset.c);
      if (typeof value === "string") node.textContent = value;
    });
  }

  document.querySelectorAll("[data-bind]").forEach((node) => {
    const value = site[node.dataset.bind];
    if (value) node.textContent = value;
  });

  document.querySelectorAll("[data-form]").forEach((node) => {
    node.href = site.formLink(node.dataset.form || "test", node.dataset.formGrade || "");
    node.target = "_blank";
    node.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-tel]").forEach((node) => {
    node.href = `tel:${site.phoneTel}`;
  });

  document.querySelectorAll("[data-map]").forEach((node) => {
    node.innerHTML = `<iframe src="${esc(site.mapEmbed)}" title="대치베스트어학원 위치" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  });

  const headerNode = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const mobileQuery = window.matchMedia("(max-width: 899px)");
  let closeTimer = 0;

  const setMenu = (open) => {
    headerNode.classList.toggle("is-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    }
  };

  const nav = headerNode ? headerNode.querySelector(".nav") : null;
  const mega = headerNode ? headerNode.querySelector(".mega") : null;
  const cancelClose = () => clearTimeout(closeTimer);
  const scheduleClose = () => {
    if (mobileQuery.matches) return;
    closeTimer = setTimeout(() => setMenu(false), 160);
  };
  const openFromMenu = () => {
    if (mobileQuery.matches) return;
    cancelClose();
    setMenu(true);
  };

  // PC에서는 메뉴와 펼친 목록 위에 있을 때만 연다.
  if (nav) {
    nav.addEventListener("mouseenter", openFromMenu);
    nav.addEventListener("mouseleave", scheduleClose);
  }
  if (mega) {
    mega.addEventListener("mouseenter", openFromMenu);
    mega.addEventListener("mouseleave", scheduleClose);
  }
  if (headerNode) {
    headerNode.addEventListener("focusin", (event) => {
      if (event.target.closest(".nav, .mega")) openFromMenu();
    });
    headerNode.addEventListener("focusout", (event) => {
      if (!headerNode.contains(event.relatedTarget)) setMenu(false);
    });
  }

  if (toggle && headerNode) {
    toggle.addEventListener("click", () => {
      setMenu(!headerNode.classList.contains("is-open"));
    });
    headerNode.querySelectorAll(".mega a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const tabs = document.querySelectorAll(".page-tabs a");
  if (tabs.length) {
    const mark = () => {
      const hash = window.location.hash || tabs[0].getAttribute("href");
      tabs.forEach((tab) => {
        tab.classList.toggle("is-active", tab.getAttribute("href") === hash || tab.getAttribute("href").endsWith(hash));
      });
    };
    mark();
    window.addEventListener("hashchange", mark);
  }

  // 홈 화면에 저장한 앱이 온라인이면 최신 파일을 받고, 갱신되면 한 번 다시 연다.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js?v=19").then((registration) => {
      registration.update();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "activated" && navigator.serviceWorker.controller) window.location.reload();
        });
      });
    }).catch(() => {});
  }
})();
