const chooseUrls_Module = (function () {

    //private properties
    const removeList = [
      'algeme',
      'link',
      'adver',
      'pagina',
      'forum',
      'over',
      'diver',
      'zoekmachine',
      'dochter',
      'wikipedia',
      'facebook',
      'twitter',
      'linkedin',
      / [0 - 9] /g,
      /[^a-z /][ - ]/g,
  ];

    // private methods

    // filters items list on unwanted items
    function initializeFilterStuff() {
        let urlTrs = document.querySelectorAll('table#cats tbody tr');

        let items = 0
        for (let row of urlTrs) {
            const textElem = row.querySelector('.nameselector');
            if (textElem) {
                const text = textElem.innerHTML.toLowerCase()
                if (removeList.some(x => text.search(x) != -1)) {
                    row.querySelector('.btn-warning').click()
                } else {
                    items++
                }
            }
        }


        while (items >= 26) {
            let randomNr = Math.floor(Math.random() * items)
            let row = urlTrs[randomNr]
            if (row) {
                setTimeout(() => {
                    row.querySelector('.btn-warning').click()
                    setTimeout(function () {
                        urlTrs.splice(randomNr, 1)
                    }, items * 0.05);
                }, items * 0.1)

                console.log(items--)
            }
        }
    }

    function setNummering() {
        let urlTrs = document.querySelectorAll('table#cats tbody tr')

        setTimeout(() => {
            for (let i = 0; i < urlTrs.length; i++) {
                urlTrs[i].children[0].innerHTML = i + 1;
            }
        }, 200);
    }

    // Public items
    return {
        items: -1,

        runScript: function() {
            initializeFilterStuff();
            setNummering();
        },

        addEventListener: (function () {
            window.addEventListener("keyup", function(e) {
                if (e.shiftKey === true) {
                    if ( e.key.toLowerCase() === "d") {
                        chooseUrls_Module.runScript();
                    }
                }
            }, 1 );
        })(),
    };
})();
