const menuItems = [
  {
    id: 1,
    name: "Classic Beef Burger",
    price: 850,
    category: "burgers",
    image:
      "/IMG/ITEM_IMG/DC_202302_0592-999_McDouble_Alt_1564x1564-1_nutrition-calculator-tile.jpeg",
  },
  {
    id: 2,
    name: "Spicy Chicken Burger",
    price: 750,
    category: "burgers",
    image:
      "IMG/ITEM_IMG/DC_202309_4282_QuarterPounderCheeseDeluxe_Shredded_1564x1564-1_nutrition-calculator-tile.jpeg",
  },
  {
    id: 3,
    name: "Big Burger",
    price: 650,
    category: "burgers",
    image:
      "IMG/ITEM_IMG/DC_202302_0005-999_BigMac_1564x1564-1_nutrition-calculator-tile.jpeg",
  },
  {
    id: 4,
    name: "French Fries",
    price: 350,
    category: "sides",
    image:
      "IMG/ITEM_IMG/DC_202002_6050_SmallFrenchFries_Standing_1564x1564-1_nutrition-calculator-tile.jpeg",
  },
  {
    id: 5,
    name: "Onion Rings",
    price: 400,
    category: "sides",
    image: "/IMG/ITEM_IMG/burrito.jpeg",
  },
  {
    id: 6,
    name: "Chicken Wings",
    price: 650,
    category: "sides",
    image:
      "/IMG/ITEM_IMG/DC_202006_0483_4McNuggets_Stacked_1564x1564-1_nutrition-calculator-tile.jpeg",
  },
  {
    id: 7,
    name: "Cola",
    price: 150,
    category: "drinks",
    image:
      "/IMG/ITEM_IMG/DC_202402_0521_MediumCoke_ContourGlassv1_1564x1564_nutrition-calculator-tile.jpeg",
  },
  {
    id: 8,
    name: "Sprite",
    price: 180,
    category: "drinks",
    image:
      "/IMG/ITEM_IMG/DC_202212_0721_MediumSprite_Glass_1564x1564-1_nutrition-calculator-tile.jpeg",
  },
  {
    id: 9,
    name: "Fanta Orange",
    price: 160,
    category: "drinks",
    image:
      "/IMG/ITEM_IMG/DC_202012_0621_MediumHi-COrange_1564x1564-1_nutrition-calculator-tile.jpeg",
  },
  {
    id: 10,
    name: "Ice Cream",
    price: 250,
    category: "desserts",
    image: "/IMG/ITEM_IMG/VanilaIceCream.jpeg",
  },
  {
    id: 11,
    name: "Chocolate Shake",
    price: 350,
    category: "desserts",
    image:
      "/IMG/ITEM_IMG/DC_201906_7659_MediumIcedMocha_Glass_A1_832x472_nutrition-calculator-tile.jpeg",
  },
  {
    id: 12,
    name: "Strawberry Shake",
    price: 300,
    category: "desserts",
    image: "/IMG/ITEM_IMG/strawberry.jpeg",
  },
];

function renderMenuItems(items) {
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
            <img src="${item.image}" class="menu-img" alt="${item.name}">
            <div class="menu-details">
                <h5>${item.name}</h5>
                <p class="text-muted">${item.category}</p>
                <h6>LKR ${item.price.toFixed(2)}</h6>
            </div>
            <div class="menu-actions">
                <button class="btn btn-info action-btn" onclick="viewItem(${
                  item.id
                })">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning action-btn" onclick="editItem(${
                  item.id
                })">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger action-btn" onclick="deleteItem(${
                  item.id
                })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    menuGrid.appendChild(card);
  });
}

document.getElementById("menuSearch").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
  );
  renderMenuItems(filteredItems);
});

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    const filteredItems =
      category === "all"
        ? menuItems
        : menuItems.filter((item) => item.category === category);
    renderMenuItems(filteredItems);
  });
});

function viewItem(id) {
  const item = menuItems.find((i) => i.id === id);
  document.getElementById("viewImage").src = item.image;
  document.getElementById("viewName").textContent = item.name;
  document.getElementById("viewCategory").textContent = item.category;
  document.getElementById("viewPrice").textContent = `LKR ${item.price.toFixed(
    2
  )}`;
  new bootstrap.Modal(document.getElementById("viewMenuModal")).show();
}

function editItem(id) {
  const item = menuItems.find((i) => i.id === id);
  document.getElementById("editItemId").value = item.id;
  document.getElementById("editName").value = item.name;
  document.getElementById("editPrice").value = item.price;
  document.getElementById("editCategory").value = item.category;
  document.getElementById("editImage").value = item.image;
  new bootstrap.Modal(document.getElementById("editMenuModal")).show();
}

function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    const index = menuItems.findIndex((i) => i.id === id);
    menuItems.splice(index, 1);
    renderMenuItems(menuItems);
  }
}
renderMenuItems(menuItems);
