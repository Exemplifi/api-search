class SearchInterface {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.dropdown = document.getElementById("search-dropdown");
    this.debounceTimer = null;
    this.selectedIndex = -1;
    this.lastQuery = "";
    this.lastResults = [];

    this.init();
  }

  init() {
    this.searchInput.addEventListener("input", (e) => this.handleInput(e));
    this.searchInput.addEventListener("keydown", (e) => this.handleKeydown(e));
    this.searchInput.addEventListener("focus", () => this.handleFocus());
    this.searchInput.addEventListener("blur", () => this.handleBlur());

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        this.hideDropdown();
      }
    });
  }

  handleFocus() {
    const query = this.searchInput.value.trim();

    if (query.length === 0) {
      this.showQueryMessage();
    } else if (this.lastResults.length > 0) {
      // Restore previous results
      this.displayResults(this.lastResults, this.lastQuery);
    } else if (query.length >= 1) {
      // Re-search if we have a query but no results
      this.performSearch(query);
    } else {
      this.showQueryMessage();
    }
  }

  handleBlur() {
    // Delay hiding to allow for clicks on results
    setTimeout(() => {
      this.hideDropdown();
    }, 200);
  }

  showQueryMessage() {
    this.dropdown.innerHTML =
      '<div class="query-message">What is your query?</div>';
    this.showDropdown();
  }

  handleInput(e) {
    const query = e.target.value.trim();

    // Clear previous timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Show query message if input is empty
    if (query.length === 0) {
      this.lastQuery = "";
      this.lastResults = [];
      this.showQueryMessage();
      return;
    }

    // Hide dropdown if query is empty
    if (query.length < 1) {
      this.lastQuery = "";
      this.lastResults = [];
      this.hideDropdown();
      return;
    }

    // Debounce API call
    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  }

  async performSearch(query) {
    this.showLoading();

    try {
      // Make actual HTTP call to temp.json
      const results = await this.fetchSearchResults(query);
      this.lastQuery = query;
      this.lastResults = results;
      this.displayResults(results, query);
    } catch (error) {
      console.error("Search error:", error);
      this.lastQuery = "";
      this.lastResults = [];
      this.showNoResults(query);
    }
  }

  async fetchSearchResults(query) {
    try {
      const response = await fetch("temp.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.best_matches) {
        throw new Error("Invalid data format");
      }

      // Filter results based on query (case-insensitive)
      const filteredResults = data.best_matches.filter(
        (result) =>
          result.phrase.toLowerCase().includes(query.toLowerCase()) ||
          result.subtext.toLowerCase().includes(query.toLowerCase())
      );

      return filteredResults;
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      throw error;
    }
  }

  showLoading() {
    this.dropdown.innerHTML = '<div class="loading">Searching...</div>';
    this.showDropdown();
  }

  showNoResults(query) {
    this.dropdown.innerHTML = `<div class="no-results">No matches found for your query</div>`;
    this.showDropdown();
  }

  displayResults(results, query) {
    if (results.length === 0) {
      this.showNoResults(query);
      return;
    }

    this.dropdown.innerHTML = results
      .map(
        (result, index) => `
            <div class="search-result" data-index="${index}" data-url="${result.url}">
                <div class="result-phrase">${result.phrase}</div>
                <div class="result-subtext">${result.subtext}</div>
                <div class="result-url">${result.url}</div>
            </div>
        `
      )
      .join("");

    this.showDropdown();
    this.attachResultListeners();
  }

  attachResultListeners() {
    const results = this.dropdown.querySelectorAll(".search-result");
    results.forEach((result) => {
      result.addEventListener("click", () => {
        const url = result.dataset.url;
        window.open(url, "_blank");
        this.hideDropdown();
      });

      result.addEventListener("mouseenter", () => {
        this.clearSelection();
        result.classList.add("selected");
        this.selectedIndex = parseInt(result.dataset.index);
      });
    });
  }

  handleKeydown(e) {
    const results = this.dropdown.querySelectorAll(".search-result");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          results.length - 1
        );
        this.updateSelection(results);
        break;

      case "ArrowUp":
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection(results);
        break;

      case "Enter":
        e.preventDefault();
        if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
          const url = results[this.selectedIndex].dataset.url;
          window.open(url, "_blank");
          this.hideDropdown();
        }
        break;

      case "Escape":
        this.hideDropdown();
        this.searchInput.blur();
        break;
    }
  }

  updateSelection(results) {
    this.clearSelection();
    if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
      results[this.selectedIndex].classList.add("selected");
    }
  }

  clearSelection() {
    this.dropdown.querySelectorAll(".search-result").forEach((result) => {
      result.classList.remove("selected");
    });
  }

  showDropdown() {
    this.dropdown.classList.add("show");
  }

  hideDropdown() {
    this.dropdown.classList.remove("show");
    this.selectedIndex = -1;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SearchInterface();
});
