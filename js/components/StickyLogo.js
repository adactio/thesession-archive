class stickyLogo extends HTMLElement {
    constructor () {
        super();
    }
    checkPosition () {
        if (window.scrollY > this.triggerpoint) {
            this.logo.classList.add(this.toggleClass);
        } else {
            this.logo.classList.remove(this.toggleClass);
        }
    }
    connectedCallback () {
        this.style.display = 'contents';
        this.toggleClass = 'sticky';
        this.logo = this.querySelector('.logo');
        this.triggerpoint = document.querySelector('.strip.top').offsetHeight;
        window.addEventListener('load', (ev) => {
            this.checkPosition();
        });
        window.addEventListener('scroll', (ev) => {
            this.checkPosition();
        });
    }
}
customElements.define('sticky-logo', stickyLogo);