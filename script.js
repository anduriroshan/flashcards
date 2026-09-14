/**
 * GCP Professional Machine Learning Engineer Flashcards
 * Clean 3D Flip Card Interactive Controller
 */

(function () {
  "use strict";

  if (typeof CARDS_DATA === "undefined" || !Array.isArray(CARDS_DATA) || CARDS_DATA.length === 0) {
    console.error("CARDS_DATA is missing or empty.");
    return;
  }

  // Storage keys
  const STORAGE_KEY_MASTERED = "gcpmle_mastered_cards_v2";
  const STORAGE_KEY_THEME = "gcpmle_theme_v2";

  // State
  const allCards = [...CARDS_DATA];
  let currentDeck = [...allCards];
  let currentIndex = 0;
  let isFlipped = false;

  let masteredIds = new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MASTERED);
    if (saved) masteredIds = new Set(JSON.parse(saved));
  } catch (e) {}

  // DOM Elements
  const htmlEl = document.documentElement;
  const progressFill = document.getElementById("progressFill");
  const categoryFilter = document.getElementById("categoryFilter");

  const flashcardEl = document.getElementById("flashcard");
  const frontCategory = document.getElementById("frontCategory");
  const frontIndex = document.getElementById("frontIndex");
  const frontScenario = document.getElementById("frontScenario");
  const frontPrompt = document.getElementById("frontPrompt");

  const backCategory = document.getElementById("backCategory");
  const backSolution = document.getElementById("backSolution");
  const whyCorrectContainer = document.getElementById("whyCorrectContainer");
  const whyCorrectList = document.getElementById("whyCorrectList");
  const distractorsContainer = document.getElementById("distractorsContainer");
  const distractorsList = document.getElementById("distractorsList");

  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const counterLabel = document.getElementById("counterLabel");
  const btnCounterJump = document.getElementById("btnCounterJump");
  const btnMasterToggle = document.getElementById("btnMasterToggle");
  const masterStatusText = document.getElementById("masterStatusText");

  const btnOpenGrid = document.getElementById("btnOpenGrid");
  const gridModal = document.getElementById("gridModal");
  const btnCloseGrid = document.getElementById("btnCloseGrid");
  const gridCellsContainer = document.getElementById("gridCellsContainer");

  const btnOpenSearch = document.getElementById("btnOpenSearch");
  const searchModal = document.getElementById("searchModal");
  const btnCloseSearch = document.getElementById("btnCloseSearch");
  const modalSearchInput = document.getElementById("modalSearchInput");
  const searchResultsList = document.getElementById("searchResultsList");

  const btnShuffle = document.getElementById("btnShuffle");
  const btnThemeToggle = document.getElementById("btnThemeToggle");
  const themeIconSun = document.getElementById("themeIconSun");
  const themeIconMoon = document.getElementById("themeIconMoon");

  // --------------------------------------------------------------------------
  // Theme Management
  // --------------------------------------------------------------------------
  function initTheme() {
    let theme = "light";
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === "dark" || saved === "light") {
        theme = saved;
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      }
    } catch (e) {}
    applyTheme(theme);
  }

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    if (theme === "dark") {
      themeIconSun.style.display = "none";
      themeIconMoon.style.display = "block";
    } else {
      themeIconSun.style.display = "block";
      themeIconMoon.style.display = "none";
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {}
  }

  function toggleTheme() {
    const current = htmlEl.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  // --------------------------------------------------------------------------
  // Category Filter Setup
  // --------------------------------------------------------------------------
  function initCategories() {
    const cats = new Set();
    allCards.forEach(c => {
      if (c.category) cats.add(c.category);
    });

    Array.from(cats).sort().forEach(cat => {
      const count = allCards.filter(c => c.category === cat).length;
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = `${cat} (${count})`;
      categoryFilter.appendChild(opt);
    });

    categoryFilter.addEventListener("change", () => {
      const selected = categoryFilter.value;
      if (selected === "all") {
        currentDeck = [...allCards];
      } else {
        currentDeck = allCards.filter(c => c.category === selected);
      }
      currentIndex = 0;
      setFlipped(false);
      renderCard();
    });
  }

  // --------------------------------------------------------------------------
  // Flashcard Flip
  // --------------------------------------------------------------------------
  function setFlipped(flipped) {
    isFlipped = flipped;
    if (isFlipped) {
      flashcardEl.classList.add("is-flipped");
      flashcardEl.setAttribute("aria-expanded", "true");
    } else {
      flashcardEl.classList.remove("is-flipped");
      flashcardEl.setAttribute("aria-expanded", "false");
    }
  }

  function toggleFlip() {
    setFlipped(!isFlipped);
  }

  // --------------------------------------------------------------------------
  // Render Current Card
  // --------------------------------------------------------------------------
  function getCurrentCard() {
    if (currentDeck.length === 0) return null;
    return currentDeck[currentIndex];
  }

  function getCategorySlug(category) {
    const cat = (category || "").toLowerCase();
    if (cat.includes("drift") || cat.includes("monitoring")) return "drift";
    if (cat.includes("genai") || cat.includes("llm")) return "genai";
    if (cat.includes("mlops") || cat.includes("ci/cd") || cat.includes("pipeline")) return "mlops";
    if (cat.includes("data") || cat.includes("feature")) return "data";
    if (cat.includes("infra") || cat.includes("serving") || cat.includes("distributed")) return "infra";
    return "ml";
  }

  function renderCard() {
    const card = getCurrentCard();
    if (!card) return;

    // Apply Domain Category Theme
    const catSlug = getCategorySlug(card.category);
    flashcardEl.setAttribute("data-category", catSlug);

    // Front Face
    frontCategory.textContent = card.category;
    frontIndex.textContent = `${card.id} / ${allCards.length}`;
    frontScenario.textContent = card.scenario;
    frontPrompt.textContent = card.prompt || "What should you do?";

    // Back Face
    backCategory.textContent = card.category;
    backSolution.textContent = card.correct_answer;

    // Why Correct Bullet Points
    whyCorrectList.innerHTML = "";
    if (card.why_correct && card.why_correct.length > 0) {
      whyCorrectContainer.style.display = "block";
      card.why_correct.forEach(pt => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${escapeHTML(pt.title)}:</strong> ${escapeHTML(pt.content)}`;
        whyCorrectList.appendChild(li);
      });
    } else {
      whyCorrectContainer.style.display = "none";
    }

    // Distractor Bullet Points
    distractorsList.innerHTML = "";
    if (card.why_distractors && card.why_distractors.length > 0) {
      distractorsContainer.style.display = "block";
      card.why_distractors.forEach(pt => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${escapeHTML(pt.title)}:</strong> ${escapeHTML(pt.content)}`;
        distractorsList.appendChild(li);
      });
    } else {
      distractorsContainer.style.display = "none";
    }

    // Bottom Navigation Bar
    counterLabel.textContent = `Card ${currentIndex + 1} / ${currentDeck.length}`;
    btnPrev.disabled = (currentIndex === 0);
    btnNext.disabled = (currentIndex === currentDeck.length - 1);

    // Mastered status
    const isMastered = masteredIds.has(card.id);
    if (isMastered) {
      btnMasterToggle.classList.add("is-mastered");
      masterStatusText.textContent = "Mastered";
    } else {
      btnMasterToggle.classList.remove("is-mastered");
      masterStatusText.textContent = "Master";
    }

    // Progress line
    const progressPercent = Math.round(((currentIndex + 1) / currentDeck.length) * 100);
    progressFill.style.width = `${progressPercent}%`;

    // Ensure scroll is at top of card back
    const backFace = flashcardEl.querySelector(".card-back");
    if (backFace) backFace.scrollTop = 0;
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------
  function prevCard() {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => {
        currentIndex--;
        renderCard();
      }, isFlipped ? 150 : 0);
    }
  }

  function nextCard() {
    if (currentIndex < currentDeck.length - 1) {
      setFlipped(false);
      setTimeout(() => {
        currentIndex++;
        renderCard();
      }, isFlipped ? 150 : 0);
    }
  }

  function shuffleDeck() {
    for (let i = currentDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
    }
    currentIndex = 0;
    setFlipped(false);
    renderCard();
  }

  function toggleMastered() {
    const card = getCurrentCard();
    if (!card) return;

    if (masteredIds.has(card.id)) {
      masteredIds.delete(card.id);
    } else {
      masteredIds.add(card.id);
    }

    try {
      localStorage.setItem(STORAGE_KEY_MASTERED, JSON.stringify(Array.from(masteredIds)));
    } catch (e) {}

    renderCard();
  }

  // --------------------------------------------------------------------------
  // Modals (Grid & Search)
  // --------------------------------------------------------------------------
  function openGridModal() {
    gridCellsContainer.innerHTML = "";
    const card = getCurrentCard();
    const currentId = card ? card.id : -1;

    allCards.forEach(c => {
      const cell = document.createElement("button");
      cell.className = "grid-cell";
      cell.textContent = c.id;
      cell.title = `Question ${c.id}: ${c.category}`;

      if (c.id === currentId) cell.classList.add("is-active");
      if (masteredIds.has(c.id)) cell.classList.add("is-mastered");

      cell.addEventListener("click", () => {
        jumpToCard(c.id);
        closeGridModal();
      });

      gridCellsContainer.appendChild(cell);
    });

    gridModal.classList.add("is-open");
    gridModal.setAttribute("aria-hidden", "false");
  }

  function closeGridModal() {
    gridModal.classList.remove("is-open");
    gridModal.setAttribute("aria-hidden", "true");
  }

  function openSearchModal() {
    modalSearchInput.value = "";
    renderSearchResults("");
    searchModal.classList.add("is-open");
    searchModal.setAttribute("aria-hidden", "false");
    setTimeout(() => modalSearchInput.focus(), 50);
  }

  function closeSearchModal() {
    searchModal.classList.remove("is-open");
    searchModal.setAttribute("aria-hidden", "true");
  }

  function renderSearchResults(query) {
    searchResultsList.innerHTML = "";
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResultsList.innerHTML = '<div style="color:var(--text-faint); font-size:13px; text-align:center; padding:16px;">Type a keyword to search across questions and answers.</div>';
      return;
    }

    const matches = allCards.filter(c => {
      return (
        c.scenario.toLowerCase().includes(q) ||
        (c.prompt || "").toLowerCase().includes(q) ||
        c.correct_answer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.why_correct || []).some(pt => pt.title.toLowerCase().includes(q) || pt.content.toLowerCase().includes(q))
      );
    });

    if (matches.length === 0) {
      searchResultsList.innerHTML = '<div style="color:var(--text-muted); font-size:13px; text-align:center; padding:16px;">No matching flashcards found.</div>';
      return;
    }

    matches.slice(0, 15).forEach(m => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.innerHTML = `
        <div class="result-item-title">Question ${m.id} &bull; ${escapeHTML(m.category)}</div>
        <div class="result-item-snippet">${escapeHTML(m.scenario.substring(0, 110))}...</div>
      `;
      item.addEventListener("click", () => {
        jumpToCard(m.id);
        closeSearchModal();
      });
      searchResultsList.appendChild(item);
    });
  }

  function jumpToCard(cardId) {
    // If filtered category doesn't contain this card, reset category
    let idx = currentDeck.findIndex(c => c.id === cardId);
    if (idx === -1) {
      categoryFilter.value = "all";
      currentDeck = [...allCards];
      idx = currentDeck.findIndex(c => c.id === cardId);
    }

    if (idx !== -1) {
      currentIndex = idx;
      setFlipped(false);
      renderCard();
    }
  }

  // --------------------------------------------------------------------------
  // Keyboard Shortcuts
  // --------------------------------------------------------------------------
  function handleKeyDown(e) {
    // If typing in search input
    if (document.activeElement === modalSearchInput) {
      if (e.key === "Escape") closeSearchModal();
      return;
    }

    if (gridModal.classList.contains("is-open")) {
      if (e.key === "Escape") closeGridModal();
      return;
    }

    if (searchModal.classList.contains("is-open")) {
      if (e.key === "Escape") closeSearchModal();
      return;
    }

    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        toggleFlip();
        break;
      case "ArrowLeft":
      case "k":
      case "K":
        e.preventDefault();
        prevCard();
        break;
      case "ArrowRight":
      case "j":
      case "J":
        e.preventDefault();
        nextCard();
        break;
      case "m":
      case "M":
        e.preventDefault();
        toggleMastered();
        break;
      case "g":
      case "G":
        e.preventDefault();
        openGridModal();
        break;
      case "/":
        e.preventDefault();
        openSearchModal();
        break;
    }
  }

  // --------------------------------------------------------------------------
  // Touch Swipe Gesture Support for Mobile
  // --------------------------------------------------------------------------
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isSwiping = false;
  const SWIPE_THRESHOLD = 45;

  flashcardEl.addEventListener("touchstart", (e) => {
    isSwiping = false;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  flashcardEl.addEventListener("touchmove", (e) => {
    const curX = e.changedTouches[0].screenX;
    const curY = e.changedTouches[0].screenY;
    if (Math.abs(curX - touchStartX) > 15 || Math.abs(curY - touchStartY) > 15) {
      isSwiping = true;
    }
  }, { passive: true });

  flashcardEl.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
  }, { passive: true });

  flashcardEl.addEventListener("click", () => {
    if (isSwiping) {
      isSwiping = false;
      return;
    }
    toggleFlip();
  });

  btnPrev.addEventListener("click", prevCard);
  btnNext.addEventListener("click", nextCard);
  btnShuffle.addEventListener("click", shuffleDeck);
  btnMasterToggle.addEventListener("click", toggleMastered);

  btnCounterJump.addEventListener("click", openGridModal);
  btnOpenGrid.addEventListener("click", openGridModal);
  btnCloseGrid.addEventListener("click", closeGridModal);
  gridModal.addEventListener("click", (e) => {
    if (e.target === gridModal) closeGridModal();
  });

  btnOpenSearch.addEventListener("click", openSearchModal);
  btnCloseSearch.addEventListener("click", closeSearchModal);
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) closeSearchModal();
  });
  modalSearchInput.addEventListener("input", (e) => renderSearchResults(e.target.value));

  btnThemeToggle.addEventListener("click", toggleTheme);
  document.addEventListener("keydown", handleKeyDown);

  // Initialize
  initTheme();
  initCategories();
  renderCard();
})();
