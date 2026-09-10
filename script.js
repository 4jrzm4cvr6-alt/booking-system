// Initialize bookings from localStorage
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

const bookingForm = document.getElementById('bookingForm');
const bookingsList = document.getElementById('bookingsList');

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Handle form submission
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const booking = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        notes: document.getElementById('notes').value,
        createdAt: new Date().toLocaleString()
    };

    // Add to bookings array
    bookings.push(booking);

    // Save to localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Reset form
    bookingForm.reset();

    // Update display
    displayBookings();

    // Show success message
    showNotification('Booking confirmed! ✓');
});

// Display all bookings
function displayBookings() {
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="empty-message">No bookings yet. Make your first booking!</p>';
        return;
    }

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <h3>${booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}</h3>
            <div class="booking-details">
                <div class="booking-detail">
                    <strong>Name:</strong>
                    <span>${booking.name}</span>
                </div>
                <div class="booking-detail">
                    <strong>Email:</strong>
                    <span>${booking.email}</span>
                </div>
                <div class="booking-detail">
                    <strong>Phone:</strong>
                    <span>${booking.phone}</span>
                </div>
                <div class="booking-detail">
                    <strong>Date & Time:</strong>
                    <span>${new Date(booking.date).toLocaleDateString()} at ${booking.time}</span>
                </div>
                ${booking.notes ? `
                <div class="booking-detail">
                    <strong>Notes:</strong>
                    <span>${booking.notes}</span>
                </div>
                ` : ''}
                <div class="booking-detail">
                    <strong>Booked:</strong>
                    <span>${booking.createdAt}</span>
                </div>
            </div>
            <button class="btn-delete" onclick="deleteBooking(${booking.id})">Cancel Booking</button>
        </div>
    `).join('');
}

// Delete a booking
function deleteBooking(id) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        bookings = bookings.filter(booking => booking.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        displayBookings();
        showNotification('Booking cancelled');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Initial display
displayBookings();