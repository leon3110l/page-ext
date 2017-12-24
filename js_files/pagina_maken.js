try {
    /*-----------------------
     Start of the singletons
    -----------------------*/

    const paginaMaken_Module = (function (programSettings) {

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
                    let urls = removeListWrap.urls;

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

                    returnedObject = testHandler(testObject, urls)
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
        }
    })(programSettings);


    // Controls double link checker
    // Depends on the testStringDiffrences_Module
    const paginaMakenUtility_Module = function (programSettings) {
        let categories = document.querySelectorAll('#urlform table tbody');

        // if categories[0] exists
        if (categories[0]) {

            function checkDoubleLinks(category) {
                const rows = category.querySelectorAll("tr");
                const checked = getCheckedArray(rows)

                return linkChecker(rows, checked, category)

                function getCheckedArray(rows) {
                    checkedArray = [];
                    for (let i = 2; i < rows.length; i++) {
                        if(rows[i].children[0].children[0].checked == false) {
                            checkedArray.push(false)
                        } else if (rows[i].children[0].children[0].checked == true) {
                            checkedArray.push(true)
                        };
                    }
                    return checkedArray
                };

                function getContentItems(row) {
                    let items = row.querySelectorAll('td ul li');
                    let textLine = "";
                    for (var i = 0; i < items.length; i++) {
                        if (
                            items[i].classList.contains("redbg") === false &&
                            items[i].querySelector('span').innerHTML !== ""
                        ) {
                            if (textLine.length !== 0) {
                                textLine += " ";
                            }
                            textLine += items[i].querySelector("span").innerHTML;
                        };
                    }
                    return textLine;
                }

                function linkChecker(rows, checked, category) {
                    for (var i = 0; i < checked.length-1; i++) {

                        if (checked[i]) {
                            for (var j = i+1; j < checked.length; j++) {
                                if (checked[j]) {
                                    let item1 = getContentItems(rows[2+(i*2)])
                                    let item2 = getContentItems(rows[2+(j*2)])
                                    let result = testStringDiffrences_Module(item1, item2, 3, 20)

                                    if(result) {
                                        rows[2+(j*2)].children[1].style.backgroundColor = "red";
                                        rows[2+(j*2)].classList.add("wrongLink");
                                        return false
                                    }
                                }
                            }
                        }
                    }
                    let removeRed = category.querySelectorAll(".wrongLink")
                    for (var i = 0; i < removeRed.length; i++) {
                        removeRed[i].children[1].style.backgroundColor = "";
                        removeRed[i].classList.remove("wrongLink");
                    }
                    return true
                }

            }

            function handleClickEvent(e, category) {
                const input = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0]
                if (e.target.classList.contains("cross") ) {
                    input.checked = true

                }
                setTimeout(function () {
                    let x = checkDoubleLinks(category);
                    console.log(x);
                }, 200);

            }


            //add eventListener module
            const addEventListeners = (function(categories) {
                for (let i = 0; i < categories.length; i++) {
                    categories[i].addEventListener("click", function(e) {
                        handleClickEvent(e, categories[i])
                    }, true);
                }
            })(categories)
        }

    } (programSettings);

    const linkColourer_module = (function (settings) {
        const tags = document.querySelectorAll('#urlform table tbody tr td ul li')

        if (settings.methodEnabled == true) {
            for (let tag of tags) {
                const state = {
                    site: false,
                }
                const text = tag.querySelector("span").innerHTML.toLowerCase();

                if (settings.red == true) {
                    if (text.length === 1 && text != '/') {
                        tag.style.border = '5px solid #272'
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
    })(programSettings.linkColourer);

    /*******************************
      string diffrence calculations
    *******************************/
    const testStringDiffrences_Module = (function(string1, string2, editDistanceAllowed, editPercentageAllowed) {
        //String testerModule
        return testStringDiffrence(string1, string2, editDistanceAllowed, editPercentageAllowed)

        function testStringDiffrence(string1, string2, editDistanceAllowed, editPercentageAllowed) {
            let editDistance = levenshteinDistance(string1, string2);
            let editPercentage = testPercentDiffrence(string1, string2,editDistance)

            if (editDistance <= (editDistanceAllowed)) {
                return true;
            } else {
                if (editPercentage <= (editPercentageAllowed) ) {
                    return true
                }
            }
            return false
        }

        function testPercentDiffrence(string1, string2, editDistance) {
            let longestDistance
            if (string1.length > string2.length) {
                longestDistance = string1.length;
            } else {
                longestDistance = string2.length;
            }

            let editPercentage = (editDistance / longestDistance) * 100;
            return editPercentage;
        }

        /*
        Copyright (c) 2011 Andrei Mackenzie
        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        */
        function levenshteinDistance (a, b) {
            if(a.length == 0) return b.length;
            if(b.length == 0) return a.length;

            var matrix = [];

            // increment along the first column of each row
            var i;
            for(i = 0; i <= b.length; i++){
                matrix[i] = [i];
            }

            // increment each column in the first row
            var j;
            for(j = 0; j <= a.length; j++){
                matrix[0][j] = j;
            }

            // Fill in the rest of the matrix
            for(i = 1; i <= b.length; i++){
                for(j = 1; j <= a.length; j++){
                    if(b.charAt(i-1) == a.charAt(j-1)){
                        matrix[i][j] = matrix[i-1][j-1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                        Math.min(matrix[i][j-1] + 1, // insertion
                        matrix[i-1][j] + 1)); // deletion
                    }
                }
            }

            return matrix[b.length][a.length];
        };
    });

} catch(err) {
    alert("pagina_maken is broken");
    console.log(err);
}
finally {
    if (programSettings.smokeTest.methodEnabled) {
        alert("No fatal error")
    }
}
