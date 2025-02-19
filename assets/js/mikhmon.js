$(".main").fadeIn(400), $(".main-mobile").fadeIn(400);
const isAndroid = () => !!navigator.userAgent.match(/android/i),
    isIphone = () => !!navigator.userAgent.match(/iphone/i),
    isIpad = () => !!navigator.userAgent.match(/ipad/i),
    isMobile = () => !!isAndroid() || (!!isIphone() || !!isIpad());
var today = new Date,
    dd = String(today.getDate()).padStart(2, "0"),
    mm = Number(today.getMonth()),
    yyyy = today.getFullYear(),
    mmm = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
    hh = today.getHours(),
    thisMonth = mm + 1 + "/" + yyyy;

function cancelPage() {
    window.stop()
}

function openPage(t) {
    closePage = setInterval(function() {
        window.stop()
    }, 100), setTimeout(function() {
        clearInterval(closePage), window.location.href = t
    }, 500)
}
var url = window.location.href;
if (url.indexOf("?") > 0) var session = "?" + url.split("?")[1].split("/")[0],
    path = url.split("?")[1].split("/")[1];
localStorage.setItem(session + "_profn", 0);
var currency = localStorage.getItem(session + "_curr"),
    theme = localStorage.getItem(session + "_theme");
localStorage.setItem(session + "AutoReload", 0), localStorage.setItem(session + "_force", "false"), localStorage.getItem(session + "_iface") ? "Select Interface" == localStorage.getItem(session + "_iface") && $("#iface-name").append("<option>Select Interface</option>") : (localStorage.setItem(session + "_iface", "Select Interface"), $("#iface-name").append("<option>Select Interface</option>")), localStorage.setItem(session + "_profn", 0), txrx = '[{"name":"Tx","data":["0"]},{"name":"Rx","data":["0"]}]', localStorage.setItem(session + "_traffic_data", txrx);
var ax = $(".sidenav div:first-child"),
    bx = $("title");

