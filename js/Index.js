const CATEGORIES = [
    { id: 1, name: "Спорткары", count: 12, image: "https://c.animaapp.com/EBE1cRbq/img/----------8@2x.png" },
    { id: 2, name: "Ретро", count: 8, image: "https://c.animaapp.com/EBE1cRbq/img/----------8@2x.png" },
    { id: 3, name: "Внедорожники", count: 15, image: "https://c.animaapp.com/EBE1cRbq/img/----------8@2x.png" },
    { id: 4, name: "Электро", count: 5, image: "https://c.animaapp.com/EBE1cRbq/img/----------8@2x.png" },
    { id: 5, name: "Кабриолеты", count: 7, image: "https://c.animaapp.com/EBE1cRbq/img/----------8@2x.png" },
    { id: 6, name: "Концепты", count: 4, image: "https://c.animaapp.com/EBE1cRbq/img/----------8@2x.png" }
];

const MATERIALS = [
    {
        id: 1,
        title: "Ford Mustang 2008",
        image: "https://c.animaapp.com/EBE1cRbq/img/foto.png",
        tags: ["Спорткар", "Америка", "V8"],
        description: "Классический американский маслкар с мощным двигателем V8 и агрессивным дизайном.",
        views: 1204,
        likes: 320,
        dislikes: 12,
        type: "Спорткары"
    },
    {
        id: 2,
        title: "BMW E30 M3",
        image: "https://c.animaapp.com/EBE1cRbq/img/foto.png",
        tags: ["Ретро", "Германия", "Легенда"],
        description: "Легендарный спорткар 80-х, символ гоночной истории BMW.",
        views: 980,
        likes: 410,
        dislikes: 5,
        type: "Ретро"
    },
    {
        id: 3,
        title: "Toyota Land Cruiser",
        image: "https://c.animaapp.com/EBE1cRbq/img/foto.png",
        tags: ["Внедорожник", "Япония", "Надёжность"],
        description: "Неубиваемый внедорожник, проверенный десятилетиями эксплуатации.",
        views: 760,
        likes: 250,
        dislikes: 8,
        type: "Внедорожники"
    },
    {
        id: 4,
        title: "Tesla Model S",
        image: "https://c.animaapp.com/EBE1cRbq/img/foto.png",
        tags: ["Электро", "США", "Инновации"],
        description: "Революционный электромобиль, изменивший представление о скорости.",
        views: 1500,
        likes: 520,
        dislikes: 30,
        type: "Электро"
    },
    {
        id: 5,
        title: "Mercedes SL 500",
        image: "https://c.animaapp.com/EBE1cRbq/img/foto.png",
        tags: ["Кабриолет", "Германия", "Люкс"],
        description: "Роскошный кабриолет, сочетающий комфорт и динамику.",
        views: 620,
        likes: 180,
        dislikes: 4,
        type: "Кабриолеты"
    },
    {
        id: 6,
        title: "DeLorean DMC-12",
        image: "https://c.animaapp.com/EBE1cRbq/img/foto.png",
        tags: ["Из кино", "США", "Легенда"],
        description: "Машина времени из «Назад в будущее», культовый автомобиль 80-х.",
        views: 2100,
        likes: 640,
        dislikes: 15,
        type: "Концепты"
    }
];

const state = {
    currentPage: 1,
    totalPages: 3,
    sortBy: "",
    categoryId: null,
    search: ""
};

function initSortMenu() {
    const menu = document.getElementById("sortMenu");
    const text = document.getElementById("sortText");

    menu.querySelectorAll(".sort-option").forEach(option => {
        option.addEventListener("click", () => {
            state.sortBy = option.dataset.sort;

            menu.querySelectorAll(".sort-option").forEach(o => o.classList.remove("active-filter"));
            option.classList.add("active-filter");

            const labels = {
                "": "Сортировка",
                "views": "По просмотрам",
                "likes": "По лайкам",
                "new": "Сначала новые"
            };
            text.textContent = labels[state.sortBy] || "Сортировка";
        });
    });
}

function initCategoryMenu() {
    const menu = document.getElementById("categoryMenu");
    const text = document.getElementById("categoryText");

    menu.innerHTML = "";

    const allOption = document.createElement("div");
    allOption.className = "active-filter";
    allOption.textContent = "- по умолчанию -";
    allOption.dataset.id = "";
    allOption.dataset.name = "Фильтрация";
    menu.appendChild(allOption);

    CATEGORIES.forEach(cat => {
        const div = document.createElement("div");
        div.textContent = cat.name;
        div.dataset.id = cat.id;
        div.dataset.name = cat.name;
        menu.appendChild(div);
    });

    menu.querySelectorAll("div").forEach(option => {
        option.addEventListener("click", () => {
            state.categoryId = option.dataset.id || null;

            menu.querySelectorAll("div").forEach(o => o.classList.remove("active-filter"));
            option.classList.add("active-filter");

            text.textContent = option.dataset.name;
        });
    });
}

function renderCategories() {
    const grid = document.getElementById("categoriesGrid");
    grid.innerHTML = "";

    CATEGORIES.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-card";
        card.innerHTML = `
            <div class="category-type">${cat.name}</div>
            <div class="category-count">статей ${cat.count}</div>
            <img class="category-img" src="${cat.image}" alt="${cat.name}">
        `;
        card.addEventListener("click", () => {
            state.categoryId = cat.id;
            state.currentPage = 1;
            renderCategories();
            renderMaterials();
            renderPagination();
        });
        grid.appendChild(card);
    });
}

