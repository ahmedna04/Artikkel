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