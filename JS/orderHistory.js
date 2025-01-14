function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatItems(items) {
    return items.map(item => `${item.name} (${item.quantity})`).join(', ');
}

function loadOrders(filters = {}) {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const tableBody = document.getElementById('orderTableBody');
    
    let filteredOrders = orders.filter(order => {
        let matchesSearch = true;
        let matchesDate = true;

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            matchesSearch = 
                order.orderId.toLowerCase().includes(searchTerm) ||
                order.customerName.toLowerCase().includes(searchTerm) ||
                order.customerPhone.toLowerCase().includes(searchTerm);
        
        }

        if (filters.date) {
            const orderDate = new Date(order.date).toLocaleDateString();
            const filterDate = new Date(filters.date).toLocaleDateString();
            matchesDate = orderDate === filterDate;
        }

        return matchesSearch && matchesDate;
    });

    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    tableBody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>${order.orderId}</td>
            <td>${formatDateTime(order.date)}</td>
            <td>${order.customerName}</td>
            <td>${order.customerPhone}</td>
            <td>${formatItems(order.items)}</td>
            <td>LKR ${order.total.toFixed(2)}</td>
        </tr>
    `).join('');

    if (filteredOrders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No orders found</td>
            </tr>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadOrders();

    const searchInput = document.getElementById('orderSearch');
    searchInput.addEventListener('input', function() {
        loadOrders({
            search: this.value,
            date: document.getElementById('dateFilter').value
        });
    });

    
    const dateFilter = document.getElementById('dateFilter');
    dateFilter.addEventListener('change', function() {
        loadOrders({
            search: document.getElementById('orderSearch').value,
            date: this.value
        });
    });
});