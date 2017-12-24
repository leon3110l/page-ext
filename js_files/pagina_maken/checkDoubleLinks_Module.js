// Controls double link checker
// Depends on the testStringDiffrences_Module
const checkDoubleLinks_Module = function (programSettings) {
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
                                let result = testStringDifferences_Module(item1, item2, 3, 20)

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
