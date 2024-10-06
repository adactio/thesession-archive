class TabControls extends HTMLElement {
    constructor () {
        super();
    }
    connectedCallback () {
        this.tabs = this.querySelectorAll('[role="tab"]');
        this.addEventListener('click', (ev) => {
            let tab = ev.target.closest('[role="tab"]');
            if (tab) {
                if (tab.getAttribute('aria-expanded') == 'false') {
                    this.tabs.forEach( (eachtab) => {
                        eachtab.setAttribute('aria-expanded', 'false');
                        eachtab.setAttribute('aria-selected', 'false');
                        document.getElementById(eachtab.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
                    });
                    tab.setAttribute('aria-expanded', 'true');
                    tab.setAttribute('aria-selected', 'true');
                    document.getElementById(tab.getAttribute('aria-controls')).removeAttribute('aria-hidden');
                }
            }
        });
        this.addEventListener('keydown', function (ev) {
            let tab = ev.target.closest('[role="tab"]');
            if (tab) {
                if (ev.key === 'ArrowLeft') {
                    if (tab.previousElementSibling && tab.previousElementSibling.closest('[role="tab"]')) {
                        tab.previousElementSibling.closest('[role="tab"]').focus();
                    }
                }
                if (ev.key === 'ArrowRight') {
                    if (tab.nextElementSibling && tab.nextElementSibling.closest('[role="tab"]')) {
                        tab.nextElementSibling.closest('[role="tab"]').focus();
                    }   
                }
                if (ev.key === 'ArrowDown') {
                    ev.preventDefault();
                    tab.click();
                    let tabpanel = document.getElementById(tab.getAttribute('aria-controls'));
                    if (tabpanel) {
                        tabpanel.setAttribute('tabindex', '-1');
                        tabpanel.focus();
                    }
                }
            }
        });
    }
}
customElements.define('tab-controls', TabControls);