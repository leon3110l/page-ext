/*
 ---------------------
 singleton addUrlpage
 ---------------------

 -- auto executes h3 remover onload
 -- auto fires addEventListener onload */
const urlpge_Module = (function () {
    return {
        evetListener : (function () {
            const urlForm = document.querySelector('textarea[name="urls"]')
            if (urlForm) {
                urlForm.addEventListener('change', () => {
                    const old = urlForm.value
                    urlorm.value = `${old}.uwpagina.nl\r\n${old}.links.nl\r\n${old}.allepaginas.nl\r\n${old}.beginzo.nl\r\n${old}.linkpaginas.nl\r\n${old}.startsleutel.nl\r\n${old}.zoeklink.nl\r\n${old}.eigenstart.nl\r\n`
                });
            }
        })(),

        h3Unchecker :  (function () {
            const h3Selector = document.querySelector('input[value="h3"]')
            if (h3Seector) {
              h3Selctor.checked = false
            }
        })()
    }
})();
