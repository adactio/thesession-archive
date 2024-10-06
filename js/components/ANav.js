class ANav extends HTMLElement {
    constructor () {
        super();
    }
    connectedCallback () {
        this.querySelector('a').addEventListener('click', (ev) => {
            if (window.matchMedia('(max-width: 44em) and (min-height: 33em)').matches) {
                ev.preventDefault();
                document.body.classList.toggle('nav-active');
            }
        });
    }
}
customElements.define('a-nav', ANav);