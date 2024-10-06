class ABCRenderButton extends ABCElement {
    constructor () {
        super();
    }
    connectedCallback () {
        this.controller = this.querySelector('button');
        this.canvas_id = this.dataset.canvas_id;
        this.notes_id = this.dataset.notes_id;
        this.abc = document.getElementById(this.notes_id).textContent;
        if (this.controller.getAttribute('aria-expanded') == 'true') {
            this.render();
        } else {
            this.controller.addEventListener('click', (ev) => {
                this.render();
            }, {once: true});
        }
    }
}
customElements.define('abc-render-button', ABCRenderButton);