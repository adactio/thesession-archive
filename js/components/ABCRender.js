class ABCRender extends ABCElement {
    constructor () {
        super();
    }
    connectedCallback () {
        this.canvas_id = this.dataset.canvas_id;
        this.notes_id = this.dataset.notes_id;
        this.abc = document.getElementById(this.notes_id).textContent;
        this.render();
    }
}
customElements.define('abc-render', ABCRender);