try {
    const pageInfo_Module = (function() {

        let categories = document.querySelectorAll('#urlform table tbody');
        if (categories[0]) {
            let dataArray = []
            
            for (var i = 0; i < categories.length; i++) {
                dataArray[i] = 0;
            }

            if(!document.getElementById("mainInfoBar") ){
                let mainInfoBar = document.createElement("div");
                    mainInfoBar.id = "mainInfoBar";
                    mainInfoBar.style.width = "100%"
                    mainInfoBar.style.position = "fixed";
                    mainInfoBar.style.backgroundColor = "grey";
                    mainInfoBar.style.border = "1px solid black";
                document.body.appendChild(mainInfoBar);

                let mainInfo = document.createElement("div");
                	mainInfo.style.width = "90%";
                    mainInfo.style.cssFloat = "left";
                mainInfoBar.appendChild(mainInfo);

                let mainInfoSide = document.createElement("div")
                    mainInfoSide.style.width = "10%";
                    mainInfoSide.style.cssFloat = "left";
                    mainInfoSide.style.borderLeft = "1px solid black";
                    mainInfoSide.style.fontSize = "16px";
                    mainInfoSide.style.fontWeight = "bold"


                    let mainInfoSideItem1 = document.createElement("div");
                        let mainInfoSideSpan1_1 = document.createElement("span");
                            mainInfoSideSpan1_1.id = "count-categories";
                            mainInfoSideSpan1_1.classList.add("MainInfoSpan1-1");
                            mainInfoSideSpan1_1.innerHTML = 0;
                        mainInfoSideItem1.appendChild(mainInfoSideSpan1_1)

                        let mainInfoSideSpan1_2 = document.createElement("span");
                            mainInfoSideSpan1_2.classList.add("MainInfoSpan1-2");
                            mainInfoSideSpan1_2.innerHTML = " / " + categories.length + "<br>";
                        mainInfoSideItem1.appendChild(mainInfoSideSpan1_2)
                    mainInfoSide.appendChild(mainInfoSideItem1)


                    let mainInfoSideItem2 = document.createElement("div");
                        let mainInfoSideSpan2_1 = document.createElement("span");
                            mainInfoSideSpan2_1.id = "count-links";
                            mainInfoSideSpan2_1.classList.add("MainInfoSpan1-1");
                            mainInfoSideSpan2_1.innerHTML = 0;
                        mainInfoSideItem1.appendChild(mainInfoSideSpan2_1);

                        let mainInfoSideSpan2_2 = document.createElement("span");
                            mainInfoSideSpan2_2.classList.add("MainInfoSpan1-2");
                            mainInfoSideSpan2_2.innerHTML = " / 90";
                        mainInfoSideItem1.appendChild(mainInfoSideSpan2_2)
                    mainInfoSide.appendChild(mainInfoSideItem2)

                mainInfoBar.appendChild(mainInfoSide)

                let mainInfoWrapper = []
                let mainInfoBox = []
                for (let i = 0; i < categories.length; i++) {
                    mainInfoWrapper[i] = document.createElement("div");
                    mainInfoWrapper[i].classList.add("mainInfoWrapper"+i)
                    mainInfoWrapper[i].style.paddingLeft = "2px";
                    mainInfoWrapper[i].style.paddingRight = "2px";
                    mainInfoWrapper[i].style.cssFloat = "left";
                    mainInfoWrapper[i].style.width = (100 / (categories.length) ) + "%";

                    // "category" + i
                    mainInfoBox[i] = document.createElement("a");
                    mainInfoBox[i].innerHTML = "0";
                    mainInfoBox[i].setAttribute("href", "#category" + i)
                    mainInfoBox[i].style.display = "block";
                    mainInfoBox[i].style.width = "100%";
                    mainInfoBox[i].classList.add("mainInfoBox"+i)
                    mainInfoBox[i].style.height = "25px";
                    mainInfoBox[i].style.backgroundColor = "red";
                    mainInfoBox[i].style.border = "1px solid black";
                    mainInfoBox[i].style.fontSize = "16px";
                    mainInfoBox[i].style.fontWeight = "bold";
                    mainInfoBox[i].style.textAlign = "center";


                    mainInfoWrapper[i].appendChild(mainInfoBox[i]);
                    mainInfo.appendChild(mainInfoWrapper[i]);
                }
            }

            function handleInfo(e, category, nr, dataArray) {
                const checkboxes = category.querySelectorAll("tr td input");
                dataArray[nr] = 0;
                for (let i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        dataArray[nr] += 1;
                    }
                }

                let categories = 0;
                let links = 0;
                for (var i = 0; i < dataArray.length; i++) {
                    let thisCategory = document.querySelector(".mainInfoBox"+i)
                    if (dataArray[i] !== 0) {
                        categories += 1
                        links += dataArray[i];
                        thisCategory.style.backgroundColor = "green";
                    } else {
                        thisCategory.style.backgroundColor = "red";
                    }
                    thisCategory.innerHTML = dataArray[i]
                }


                document.getElementById("count-categories").innerHTML = categories;
                document.getElementById("count-links").innerHTML = links;
            }

            const addEventListeners2 = (function(categories, dataArray) {
                for (let i = 0; i < categories.length; i++) {
                    categories[i].id = "category" + i
                    categories[i].addEventListener("click", function(e) {
                        handleInfo(e, categories[i], i, dataArray)
                    }, true);
                }
            })(categories, dataArray)
        }
    })();

} catch (err) {
    console.log(err)
    alert("pageInfo broke")
}
