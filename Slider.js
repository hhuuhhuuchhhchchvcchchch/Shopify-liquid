
class Slider {
    constructor({ prev, next, slider, scrollAmount = 300, time = 1.2, auto = false, autoSpeed = 50 }) {
        if (!prev || !next || !slider) {
            console.error('Slider: missing required elements');
            return;
        }

        this.next = next;
        this.prev = prev;
        this.slider = slider;
        this.scrollAmount = scrollAmount;
        this.time = time;
        this.auto = auto;
        this.autoSpeed = autoSpeed;
        this.autoTween = null;

        this.init();
    }

    init() {
        this.bind();
        if (this.auto) {
            this.startAutoScroll();
        }
    }

    bind() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            this.slider.addEventListener('touchstart', () => this.pauseAuto());
        } else {
            this.slider.addEventListener('mouseenter', () => this.pauseAuto());
            this.slider.addEventListener('mouseleave', () => this.resumeAuto());
        }


        this.prev.addEventListener('click', () => this.scrollLeft());
        this.next.addEventListener('click', () => this.scrollRight());
        window.addEventListener('resize', () => {
            if (this.auto) this.startAutoScroll();
        });
    }
    scrollLeft() {
        this.pauseAuto(); 
        gsap.to(this.slider, {
            scrollTo: { x: `-=${this.scrollAmount}` }, 
            duration: this.time,
            ease: "power4.out",
            onComplete: () => {
                if (this.auto) this.startAutoScroll();  
            }
        });
    }

    scrollRight() {
        this.pauseAuto();  
        gsap.to(this.slider, {
            scrollTo: { x: `+=${this.scrollAmount}` },
            duration: this.time,
            ease: "power4.out",
            onComplete: () => {
                if (this.auto) this.startAutoScroll();  
            }
        });
    }
    startAutoScroll() {
        if (this.autoTween) this.autoTween.kill();

        const current = this.slider.scrollLeft; 
        const max = this.slider.scrollWidth - this.slider.clientWidth;
        const distance = max - current;
        const duration = distance / this.autoSpeed;

        this.autoTween = gsap.to(this.slider, {
            scrollTo: { x: max }, 
            duration: duration,
            ease: "none",
            onComplete: () => {
                gsap.to(this.slider, {
                    scrollTo: { x: 0 }, 
                    duration: this.time,
                    onComplete: () => this.startAutoScroll() 
                });
            }
        });
    }
    
    pauseAuto() {
        if (this.autoTween) this.autoTween.pause();
    }

    resumeAuto() {
        if (this.auto && this.autoTween) this.autoTween.play();
    }
}
