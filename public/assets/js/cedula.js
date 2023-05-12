$(document).ready(function () {
    const txtCedula = $("#txtCedula")

    txtCedula.on("keyup", e => {
        const selected = window.getSelection().toString();
        if (selected != '') return;

        if ($.inArray(e.keyCode, [38, 40, 37, 39]) != -1) return;

        let cedula = txtCedula.val();
        cedula = cedula.replace(/[\D\s\._\-]+/g, "");

        //000-0000000-0
        if (cedula.length > 3) {
            const cedarr = cedula.split("")
            if (cedarr[3] != "-") {
                cedarr[2] = cedarr[2] + "-"
            }

            cedula = cedarr.join("")
        }

        if (cedula.length > 11) {
            const cedarr = cedula.split("")
            if (cedarr[11] != "-") {
                cedarr[10] = cedarr[10] + "-"
            }

            cedula = cedarr.join("")
        }

        if (cedula.length > 13) {
            const cedarr = cedula.split("")
            let newCed = "";
            for (let i = 0; i < 13; i++) {
                newCed += cedarr[i];
            }

            cedula = newCed
        }

        txtCedula.val(cedula)
    })
})