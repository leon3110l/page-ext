try {
    /*-----------------------
     Start of the singletons
    -----------------------*/

    const filter_Module = (function (programSettings) {

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




} catch(err) {
    alert("pagina_maken is broken");
    console.log(err);
}
finally {
    if (programSettings.smokeTest.methodEnabled) {
        alert("No fatal error")
    }
}
