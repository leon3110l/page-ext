const metaData_Module = (function () {
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
