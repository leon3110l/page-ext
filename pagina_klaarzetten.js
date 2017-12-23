try {
    const klaarzetten = (function () {

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
                            klaarzetten.runScript();
                        }
                    }
                }, 1 );
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
                    });
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

    const paginaKlaarzettenMetaData = (function () {
        const formElements = document.querySelectorAll('#zoeken #pagesettings .form-group');
        if (formElements) {
            window.addEventListener("keyup", function(e) {
                if (e.shiftKey === true) {
                    if ( e.key.toLowerCase() === "d") {
                        fillElements(formElements)
                    }
                }
            }, 1 );
        }

        function fillElements(formElements) {
            const content = formElements[0].querySelector('input').value;

            /* changes the select*/
            formElements[1].querySelectorAll('select option')[1].selected = true;

            /* loads rubriek*/
            const rubriek = formElements[2].querySelector('select');
            const id = formElements[1].querySelector('select').value;
            sendAjax2(id, rubriek)

            /* changes the meta titel*/
            formElements[3].querySelector('input').value = content;

            /* changes the meta titel*/
            formElements[4].querySelector('textarea').value = "alles over ";
            formElements[4].querySelector('textarea').value += content;

            formElements[0].querySelector('input').removeEventListener('change', handler);
        };

        function sendAjax2(id_l, rubriek) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", 'http://51.255.87.34/~pagina/ajax/get_sitecats.php', true);

            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {//Call a function when the state changes.
                if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    JSON.parse(xhr.responseText)

                    let response = JSON.parse(xhr.responseText);
                    rubriek.removeAttribute("disabled")
                    rubriek.innerHTML = "";

                    let options = "";
                    for (var i = 0; i < response.length; i++) {
                        let option = document.createElement("option");
                        option.setAttribute('value', response[i]);
                        option.text = response[i];
                        rubriek.append(option)
                    }
                }
            }
            xhr.send('id=' + id_l)
        }
    })();
} catch(err) {
    alert("pagina_klaarzetten is broken")
    console.log(err)
}
