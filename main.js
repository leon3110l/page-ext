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

        arrayToString: {
            addDot: false
        },

        smokeTest: {
            methodEnabled: false
        },

        removeOnCode: {
            methodEnabled: true,
            colorAffectedElements: false,
            testlog0: false,
            testlog1: false
        },

        urlRemover: {
            functionEnabled: true,
            ajaxEnabled: true,
            testColoring: false,
            clearVisibleContent: false,
            removeListWrap: {
                removeList:  [
                    // "com",
                    // "eu",
                    // "infonu",
                    // "net",
                    // "nl",
                    // "nl:",
                    // "org",
                    // "www",
                    // "be",
                ],

                shortIcons: [
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
                    "®",
                    "›",
                ],

                longIcons: [
                    "--",
                    "&gt;",
                    "&gt;&gt;",
                ],

                words: [
                    "home",
                    "homepagina",
                    "homepage,",
                    "homepage",
                    "startpagina:",
                    "homepages®",
                    "page",
                    "links",
                    "blog",
                ],

                isBetweenDots : [
                    "startpagina",
                    "wikipedia",
                    "facebook",
                    "twitter",
                    "linkedin",

                    // "com",
                    // "eu",
                    // "infonu",
                    // "net",
                    // "nl",
                    // "nl:",
                    // "org",
                    // "www",
                    // "be",
                ],

                contains: [
                    "facebook",
                    "twitter",
                    "linkedin",
                ],
            }
        },
    };

try {
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

            --Removes domain names from the page*/
            urlRemover: (function () {
                if (programSettings.urlRemover.functionEnabled) {
                    (runScript = function () {
                        let removeListWrap = programSettings.urlRemover.removeListWrap;
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

                                    /* Dont test if shorter then 1*/
                                    if (text.length > 0) {

                                        // if value is negative stop
                                        value = testFunctions(text, removeListWrap, tag)

                                        if (value !== false) {
                                            console.log(value);

                                            /* replaces the original dom items with the newly computed one*/
                                            if (programSettings.urlRemover.testColoring) {
                                                tag.style.backgroundColor = "#222";
                                                tag.style.color = "#444";
                                                tag.style.borderColor = "black";
                                            }
                                            if (!programSettings.urlRemover.clearVisibleContent) {
                                                tag.querySelector('span').innerHTML = value;
                                            }

                                            tag.querySelector('input').value = value;
                                            const ui = document.querySelector('input.hidden').value;

                                            /*removes item from DB*/
                                            if (programSettings.urlRemover.ajaxEnabled) {
                                                let id_pos = tag.id.split("_");
                                                sendAjax(ui, id_pos, value);
                                            }

                                        }
                                    }
                                }, 1000);
                            }
                        }
                    })();
                }

                function testFunctions(text, removeListWrap, tag) {try {

                    /*set local removelists*/
                    let shortIcons = removeListWrap.shortIcons;
                    let longIcons = removeListWrap.longIcons;
                    let words = removeListWrap.words;
                    let isBetweenDots = removeListWrap.isBetweenDots;

                    /* create data object */
                    let returnedObject = {};
                    let testObject = {};
                    testObject.testArray = [text];
                    testObject.results = "";
                    testObject.bool = true;

                    /* create value variable*/
                    let value = "";

                    /* create a binary removeCode*/
                    returnedObject = testHandler(testObject, shortIcons)
                    testObject.bool = returnedObject.bool;

                    returnedObject = testHandler(testObject, longIcons)
                    testObject.bool = returnedObject.bool;

                    returnedObject = testHandler(testObject, words)
                    testObject.bool = returnedObject.bool;

                    testObject.testArray = text.split(".");
                    returnedObject = testHandler(testObject, isBetweenDots)
                    testObject.bool = returnedObject.bool;

                    /* Remove elements from array based on binaryCode*/
                    let proccesedArray = removeOnCode(returnedObject.results, testObject.testArray, tag );

                    /* convert the array back to a string*/
                    value = arrayToString(proccesedArray);

                    /* handle end of the testfunctions*/
                    if (testObject.bool) {
                        return false;
                    } else {
                        return value;
                    }

                    /*Testing proxy*/
                    function testHandler(sendObject, removeList) {
                        if (sendObject.bool) {
                            returnObject = createBinaryRemoveCode(sendObject, removeList);
                            return returnObject;
                        } else {
                            return returnObject;
                        }
                    }

                } catch(err) {

                    setTimeout(function () {
                        alert("testFunction Error")
                        console.log(err)
                    }, 50);
                }};


                //creates a binaryCode to use later

                function createBinaryRemoveCode(object, removeList) {
                    let testArray = object.testArray;
                    let results = "";
                    let bool = object.bool;
                    let res;

                    /*Compares every string in the array against the removeList*/
                    for (var i = 0; i < testArray.length; i++) {

                        /*Compares the string against the removeList*/
                        res = (function(string, removeList) {
                            for (var i = 0; i < removeList.length; i++) {
                                if (string.toLowerCase() == removeList[i]) {
                                    return true;
                                };
                            }
                            return false;
                        })(testArray[i], removeList);

                        /*create the binarycode*/
                        if (res === true) {
                            results += "1";
                            bool = false
                        } else if (res === false) {
                            results += "0";
                        }
                    }

                    /*returns the object*/
                    object.results = results;
                    object.bool = bool;

                    return (object);
                }

                function removeOnCode(removeCode, testArray, element) {
                    if (programSettings.removeOnCode.methodEnabled) {
                        const removeCodeArray = removeCode.split("");

                        for (let i=testArray.length-1;  i>-1;  i--) {
                            if (removeCodeArray[i] == '1') {
                                testArray = [""];

                                if (programSettings.removeOnCode.colorAffectedElements) {
                                    element.style.backgroundColor = "#222";
                                    element.style.color = "#444";
                                    element.style.borderColor = "black";
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
            formElements[4].querySelector('textarea').innerHTML = "alles over ";
            formElements[4].querySelector('textarea').innerHTML += content;

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
    alert("code is broken");
    console.log(err);
}
finally {
    if (programSettings.smokeTest) {
        alert("No fatal error")
    }
}
