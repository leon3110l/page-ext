/*****************
 Program Settings
*****************/
const programSettings = {
    linkColourer : {
        methodEnabled: false,

        red: false,
        orange: false,
        yellow: false
    },

    smokeTest : {
        methodEnabled : false
    }
};

/*
--------------
 linkColourer
 -------------

 --Colours the links based upon some specified rules
*/
(linkColourer = function (settings) {
    if (settings.methodEnabled == true) {
        const tables = document.querySelectorAll('#urlform table')

        const endCharacters = /([:.?!])/g           // specifies when a thing ends
        const remCharacters = /([|]{2})|([≥()])/g   // specifies the stuff to take out
        const website = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g // website check


        for (let table of tables) {
            const tags = table.querySelectorAll('tbody tr td ul li');

            for (let tag of tags) {
                const state = {
                    site: false,
                }
                const text = tag.querySelector('span').innerHTML.toLowerCase();

                if (settings.red == true) {
                    if (text.length === 1 && text != '/') {
                        tag.style.border = '5px solid red'
                    }
                }

                if (settings.orange == true) {
                    if (
                        text.search(remCharacters) > -1 ||
                        text.search(website) > -1 ||
                        text.indexOf('home') > -1
                    ) {
                        tag.style.border = '5px solid orange'
                        state.site = true
                    }
                }

                if (settings.yellow == true) {
                    if (text.search(endCharacters) > -1 && !state.site) {
                        tag.style.border = '5px solid yellow'
                    }
                }
            }
        }
    }
})(programSettings.linkColourer);

/*
  ----------------------
  klaar zetten singleton
  ----------------------

 -- is called by a eventlistener
 -- has all needed properties nested inside */
const klaarzetten = (function () {

    //private properties

    const urlTrs = document.querySelectorAll('table#cats tbody tr');

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
      / [0 - 9] /g,
      /[^a-z /][ - ]/g,
  ];

    // private methods

    // filters items list on unwanted items
    function initializeFilterStuff(urlTrs) {
        items = 0
        for (let row of urlTrs) {
            const textElem = row.querySelector('.nameselector')
            if (textElem) {
                const text = textElem.innerHTML.toLowerCase()

                //filter removeShit
                if (removeList.some(x => text.search(x) != -1)) {
                    console.log('remove: ', text)
                    row.querySelector('.btn-warning').click()
                }

                else {
                   items++
                }
            }
        }
    }

    function mainFilterStuff(urlTrs) {
        // reduces page categories to 25
        while (items >= 26) {
            let row = urlTrs[Math.floor(Math.random() * items)]
            if (row) {
                row.querySelector('.btn-warning').click()
                console.log(items--)
            }
        }
    }

    function setNummering(urlTrs) {
        setTimeout(() => {
            for (let i = 0; i < urlTrs.length; i++) {
                urlTrs[i].children[0].innerHTML = i + 1;
            }
        }, 1 + (items*1.2) - items);
    }

    // Public items
    return {
        items: -1,

        runScript: function() {
            initializeFilterStuff(urlTrs);
            mainFilterStuff(urlTrs);
            setNummering(urlTrs);
        },

        addEventListener: (function () {
            window.addEventListener("keyup", function(e) {
                if (e.shiftKey === true) {
                    if ( e.key.toLowerCase() === "d") {
                        klaarzetten.runScript()
                    }
                }
            }, 1 )
        })(),

    };
})();


/*
 ---------------------
 singleton addUrlpage
 ---------------------

 -- auto executes h3 remover onload
 -- auto fires addEventListener onload */
const addUrlpage = (function () {

    return {

        eventListener : (function () {
            const urlForm = document.querySelector('textarea[name="urls"]')
            if (urlForm) {
                urlForm.addEventListener('change', () => {
                    const old = urlForm.value
                    urlForm.value = `${old}.uwpagina.nl\r\n${old}.links.nl\r\n${old}.allepaginas.nl\r\n${old}.beginzo.nl\r\n${old}.linkpaginas.nl\r\n${old}.startsleutel.nl\r\n${old}.zoeklink.nl\r\n${old}.eigenstart.nl\r\n`
                })
            }
        })(),

        h3Unchecker :  (function () {
            const h3Selector = document.querySelector('input[value="h3"]')
            if (h3Selector) {
              h3Selector.checked = false
            }
        })()
    }
})();


(function smokeTest (settings) {
    if (settings.methodEnabled == true) {
        alert("not broken yet");
    }
})(programSettings.smokeTest);
