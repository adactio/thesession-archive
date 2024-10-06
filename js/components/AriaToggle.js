class AriaToggle extends HTMLElement {
    constructor () {
        super();
    }
    open () {
        this.content.removeAttribute('aria-hidden');
        this.controller.setAttribute('aria-expanded', 'true');
        this.addEventListener('keyup', this);
    }
    close () {
        this.content.setAttribute('aria-hidden', 'true');
        this.controller.setAttribute('aria-expanded', 'false');
        this.removeEventListener('keyup', this);
    }
    handleEvent (ev) {
        if (ev.key === 'Escape') {
            let closing = new CustomEvent('closing', { bubbles: true });
            this.dispatchEvent(closing);
            this.close();
        }
    }
    connectedCallback () {
        this.controller = this.querySelector('[aria-controls]');
        this.content_id = this.controller.getAttribute('aria-controls');
        this.content = document.getElementById(this.content_id);
        this.controller.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (this.content_id == 'sharing' && navigator.share) {
                navigator.share(
                    {
                        title: document.querySelector('title').textContent,
                        url: document.querySelector('link[rel="canonical"]').getAttribute('href')
                    }
                );
                return;
            }
            if (this.content.hasAttribute('aria-hidden')) {
                this.open();
            } else {
                this.close();
            }
        });
    }
}
customElements.define('aria-toggle', AriaToggle);