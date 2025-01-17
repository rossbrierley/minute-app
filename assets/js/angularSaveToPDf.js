angular.module("htmlToPdfSave", []), angular.module("htmlToPdfSave").directive("pdfSaveButton", ["$rootScope", "$pdfStorage", function(t, e) {
    return {
        restrict: "A",
        link: function(n, o, a) {
            e.pdfSaveButtons.push(o), n.buttonText = "Button", o.on("click", function() {
                var e = a.pdfSaveButton;
                t.$broadcast("savePdfEvent", {
                    activePdfSaveId: e
                })
            })
        }
    }
}]), angular.module("htmlToPdfSave").directive("pdfSaveContent", ["$rootScope", "$pdfStorage", function(t, e) {
    return {
        link: function(t, n, o) {
            e.pdfSaveContents.push(n);
            var a = t.$on("savePdfEvent", function(t, o) {
                function a(t, e) {
                    return t == e
                }

                function d(t, e) {
                    f(t, e)
                }

                function f(t, e) {
                    function n() {
                        o().then(function(t) {
                            console.log("resolved get canvas");
                            var e = t.toDataURL("image/png"),
                                n = new jsPDF({
                                    unit: "px",
                                    format: "a4"
                                });
                            n.addImage(e, "JPEG", 20, 20), n.save("minutes.pdf"), a.width(d)
                        })
                    }

                    function o() {
                        return a.width(1.33333 * f[0] - 80).css("max-width", "none"), html2canvas(a, {
                            imageTimeout: 2e3,
                            removeContainer: !0
                        })
                    }
                    var a = $("[pdf-save-content=" + e + "]"),
                        d = a.width(),
                        f = [595.28, 841.89];
                    $("body").scrollTop(0), n()
                }
                for (var i = n, r = i[0].getAttribute("pdf-save-content"), u = e.pdfSaveContents, v = o.activePdfSaveId, c = 0; c < u.length; c++)
                    if (a(v, r)) {
                        var s = u[c],
                            p = s[0],
                            l = p.getAttribute("pdf-save-content");
                        if (a(l, v)) {
                            console.log("Id is same"), d(u, l);
                            break
                        }
                    }
            });
            t.$on("$destroy", a)
        }
    }
}]), angular.module("htmlToPdfSave").service("$pdfStorage", function() {
    this.pdfSaveButtons = [], this.pdfSaveContents = []
}).service("pdfSaveConfig", function() {
    this.pdfName = "default.pdf"
});