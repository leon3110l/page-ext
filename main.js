/*****************
 Program Settings
*****************/
const programSettings = {

    // linkColourer
    linkColourer: {
        methodEnabled: true,

        red: true,
        orange: false,
        yellow: false
    },

    arrayToString : {
        addDot: false
    },

    urlRemover : {
        functionEnabled: true,
        removeList: [
            // "com",
            // "eu",
            // "infonu",
            // "net",
            // "nl",
            // "nl:",
            // "org",
            // "www",
            // "be",

            "wikipedia",
            "wikipedia.org",
            "nl.wikipedia.org",
            "nl.wiktionary.org",
            "en.wikipedia.org",

            "≥",
            "º",
            "▷",
            "ᐅ",
            "»",
            "«",
            "√",
            "ʘ",
            "•",
            "·",
            "'",
            "::",
            ",",
            ".",
            "→",
            "@",
            "~",

            "--",
            "&gt;",
            "&gt;&gt;",
            "startpagina",
            "home",
            "Homepagina",
            "Homepage,",
            "homepage",
            "Startpagina:",
            "HomePages®",
            "page",
            // "vakantielandbelgie",
        ],
    },

    // Test Settings
    smokeTest: {
        methodEnabled: true
    },

    removeOnCode: {
        methodEnabled: true,
        colorAffectedElements: false,
        testlog0: false,
        testlog1: false
    },
};


/*-----------------------
 Start of the singletons
-----------------------*/

const paginaMaken = (function (programSettings) {

    /*----------------
     Private variables
    -----------------*/

    const tableRows = document.querySelectorAll('#urlform table tbody tr');
    const endCharacters = /([:.?!])/g;           // specifies when a thing ends
    const remCharacters = /([|]{2})|([≥()])/g;   // specifies the stuff to take out
    const website = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g; // website check
    return {

        /*----------------
         Public Methods
        -----------------

        ----------
         UrlRemover
        ------------

        --Removes domain names from the page*/
        urlRemover: (function () {
            if (programSettings.urlRemover.functionEnabled) {
                (runScript = function () {
                    let removeList = programSettings.urlRemover.removeList;
                    let id_pos = [];
                    let value = "";
                    let removeCode = "";

                    for (let tableRow of tableRows) {
                        const tags = tableRow.querySelectorAll('td ul li');
                        for (let tag of tags) {

                            setTimeout(function () {
                                let testArray = [];
                                const text = tag.querySelector('span').innerHTML;
                                const state = { site: false}


                                // split the string;
                                // testArray = text.split(".");
                                testArray[0] = text;
                                // if there is only 1 target stop going forward has no purpose
                                if (text.length > 0) {

                                    // if value is negative stop
                                    value = TestFunctions(testArray, removeList, tag.querySelector('span').style)
                                    if (value !== false) {
                                        // replaces the original dom item with the newly computed one
                                        tag.querySelector('span').innerHTML = value;
                                        tag.querySelector('input').value = value;

                                        const ui = document.querySelector('input.hidden').value;

                                        let id_pos = tag.id.split("_");
                                        sendAjax(ui, id_pos, value);
                                    }
                                }
                            }, 1000);
                        }
                    }
                })();
            }

            function TestFunctions(testArray, removeList, tag) {
                value = "";
                // create a binary removeCode;
                removeCode = testLooper(testArray, removeList);

                // Remove elements from array based on binaryCode
                testArray = removeOnCode(removeCode, testArray, tag );

                // convert the array back to a string
                value = arrayToString(testArray);

                return value
            }

            function testLooper(arrayOfStr, removeList) {
                let results = "";
                let res

                for (var i = 0; i < arrayOfStr.length; i++) {
                    res = containsDomainCode(arrayOfStr[i], removeList)
                    if (res === true) {
                        results += "1";
                    } else if (res === false ) {
                        results += "0";
                    }
                }

                return (results);
            }

            function containsDomainCode(string, removeList) {
                for (var i = 0; i < removeList.length; i++) {
                    if (string.toLowerCase() == removeList[i]) {
                        return true;
                    };
                }
                return false;
            }

            function removeOnCode(removeCode, testArray, element) {
                if (programSettings.removeOnCode.methodEnabled) {
                    const removeCodeArray = removeCode.split("");

                    for (let i=testArray.length-1;  i>-1;  i--) {
                        if (removeCodeArray[i] == '1') {
                            if (programSettings.removeOnCode.colorAffectedElements) {
                                testArray.splice(i, 1);
                                element.backgroundColor = "red";
                            } else {
                                testArray.splice(i, 1);
                            }
                            if (programSettings.removeOnCode.testlog1) {
                                console.log(1)
                            }
                        }
                        else if (removeCodeArray[i] == '0') {
                            if (programSettings.removeOnCode.testlog0) {
                                console.log(0);
                            }
                        } else {
                            alert("removeCodeBroke");
                        }
                    }
                }
                return testArray;
            }

            function arrayToString(array) {
                let string = "";
                for (var i = 0; i < array.length; i++) {
                    string += array[i];

                    if (programSettings.arrayToString.addDot) {
                        string += ".";
                    }
                }
                return string;
            }

            // xhr.open('POST', 'http://51.255.87.34/~pagina/ajax/change_tag.php');

            function sendAjax(ui, id_pos, value) {
                const L_ui = ui;
                const L_id = id_pos[0];
                const L_pos = id_pos[1];
                const L_value = value;

                var xhr = new XMLHttpRequest();
                xhr.open("POST", 'http://51.255.87.34/~pagina/ajax/change_tag.php', true);

                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function() {//Call a function when the state changes.
                    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                        // Request finished. Do processing here.
                    }
                }
                xhr.send('ui=' + L_ui + "&id=" + L_id + "&pos=" + L_pos + "&value=" + L_value);
            }

        })(),

        /*-----------
         linkColourer
        -------------

        --Colours the links based upon some specified rules*/
        linkColourer : (function (settings) {
            if (settings.methodEnabled == true) {

                for (let tableRow of tableRows) {
                    const tags = tableRow.querySelectorAll('td ul li');

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
        })(programSettings.linkColourer)
    }
})(programSettings);

/*
  ----------------------
  klaar zetten singleton
  ----------------------

 -- is called by a eventlistener
 -- has all needed properties nested inside */
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
            let row = urlTrs[Math.floor(Math.random() * items)]
            if (row) {
                setTimeout(() => {
                    row.querySelector('.btn-warning').click()
                }, 50)
                urlTrs.splice(row, 1)
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
        }, 5);
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
        console.log(formElements[3].querySelector('input').value = content);

        /* changes the meta titel*/
        console.log(formElements[4].querySelector('textarea').innerHTML = "alles over " + content);

        formElements[0].querySelector('input').removeEventListener('change', handler);
    };

    function sendAjax2(id_l, rubriek) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://51.255.87.34/~pagina/ajax/get_sitecats.php', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText))

                let response = JSON.parse(xhr.responseText);
                rubriek.removeAttribute("disabled")
                rubriek.innerHTML = "";

                let options = "";
                for (var i = 0; i < response.length; i++) {
                    let option = document.createElement("option");
                    option.setAttribute('value', response[i]);
                    option.text = response[i];
                    rubriek.append(option)
                    console.log (option)
                }
            }
        }
        xhr.send('id=' + id_l)
    }
})();

(function smokeTest (settings) {
    if (settings.methodEnabled == true) {
        alert("not broken yet");
    }
})(programSettings.smokeTest);
