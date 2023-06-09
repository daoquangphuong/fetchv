(async () => {
    const n = navigator.userAgent.includes("Chrome") ? chrome : browser;
    $("[lang-text]").each(function () {
        var e = $(this), t = $.trim($(this).text());
        e.text(m(t))
    }), $("[lang-title]").each(function () {
        var e = $(this), t = $.trim(e.attr("title"));
        e.attr("title", m(t))
    }), $("[lang-html]").each(function () {
        var e = $(this), t = $.trim($(this).text());
        e.html(m(t))
    });
    let o = await new Promise((t, e) => {
            try {
                n.storage.sync.get(["options"], function (e) {
                    t(e)
                })
            } catch (e) {
                t({})
            }
        }),
        e = (0 < Object.keys(o).length ? o = o.options : (o = await (o = await fetch("../options.json")).json(), n.storage.sync.set({options: o})), await n.i18n.getUILanguage());
    e = e.toLowerCase(), e = o.lang.indexOf(e) < 0 ? "" : "/" + e;
    var t, a;
    await new Promise((t, e) => {
        try {
            n.storage.sync.get(["controller"], function (e) {
                t(e)
            })
        } catch (e) {
            t({})
        }
    });
    for (t in $('[name="min"]').val(o.size.min), $('[name="max"]').val(o.size.max), o.ext) {
        var i = $("[object-ext]"), s = i.clone(!0);
        s.removeClass("d-none").removeAttr("object-ext"), s.find(".form-check-label").text(o.ext[t].name), s.find("input").prop("checked", o.ext[t].checked).val(o.ext[t].name), s.insertBefore(i)
    }
    for (a in o.domain) {
        var c = $("[object-domain]"), r = c.clone(!0);
        r.removeClass("d-none").removeAttr("object-domain"), r.find("input").val(o.domain[a]), r.insertBefore(c)
    }

    function m(e) {
        return n.i18n.getMessage(e)
    }

    $(document).on("click", "[btn-domain-add]", function () {
        var e = $("[object-domain]"), t = e.clone(!0);
        t.removeClass("d-none").removeAttr("object-domain"), t.insertBefore(e)
    }).on("click", "[btn-delete]", function () {
        $(this).parents("tr").remove()
    }).on("click", "[btn-save]", function () {
        let e, t = $("body");
        "" === (e = t.find('[name="min"]').val()) && (e = 0), o.size.min = parseInt(e), "" === (e = t.find('[name="max"]').val()) && (e = 0), o.size.max = parseInt(e), o.ext = [], t.find('[name="ext"]').each(function () {
            (e = $(this)).val() && o.ext.push({name: e.val(), checked: !!e.is(":checked")})
        }), o.domain = [], t.find('[name="domain"]').each(function () {
            (e = $(this).val()) && (e = e.toLowerCase(), o.domain.push(e))
        }), n.storage.sync.set({options: o}, function () {
            n.runtime.sendMessage({
                cmd: "RESET_OPTIONS",
                parameter: {}
            }), $("#layer").removeClass("d-none"), setTimeout(() => {
                $("#layer").addClass("d-none")
            }, 5e3)
        })
    }).on("click", "[btn-reset]", function () {
        n.storage.sync.remove(["options"], async function () {
            o = await (o = await fetch("../options.json")).json(), n.storage.sync.set({options: o}, function () {
                n.runtime.sendMessage({cmd: "RESET_OPTIONS", parameter: {}}), setTimeout(function () {
                    window.location.reload()
                }, 500)
            })
        })
    }).on("click", "[menu-home]", function () {
        n.tabs.create({url: o.site + e})
    }).on("click", "[menu-help]", function () {
        n.tabs.create({url: o.site + e + "/help"})
    })
})();