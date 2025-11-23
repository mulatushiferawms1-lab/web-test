// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add smooth scrolling to all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Application Form Handling
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        reason: document.getElementById('reason').value,
        resume: document.getElementById('resume').files[0]?.name || null,
        submissionDate: new Date().toISOString(),
        status: getRandomStatus()
    };
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.age || !formData.reason) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Save to localStorage
    saveApplication(formData);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    this.reset();
});

// Generate random status for application
function getRandomStatus() {
    const statuses = ['accepted', 'rejected', 'pending'];
    const weights = [0.3, 0.2, 0.5]; // 30% accepted, 20% rejected, 50% pending
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < statuses.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
            return statuses[i];
        }
    }
    
    return 'pending'; // fallback
}

// Save application to localStorage
function saveApplication(applicationData) {
    let applications = JSON.parse(localStorage.getItem('kiroApplications')) || [];
    
    // Check if email already exists and update, otherwise add new
    const existingIndex = applications.findIndex(app => app.email === applicationData.email);
    
    if (existingIndex !== -1) {
        applications[existingIndex] = applicationData;
    } else {
        applications.push(applicationData);
    }
    
    localStorage.setItem('kiroApplications', JSON.stringify(applications));
}

// Get application by email
function getApplicationByEmail(email) {
    const applications = JSON.parse(localStorage.getItem('kiroApplications')) || [];
    return applications.find(app => app.email.toLowerCase() === email.toLowerCase());
}

// Status Check Modal Functions
function showStatusCheck() {
    document.getElementById('statusModal').style.display = 'block';
    document.getElementById('statusResult').innerHTML = '';
    document.getElementById('statusEmail').value = '';
}

function closeStatusModal() {
    document.getElementById('statusModal').style.display = 'none';
}

function checkStatus() {
    const email = document.getElementById('statusEmail').value.trim();
    const statusResult = document.getElementById('statusResult');
    
    if (!email) {
        statusResult.innerHTML = '<div class="status-result" style="background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;">Please enter your email address.</div>';
        return;
    }
    
    const application = getApplicationByEmail(email);
    
    if (!application) {
        statusResult.innerHTML = '<div class="status-result" style="background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;">No application found for this email address.</div>';
        return;
    }
    
    let statusClass = '';
    let statusIcon = '';
    let statusText = '';
    
    switch (application.status) {
        case 'accepted':
            statusClass = 'status-accepted';
            statusIcon = '✔';
            statusText = 'Congratulations! Your application has been accepted.';
            break;
        case 'rejected':
            statusClass = 'status-rejected';
            statusIcon = '❌';
            statusText = 'We appreciate your interest, but your application was not selected at this time.';
            break;
        case 'pending':
            statusClass = 'status-pending';
            statusIcon = '⏳';
            statusText = 'Your application is currently under review. Please check back later.';
            break;
    }
    
    const submissionDate = new Date(application.submissionDate).toLocaleDateString();
    
    statusResult.innerHTML = `
        <div class="status-result ${statusClass}">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${statusIcon}</div>
            <div style="font-size: 1.2rem; margin-bottom: 1rem; text-transform: capitalize;">${application.status}</div>
            <div style="margin-bottom: 1rem;">${statusText}</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Application submitted: ${submissionDate}</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Applicant: ${application.fullName}</div>
        </div>
    `;
}

// Success Modal Functions
function showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const statusModal = document.getElementById('statusModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === statusModal) {
        closeStatusModal();
    }
    
    if (event.target === successModal) {
        closeSuccessModal();
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .stat, .about-text');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form validation enhancements
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#e74c3c';
        this.setCustomValidity('Please enter a valid email address');
    } else {
        this.style.borderColor = '#e9ecef';
        this.setCustomValidity('');
    }
});

document.getElementById('age').addEventListener('input', function() {
    const age = parseInt(this.value);
    
    if (age && (age < 18 || age > 100)) {
        this.style.borderColor = '#e74c3c';
        this.setCustomValidity('Age must be between 18 and 100');
    } else {
        this.style.borderColor = '#e9ecef';
        this.setCustomValidity('');
    }
});

// File upload handling
document.getElementById('resume').addEventListener('change', function() {
    const file = this.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file && file.size > maxSize) {
        alert('File size must be less than 5MB');
        this.value = '';
        return;
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file && !allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        this.value = '';
        return;
    }
});

// Keyboard navigation for modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeStatusModal();
        closeSuccessModal();
    }
});

// Add loading state to form submission
const originalSubmitText = 'Submit Application';
document.getElementById('applicationForm').addEventListener('submit', function() {
    const submitButton = this.querySelector('.submit-button');
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        submitButton.textContent = originalSubmitText;
        submitButton.disabled = false;
    }, 1000);
});