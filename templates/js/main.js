/* ═══════════════════════════════════════════════════════════════════════════
   ║                      ملف JavaScript الرئيسي                               ║
   ║                      Main JavaScript File                                 ║
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   ║                     الانتظار حتى تحميل الصفحة                             ║
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة القائمة المتنقلة
    initMobileMenu();
    
    // تهيئة التمرير السلس للروابط
    initSmoothScroll();
    
    // تهيئة التنبيهات
    initNotifications();
    
    // تهيئة النماذج
    initForms();
});

/* ═══════════════════════════════════════════════════════════════════════════
   ║                     القائمة المتنقلة (Mobile Menu)                       ║
   ═══════════════════════════════════════════════════════════════════════════ */

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        // تبديل القائمة
        navLinks.classList.toggle('active');
        
        // تبديل أيقونة القائمة
        this.classList.toggle('active');
    });
    
    // إغلاق القائمة عند النقر على رابط
    const links = navLinks.querySelectorAll('a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   ║                     التمرير السلس (Smooth Scroll)                        ║
   ═══════════════════════════════════════════════════════════════════════════ */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   ║                        نظام التنبيهات                                    ║
   ═══════════════════════════════════════════════════════════════════════════ */

function initNotifications() {
    // التحقق من وجود عنصر التنبيهات
    const notificationContainer = document.getElementById('notifications');
    
    if (!notificationContainer) return;
    
    // دالة لعرض تنبيه
    window.showNotification = function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.innerHTML = '<span>' + message + '</span><button class="notification-close">&times;</button>';
        
        notificationContainer.appendChild(notification);
        
        // إظهار التنبيه
        setTimeout(function() {
            notification.classList.add('show');
        }, 10);
        
        // زر الإغلاق
        notification.querySelector('.notification-close').addEventListener('click', function() {
            hideNotification(notification);
        });
        
        // إخفاء تلقائي
        if (duration > 0) {
            setTimeout(function() {
                hideNotification(notification);
            }, duration);
        }
    };
    
    // دالة لإخفاء تنبيه
    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ║                        معالجة النماذج                                    ║
   ═══════════════════════════════════════════════════════════════════════════ */

function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // التحقق في الوقت الفعلي
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // إزالة رسالة الخطأ عند الكتابة
                const errorElement = this.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                    this.classList.remove('error');
                }
            });
        });
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   ║                        التحقق من النماذج                                 ║
   ═══════════════════════════════════════════════════════════════════════════ */

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(function(input) {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // التحقق من الحقول المطلوبة
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }
    
    // التحقق من البريد الإلكتروني
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
        }
    }
    
    // التحقق من رقم الهاتف
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-+()]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال رقم هاتف صحيح';
        }
    }
    
    // عرض رسالة الخطأ
    showFieldError(field, errorMessage);
    
    return isValid;
}

function showFieldError(field, message) {
    // إزالة رسالة الخطأ السابقة
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
    
    if (message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (field.type === 'checkbox' || field.type === 'radio') {
            field.parentNode.appendChild(errorElement);
        } else {
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ║                        دوال مساعدة عامة                                   ║
   ═══════════════════════════════════════════════════════════════════════════ */

// دالة للتحقق من العنصر في منطقة العرض
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// دالة للتحقق من نوع الجهاز
function isMobile() {
    return window.innerWidth < 768;
}

// دالة للتحقق من دعم الميزة
function supportsFeature(feature) {
    return feature in document.createElement('input');
}

// دالة لتنسيق التاريخ
function formatDate(date, format = 'dd/mm/yyyy') {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return format.replace('dd', day).replace('mm', month).replace('yyyy', year);
}

// دالة لتأخير التنفيذ
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// دالة لتكرار التنفيذ
function throttle(func, limit) {
    let inThrottle;
    
    return function() {
        const args = arguments;
        const context = this;
        
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ║                        تهيئة التحليلات                                    ║
   ═══════════════════════════════════════════════════════════════════════════ */

// تهيئة Google Analytics (إذا كان موجودًا)
function initAnalytics() {
    // كود التحليلات
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: window.location.pathname
        });
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ║                        نهاية الملف                                        ║
   ═══════════════════════════════════════════════════════════════════════════ */
