if (!localStorage.getItem("customers")) {
  localStorage.setItem("customers", JSON.stringify([]));
}
if (!localStorage.getItem("orderHistory")) {
  localStorage.setItem("orderHistory", JSON.stringify([]));
}
if (!localStorage.getItem("lastOrderId")) {
  localStorage.setItem("lastOrderId", "0000");
}


function generateOrderId() {
  const lastId = parseInt(localStorage.getItem("lastOrderId"));
  const newId = (lastId + 1).toString().padStart(4, "0");
  localStorage.setItem("lastOrderId", newId);
  return `OR#${newId}`;
}


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

let selectedItems = [];
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  document.getElementById("datetime").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

function saveCustomer(customerData) {
  const customers = JSON.parse(localStorage.getItem("customers"));
  customers.push(customerData);
  localStorage.setItem("customers", JSON.stringify(customers));
}

function findCustomerByPhone(phone) {
  const customers = JSON.parse(localStorage.getItem("customers"));
  return customers.find((customer) => customer.phone === phone);
}

function updateQuantity(itemId, change) {
  const item = selectedItems.find((i) => i.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeItem(itemId);
    } else {
      updateOrderSummary();
    }
  }
}

function removeItem(itemId) {
  selectedItems = selectedItems.filter((item) => item.id !== itemId);
  updateOrderSummary();
}

function generateBillPDF() {
  const orderData = {
    orderId: document.getElementById("orderId").textContent,
    customerName: document.getElementById("customerName").value,
    items: selectedItems,
    total: selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    date: new Date().toLocaleString(),
  };

  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
        <html>
            <head>
                <title>Order Bill - ${orderData.orderId}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .item-row { display: flex; justify-content: space-between; margin: 5px 0; }
                    .total { margin-top: 20px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>MOS Burger</h2>
                    <p>Order ID: ${orderData.orderId}</p>
                    <p>Customer: ${orderData.customerName}</p>
                    <p>Date: ${orderData.date}</p>
                </div>
                <div class="items">
                    ${orderData.items
                      .map(
                        (item) => `
                        <div class="item-row">
                            <span>${item.name} x${item.quantity}</span>
                            <span>LKR ${(item.price * item.quantity).toFixed(
                              2
                            )}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="total">
                    <div class="item-row">
                        <span>Total:</span>
                        <span>LKR ${orderData.total.toFixed(2)}</span>
                    </div>
                </div>
            </body>
        </html>
    `);
  printWindow.document.close();
  printWindow.print();
}

function saveOrderToHistory(orderData) {
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory"));
  orderHistory.push(orderData);
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("orderId").textContent = generateOrderId();
  updateDateTime();
  setInterval(updateDateTime, 1000);

  const categoryIcons = document.querySelectorAll(".category-icon");
  categoryIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      categoryIcons.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");

      const category = this.dataset.category;
      const filteredItems =
        category === "all"
          ? menuItems
          : menuItems.filter((item) => item.category === category);

      displayMenuItems(filteredItems);
    });
  });

  function displayMenuItems(items) {
    const container = document.getElementById("menuItems");
    container.innerHTML = items
      .map(
        (item) => `
            <div class="menu-item-card" data-id="${item.id}">
                <img src="${item.image}" alt="${
          item.name
        }" class="menu-item-image">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">LKR ${item.price.toFixed(2)}</div>
            </div>
        `
      )
      .join("");
  }

  displayMenuItems(menuItems);

  document.getElementById("itemSearch").addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = menuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    displayMenuItems(filteredItems);
  });

  function addToOrder(item) {
    const existingItem = selectedItems.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      selectedItems.push({ ...item, quantity: 1 });
    }
    updateOrderSummary();
  }

  function updateOrderSummary() {
    const container = document.getElementById("selectedItems");
    container.innerHTML = selectedItems
      .map(
        (item) => `
            <div class="selected-item">
                <div class="d-flex align-items-center">
                    <div class="item-name me-2">${item.name}</div>
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="updateQuantity(${
                          item.id
                        }, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="updateQuantity(${
                          item.id
                        }, 1)">+</button>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="me-3">LKR ${(
                      item.price * item.quantity
                    ).toFixed(2)}</div>
                    <button class="btn btn-sm btn-outline-danger py-0" onclick="removeItem(${
                      item.id
                    })">×</button>
                </div>
            </div>
        `
      )
      .join("");

    const total = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    document.getElementById("totalAmount").textContent = `LKR ${total.toFixed(
      2
    )}`;
  }

  document.getElementById("menuItems").addEventListener("click", function (e) {
    const card = e.target.closest(".menu-item-card");
    if (card) {
      const itemId = parseInt(card.dataset.id);
      const item = menuItems.find((i) => i.id === itemId);
      if (item) addToOrder(item);
    }
  });

  document
    .getElementById("saveCustomer")
    .addEventListener("click", function () {
      const form = document.getElementById("customerForm");
      if (form.checkValidity()) {
        const customerData = {
          name: form.querySelector('input[type="text"]').value,
          phone: form.querySelector('input[type="tel"]').value,
          email: form.querySelector('input[type="email"]').value,
          dob: form.querySelector('input[type="date"]').value,
          address: form.querySelector("textarea").value,
        };
        saveCustomer(customerData);
        $("#addCustomerModal").modal("hide");
        form.reset();
        alert("Customer saved successfully!");
      } else {
        alert("Please fill in all required fields");
      }
    });

  document
    .getElementById("customerPhone")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const phone = this.value;
        const customer = findCustomerByPhone(phone);
        if (customer) {
          document.getElementById("customerName").value = customer.name;
          document.getElementById("customerEmail").value = customer.email;
        } else {
          alert("Customer not found. Please add new customer.");
        }
      }
    });

  document.querySelector(".btn-primary").addEventListener("click", function () {
    if (selectedItems.length === 0) {
      alert("Please add items to the order");
      return;
    }

    const orderData = {
      orderId: document.getElementById("orderId").textContent,
      customerName: document.getElementById("customerName").value,
      customerPhone: document.getElementById("customerPhone").value,
      items: selectedItems,
      total: selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      date: new Date().toISOString(),
    };

    saveOrderToHistory(orderData);
    generateBillPDF();

    selectedItems = [];
    updateOrderSummary();
    document.getElementById("orderId").textContent = generateOrderId();
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerEmail").value = "";
  });
});
