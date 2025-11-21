const scroller = scrollama();

// ========== PARALLAX HERO ==========
const hero = document.getElementById('hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    if (scrolled < heroHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.querySelector('.hero-content').style.opacity = 1 - (scrolled / heroHeight);
    }
});

// ========== FLOATING STATS ==========
const floatingStats = document.getElementById('floatingStats');
let statsAnimated = false;

function checkFloatingStats() {
    const scrollPos = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    if (scrollPos > heroHeight + 200) {
        floatingStats.classList.add('visible');
        
        if (!statsAnimated) {
            animateFloatingStats();
            statsAnimated = true;
        }
    } else {
        floatingStats.classList.remove('visible');
    }
}

function animateFloatingStats() {
    const statNums = floatingStats.querySelectorAll('.stat-num');
    
    statNums.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, 0, target, 1500);
    });
}

window.addEventListener('scroll', checkFloatingStats);

// ========== COUNTER ANIMATION ==========
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ========== SCROLLAMA SETUP ==========
scroller
    .setup({
        step: '.scroll-section',
        offset: 0.6,
        debug: false
    })
    .onStepEnter(response => {
        response.element.classList.add('active');
    })
    .onStepExit(response => {
        if (response.direction === 'up') {
            response.element.classList.remove('active');
        }
    });

// ========== BACK TO TOP BUTTON ==========
const backToTop = document.getElementById('backToTop');

function checkBackToTop() {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', checkBackToTop);

// ========== RESIZE HANDLER ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        scroller.resize();
    }, 250);
});