function dashboard() {
    $("#sessionload") && $("#sessionLoad").html(session.split("?")[1].toUpperCase() + "&nbsp;");
    var t = localStorage.getItem(session + "_iface");
    localStorage.setItem(session + "_NetInfo", 0), $("#applog").append("<tr><td>" + timeStamp() + "</td><td>Loading System Resource</td></tr>"), scrollD();
    var e = "",
        s = "";
    $.get(session + "/get_sys_resource", function(t) {
        var o = jesD.dec(t);
        if ("[" == o.substring(0, 1)) t = JSON.parse(o);
        else t = JSON.parse(o.substring(1, o.length));
        try {
            $("#time").html(t.systime.time), $("#date").html(ucFirst(t.systime.date)), $("#time-zone").html(t.systime["time-zone-name"]), $("#identity").html(t.identity), $("#uptime").html(timeNice(t.resource.uptime)), $("#board-name").html(t.resource["board-name"]), $("#model").html(t.model), $("#version").html(t.resource.version), $("#cpu-load").html(t.resource["cpu-load"] + "% " + t.resource["cpu-count"] + "x " + t.resource["cpu-frequency"] + " MHz"), $("#memory").html(formatBytes(t.resource["free-memory"]) + " / " + formatBytes(t.resource["total-memory"])), $("#hdd").html(formatBytes(t.resource["free-hdd-space"]) + " / " + formatBytes(t.resource["total-hdd-space"])), $("#prog-cpu").css("width", t.resource["cpu-load"] + "%"), $("#prog-memory").css("width", 100 - Number(t.resource["free-memory"]) / Number(t.resource["total-memory"]) * 100 + "%"), $("#prog-hdd").css("width", 100 - Number(t.resource["free-hdd-space"]) / Number(t.resource["total-hdd-space"]) * 100 + "%"), t.syshealth.voltage ? (e = t.syshealth.voltage + "V", s = t.syshealth.temperature + "&#8451;") : (e = "-", s = "-"), $("#voltage").html(e), $("#temperature").html(s)
        } catch (t) {
            scrollD()
        }
    }).fail(function() {
        console.log("get_resource"), location.href = "./?admin/settings/&r=" + session.split("?")[1], $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_resource : timeout</td></tr>'), scrollD()
    }).always(function() {
        $("#applog").append("<tr><td>" + timeStamp() + "</td><td>Loading Hotspot Info</td></tr>"), scrollD(), $.get(session + "/get_hotspotinfo", function(t) {
            var e = jesD.dec(t);
            if ("[" == e.substring(0, 1)) t = JSON.parse(e);
            else t = JSON.parse(e.substring(1, e.length));
            try {
                isMobile() ? ($("#hotspot-active").html(nFormatMobile(t.hotspot_active)), $("#hotspot-users").html(nFormatMobile(t.hotspot_users))) : ($("#hotspot-active").html(nFormat(t.hotspot_active)), $("#hotspot-users").html(nFormat(t.hotspot_users)))
            } catch (t) {
                console.log("get_hotspotinfo"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_hotspotinfo : timeout</td></tr>'), scrollD()
            }
        }).fail(function() {
            console.log("get_hotspotinfo"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_hotspotinfo : timeout</td></tr>'), scrollD()
        }).always(function() {
            $("#applog").append("<tr><td>" + timeStamp() + "</td><td>Loading Traffic " + t + "</td></tr>"), scrollD(), $.getJSON(session + "/get_traffic/&iface=" + t, function(t) {
                try {
                    txrx = '[{"name":"Tx","data":["' + t.tx + '"]},{"name":"Rx","data":["' + t.rx + '"]}]', localStorage.setItem(session + "_traffic_data", txrx)
                } catch (t) {
                    console.log("get_traffic"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_traffic : timeout</td></tr>'), scrollD()
                }
            }).fail(function() {
                console.log("get_traffic"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_traffic : timeout</td></tr>'), scrollD()
            }).always(function() {
                var e = localStorage.getItem(session + "_force");
                $("#applog").append("<tr><td>" + timeStamp() + "</td><td>Loading System Log</td></tr>"), scrollD(), $.get(session + "/get_log&f=" + e, function(t) {
                    var e = jesD.dec(t);
                    t = JSON.parse("[" + e.substring(e.lastIndexOf("[") + 1, e.lastIndexOf("]")) + "]");
                    try {
                        for ($("#log").html(""), i = 0; i < 30; i++)
                            if ("->" == t[i].message.substring(0, 2)) {
                                var s = t[i].message.substring(3, t[i].message.length).split("):")[0] + ")",
                                    o = t[i].message.substring(3, t[i].message.length).split("):")[1].replace("trying to", "");
                                $("#log").append("\n                                                        <tr>\n                                                            <td>" + t[i].time + "</td>\n                                                            <td>" + s + "</td>\n                                                            <td>" + o + "</td>\n                                                        </tr>")
                            }
                    } catch (t) {}
                }).fail(function() {
                    console.log("get_log"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_log : timeout</td></tr>'), scrollD()
                }).always(function() {
                    var e = localStorage.getItem(session + "-report"),
                        s = "",
                        o = performance.now();
                    localStorage.setItem(session + "_report_loadtime", o);
                    var a = localStorage.getItem(session + "_force"),
                        r = new Date,
                        n = String(r.getDate()).padStart(2, "0"),
                        i = Number(r.getMonth()),
                        l = r.getFullYear(),
                        c = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
                        d = c[i] + "/" + n + "/" + l;
                    "enable" == e ? (s = "/get_livereport/&month=" + (c[i] + l) + "&f=" + a, $("#applog").append("<tr><td>" + timeStamp() + "</td><td>Loading Report " + (c[i] + " " + l).capitalize() + "</td></tr>"), scrollD()) : "disable" == e && (s = "/get_livereport_disable"), $.get(session + s, function(t) {
                        var e = jesD.dec(t),
                            s = (t = JSON.parse("[" + e.substring(e.lastIndexOf("[") + 1, e.lastIndexOf("]")) + "]"), 0),
                            o = 0;
                        try {
                            $.each(t, function(t, e) {
                                s += parseInt(e.name.split("-|-")[3]), e.source == d && (o += parseInt(e.name.split("-|-")[3]))
                            }), isMobile(), $("#live-report-month").html(currencyFormat(s, currency)), $("#live-report-day").html(currencyFormat(o, currency))
                        } catch (t) {
                            console.log("get_livereport"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">Loading Report : timeout</td></tr>'), scrollD()
                        }
                    }).fail(function() {
                        console.log("get_livereport"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">Loading Report : timeout</td></tr>'), scrollD()
                    }).always(function() {
                        performance.now() - localStorage.getItem(session + "_report_loadtime") > 29e3 && ($("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">Loading Report : timeout</td></tr>'), scrollD()), localStorage.setItem(session + "_force", "true"), $.getJSON(session + "/get_traffic/&iface=" + t, function(t) {
                            try {
                                txrx = '[{"name":"Tx","data":["' + t.tx + '"]},{"name":"Rx","data":["' + t.rx + '"]}]', localStorage.setItem(session + "_traffic_data", txrx)
                            } catch (t) {
                                console.log("get_traffic"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_traffic : timeout</td></tr>'), scrollD()
                            }
                        }).fail(function() {
                            console.log("get_traffic"), $("#applog").append("<tr><td>" + timeStamp() + '</td><td style="color:#f86c6b;">get_traffic : timeout</td></tr>'), scrollD(), localStorage.setItem(session + "_NetInfo", "504")
                        }).always(function() {
                            "504" != localStorage.getItem(session + "_NetInfo") && setTimeout(function() {
                                dashboard()
                            }, 1e4), localStorage.getItem(session + "_cache_user_profiles") && "" != localStorage.getItem(session + "_cache_user_profiles") ? forceCaching() : (localStorage.setItem(session + "_cache_user_profiles", timeStamp()), cachingUProfile())
                        })
                    })
                })
            })
        })
    })
}

function trafficMonitor(t) {
    $(document).ready(function() {
        var e;
        "light" == t ? Highcharts.setOptions(light) : "dark" == t ? Highcharts.setOptions(dark) : "blue" == t ? Highcharts.setOptions(blue) : "green" == t ? Highcharts.setOptions(green) : "pink" == t && Highcharts.setOptions(pink), Highcharts.setOptions({
            global: {
                useUTC: !1
            }
        }), Highcharts.addEvent(Highcharts.Series, "afterInit", function() {
            this.symbolUnicode = {
                circle: "●",
                diamond: "♦",
                square: "■",
                triangle: "▲",
                "triangle-down": "▼"
            } [this.symbol] || "●"
        }), e = new Highcharts.Chart({
            chart: {
                renderTo: "trafficMonitor",
                animation: Highcharts.svg,
                type: "areaspline",
                events: {
                    load: function() {
                        window.ifaceI = setInterval(function() {
                            var t = localStorage.getItem(session + "_traffic_data"),
                                s = JSON.parse(t);
                            if (s.length > 0) {
                                var o = parseInt(s[0].data),
                                    a = parseInt(s[1].data),
                                    r = (new Date).getTime();
                                try {
                                    shift = e.series[0].data.length > 25, e.series[0].addPoint([r, o], !0, shift), e.series[1].addPoint([r, a], !0, shift), clearInterval(window.ifaceI)
                                } catch (t) {}
                            }
                            window.ifaceII = setInterval(function() {
                                var t = localStorage.getItem(session + "_traffic_data"),
                                    s = JSON.parse(t);
                                if (s.length > 0) {
                                    var o = parseInt(s[0].data),
                                        a = parseInt(s[1].data),
                                        r = (new Date).getTime();
                                    try {
                                        shift = e.series[0].data.length > 25, e.series[0].addPoint([r, o], !0, shift), e.series[1].addPoint([r, a], !0, shift)
                                    } catch (t) {}
                                }
                            }, 5e3)
                        }, 1500)
                    }
                }
            },
            title: {
                text: ""
            },
            xAxis: {
                type: "datetime",
                tickPixelInterval: 150,
                maxZoom: 2e4
            },
            yAxis: {
                minPadding: .2,
                maxPadding: .2,
                title: {
                    text: null
                },
                labels: {
                    formatter: function() {
                        var t = this.value;
                        if (0 == t) return "0 bps";
                        var e = parseInt(Math.floor(Math.log(t) / Math.log(1024)));
                        return parseFloat((t / Math.pow(1024, e)).toFixed(2)) + " " + ["bps", "kbps", "Mbps", "Gbps", "Tbps"][e]
                    }
                }
            },
            series: [{
                name: "Tx",
                data: [],
                marker: {
                    symbol: "circle"
                }
            }, {
                name: "Rx",
                data: [],
                marker: {
                    symbol: "circle"
                }
            }],
            tooltip: {
                formatter: function() {
                    var t = [];
                    return $.each(this.points, function(e, s) {
                        var o = s.y;
                        0 == o && t.push('<span style="color:' + this.series.color + '; font-size: 1.5em;">' + this.series.symbolUnicode + "</span><b>" + this.series.name + ":</b> 0 bps");
                        e = parseInt(Math.floor(Math.log(o) / Math.log(1024)));
                        t.push('<span style="color:' + this.series.color + '; font-size: 1.5em;">' + this.series.symbolUnicode + "</span><b>" + this.series.name + ":</b> " + parseFloat((o / Math.pow(1024, e)).toFixed(2)) + " " + ["bps", "kbps", "Mbps", "Gbps", "Tbps"][e])
                    }), "<b>Traffic Monitor</b><br /><b>Time: </b>" + Highcharts.dateFormat("%H:%M:%S", new Date(this.x)) + "<br />" + t.join(" <br/> ")
                },
                shared: !0
            }
        })
    })
}

function getExpMode(t) {
    return a = ["rem", "remc", "ntf", "ntfc", "noexp", ""].indexOf(t), ["Remove", "Remove & Record", "Notice", "Notice & Record", "", ""][a]
}

function loadInterface() {
    $.get(session + "/get_interface", function(t) {
        var e = jesD.dec(t);
        if ("[" == e.substring(0, 1)) t = JSON.parse(e);
        else t = JSON.parse(e.substring(1, e.length));
        $.each(t, function(t, e) {
            var s = localStorage.getItem(session + "_iface");
            if ("<" !== e.name[0]) {
                if (e.name == s) var o = "selected";
                $("#iface-name").append("<option " + o + ">" + e.name + "</option>")
            }
        })
    })
}

function loadUProfiles(t = "false") {
    localStorage.setItem(session + "_force", t), $("#loading").html("Loading user profiles..."), $("#add_usrprofile").html("");
    var e, s, o, a, r, n, i = "";
    $("#select-profile").html("").append('<option value="" >Profile</option>'), $.get(session + "/profiles&f=" + t, function(t) {
        var l = jesD.dec(t);
        if ("[" == l.substring(0, 1)) t = JSON.parse(l);
        else t = JSON.parse(l.substring(1, l.length));
        var c = [];
        $.each(t, function(t, l) {
            c.push('"' + l.name + '"'), $("#select-profile").append('<option value="' + l.name + '" >' + l.name + "</option>"), l.comment ? l.comment : "", e = l["rate-limit"] ? l["rate-limit"] : "", l["on-login"] && ":put" == l["on-login"].substring(0, 4) ? (s = l["on-login"].split('("')[1].split('")')[0].split(","), o = getExpMode(s[1]), a = s[3], "0" == s[2] || "" == s[2] ? r = "" : Number(s[2]) > 0 && (r = priceFormat(Number(s[2]), currency)), "0" == s[4] || "" == s[4] ? n = "" : Number(s[4]) > 0 && (n = priceFormat(Number(s[4]), currency)), i = s[6], serverLock = s[7]) : (o = "", a = "", r = "", n = "", i = "", serverLock = ""), isMobile() ? ($("#pload").html($("#btn-user-profiles").html() + ' <span id="exp_mon">'), $("#profiles").append("\n          <tr class='yes'><td ><div class=\"box-mobile\" onclick=\"openUserProfile('" + l[".id"] + '\')">\n          Name: <span id="' + t + '"></span> <b>' + l.name + "</b><br>\n          Shared Users: " + l["shared-users"] + "<br>\n          Rate Limit: " + e + "<br>\n          Expire Mode: " + o + "<br>\n          Validity: " + a + "<br>\n          Price | Selling Price: " + r + " | \n          " + n + "<br>\n          Lock User | Lock Server: " + i + " | " + serverLock + "<br>\n          </div>\n          </td>\n          </tr>\n          \n          ")) : $("#profiles").append("\n          <tr class='yes'>\n          <td class='text-center'><span class='pointer' onclick=\"removeProfile('" + l[".id"] + "','" + l.name + "')\"><i class='fa fa-minus-square text-danger'></i></span></td>\n          <td><span class=\"pointer\" onclick=\"openUserProfile('" + l[".id"] + '\')"><i class="fa fa-external-link"></i> ' + l.name + "</span></td>\n          <td>" + l["shared-users"] + "</td>\n          <td>" + e + "</td>\n          <td>" + o + '</td>\n          <td class="text-right">' + a + '</td>\n          <td class="text-right">' + r + '</td>\n          <td class="text-right">' + n + "</td>\n          <td>" + i + "</td>\n          <td>" + serverLock + "</td>\n          </tr>\n          \n          "), $("#add_usrprofile").append('<option value="' + l.name + '" >' + l.name + "</option>")
        });
        var d = "[" + c.join(",") + "]";
        localStorage.setItem(session + "_temp_user_profiles", d), localStorage.setItem(session + "_tot_user_profiles", JSON.parse(d).length)
    }).always(function() {
        countTableRow("profiles"), updateTable("searchProfiles"), $("#profiles").fadeIn(200), $("#loading").html(""), $("#add_hserver").html("<option value='all'>all</option>"), $.get(session + "/get_hotspot_server&f=" + t, function(t) {
            var e = jesD.dec(t);
            if ("[" == e.substring(0, 1)) t = JSON.parse(e);
            else t = JSON.parse(e.substring(1, e.length));
            var s = [];
            $.each(t, function(t, e) {
                s.push('"' + e.name + '"'), $("#add_hserver").append('<option value="' + e.name + '" >' + e.name + "</option>")
            });
            var o = "[" + s.join(",") + "]";
            localStorage.setItem(session + "_temp_hotspot_server", o)
        })
    })
}

function loadUserProfiles(t = "false") {
    $("#profiles").html(""), $("#total-profiles").html("0"), menuNonActive("hotspot-active"), menuNonActive("hotspot-users"), menuActive("user-profiles"), menuNonActive("hotspot-hosts"), loadUProfiles(t), clearTimeout(window.auto_hotspot_active), clearTimeout(window.auto_hotspot_hosts), $.getJSON(session + "/get_expire_mon", function(t) {
        "ok" == t.expire_monitor ? $("#exp_mon").html('<i class="fa fa-ci fa-circle text-green" title="Expire users monitor is activated."></i>') : ($("#exp_mon").html('<i class="fa fa-ci fa-circle text-orange" title="Expire users monitor is not activated."></i>'), $("#btn-exp-mon").html('<button class="bg-btn-group" onclick="setExpMon()"><i class="fa fa-gear" ></i> Set Expire Monitor</button>'))
    })
}

function cachingUProfile() {
    $("#applog").append("<tr><td>" + timeStamp() + "</td><td>Caching User Profiles</td></tr>"), $.get(session + "/profiles&f=true", function(t) {
        localStorage.setItem(session + "_cache_user_profiles", timeStamp());
        var e = jesD.dec(t);
        if ("[" == e.substring(0, 1)) t = JSON.parse(e);
        else t = JSON.parse(e.substring(1, e.length));
        var s = [];
        $.each(t, function(t, e) {
            s.push('"' + e.name + '"')
        });
        var o = "[" + s.join(",") + "]";
        localStorage.setItem(session + "_temp_user_profiles", o), localStorage.setItem(session + "_tot_user_profiles", JSON.parse(o).length), scrollD()
    }).always(function() {
        var t = localStorage.getItem(session + "_temp_user_profiles"),
            e = JSON.parse(t);
        localStorage.setItem(session + "_profn", 0), $("#applog").append("<tr><td>" + timeStamp() + "</td><td>1/" + e.length + " Caching users in profile " + e[0] + "</td></tr>"), cachingUsers(e[0]), scrollD(), $.getJSON(session + "/get_tot_users", function(t) {
            localStorage.setItem(session + "_tot_users", t.users)
        })
    })
}

function forceCaching() {
    $.getJSON(session + "/get_tot_users", function(t) {
        localStorage.setItem(session + "_c_tot_users", t.users)
    }).always(function() {
        diffct(localStorage.getItem(session + "_cache_user_profiles")) > 4 && Number(localStorage.getItem(session + "_tot_users")) != Number(localStorage.getItem(session + "_c_tot_users")) && cachingUProfile()
    })
}

function loadUsersPPF(t = "false") {
    localStorage.setItem(session + "_profn", 0), localStorage.setItem(session + "_force", t), $("#users").fadeOut(200), $("#users").html(""), $("#total-users").html("0"), $("#select-comment").html(""), $("#select-comment").append('<option value="">Comment</option>'), menuNonActive("hotspot-active"), menuActive("hotspot-users"), menuNonActive("user-profiles"), menuNonActive("hotspot-hosts");
    var e = localStorage.getItem(session + "_temp_user_profiles");
    t = localStorage.getItem(session + "_force");
    getUsers(JSON.parse(e)[0], t)
}

function loadUsersPP(t = "false") {
    if (localStorage.setItem(session + "_force", t), menuNonActive("hotspot-active"), menuActive("hotspot-users"), menuNonActive("user-profiles"), menuNonActive("hotspot-hosts"), isMobile() && $("#pload").html($("#btn-hotspot-users").html()), $("#select-comment").append('<option value="">Comment</option>'), clearTimeout(window.auto_hotspot_active), clearTimeout(window.auto_hotspot_hosts), Number(localStorage.getItem(session + "_profn")) < 1) {
        loadUProfiles(t), $("#users").fadeOut(200), $("#users").html("");
        var e = localStorage.getItem(session + "_temp_user_profiles");
        getUsers(JSON.parse(e)[0], t)
    } else Number(localStorage.getItem(session + "_profn")) > 0 && "<tr>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td></tr>" == $("#users").html().trim() && loadUsersPPF()
}

function removeDuplicate(t) {
    return t.filter(function(e, s) {
        return t.indexOf(e) == s
    })
}

function getUsers(t) {
    var e = localStorage.getItem(session + "_force");
    $("#loading").html("Loading  " + (Number(localStorage.getItem(session + "_profn")) + 1) + " / " + localStorage.getItem(session + "_tot_user_profiles") + " : user with profile " + t + "...");
    var s, o, a;
    $.get(session + "/users/&prof=" + t + "&f=" + e, function(t) {
        var e = jesD.dec(t),
            r = (t = JSON.parse("[" + e.substring(e.lastIndexOf("[") + 1, e.lastIndexOf("]")) + "]"), []);
        $.each(t, function(t, e) {
            e.comment ? (s = e.comment, r.push('"' + e.comment + '"')) : s = "", o = "1s" == e["limit-uptime"] ? "expired" : "", e.server ? server = e.server : server = "all", a = "true" == e.disabled ? "<span title='X - disabled'>X</span>" : "", e["limit-uptime"] ? timeLimit = e["limit-uptime"] : timeLimit = "", e["mac-address"] ? macaddr = e["mac-address"] : macaddr = "", e["limit-bytes-total"] ? dataLimit = formatBytes(e["limit-bytes-total"]) : dataLimit = "", isMobile() ? ($("#pload").html($("#btn-hotspot-users").html()), $("#users").append("\n            <tr class='yes'><td ><div class=\"box-mobile\" onclick=\"openUser('" + e[".id"] + "')\">\n            Server: " + server + "<br>\n            User: <b onclick=\"openUser('" + e[".id"] + "')\">" + e.name + "</b><br>\n            Profile: " + e.profile + "<br>\n            MAC Address: " + macaddr + "<br>\n            Uptime: " + timeNice(e.uptime) + "<br>\n            Bytes In: " + formatBytes(e["bytes-in"]) + "<br>\n            Bytes Out: " + formatBytes(e["bytes-out"]) + "<br>\n            Comment: <span class='pointer' title='Filter by " + s + "' onclick='setC(\"" + s + "\")'>" + s + "</span> " + dataLimit + " " + timeLimit + " " + o + "<br>\n            </div>\n            </td>\n            </tr>\n            \n            ")) : $("#users").append("\n            <tr class='yes'>\n            <td class='text-center'><span class='pointer' onclick=\"removeUser('" + e[".id"] + "','" + e.name + "','" + e.profile + "')\"><i class='fa fa-minus-square text-danger'></i></span></td>\n            <td class='text-center'>" + a + "</td>\n            <td>" + server + '</td>\n            <td><span class="pointer" onclick="openUser(\'' + e[".id"] + '\')" title="Open user ' + e.name + '"><i class="fa fa-external-link"></i> ' + e.name + "</span></td>\n            <td>" + e.profile + "</td>\n            <td>" + macaddr + "</td>\n            <td class='text-right' >" + timeNice(e.uptime) + "</td>\n            <td class='text-right'>" + formatBytes(e["bytes-in"]) + "</td>\n            <td class='text-right'>" + formatBytes(e["bytes-out"]) + "</td>\n            <td><span class='pointer' title='Filter by " + s + "' onclick='setC(\"" + s + "\")'>" + s + "</span> " + dataLimit + " " + timeLimit + " " + o + "</td>\n            </tr>\n            \n            ")
        });
        var n = removeDuplicate(r.join(",").split(","));
        $.each(n, function(t, e) {
            "/" !== (e = e.replace(/"/g, "").replace(/''/g, "")).substring(4, 3) && "/" !== e.substring(7, 6) && "" != e && $("#select-comment").append('<option value="' + e.split(" *")[0] + '" >' + e + "</option>")
        }), countTableRow("users"), $("#users").fadeIn(200)
    }).fail(function() {
        console.log("get_users profile" + t)
    }).always(function() {
        var t = Number(localStorage.getItem(session + "_tot_user_profiles")),
            e = localStorage.getItem(session + "_temp_user_profiles"),
            s = JSON.parse(e),
            o = Number(localStorage.getItem(session + "_profn")) + 1;
        localStorage.setItem(session + "_profn", o), o < t ? (getUsers(s[o]), updateTable("searchUsers")) : ($("#loading").html("&nbsp;"), countTableRow("users"), updateTable("searchUsers"))
    })
}

function cachingUsers(t) {
    $.get(session + "/users/&prof=" + t + "&f=true", function(t) {}).always(function() {
        var t = Number(localStorage.getItem(session + "_tot_user_profiles")),
            e = localStorage.getItem(session + "_temp_user_profiles"),
            s = JSON.parse(e);
        profn = Number(localStorage.getItem(session + "_profn")) + 1, localStorage.setItem(session + "_profn", profn), profn < t && ($("#applog").append("<tr><td>" + timeStamp() + "</td><td>" + (profn + 1) + "/" + s.length + " Caching Users in profile " + s[profn] + "</td></tr>"), cachingUsers(s[profn])), scrollD()
    })
}

function clearAuto(t) {
    clearInterval(t)
}

function loadHotspotActive() {
    menuActive("hotspot-active"), menuNonActive("hotspot-users"), menuNonActive("user-profiles"), menuNonActive("hotspot-hosts"), clearTimeout(window.auto_hotspot_hosts), clearTimeout(window.auto_hotspot_active), getHospotActive()
}

function getHospotActive() {
    $("#active").fadeOut(200), $("#active").html(""), $("#loading").html("Loading hotspot active...");
    var t, e = "";
    $.get(session + "/get_hotspot_active", function(s) {
        var o = jesD.dec(s),
            a = (s = JSON.parse("[" + o.substring(o.lastIndexOf("[") + 1, o.lastIndexOf("]")) + "]"), []);
        $.each(s, function(s, o) {
            t = o.comment ? o.comment : "", e = o["time-left"] ? o["time-left"] : "", a.push('"' + o.server + '"'), isMobile() ? ($("#pload").html($("#btn-hotspot-active").html()), $("#active").append("\n         <tr class='yes' id=\"" + o.user + '"><td>\n         <div class="box-mobile">\n         <div>\n         Server: ' + o.server + "<br>\n         User: <b>" + o.user + "</b><br>\n         Address: " + o.address + "<br>\n         MAC Address: " + o["mac-address"] + "<br>\n         Uptime: " + timeNice(o.uptime) + '<span style="float:right"  onclick="detHA(\'d' + s + '\')">&nbsp <span id="td' + s + '"><i  class="fa fa-caret-down"></i> more</span></span><br>\n         </div>\n         <div style="display:none" id="d' + s + '">\n         Bytes In: ' + formatBytes(o["bytes-in"]) + "<br>\n         Bytes Out: " + formatBytes(o["bytes-out"]) + "<br>\n         Time Left: " + e + "<br>\n         Login By: " + o["login-by"] + "<br>\n         Comment: " + t + "<br>\n         </div>\n         </div>\n         </td>\n         </tr>\n         \n         ")) : $("#active").append("\n         <tr class='yes' id=\"" + o.user + "\">\n         <td class='text-center'><span class='pointer' onclick=\"removeActive('" + o[".id"] + "','" + o.user + "')\"><i class='fa fa-minus-square text-danger'></i></span></td>\n         <td>" + o.server + '</td>\n         <td><span class="pointer" onclick="openUser(\'' + o.user + "','uname')\">" + o.user + "</span></td>\n         <td>" + o.address + "</td>\n         <td>" + o["mac-address"] + "</td>\n         <td class='text-right' >" + timeNice(o.uptime) + "</td>\n         <td class='text-right'>" + formatBytes(o["bytes-in"]) + "</td>\n         <td class='text-right'>" + formatBytes(o["bytes-out"]) + "</td>\n         <td>" + e + "</td>\n         <td>" + o["login-by"] + "</td>\n         <td>" + t + "</td>\n         </tr>\n         \n         ")
        }), $("#select-server").html('<option value="" >Server</option>');
        var r = removeDuplicate(a.join(",").split(","));
        $.each(r, function(t, e) {
            e = e.replace(/"/g, "").replace(/''/g, ""), $("#select-server").append('<option value="' + e + '" >' + e + "</option>")
        }), countTableRow("active"), $("#active").fadeIn(200)
    }).always(function() {
        $("#loading").html(""), updateTable("searchActive"), window.auto_hotspot_active = setTimeout(function() {
            getHospotActive()
        }, 3e4)
    })
}

function loadHotspotHosts() {
    menuActive("hotspot-hosts"), menuNonActive("hotspot-active"), menuNonActive("hotspot-users"), menuNonActive("user-profiles"), clearTimeout(window.auto_hotspot_hosts), clearTimeout(window.auto_hotspot_active), getHospotHosts()
}

function getHospotHosts() {
    $("#hosts").fadeOut(200), $("#hosts").html(""), $("#loading").html("Loading hotspot hosts...");
    var t, e, s, o, a, r, n, i, l, c = "";
    $.get(session + "/get_hosts", function(d) {
        var p = jesD.dec(d);
        d = JSON.parse("[" + p.substring(p.lastIndexOf("[") + 1, p.lastIndexOf("]")) + "]");
        $.each(d, function(d, p) {
            c = p.comment ? p.comment : "", "true" == p.DHCP ? (t = " H", e = ", H - DHCP") : (t = "", e = ""), "true" == p.authorized ? (s = " A", o = " A - authorized") : (s = "", o = ""), "true" == p.bypassed ? (a = " P", r = ", P - bypassed") : (a = "", r = ""), "true" == p.dynamic ? (n = " D", i = ", D - dynamic") : (n = "", i = ""), l = '<span title="' + o + e + r + i + '">' + s + t + a + n + '</span><span style="display:none;">' + o + e + r + i + "</span>", isMobile() ? ($("#pload").html($("#btn-hotspot-hosts").html()), $("#hosts").append("\n         <tr class='yes'><td><div class=\"box-mobile\">\n         Status: " + l + "<br>\n         MAC Address: " + p["mac-address"] + "<br>\n         Address: " + p.address + "<br>\n         To Address: " + p["to-address"] + "<br>\n         Server: " + p.server + "<br>\n         Comment: " + c + "<br>\n         </div>\n         </td>\n         </tr>\n         \n         ")) : $("#hosts").append("\n         <tr class='yes'>\n         <td class='text-center'><span class='pointer' onclick=\"removeHost('" + p[".id"] + "','" + p["mac-address"] + "')\"><i class='fa fa-minus-square text-danger'></i></span></td>\n         <td class=\"text-center\">" + l + "</td>\n         <td>" + p["mac-address"] + "</td>\n         <td>" + p.address + "</td>\n         <td>" + p["to-address"] + "</td>\n         <td>" + p.server + "</td>\n         <td>" + c + "</td>\n         </tr>\n         \n         ")
        }), countTableRow("hosts"), $("#hosts").fadeIn(200)
    }).always(function() {
        $("#loading").html(""), updateTable("searchHosts"), window.auto_hotspot_hosts = setTimeout(function() {
            getHospotHosts()
        }, 3e4)
    })
}

function loadLog() {
    $("#loading").html("Loading Logs..."), $.get(session + "/get_log&f=true", function(t) {
        var e = jesD.dec(t);
        t = JSON.parse("[" + e.substring(e.lastIndexOf("[") + 1, e.lastIndexOf("]")) + "]");
        try {
            for ($("#log").fadeOut(200), $("#log").html(""), i = 0; i < 200; i++) "->" == t[i].message.substring(0, 2) && (isMobile() ? $("#log").append("<tr class='yes'><td>" + t[i].time + " <b>" + t[i].message.substring(3, 200).split("):")[0] + ")</b> <br>" + t[i].message.substring(3, 200).split("):")[1].replace("trying to", "") + "</td></tr>") : $("#log").append("<tr class='yes'><td>" + t[i].time + "</td><td>" + t[i].message.substring(3, 200).split("):")[0] + ")</td><td>" + t[i].message.substring(3, 200).split("):")[1].replace("trying to", "") + "</td></tr>"))
        } catch (t) {
            console.log("connection timeout")
        }
        countTableRow("log"), $("#log").fadeIn(200)
    }).always(function() {
        $("#loading").html(""), updateTable("searchLog")
    })
}

function loadSReport(t, e = "false") {
    menuActive("selling-report"), menuNonActive("report-resume"), localStorage.setItem(session + "_force", e), localStorage.setItem(session + "_day_report", 0), $("#report").html(""), "true" == e && (localStorage.setItem(session + "_resume_report", ""), filterTableReport("report", "searchReport", "", "count-report"), document.getElementById("year").selectedIndex = "0", document.getElementById("month").selectedIndex = mm, document.getElementById("day").selectedIndex = "0", setDay("day"), $("#report").fadeOut(200), $("#report").html("")), getReport(t, e)
}

function getReport(t, e = "false") {
    var s, o = t.split("/")[0],
        a = t.split("/")[1],
        r = "";
    if (t == thisMonth) {
        var n = new Date;
        s = String(n.getDate()).padStart(2, "0")
    } else t != thisMonth && (s = daysInMonth(o, a));
    var i = localStorage.getItem(session + "_day_report");
    1 == i.length && i < 9 ? (r = "0" + (Number(i) + 1), localStorage.setItem(session + "_day_report", Number(i) + 1)) : (r = Number(i) + 1, localStorage.setItem(session + "_day_report", r)), today = mmm[o - 1] + "/" + r + "/" + a, Number(i) < Number(s) ? ($("#loading").html("Loding report " + today + "..."), $("#spin").html('<i class="fa fa-circle-o-notch fa-spin"></i>'), loadReport(t, session + "/get_report/&day=" + today + "&f=" + e, today)) : ($("#loading").html(""), $("#spin").html(""))
}

function loadReport(t, e, s) {
    localStorage.getItem(session + "_day_report");
    totalMonth = localStorage.getItem("totalMonth"), $.get(e, function(t) {
        var e = jesD.dec(t);
        t = JSON.parse("[" + e.substring(e.lastIndexOf("[") + 1, e.lastIndexOf("]")) + "]");
        $.each(t, function(t, e) {
            var s = e.name.split("-|-");
            isMobile() ? $("#report").append("<tr class='yes " + s[0].replace(/\//g, "") + " '>\n              <td>\n              Date: " + s[0] + "\n              Time: " + s[1] + "<br>\n              Username: <b>" + s[2] + "</b><br>\n              IP Address: " + s[4] + "<br>\n              MAC Address: " + s[5] + "<br>\n              Profile: " + s[7] + "<br>\n              Comment: " + s[8] + "</td>\n              <td class='text-right'><span>" + s[3] + "</span></td>\n              \n              \n              </tr>") : $("#report").append("<tr class='yes  " + s[0].replace(/\//g, "") + "'>\n                      <td>" + s[0] + "</td>\n                      <td>" + s[1] + "</td>\n                      <td>" + s[2] + "</td>\n                      <td>" + s[4] + "</td>\n                      <td>" + s[5] + "</td>\n                      <td>" + s[7] + "</td>\n                      <td>" + s[8] + "</td>\n                      <td class='text-right'><span>" + s[3] + "</span></td>\n              \n                    </tr>")
        }), countTableRow("report"), $("#report").fadeIn(200)
    }).always(function() {
        var e = localStorage.getItem(session + "_force");
        countReport("report", "count-report"), getReport(t, e), updateTable("searchReport"), countReportT("report", s.replace(/\//g, "")), $("#count-vcr").html($("#total-report").html())
    })
}

function loadReportResume() {
    menuActive("report-resume"), menuNonActive("selling-report")
}
"SATNET" == ax.html() && "SATNET" == bx.html() || (ax.html("SATNET"), bx.html("SATNET " + session.replace("?", "").toUpperCase())), $("#lsession") && $("#lsession").val(session.split("?")[1]), $("#btn-user-profiles").attr("onclick", "loadUserProfiles()"), $("#btn-hotspot-users").attr("onclick", "loadUsersPP()"), $("#btn-hotspot-active").attr("onclick", "loadHotspotActive()"), $("#btn-hotspot-hosts").attr("onclick", "loadHotspotHosts()"), localStorage.setItem(session + "_day_report", 0);