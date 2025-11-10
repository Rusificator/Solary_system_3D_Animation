// script.js
class SolarSystem {
    constructor() {
        this.planets = {
            sun: {
                name: "Солнце",
                facts: [
                    "Диаметр: 1 392 700 км",
                    "Масса: 1.989 × 10³⁰ кг",
                    "Температура ядра: ~15 000 000°C",
                    "Температура поверхности: ~5 500°C",
                    "Состав: 73% водород, 25% гелий",
                    "Возраст: ~4.6 миллиарда лет",
                    "Тип: Жёлтый карлик (G2V)"
                ]
            },
            mercury: {
                name: "Меркурий",
                facts: [
                    "Диаметр: 4 880 км",
                    "Расстояние от Солнца: ~58 млн км",
                    "Спутники: Отсутствуют",
                    "Год: 88 земных дней",
                    "День: 59 земных дней",
                    "Температура: от -180°C до 430°C",
                    "Атмосфера: Очень разреженная"
                ]
            },
            venus: {
                name: "Венера",
                facts: [
                    "Диаметр: 12 104 км",
                    "Расстояние от Солнца: ~108 млн км",
                    "Спутники: Отсутствуют",
                    "Год: 225 земных дней",
                    "День: 243 земных дня",
                    "Температура: 462°C (самая горячая планета)",
                    "Атмосфера: Плотная, CO₂"
                ]
            },
            earth: {
                name: "Земля",
                facts: [
                    "Диаметр: 12 742 км",
                    "Расстояние от Солнца: ~150 млн км",
                    "Спутники: 1 (Луна)",
                    "Год: 365.25 дней",
                    "День: 24 часа",
                    "Температура: от -88°C до 58°C",
                    "Единственная известная обитаемая планета"
                ]
            },
            mars: {
                name: "Марс",
                facts: [
                    "Диаметр: 6 779 км",
                    "Расстояние от Солнца: ~228 млн км",
                    "Спутники: 2 (Фобос, Деймос)",
                    "Год: 687 земных дней",
                    "День: 24 часа 37 минут",
                    "Температура: от -153°C до 20°C",
                    "Красная планета из-за оксида железа"
                ]
            },
            jupiter: {
                name: "Юпитер",
                facts: [
                    "Диаметр: 139 820 км",
                    "Расстояние от Солнца: ~778 млн км",
                    "Спутники: 95 известных",
                    "Год: 12 земных лет",
                    "День: 9 часов 56 минут",
                    "Температура: ~-145°C",
                    "Крупнейшая планета Солнечной системы"
                ]
            },
            saturn: {
                name: "Сатурн",
                facts: [
                    "Диаметр: 116 460 км",
                    "Расстояние от Солнца: ~1.4 млрд км",
                    "Спутники: 146 известных",
                    "Год: 29 земных лет",
                    "День: 10 часов 42 минуты",
                    "Температура: ~-178°C",
                    "Известен своими кольцами из льда и камня"
                ]
            },
            uranus: {
                name: "Уран",
                facts: [
                    "Диаметр: 50 724 км",
                    "Расстояние от Солнца: ~2.9 млрд км",
                    "Спутники: 28 известных",
                    "Год: 84 земных года",
                    "День: 17 часов 14 минут",
                    "Температура: ~-224°C",
                    "Вращается на боку (наклон 98°)"
                ]
            },
            neptune: {
                name: "Нептун",
                facts: [
                    "Диаметр: 49 244 км",
                    "Расстояние от Солнца: ~4.5 млрд км",
                    "Спутники: 16 известных",
                    "Год: 165 земных лет",
                    "День: 16 часов 6 минут",
                    "Температура: ~-218°C",
                    "Самая ветреная планета (скорость ветра до 2100 км/ч)"
                ]
            }
        };

        this.isCardOpen = false;
        this.isFullscreen = false;
        this.touchStartY = 0;
        this.cardTouchStartY = 0;
        this.cardCurrentY = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.detectDeviceType();
        this.setupCardSwipe();
    }

