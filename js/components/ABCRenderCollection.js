class ABCRenderCollection extends ABCElement {
    constructor () {
        super();
    }
    render () {
        this.renderbuttons.forEach( (renderer) => {
            renderer.querySelector('button').click();
        });
    }
    connectedCallback () {
        this.renderbuttons = this.querySelectorAll('abc-render-button');
        if (this.renderbuttons.length > 0 && this.renderbuttons.length < 20) {
            if (window.ABCJS) {
                this.render();
            } else {
                this.loadLibrary();
            }
        }
    }
}
customElements.define('abc-render-collection', ABCRenderCollection);