if (!localStorage.getItem('customers')) {
    localStorage.setItem('customers', JSON.stringify([]));
}

function loadCustomers(searchTerm = '') {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const tableBody = document.getElementById('customerTableBody');
    
    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    tableBody.innerHTML = filteredCustomers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${formatDate(customer.dob)}</td>
            <td>${customer.address}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editCustomer('${customer.phone}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer.phone}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    if (filteredCustomers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No customers found</td>
            </tr>
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function addCustomer() {
    const form = document.getElementById('addCustomerForm');
    if (form.checkValidity()) {
        const customerData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            dob: document.getElementById('customerDOB').value,
            address: document.getElementById('customerAddress').value
        };

        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        if (customers.some(customer => customer.phone === customerData.phone)) {
            alert('A customer with this phone number already exists!');
            return;
        }

        customers.push(customerData);
        localStorage.setItem('customers', JSON.stringify(customers));

        form.reset();
        bootstrap.Modal.getInstance(document.getElementById('addCustomerModal')).hide();
        
        loadCustomers();
        alert('Customer added successfully!');
    } else {
        alert('Please fill in all required fields correctly.');
    }
}

function editCustomer(phone) {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customer = customers.find(c => c.phone === phone);
    
    if (customer) {
        const modalHTML = `
            <div class="modal fade" id="editCustomerModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Customer</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editCustomerForm">
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input type="text" class="form-control" id="editName" value="${customer.name}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone Number</label>
                                    <input type="tel" class="form-control" id="editPhone" value="${customer.phone}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="editEmail" value="${customer.email}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Date of Birth</label>
                                    <input type="date" class="form-control" id="editDOB" value="${customer.dob}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Address</label>
                                    <textarea class="form-control" id="editAddress" rows="3" required>${customer.address}</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="updateCustomer('${phone}')">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('editCustomerModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
        modal.show();
    }
}

function updateCustomer(phone) {
    const form = document.getElementById('editCustomerForm');
    if (form.checkValidity()) {
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        const index = customers.findIndex(c => c.phone === phone);
        
        if (index !== -1) {
            customers[index] = {
                name: document.getElementById('editName').value,
                phone: document.getElementById('editPhone').value,
                email: document.getElementById('editEmail').value,
                dob: document.getElementById('editDOB').value,
                address: document.getElementById('editAddress').value
            };

            localStorage.setItem('customers', JSON.stringify(customers));
            
            bootstrap.Modal.getInstance(document.getElementById('editCustomerModal')).hide();
            loadCustomers();
            alert('Customer updated successfully!');
        }
    } else {
        alert('Please fill in all required fields correctly.');
    }
}

function deleteCustomer(phone) {
    if (confirm('Are you sure you want to delete this customer?')) {
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
        customers = customers.filter(c => c.phone !== phone);
        localStorage.setItem('customers', JSON.stringify(customers));
        loadCustomers();
        alert('Customer deleted successfully!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCustomers();

    const searchInput = document.getElementById('customerSearch');
    searchInput.addEventListener('input', function() {
        loadCustomers(this.value);
    });
});