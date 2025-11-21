// Initialize Scrollama
const scroller = scrollama();

// ========== PROGRESS BAR ==========
const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateProgressBar);

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
        let current = 0;
        const increment = target / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    });
}

window.addEventListener('scroll', checkFloatingStats);

// ========== ANIMATED COUNTER FOR STATS GRID ==========
function animateValue(element, start, end, duration) {
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
        step: '.fade-in-up, .fade-in-scale, .slide-in-left, .slide-in-right',
        offset: 0.7,
        debug: false
    })
    .onStepEnter(response => {
        response.element.classList.add('visible');

        // Animate stat cards when they become visible
        if (response.element.classList.contains('stats-grid')) {
            const statCards = response.element.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                    const statNumber = card.querySelector('.stat-number');
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    animateValue(statNumber, 0, target, 1500);
                }, index * 200);
            });
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

// ========== SMOOTH SCROLL FOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== LAZY LOAD IMAGES ==========
// const images = document.querySelectorAll('img');
// const imageObserver = new IntersectionObserver((entries, observer) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             const img = entry.target;
//             img.style.opacity = '0';
//             img.style.transition = 'opacity 0.6s ease';
//
//             img.addEventListener('load', () => {
//                 img.style.opacity = '1';
//             });
//
//             observer.unobserve(img);
//         }
//     });
// }, {
//     rootMargin: '50px'
// });

// images.forEach(img => imageObserver.observe(img));


// Statistikk Nederland innvandring:
const yearlyData = {
    labels: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    data: [4283, 4773, 5422, 5946, 6270, 6550, 6818, 7086, 7260, 7589, 7729, 7713, 7773, 7859, 8002, 8100, 8336, 8553, 8854]
};

const ctx = document.getElementById('dutchImmigrantsChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: yearlyData.labels,
        datasets: [{
            label: 'Nederlandske innvandrere i Norge (SSB)',
            data: yearlyData.data,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const year = context.label;
                        const value = context.parsed.y;
                        return year + ': ' + value.toLocaleString() + ' personer';
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'År'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Antall personer'
                },
                beginAtZero: true
            }
        }
    }
});



// ========== RESIZE HANDLER ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        scroller.resize();
    }, 250);
});

// ========== INITIAL LOAD ANIMATION ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});