function renderMaterials() {
    const grid = document.getElementById("carsGrid");
    grid.innerHTML = "";

    let items = [...MATERIALS];

    if (state.categoryId) {
        const catName = CATEGORIES.find(c => c.id == state.categoryId)?.name;
        items = items.filter(m => m.type === catName);
    }

    if (state.search) {
        const q = state.search.toLowerCase();
        items = items.filter(m =>
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q)
        );
    }

    if (state.sortBy === "views") items.sort((a, b) => b.views - a.views);
    if (state.sortBy === "likes") items.sort((a, b) => b.likes - a.likes);
    if (state.sortBy === "new") items.sort((a, b) => b.id - a.id);

    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">Ничего не найдено</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "car-card";
        card.innerHTML = `
            <div class="car-card-inner">
                <img class="car-card-image" src="${item.image}" alt="${item.title}">
                <div class="car-card-content">
                    <h3 class="car-card-title">${item.title}</h3>
                    <div class="car-card-tags">${item.tags.join(" | ")}</div>
                    <p class="car-card-description">${item.description}</p>
                    <div class="car-card-stats">
                        <div class="car-card-stat">
                            <img class="car-card-icon" src="https://c.animaapp.com/EBE1cRbq/img/----------8@2x.png" alt="views">
                            <span>${item.views}</span>
                        </div>
                        <div class="car-card-stat">
                            <img class="car-card-icon car-card-icon--small" src="https://c.animaapp.com/EBE1cRbq/img/-----8@2x.png" alt="likes">
                            <span>${item.likes}</span>
                        </div>
                        <div class="car-card-stat">
                            <img class="car-card-icon car-card-icon--small" src="https://c.animaapp.com/EBE1cRbq/img/--------8@2x.png" alt="dislikes">
                            <span>${item.dislikes}</span>
                        </div>
                        <div class="car-card-category">${item.type}</div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderPagination() {
    const pag = document.getElementById("pagination");
    pag.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination__arrow";
    prevBtn.disabled = state.currentPage === 1;
    prevBtn.innerHTML = `
        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.91667 16.0417C2.91667 8.79293 8.79293 2.91667 16.0417 2.91667C23.2904 2.91667 29.1667 8.79293 29.1667 16.0417C29.1667 23.2904 23.2904 29.1667 16.0417 29.1667C8.79293 29.1667 2.91667 23.2904 2.91667 16.0417ZM16.0417 0C7.1821 0 0 7.1821 0 16.0417C0 24.9012 7.1821 32.0833 16.0417 32.0833C24.9012 32.0833 32.0833 24.9012 32.0833 16.0417C32.0833 7.1821 24.9012 0 16.0417 0ZM16.4688 10.6355L12.0938 15.0105C11.5243 15.58 11.5243 16.5033 12.0938 17.0729L16.4688 21.4479C17.0383 22.0174 17.9617 22.0174 18.5312 21.4479C19.1007 20.8783 19.1007 19.955 18.5312 19.3855L15.1874 16.0417L18.5312 12.6979C19.1007 12.1283 19.1007 11.205 18.5312 10.6355C17.9617 10.066 17.0383 10.066 16.4688 10.6355Z"/>
        </svg>
    `;
    prevBtn.addEventListener("click", () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderPagination();
        }
    });
    pag.appendChild(prevBtn);

    const numbers = document.createElement("div");
    numbers.className = "pagination__numbers";

    for (let i = 1; i <= state.totalPages; i++) {
        const a = document.createElement("a");
        a.className = "pagination__item" + (i === state.currentPage ? " pagination__item--active" : "");
        a.href = "#";
        a.innerHTML = `
            <span class="pagination__number ${i === state.currentPage ? "pagination__number--active" : ""}">${i}</span>
            <div class="pagination__border ${i === state.currentPage ? "pagination__border--active" : ""}"></div>
        `;
        a.addEventListener("click", (e) => {
            e.preventDefault();
            state.currentPage = i;
            renderPagination();
        });
        numbers.appendChild(a);
    }
    pag.appendChild(numbers);

    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination__arrow";
    nextBtn.disabled = state.currentPage === state.totalPages;
    nextBtn.innerHTML = `
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.18182 17.5C3.18182 9.59229 9.59229 3.18182 17.5 3.18182C25.4077 3.18182 31.8182 9.59229 31.8182 17.5C31.8182 25.4077 25.4077 31.8182 17.5 31.8182C9.59229 31.8182 3.18182 25.4077 3.18182 17.5ZM17.5 0C7.83502 0 0 7.83502 0 17.5C0 27.165 7.83502 35 17.5 35C27.165 35 35 27.165 35 17.5C35 7.83502 27.165 0 17.5 0ZM17.034 11.6023L21.8068 16.3751C22.428 16.9963 22.4281 18.0037 21.8068 18.6249L17.034 23.3977C16.4127 24.019 15.4054 24.019 14.7841 23.3977C14.1629 22.7764 14.1629 21.7691 14.7841 21.1478L18.4319 17.5L14.7841 13.8522C14.1629 13.2309 14.1629 12.2236 14.7841 11.6023C15.4054 10.981 16.4127 10.981 17.034 11.6023Z"/>
        </svg>
    `;
    nextBtn.addEventListener("click", () => {
        if (state.currentPage < state.totalPages) {
            state.currentPage++;
            renderPagination();
        }
    });
    pag.appendChild(nextBtn);
}

function initSearch() {
    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");

    form.addEventListener("submit", () => {
        state.search = input.value.trim();
        state.currentPage = 1;
        renderMaterials();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSortMenu();
    initCategoryMenu();
    initSearch();
    renderCategories();
    renderMaterials();
    renderPagination();
});