    setupEventListeners() {
        // Кнопка входа в полноэкранный режим
        document.getElementById('enterFullscreen').addEventListener('click', () => {
            this.enterFullscreen();
        });

        // Кнопка выхода из полноэкранного режима
        document.getElementById('exitFullscreen').addEventListener('click', () => {
            this.exitFullscreen();
        });

        // Обработка кликов на планеты и солнце в полноэкранном режиме
        document.addEventListener('click', (e) => {
            if (!this.isFullscreen) return;
            
            const touchTarget = e.target.closest('.planet-touch-target');
            if (touchTarget) {
                e.stopPropagation();
                const celestialBody = touchTarget.parentElement;
                this.showPlanetInfo(celestialBody.id);
                return;
            }

            // Прямой клик на планету (без touch-target)
            const planet = e.target.closest('.planet, .sun');
            if (planet && planet.id && this.planets[planet.id]) {
                e.stopPropagation();
                this.showPlanetInfo(planet.id);
            }
        });

        // Обработка тач-событий для планет
        document.addEventListener('touchstart', (e) => {
            if (!this.isFullscreen) return;
            
            const touchTarget = e.target.closest('.planet-touch-target');
            if (touchTarget) {
                e.stopPropagation();
                this.touchStartY = e.touches[0].clientY;
                const celestialBody = touchTarget.parentElement;
                this.scaleCelestialBody(celestialBody, 1.2);
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!this.isFullscreen) return;
            
            const touchTarget = e.target.closest('.planet-touch-target');
            if (touchTarget) {
                e.stopPropagation();
                const celestialBody = touchTarget.parentElement;
                this.scaleCelestialBody(celestialBody, 1.0);
                
                // Проверяем, был ли это короткий тап (не свайп)
                const touchEndY = e.changedTouches[0].clientY;
                if (Math.abs(touchEndY - this.touchStartY) < 10) {
                    this.showPlanetInfo(celestialBody.id);
                }
            }
        }, { passive: true });

        // Обработка клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.classList.contains('planet') || activeElement.id === 'sun')) {
                    e.preventDefault();
                    this.showPlanetInfo(activeElement.id);
                }
            }
            
            if (e.key === 'Escape' && this.isCardOpen) {
                this.hidePlanetInfo();
            }
            
            if (e.key === 'Escape' && this.isFullscreen) {
                this.exitFullscreen();
            }
        });

        // Закрытие карточки
        document.getElementById('closeCard').addEventListener('click', () => {
            this.hidePlanetInfo();
        });

        // Закрытие карточки по клику на затемненную область
        document.addEventListener('click', (e) => {
            if (this.isCardOpen && this.isFullscreen && 
                !e.target.closest('.planet-card') && 
                !e.target.closest('.planet-touch-target') &&
                !e.target.closest('.planet') &&
                !e.target.closest('.sun')) {
                this.hidePlanetInfo();
            }
        });

        // Мобильные контролы в полноэкранном режиме
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));
        document.getElementById('toggleOrbits').addEventListener('click', () => this.toggleOrbits());
        
        // Обработка изменения ориентации
        window.addEventListener('resize', () => this.handleOrientation());
    }

    scaleCelestialBody(element, scale) {
        if (element.id === 'sun') {
            element.style.transform = `translate(-50%, -50%) scale(${scale})`;
        } else {
            element.style.transform = `translateX(-50%) scale(${scale})`;
        }
    }

    setupCardSwipe() {
        const card = document.getElementById('planetCard');
        
        card.addEventListener('touchstart', (e) => {
            if (!this.isCardOpen) return;
            
            this.cardTouchStartY = e.touches[0].clientY;
            this.cardCurrentY = this.cardTouchStartY;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            if (!this.isCardOpen) return;
            
            this.cardCurrentY = e.touches[0].clientY;
            const diff = this.cardCurrentY - this.cardTouchStartY;
            
            // Если свайп вниз - двигаем карточку
            if (diff > 0) {
                card.style.transform = `translateY(${diff}px)`;
            }
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            if (!this.isCardOpen) return;
            
            const diff = this.cardCurrentY - this.cardTouchStartY;
            
            // Если свайп достаточно большой - закрываем карточку
            if (diff > 100) {
                this.hidePlanetInfo();
            } else {
                // Возвращаем карточку на место
                card.style.transform = '';
            }
            
            this.cardTouchStartY = 0;
            this.cardCurrentY = 0;
        }, { passive: true });
    }

    detectDeviceType() {
        // Определяем тип устройства
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('pointer-device');
        }

        this.handleOrientation();
    }

    handleOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        document.body.classList.toggle('portrait', isPortrait);
        document.body.classList.toggle('landscape', !isPortrait);
    }

    enterFullscreen() {
        const fullscreenMode = document.getElementById('fullscreenMode');
        const header = document.querySelector('.site-header');
        
        header.classList.add('hidden');
        fullscreenMode.classList.remove('hidden');
        
        this.isFullscreen = true;
        
        // Вибрация при входе в полноэкранный режим
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }

    exitFullscreen() {
        const fullscreenMode = document.getElementById('fullscreenMode');
        const header = document.querySelector('.site-header');
        
        fullscreenMode.classList.add('hidden');
        header.classList.remove('hidden');
        
        this.isFullscreen = false;
        this.hidePlanetInfo();
        
        // Сбрасываем масштаб при выходе
        const solarSystem = document.querySelector('.solar-system');
        solarSystem.style.transform = '';
        
        // Вибрация при выходе
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    showPlanetInfo(celestialBodyId) {
        if (!this.isFullscreen) return;
        
        const planetData = this.planets[celestialBodyId];
        if (!planetData || this.isCardOpen) return;

        const card = document.getElementById('planetCard');
        const title = document.getElementById('cardTitle');
        const factsList = document.getElementById('cardFacts');

        title.textContent = planetData.name;
        factsList.innerHTML = planetData.facts.map(fact => 
            `<li>${fact}</li>`
        ).join('');

        // Сбрасываем возможные трансформации перед показом
        card.style.transform = '';
        card.style.opacity = '';
        
        card.classList.remove('hidden');
        
        // Принудительный reflow для анимации
        card.offsetHeight;
        
        card.classList.add('active');
        this.isCardOpen = true;
        
        // Блокируем скролл тела при открытой карточке на мобильных
        if (this.isMobileDevice()) {
            document.body.style.overflow = 'hidden';
        }
        
        // Вибрация на поддерживающих устройствах
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Фокусируем на кнопке закрытия для доступности
        document.getElementById('closeCard').focus();
    }

    hidePlanetInfo() {
        if (!this.isCardOpen) return;
        
        const card = document.getElementById('planetCard');
        card.classList.remove('active');
        
        // Разблокируем скролл тела
        document.body.style.overflow = '';
        
        setTimeout(() => {
            card.classList.add('hidden');
            this.isCardOpen = false;
            // Сбрасываем transform после скрытия
            card.style.transform = '';
        }, 300);
    }

    isMobileDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    zoom(factor) {
        const solarSystem = document.querySelector('.solar-system');
        const currentTransform = getComputedStyle(solarSystem).transform;
        let currentScale = 1;
        
        if (currentTransform && currentTransform !== 'none') {
            const matrix = currentTransform.match(/matrix\(([^)]+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ');
                currentScale = parseFloat(values[3]) || 1;
            }
        }
        
        const newScale = Math.max(0.3, Math.min(3, currentScale * factor));
        solarSystem.style.transform = `scale(${newScale})`;
        
        // При масштабировании закрываем карточку для лучшего UX
        if (this.isCardOpen && Math.abs(newScale - 1) > 0.1) {
            this.hidePlanetInfo();
        }
        
        // Вибрация при масштабировании
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }

    toggleOrbits() {
        const orbits = document.querySelectorAll('.orbit');
        const isVisible = orbits[0].style.opacity !== '0';
        
        orbits.forEach(orbit => {
            orbit.style.opacity = isVisible ? '0' : '0.1';
        });
        
        // Вибрация при переключении
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }
}

// Инициализация когда DOM полностью загружен
document.addEventListener('DOMContentLoaded', () => {
    window.solarSystem = new SolarSystem();
});

// Предотвращение масштабирования на iOS при дабл-тапе
document.addEventListener('touchend', (e) => {
    // Пассивный обработчик без preventDefault
}, { passive: true });
