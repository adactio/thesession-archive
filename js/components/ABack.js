class ABack extends HTMLElement {
    constructor () {
        super();
    }
    connectedCallback () {
        this.querySelector('a').addEventListener('click', (ev) => {
            ev.preventDefault();
            history.back();
        });
    }
}
customElements.define('a-back', ABack);