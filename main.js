/*****************
 Program Settings
*****************/
const programSettings = {
    linkColourer: {
        methodEnabled: true,

        red: true,
        orange: false,
        yellow: false
    },

    // Test Settings
    smokeTest: {
        methodEnabled: true
    },

    removeOnCode: {
        methodEnabled: true,
        colorAffectedElements: false
    },

    arrayToString : {
        addDot: false
    },

    urlRemover : {
        functionEnabled: true
    }
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
        urlRemover : (function () {
            if (programSettings.urlRemover.functionEnabled) {
                (runScript = function () {
                    let id_pos = [];
                    let value = "";

                    let removeCode = "";
                    let testArray = [];

                    for (let tableRow of tableRows) {

                        const tags = tableRow.querySelectorAll('td ul li');
                        for (let tag of tags) {

                            setTimeout(function () {
                                const text = tag.querySelector('span').innerHTML;
                                const state = { site: false}
                                // split the string;
                                testArray = splitter(text);

                                // create a binary removeCode;
                                removeCode = testLooper(testArray);

                                // Remove elements from array based on binaryCode
                                testArray = removeOnCode(removeCode, testArray, (tag.querySelector('span').style) );

                                // convert the array back to a string
                                value = arrayToString(testArray);

                                // replaces the original dom item with the newly computed one
                                tag.querySelector('span').innerHTML = value;
                                tag.querySelector('input').value = value;

                                const ui = document.querySelector('input.hidden').value;
                                let id_pos = tag.id.split("_");
                                sendAjax(ui, id_pos, value)

                            }, 2000);
                        }
                    }
                })();
            }
            function splitter(string) {
                const splittedString = string.split(".");
                return splittedString;
            }

            function testLooper(arrayOfStr) {
                let results = "";

                for (var i = 0; i < arrayOfStr.length; i++) {

                    if ( containsDomainCode(arrayOfStr[i]) === true) {
                        results += "1";
                    } else if ( containsDomainCode(arrayOfStr[i]) === false ) {
                        results += "0";
                    }
                }

                return (results);
            }

            function containsDomainCode(string) {
                const removeList = [
                    "com",
                    "eu",
                    "infonu",
                    "net",
                    "nl",
                    "org",
                    "www",
                    "be",
                ];
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

                    // console.log(i);
                    for (let i=testArray.length-1;  i>-1;  i--) {
                        if (removeCodeArray[i] == '1') {

                            if (programSettings.removeOnCode.colorAffectedElements) {
                                testArray.splice(i, 1);
                                element.backgroundColor = "red"
                            } else {
                                testArray.splice(i, 1);
                            }
                        }
                        else if (removeCodeArray[i] == '0') {

                        } else {
                            Alert("removeCodeBroke");
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
                xhr.send('ui=' + L_ui + "&id=" + L_id + "&pos=" + L_pos + "&value=" + L_value)
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

// (linkColourer = function (settings) {
//     if (settings.methodEnabled == true) {
//         const tables = document.querySelectorAll('#urlform table')
//
//         const endCharacters = /([:.?!])/g           // specifies when a thing ends
//         const remCharacters = /([|]{2})|([≥()])/g   // specifies the stuff to take out
//         const website = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g // website check
//
//
//         for (let table of tables) {
//             const tags = table.querySelectorAll('tbody tr td ul li');
//
//             for (let tag of tags) {
//                 const state = {
//                     site: false,
//                 }
//                 const text = tag.querySelector('span').innerHTML.toLowerCase();
//
//                 if (settings.red == true) {
//                     if (text.length === 1 && text != '/') {
//                         tag.style.border = '5px solid red'
//                     }
//                 }
//
//                 if (settings.orange == true) {
//                     if (
//                         text.search(remCharacters) > -1 ||
//                         text.search(website) > -1 ||
//                         text.indexOf('home') > -1
//                     ) {
//                         tag.style.border = '5px solid orange'
//                         state.site = true
//                     }
//                 }
//
//                 if (settings.yellow == true) {
//                     if (text.search(endCharacters) > -1 && !state.site) {
//                         tag.style.border = '5px solid yellow'
//                     }
//                 }
//             }
//         }
//     }
// })(programSettings.linkColourer);

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
