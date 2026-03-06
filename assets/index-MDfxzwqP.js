(async ()=>{
    (function() {
        const t = document.createElement("link").relList;
        if (t && t.supports && t.supports("modulepreload")) return;
        for (const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);
        new MutationObserver((l)=>{
            for (const o of l)if (o.type === "childList") for (const u of o.addedNodes)u.tagName === "LINK" && u.rel === "modulepreload" && r(u);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function n(l) {
            const o = {};
            return l.integrity && (o.integrity = l.integrity), l.referrerPolicy && (o.referrerPolicy = l.referrerPolicy), l.crossOrigin === "use-credentials" ? o.credentials = "include" : l.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
        }
        function r(l) {
            if (l.ep) return;
            l.ep = !0;
            const o = n(l);
            fetch(l.href, o);
        }
    })();
    function mc(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    }
    var ts = {
        exports: {}
    }, ll = {}, ns = {
        exports: {}
    }, I = {};
    var Zn = Symbol.for("react.element"), vc = Symbol.for("react.portal"), yc = Symbol.for("react.fragment"), gc = Symbol.for("react.strict_mode"), wc = Symbol.for("react.profiler"), Sc = Symbol.for("react.provider"), kc = Symbol.for("react.context"), Ec = Symbol.for("react.forward_ref"), Cc = Symbol.for("react.suspense"), _c = Symbol.for("react.memo"), Pc = Symbol.for("react.lazy"), Uu = Symbol.iterator;
    function Tc(e) {
        return e === null || typeof e != "object" ? null : (e = Uu && e[Uu] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var rs = {
        isMounted: function() {
            return !1;
        },
        enqueueForceUpdate: function() {},
        enqueueReplaceState: function() {},
        enqueueSetState: function() {}
    }, ls = Object.assign, os = {};
    function on(e, t, n) {
        this.props = e, this.context = t, this.refs = os, this.updater = n || rs;
    }
    on.prototype.isReactComponent = {};
    on.prototype.setState = function(e, t) {
        if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, e, t, "setState");
    };
    on.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
    };
    function us() {}
    us.prototype = on.prototype;
    function $o(e, t, n) {
        this.props = e, this.context = t, this.refs = os, this.updater = n || rs;
    }
    var Ho = $o.prototype = new us;
    Ho.constructor = $o;
    ls(Ho, on.prototype);
    Ho.isPureReactComponent = !0;
    var Wu = Array.isArray, is = Object.prototype.hasOwnProperty, Qo = {
        current: null
    }, ss = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };
    function as(e, t, n) {
        var r, l = {}, o = null, u = null;
        if (t != null) for(r in t.ref !== void 0 && (u = t.ref), t.key !== void 0 && (o = "" + t.key), t)is.call(t, r) && !ss.hasOwnProperty(r) && (l[r] = t[r]);
        var i = arguments.length - 2;
        if (i === 1) l.children = n;
        else if (1 < i) {
            for(var s = Array(i), a = 0; a < i; a++)s[a] = arguments[a + 2];
            l.children = s;
        }
        if (e && e.defaultProps) for(r in i = e.defaultProps, i)l[r] === void 0 && (l[r] = i[r]);
        return {
            $$typeof: Zn,
            type: e,
            key: o,
            ref: u,
            props: l,
            _owner: Qo.current
        };
    }
    function Nc(e, t) {
        return {
            $$typeof: Zn,
            type: e.type,
            key: t,
            ref: e.ref,
            props: e.props,
            _owner: e._owner
        };
    }
    function Yo(e) {
        return typeof e == "object" && e !== null && e.$$typeof === Zn;
    }
    function xc(e) {
        var t = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + e.replace(/[=:]/g, function(n) {
            return t[n];
        });
    }
    var Vu = /\/+/g;
    function Cl(e, t) {
        return typeof e == "object" && e !== null && e.key != null ? xc("" + e.key) : t.toString(36);
    }
    function kr(e, t, n, r, l) {
        var o = typeof e;
        (o === "undefined" || o === "boolean") && (e = null);
        var u = !1;
        if (e === null) u = !0;
        else switch(o){
            case "string":
            case "number":
                u = !0;
                break;
            case "object":
                switch(e.$$typeof){
                    case Zn:
                    case vc:
                        u = !0;
                }
        }
        if (u) return u = e, l = l(u), e = r === "" ? "." + Cl(u, 0) : r, Wu(l) ? (n = "", e != null && (n = e.replace(Vu, "$&/") + "/"), kr(l, t, n, "", function(a) {
            return a;
        })) : l != null && (Yo(l) && (l = Nc(l, n + (!l.key || u && u.key === l.key ? "" : ("" + l.key).replace(Vu, "$&/") + "/") + e)), t.push(l)), 1;
        if (u = 0, r = r === "" ? "." : r + ":", Wu(e)) for(var i = 0; i < e.length; i++){
            o = e[i];
            var s = r + Cl(o, i);
            u += kr(o, t, n, s, l);
        }
        else if (s = Tc(e), typeof s == "function") for(e = s.call(e), i = 0; !(o = e.next()).done;)o = o.value, s = r + Cl(o, i++), u += kr(o, t, n, s, l);
        else if (o === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
        return u;
    }
    function lr(e, t, n) {
        if (e == null) return e;
        var r = [], l = 0;
        return kr(e, r, "", "", function(o) {
            return t.call(n, o, l++);
        }), r;
    }
    function zc(e) {
        if (e._status === -1) {
            var t = e._result;
            t = t(), t.then(function(n) {
                (e._status === 0 || e._status === -1) && (e._status = 1, e._result = n);
            }, function(n) {
                (e._status === 0 || e._status === -1) && (e._status = 2, e._result = n);
            }), e._status === -1 && (e._status = 0, e._result = t);
        }
        if (e._status === 1) return e._result.default;
        throw e._result;
    }
    var ce = {
        current: null
    }, Er = {
        transition: null
    }, Rc = {
        ReactCurrentDispatcher: ce,
        ReactCurrentBatchConfig: Er,
        ReactCurrentOwner: Qo
    };
    function cs() {
        throw Error("act(...) is not supported in production builds of React.");
    }
    I.Children = {
        map: lr,
        forEach: function(e, t, n) {
            lr(e, function() {
                t.apply(this, arguments);
            }, n);
        },
        count: function(e) {
            var t = 0;
            return lr(e, function() {
                t++;
            }), t;
        },
        toArray: function(e) {
            return lr(e, function(t) {
                return t;
            }) || [];
        },
        only: function(e) {
            if (!Yo(e)) throw Error("React.Children.only expected to receive a single React element child.");
            return e;
        }
    };
    I.Component = on;
    I.Fragment = yc;
    I.Profiler = wc;
    I.PureComponent = $o;
    I.StrictMode = gc;
    I.Suspense = Cc;
    I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Rc;
    I.act = cs;
    I.cloneElement = function(e, t, n) {
        if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
        var r = ls({}, e.props), l = e.key, o = e.ref, u = e._owner;
        if (t != null) {
            if (t.ref !== void 0 && (o = t.ref, u = Qo.current), t.key !== void 0 && (l = "" + t.key), e.type && e.type.defaultProps) var i = e.type.defaultProps;
            for(s in t)is.call(t, s) && !ss.hasOwnProperty(s) && (r[s] = t[s] === void 0 && i !== void 0 ? i[s] : t[s]);
        }
        var s = arguments.length - 2;
        if (s === 1) r.children = n;
        else if (1 < s) {
            i = Array(s);
            for(var a = 0; a < s; a++)i[a] = arguments[a + 2];
            r.children = i;
        }
        return {
            $$typeof: Zn,
            type: e.type,
            key: l,
            ref: o,
            props: r,
            _owner: u
        };
    };
    I.createContext = function(e) {
        return e = {
            $$typeof: kc,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null
        }, e.Provider = {
            $$typeof: Sc,
            _context: e
        }, e.Consumer = e;
    };
    I.createElement = as;
    I.createFactory = function(e) {
        var t = as.bind(null, e);
        return t.type = e, t;
    };
    I.createRef = function() {
        return {
            current: null
        };
    };
    I.forwardRef = function(e) {
        return {
            $$typeof: Ec,
            render: e
        };
    };
    I.isValidElement = Yo;
    I.lazy = function(e) {
        return {
            $$typeof: Pc,
            _payload: {
                _status: -1,
                _result: e
            },
            _init: zc
        };
    };
    I.memo = function(e, t) {
        return {
            $$typeof: _c,
            type: e,
            compare: t === void 0 ? null : t
        };
    };
    I.startTransition = function(e) {
        var t = Er.transition;
        Er.transition = {};
        try {
            e();
        } finally{
            Er.transition = t;
        }
    };
    I.unstable_act = cs;
    I.useCallback = function(e, t) {
        return ce.current.useCallback(e, t);
    };
    I.useContext = function(e) {
        return ce.current.useContext(e);
    };
    I.useDebugValue = function() {};
    I.useDeferredValue = function(e) {
        return ce.current.useDeferredValue(e);
    };
    I.useEffect = function(e, t) {
        return ce.current.useEffect(e, t);
    };
    I.useId = function() {
        return ce.current.useId();
    };
    I.useImperativeHandle = function(e, t, n) {
        return ce.current.useImperativeHandle(e, t, n);
    };
    I.useInsertionEffect = function(e, t) {
        return ce.current.useInsertionEffect(e, t);
    };
    I.useLayoutEffect = function(e, t) {
        return ce.current.useLayoutEffect(e, t);
    };
    I.useMemo = function(e, t) {
        return ce.current.useMemo(e, t);
    };
    I.useReducer = function(e, t, n) {
        return ce.current.useReducer(e, t, n);
    };
    I.useRef = function(e) {
        return ce.current.useRef(e);
    };
    I.useState = function(e) {
        return ce.current.useState(e);
    };
    I.useSyncExternalStore = function(e, t, n) {
        return ce.current.useSyncExternalStore(e, t, n);
    };
    I.useTransition = function() {
        return ce.current.useTransition();
    };
    I.version = "18.3.1";
    ns.exports = I;
    var z = ns.exports;
    const Lc = mc(z);
    var jc = z, Mc = Symbol.for("react.element"), Ic = Symbol.for("react.fragment"), Oc = Object.prototype.hasOwnProperty, Dc = jc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Fc = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };
    function fs(e, t, n) {
        var r, l = {}, o = null, u = null;
        n !== void 0 && (o = "" + n), t.key !== void 0 && (o = "" + t.key), t.ref !== void 0 && (u = t.ref);
        for(r in t)Oc.call(t, r) && !Fc.hasOwnProperty(r) && (l[r] = t[r]);
        if (e && e.defaultProps) for(r in t = e.defaultProps, t)l[r] === void 0 && (l[r] = t[r]);
        return {
            $$typeof: Mc,
            type: e,
            key: o,
            ref: u,
            props: l,
            _owner: Dc.current
        };
    }
    ll.Fragment = Ic;
    ll.jsx = fs;
    ll.jsxs = fs;
    ts.exports = ll;
    var P = ts.exports, Gl = {}, ds = {
        exports: {}
    }, ke = {}, ps = {
        exports: {}
    }, hs = {};
    (function(e) {
        function t(C, L) {
            var j = C.length;
            C.push(L);
            e: for(; 0 < j;){
                var Q = j - 1 >>> 1, Z = C[Q];
                if (0 < l(Z, L)) C[Q] = L, C[j] = Z, j = Q;
                else break e;
            }
        }
        function n(C) {
            return C.length === 0 ? null : C[0];
        }
        function r(C) {
            if (C.length === 0) return null;
            var L = C[0], j = C.pop();
            if (j !== L) {
                C[0] = j;
                e: for(var Q = 0, Z = C.length, nr = Z >>> 1; Q < nr;){
                    var yt = 2 * (Q + 1) - 1, El = C[yt], gt = yt + 1, rr = C[gt];
                    if (0 > l(El, j)) gt < Z && 0 > l(rr, El) ? (C[Q] = rr, C[gt] = j, Q = gt) : (C[Q] = El, C[yt] = j, Q = yt);
                    else if (gt < Z && 0 > l(rr, j)) C[Q] = rr, C[gt] = j, Q = gt;
                    else break e;
                }
            }
            return L;
        }
        function l(C, L) {
            var j = C.sortIndex - L.sortIndex;
            return j !== 0 ? j : C.id - L.id;
        }
        if (typeof performance == "object" && typeof performance.now == "function") {
            var o = performance;
            e.unstable_now = function() {
                return o.now();
            };
        } else {
            var u = Date, i = u.now();
            e.unstable_now = function() {
                return u.now() - i;
            };
        }
        var s = [], a = [], h = 1, p = null, m = 3, v = !1, g = !1, S = !1, N = typeof setTimeout == "function" ? setTimeout : null, f = typeof clearTimeout == "function" ? clearTimeout : null, c = typeof setImmediate < "u" ? setImmediate : null;
        typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function d(C) {
            for(var L = n(a); L !== null;){
                if (L.callback === null) r(a);
                else if (L.startTime <= C) r(a), L.sortIndex = L.expirationTime, t(s, L);
                else break;
                L = n(a);
            }
        }
        function y(C) {
            if (S = !1, d(C), !g) if (n(s) !== null) g = !0, Sl(k);
            else {
                var L = n(a);
                L !== null && kl(y, L.startTime - C);
            }
        }
        function k(C, L) {
            g = !1, S && (S = !1, f(x), x = -1), v = !0;
            var j = m;
            try {
                for(d(L), p = n(s); p !== null && (!(p.expirationTime > L) || C && !ie());){
                    var Q = p.callback;
                    if (typeof Q == "function") {
                        p.callback = null, m = p.priorityLevel;
                        var Z = Q(p.expirationTime <= L);
                        L = e.unstable_now(), typeof Z == "function" ? p.callback = Z : p === n(s) && r(s), d(L);
                    } else r(s);
                    p = n(s);
                }
                if (p !== null) var nr = !0;
                else {
                    var yt = n(a);
                    yt !== null && kl(y, yt.startTime - L), nr = !1;
                }
                return nr;
            } finally{
                p = null, m = j, v = !1;
            }
        }
        var T = !1, _ = null, x = -1, M = 5, R = -1;
        function ie() {
            return !(e.unstable_now() - R < M);
        }
        function an() {
            if (_ !== null) {
                var C = e.unstable_now();
                R = C;
                var L = !0;
                try {
                    L = _(!0, C);
                } finally{
                    L ? cn() : (T = !1, _ = null);
                }
            } else T = !1;
        }
        var cn;
        if (typeof c == "function") cn = function() {
            c(an);
        };
        else if (typeof MessageChannel < "u") {
            var Au = new MessageChannel, hc = Au.port2;
            Au.port1.onmessage = an, cn = function() {
                hc.postMessage(null);
            };
        } else cn = function() {
            N(an, 0);
        };
        function Sl(C) {
            _ = C, T || (T = !0, cn());
        }
        function kl(C, L) {
            x = N(function() {
                C(e.unstable_now());
            }, L);
        }
        e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(C) {
            C.callback = null;
        }, e.unstable_continueExecution = function() {
            g || v || (g = !0, Sl(k));
        }, e.unstable_forceFrameRate = function(C) {
            0 > C || 125 < C ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : M = 0 < C ? Math.floor(1e3 / C) : 5;
        }, e.unstable_getCurrentPriorityLevel = function() {
            return m;
        }, e.unstable_getFirstCallbackNode = function() {
            return n(s);
        }, e.unstable_next = function(C) {
            switch(m){
                case 1:
                case 2:
                case 3:
                    var L = 3;
                    break;
                default:
                    L = m;
            }
            var j = m;
            m = L;
            try {
                return C();
            } finally{
                m = j;
            }
        }, e.unstable_pauseExecution = function() {}, e.unstable_requestPaint = function() {}, e.unstable_runWithPriority = function(C, L) {
            switch(C){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                default:
                    C = 3;
            }
            var j = m;
            m = C;
            try {
                return L();
            } finally{
                m = j;
            }
        }, e.unstable_scheduleCallback = function(C, L, j) {
            var Q = e.unstable_now();
            switch(typeof j == "object" && j !== null ? (j = j.delay, j = typeof j == "number" && 0 < j ? Q + j : Q) : j = Q, C){
                case 1:
                    var Z = -1;
                    break;
                case 2:
                    Z = 250;
                    break;
                case 5:
                    Z = 1073741823;
                    break;
                case 4:
                    Z = 1e4;
                    break;
                default:
                    Z = 5e3;
            }
            return Z = j + Z, C = {
                id: h++,
                callback: L,
                priorityLevel: C,
                startTime: j,
                expirationTime: Z,
                sortIndex: -1
            }, j > Q ? (C.sortIndex = j, t(a, C), n(s) === null && C === n(a) && (S ? (f(x), x = -1) : S = !0, kl(y, j - Q))) : (C.sortIndex = Z, t(s, C), g || v || (g = !0, Sl(k))), C;
        }, e.unstable_shouldYield = ie, e.unstable_wrapCallback = function(C) {
            var L = m;
            return function() {
                var j = m;
                m = L;
                try {
                    return C.apply(this, arguments);
                } finally{
                    m = j;
                }
            };
        };
    })(hs);
    ps.exports = hs;
    var Ac = ps.exports;
    var Uc = z, Se = Ac;
    function w(e) {
        for(var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++)t += "&args[]=" + encodeURIComponent(arguments[n]);
        return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    var ms = new Set, Mn = {};
    function Lt(e, t) {
        qt(e, t), qt(e + "Capture", t);
    }
    function qt(e, t) {
        for(Mn[e] = t, e = 0; e < t.length; e++)ms.add(t[e]);
    }
    var Ye = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Zl = Object.prototype.hasOwnProperty, Wc = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Bu = {}, $u = {};
    function Vc(e) {
        return Zl.call($u, e) ? !0 : Zl.call(Bu, e) ? !1 : Wc.test(e) ? $u[e] = !0 : (Bu[e] = !0, !1);
    }
    function Bc(e, t, n, r) {
        if (n !== null && n.type === 0) return !1;
        switch(typeof t){
            case "function":
            case "symbol":
                return !0;
            case "boolean":
                return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
            default:
                return !1;
        }
    }
    function $c(e, t, n, r) {
        if (t === null || typeof t > "u" || Bc(e, t, n, r)) return !0;
        if (r) return !1;
        if (n !== null) switch(n.type){
            case 3:
                return !t;
            case 4:
                return t === !1;
            case 5:
                return isNaN(t);
            case 6:
                return isNaN(t) || 1 > t;
        }
        return !1;
    }
    function fe(e, t, n, r, l, o, u) {
        this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = u;
    }
    var te = {};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
        te[e] = new fe(e, 0, !1, e, null, !1, !1);
    });
    [
        [
            "acceptCharset",
            "accept-charset"
        ],
        [
            "className",
            "class"
        ],
        [
            "htmlFor",
            "for"
        ],
        [
            "httpEquiv",
            "http-equiv"
        ]
    ].forEach(function(e) {
        var t = e[0];
        te[t] = new fe(t, 1, !1, e[1], null, !1, !1);
    });
    [
        "contentEditable",
        "draggable",
        "spellCheck",
        "value"
    ].forEach(function(e) {
        te[e] = new fe(e, 2, !1, e.toLowerCase(), null, !1, !1);
    });
    [
        "autoReverse",
        "externalResourcesRequired",
        "focusable",
        "preserveAlpha"
    ].forEach(function(e) {
        te[e] = new fe(e, 2, !1, e, null, !1, !1);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
        te[e] = new fe(e, 3, !1, e.toLowerCase(), null, !1, !1);
    });
    [
        "checked",
        "multiple",
        "muted",
        "selected"
    ].forEach(function(e) {
        te[e] = new fe(e, 3, !0, e, null, !1, !1);
    });
    [
        "capture",
        "download"
    ].forEach(function(e) {
        te[e] = new fe(e, 4, !1, e, null, !1, !1);
    });
    [
        "cols",
        "rows",
        "size",
        "span"
    ].forEach(function(e) {
        te[e] = new fe(e, 6, !1, e, null, !1, !1);
    });
    [
        "rowSpan",
        "start"
    ].forEach(function(e) {
        te[e] = new fe(e, 5, !1, e.toLowerCase(), null, !1, !1);
    });
    var Ko = /[\-:]([a-z])/g;
    function Xo(e) {
        return e[1].toUpperCase();
    }
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
        var t = e.replace(Ko, Xo);
        te[t] = new fe(t, 1, !1, e, null, !1, !1);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
        var t = e.replace(Ko, Xo);
        te[t] = new fe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
    });
    [
        "xml:base",
        "xml:lang",
        "xml:space"
    ].forEach(function(e) {
        var t = e.replace(Ko, Xo);
        te[t] = new fe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
    });
    [
        "tabIndex",
        "crossOrigin"
    ].forEach(function(e) {
        te[e] = new fe(e, 1, !1, e.toLowerCase(), null, !1, !1);
    });
    te.xlinkHref = new fe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
    [
        "src",
        "href",
        "action",
        "formAction"
    ].forEach(function(e) {
        te[e] = new fe(e, 1, !1, e.toLowerCase(), null, !0, !0);
    });
    function Go(e, t, n, r) {
        var l = te.hasOwnProperty(t) ? te[t] : null;
        (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && ($c(t, n, l, r) && (n = null), r || l === null ? Vc(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
    }
    var Ze = Uc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, or = Symbol.for("react.element"), It = Symbol.for("react.portal"), Ot = Symbol.for("react.fragment"), Zo = Symbol.for("react.strict_mode"), Jl = Symbol.for("react.profiler"), vs = Symbol.for("react.provider"), ys = Symbol.for("react.context"), Jo = Symbol.for("react.forward_ref"), ql = Symbol.for("react.suspense"), bl = Symbol.for("react.suspense_list"), qo = Symbol.for("react.memo"), qe = Symbol.for("react.lazy"), gs = Symbol.for("react.offscreen"), Hu = Symbol.iterator;
    function fn(e) {
        return e === null || typeof e != "object" ? null : (e = Hu && e[Hu] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var $ = Object.assign, _l;
    function wn(e) {
        if (_l === void 0) try {
            throw Error();
        } catch (n) {
            var t = n.stack.trim().match(/\n( *(at )?)/);
            _l = t && t[1] || "";
        }
        return `
` + _l + e;
    }
    var Pl = !1;
    function Tl(e, t) {
        if (!e || Pl) return "";
        Pl = !0;
        var n = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            if (t) if (t = function() {
                throw Error();
            }, Object.defineProperty(t.prototype, "props", {
                set: function() {
                    throw Error();
                }
            }), typeof Reflect == "object" && Reflect.construct) {
                try {
                    Reflect.construct(t, []);
                } catch (a) {
                    var r = a;
                }
                Reflect.construct(e, [], t);
            } else {
                try {
                    t.call();
                } catch (a) {
                    r = a;
                }
                e.call(t.prototype);
            }
            else {
                try {
                    throw Error();
                } catch (a) {
                    r = a;
                }
                e();
            }
        } catch (a) {
            if (a && r && typeof a.stack == "string") {
                for(var l = a.stack.split(`
`), o = r.stack.split(`
`), u = l.length - 1, i = o.length - 1; 1 <= u && 0 <= i && l[u] !== o[i];)i--;
                for(; 1 <= u && 0 <= i; u--, i--)if (l[u] !== o[i]) {
                    if (u !== 1 || i !== 1) do if (u--, i--, 0 > i || l[u] !== o[i]) {
                        var s = `
` + l[u].replace(" at new ", " at ");
                        return e.displayName && s.includes("<anonymous>") && (s = s.replace("<anonymous>", e.displayName)), s;
                    }
                    while (1 <= u && 0 <= i);
                    break;
                }
            }
        } finally{
            Pl = !1, Error.prepareStackTrace = n;
        }
        return (e = e ? e.displayName || e.name : "") ? wn(e) : "";
    }
    function Hc(e) {
        switch(e.tag){
            case 5:
                return wn(e.type);
            case 16:
                return wn("Lazy");
            case 13:
                return wn("Suspense");
            case 19:
                return wn("SuspenseList");
            case 0:
            case 2:
            case 15:
                return e = Tl(e.type, !1), e;
            case 11:
                return e = Tl(e.type.render, !1), e;
            case 1:
                return e = Tl(e.type, !0), e;
            default:
                return "";
        }
    }
    function eo(e) {
        if (e == null) return null;
        if (typeof e == "function") return e.displayName || e.name || null;
        if (typeof e == "string") return e;
        switch(e){
            case Ot:
                return "Fragment";
            case It:
                return "Portal";
            case Jl:
                return "Profiler";
            case Zo:
                return "StrictMode";
            case ql:
                return "Suspense";
            case bl:
                return "SuspenseList";
        }
        if (typeof e == "object") switch(e.$$typeof){
            case ys:
                return (e.displayName || "Context") + ".Consumer";
            case vs:
                return (e._context.displayName || "Context") + ".Provider";
            case Jo:
                var t = e.render;
                return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
            case qo:
                return t = e.displayName || null, t !== null ? t : eo(e.type) || "Memo";
            case qe:
                t = e._payload, e = e._init;
                try {
                    return eo(e(t));
                } catch  {}
        }
        return null;
    }
    function Qc(e) {
        var t = e.type;
        switch(e.tag){
            case 24:
                return "Cache";
            case 9:
                return (t.displayName || "Context") + ".Consumer";
            case 10:
                return (t._context.displayName || "Context") + ".Provider";
            case 18:
                return "DehydratedFragment";
            case 11:
                return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
            case 7:
                return "Fragment";
            case 5:
                return t;
            case 4:
                return "Portal";
            case 3:
                return "Root";
            case 6:
                return "Text";
            case 16:
                return eo(t);
            case 8:
                return t === Zo ? "StrictMode" : "Mode";
            case 22:
                return "Offscreen";
            case 12:
                return "Profiler";
            case 21:
                return "Scope";
            case 13:
                return "Suspense";
            case 19:
                return "SuspenseList";
            case 25:
                return "TracingMarker";
            case 1:
            case 0:
            case 17:
            case 2:
            case 14:
            case 15:
                if (typeof t == "function") return t.displayName || t.name || null;
                if (typeof t == "string") return t;
        }
        return null;
    }
    function dt(e) {
        switch(typeof e){
            case "boolean":
            case "number":
            case "string":
            case "undefined":
                return e;
            case "object":
                return e;
            default:
                return "";
        }
    }
    function ws(e) {
        var t = e.type;
        return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Yc(e) {
        var t = ws(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
        if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
            var l = n.get, o = n.set;
            return Object.defineProperty(e, t, {
                configurable: !0,
                get: function() {
                    return l.call(this);
                },
                set: function(u) {
                    r = "" + u, o.call(this, u);
                }
            }), Object.defineProperty(e, t, {
                enumerable: n.enumerable
            }), {
                getValue: function() {
                    return r;
                },
                setValue: function(u) {
                    r = "" + u;
                },
                stopTracking: function() {
                    e._valueTracker = null, delete e[t];
                }
            };
        }
    }
    function ur(e) {
        e._valueTracker || (e._valueTracker = Yc(e));
    }
    function Ss(e) {
        if (!e) return !1;
        var t = e._valueTracker;
        if (!t) return !0;
        var n = t.getValue(), r = "";
        return e && (r = ws(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
    }
    function Mr(e) {
        if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
        try {
            return e.activeElement || e.body;
        } catch  {
            return e.body;
        }
    }
    function to(e, t) {
        var n = t.checked;
        return $({}, t, {
            defaultChecked: void 0,
            defaultValue: void 0,
            value: void 0,
            checked: n ?? e._wrapperState.initialChecked
        });
    }
    function Qu(e, t) {
        var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
        n = dt(t.value != null ? t.value : n), e._wrapperState = {
            initialChecked: r,
            initialValue: n,
            controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null
        };
    }
    function ks(e, t) {
        t = t.checked, t != null && Go(e, "checked", t, !1);
    }
    function no(e, t) {
        ks(e, t);
        var n = dt(t.value), r = t.type;
        if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
        else if (r === "submit" || r === "reset") {
            e.removeAttribute("value");
            return;
        }
        t.hasOwnProperty("value") ? ro(e, t.type, n) : t.hasOwnProperty("defaultValue") && ro(e, t.type, dt(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
    }
    function Yu(e, t, n) {
        if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
            var r = t.type;
            if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
            t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
        }
        n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
    }
    function ro(e, t, n) {
        (t !== "number" || Mr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
    }
    var Sn = Array.isArray;
    function Yt(e, t, n, r) {
        if (e = e.options, t) {
            t = {};
            for(var l = 0; l < n.length; l++)t["$" + n[l]] = !0;
            for(n = 0; n < e.length; n++)l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
        } else {
            for(n = "" + dt(n), t = null, l = 0; l < e.length; l++){
                if (e[l].value === n) {
                    e[l].selected = !0, r && (e[l].defaultSelected = !0);
                    return;
                }
                t !== null || e[l].disabled || (t = e[l]);
            }
            t !== null && (t.selected = !0);
        }
    }
    function lo(e, t) {
        if (t.dangerouslySetInnerHTML != null) throw Error(w(91));
        return $({}, t, {
            value: void 0,
            defaultValue: void 0,
            children: "" + e._wrapperState.initialValue
        });
    }
    function Ku(e, t) {
        var n = t.value;
        if (n == null) {
            if (n = t.children, t = t.defaultValue, n != null) {
                if (t != null) throw Error(w(92));
                if (Sn(n)) {
                    if (1 < n.length) throw Error(w(93));
                    n = n[0];
                }
                t = n;
            }
            t == null && (t = ""), n = t;
        }
        e._wrapperState = {
            initialValue: dt(n)
        };
    }
    function Es(e, t) {
        var n = dt(t.value), r = dt(t.defaultValue);
        n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
    }
    function Xu(e) {
        var t = e.textContent;
        t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
    }
    function Cs(e) {
        switch(e){
            case "svg":
                return "http://www.w3.org/2000/svg";
            case "math":
                return "http://www.w3.org/1998/Math/MathML";
            default:
                return "http://www.w3.org/1999/xhtml";
        }
    }
    function oo(e, t) {
        return e == null || e === "http://www.w3.org/1999/xhtml" ? Cs(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
    }
    var ir, _s = function(e) {
        return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
            MSApp.execUnsafeLocalFunction(function() {
                return e(t, n, r, l);
            });
        } : e;
    }(function(e, t) {
        if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
        else {
            for(ir = ir || document.createElement("div"), ir.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = ir.firstChild; e.firstChild;)e.removeChild(e.firstChild);
            for(; t.firstChild;)e.appendChild(t.firstChild);
        }
    });
    function In(e, t) {
        if (t) {
            var n = e.firstChild;
            if (n && n === e.lastChild && n.nodeType === 3) {
                n.nodeValue = t;
                return;
            }
        }
        e.textContent = t;
    }
    var _n = {
        animationIterationCount: !0,
        aspectRatio: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridArea: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0
    }, Kc = [
        "Webkit",
        "ms",
        "Moz",
        "O"
    ];
    Object.keys(_n).forEach(function(e) {
        Kc.forEach(function(t) {
            t = t + e.charAt(0).toUpperCase() + e.substring(1), _n[t] = _n[e];
        });
    });
    function Ps(e, t, n) {
        return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || _n.hasOwnProperty(e) && _n[e] ? ("" + t).trim() : t + "px";
    }
    function Ts(e, t) {
        e = e.style;
        for(var n in t)if (t.hasOwnProperty(n)) {
            var r = n.indexOf("--") === 0, l = Ps(n, t[n], r);
            n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
        }
    }
    var Xc = $({
        menuitem: !0
    }, {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
    });
    function uo(e, t) {
        if (t) {
            if (Xc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(w(137, e));
            if (t.dangerouslySetInnerHTML != null) {
                if (t.children != null) throw Error(w(60));
                if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(w(61));
            }
            if (t.style != null && typeof t.style != "object") throw Error(w(62));
        }
    }
    function io(e, t) {
        if (e.indexOf("-") === -1) return typeof t.is == "string";
        switch(e){
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
                return !1;
            default:
                return !0;
        }
    }
    var so = null;
    function bo(e) {
        return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var ao = null, Kt = null, Xt = null;
    function Gu(e) {
        if (e = bn(e)) {
            if (typeof ao != "function") throw Error(w(280));
            var t = e.stateNode;
            t && (t = al(t), ao(e.stateNode, e.type, t));
        }
    }
    function Ns(e) {
        Kt ? Xt ? Xt.push(e) : Xt = [
            e
        ] : Kt = e;
    }
    function xs() {
        if (Kt) {
            var e = Kt, t = Xt;
            if (Xt = Kt = null, Gu(e), t) for(e = 0; e < t.length; e++)Gu(t[e]);
        }
    }
    function zs(e, t) {
        return e(t);
    }
    function Rs() {}
    var Nl = !1;
    function Ls(e, t, n) {
        if (Nl) return e(t, n);
        Nl = !0;
        try {
            return zs(e, t, n);
        } finally{
            Nl = !1, (Kt !== null || Xt !== null) && (Rs(), xs());
        }
    }
    function On(e, t) {
        var n = e.stateNode;
        if (n === null) return null;
        var r = al(n);
        if (r === null) return null;
        n = r[t];
        e: switch(t){
            case "onClick":
            case "onClickCapture":
            case "onDoubleClick":
            case "onDoubleClickCapture":
            case "onMouseDown":
            case "onMouseDownCapture":
            case "onMouseMove":
            case "onMouseMoveCapture":
            case "onMouseUp":
            case "onMouseUpCapture":
            case "onMouseEnter":
                (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
                break e;
            default:
                e = !1;
        }
        if (e) return null;
        if (n && typeof n != "function") throw Error(w(231, t, typeof n));
        return n;
    }
    var co = !1;
    if (Ye) try {
        var dn = {};
        Object.defineProperty(dn, "passive", {
            get: function() {
                co = !0;
            }
        }), window.addEventListener("test", dn, dn), window.removeEventListener("test", dn, dn);
    } catch  {
        co = !1;
    }
    function Gc(e, t, n, r, l, o, u, i, s) {
        var a = Array.prototype.slice.call(arguments, 3);
        try {
            t.apply(n, a);
        } catch (h) {
            this.onError(h);
        }
    }
    var Pn = !1, Ir = null, Or = !1, fo = null, Zc = {
        onError: function(e) {
            Pn = !0, Ir = e;
        }
    };
    function Jc(e, t, n, r, l, o, u, i, s) {
        Pn = !1, Ir = null, Gc.apply(Zc, arguments);
    }
    function qc(e, t, n, r, l, o, u, i, s) {
        if (Jc.apply(this, arguments), Pn) {
            if (Pn) {
                var a = Ir;
                Pn = !1, Ir = null;
            } else throw Error(w(198));
            Or || (Or = !0, fo = a);
        }
    }
    function jt(e) {
        var t = e, n = e;
        if (e.alternate) for(; t.return;)t = t.return;
        else {
            e = t;
            do t = e, t.flags & 4098 && (n = t.return), e = t.return;
            while (e);
        }
        return t.tag === 3 ? n : null;
    }
    function js(e) {
        if (e.tag === 13) {
            var t = e.memoizedState;
            if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
        }
        return null;
    }
    function Zu(e) {
        if (jt(e) !== e) throw Error(w(188));
    }
    function bc(e) {
        var t = e.alternate;
        if (!t) {
            if (t = jt(e), t === null) throw Error(w(188));
            return t !== e ? null : e;
        }
        for(var n = e, r = t;;){
            var l = n.return;
            if (l === null) break;
            var o = l.alternate;
            if (o === null) {
                if (r = l.return, r !== null) {
                    n = r;
                    continue;
                }
                break;
            }
            if (l.child === o.child) {
                for(o = l.child; o;){
                    if (o === n) return Zu(l), e;
                    if (o === r) return Zu(l), t;
                    o = o.sibling;
                }
                throw Error(w(188));
            }
            if (n.return !== r.return) n = l, r = o;
            else {
                for(var u = !1, i = l.child; i;){
                    if (i === n) {
                        u = !0, n = l, r = o;
                        break;
                    }
                    if (i === r) {
                        u = !0, r = l, n = o;
                        break;
                    }
                    i = i.sibling;
                }
                if (!u) {
                    for(i = o.child; i;){
                        if (i === n) {
                            u = !0, n = o, r = l;
                            break;
                        }
                        if (i === r) {
                            u = !0, r = o, n = l;
                            break;
                        }
                        i = i.sibling;
                    }
                    if (!u) throw Error(w(189));
                }
            }
            if (n.alternate !== r) throw Error(w(190));
        }
        if (n.tag !== 3) throw Error(w(188));
        return n.stateNode.current === n ? e : t;
    }
    function Ms(e) {
        return e = bc(e), e !== null ? Is(e) : null;
    }
    function Is(e) {
        if (e.tag === 5 || e.tag === 6) return e;
        for(e = e.child; e !== null;){
            var t = Is(e);
            if (t !== null) return t;
            e = e.sibling;
        }
        return null;
    }
    var Os = Se.unstable_scheduleCallback, Ju = Se.unstable_cancelCallback, ef = Se.unstable_shouldYield, tf = Se.unstable_requestPaint, Y = Se.unstable_now, nf = Se.unstable_getCurrentPriorityLevel, eu = Se.unstable_ImmediatePriority, Ds = Se.unstable_UserBlockingPriority, Dr = Se.unstable_NormalPriority, rf = Se.unstable_LowPriority, Fs = Se.unstable_IdlePriority, ol = null, Ue = null;
    function lf(e) {
        if (Ue && typeof Ue.onCommitFiberRoot == "function") try {
            Ue.onCommitFiberRoot(ol, e, void 0, (e.current.flags & 128) === 128);
        } catch  {}
    }
    var Me = Math.clz32 ? Math.clz32 : sf, of = Math.log, uf = Math.LN2;
    function sf(e) {
        return e >>>= 0, e === 0 ? 32 : 31 - (of(e) / uf | 0) | 0;
    }
    var sr = 64, ar = 4194304;
    function kn(e) {
        switch(e & -e){
            case 1:
                return 1;
            case 2:
                return 2;
            case 4:
                return 4;
            case 8:
                return 8;
            case 16:
                return 16;
            case 32:
                return 32;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
                return e & 4194240;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
                return e & 130023424;
            case 134217728:
                return 134217728;
            case 268435456:
                return 268435456;
            case 536870912:
                return 536870912;
            case 1073741824:
                return 1073741824;
            default:
                return e;
        }
    }
    function Fr(e, t) {
        var n = e.pendingLanes;
        if (n === 0) return 0;
        var r = 0, l = e.suspendedLanes, o = e.pingedLanes, u = n & 268435455;
        if (u !== 0) {
            var i = u & ~l;
            i !== 0 ? r = kn(i) : (o &= u, o !== 0 && (r = kn(o)));
        } else u = n & ~l, u !== 0 ? r = kn(u) : o !== 0 && (r = kn(o));
        if (r === 0) return 0;
        if (t !== 0 && t !== r && !(t & l) && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
        if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for(e = e.entanglements, t &= r; 0 < t;)n = 31 - Me(t), l = 1 << n, r |= e[n], t &= ~l;
        return r;
    }
    function af(e, t) {
        switch(e){
            case 1:
            case 2:
            case 4:
                return t + 250;
            case 8:
            case 16:
            case 32:
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
                return t + 5e3;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
                return -1;
            case 134217728:
            case 268435456:
            case 536870912:
            case 1073741824:
                return -1;
            default:
                return -1;
        }
    }
    function cf(e, t) {
        for(var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o;){
            var u = 31 - Me(o), i = 1 << u, s = l[u];
            s === -1 ? (!(i & n) || i & r) && (l[u] = af(i, t)) : s <= t && (e.expiredLanes |= i), o &= ~i;
        }
    }
    function po(e) {
        return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
    }
    function As() {
        var e = sr;
        return sr <<= 1, !(sr & 4194240) && (sr = 64), e;
    }
    function xl(e) {
        for(var t = [], n = 0; 31 > n; n++)t.push(e);
        return t;
    }
    function Jn(e, t, n) {
        e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Me(t), e[t] = n;
    }
    function ff(e, t) {
        var n = e.pendingLanes & ~t;
        e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
        var r = e.eventTimes;
        for(e = e.expirationTimes; 0 < n;){
            var l = 31 - Me(n), o = 1 << l;
            t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
        }
    }
    function tu(e, t) {
        var n = e.entangledLanes |= t;
        for(e = e.entanglements; n;){
            var r = 31 - Me(n), l = 1 << r;
            l & t | e[r] & t && (e[r] |= t), n &= ~l;
        }
    }
    var D = 0;
    function Us(e) {
        return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
    }
    var Ws, nu, Vs, Bs, $s, ho = !1, cr = [], lt = null, ot = null, ut = null, Dn = new Map, Fn = new Map, et = [], df = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
    function qu(e, t) {
        switch(e){
            case "focusin":
            case "focusout":
                lt = null;
                break;
            case "dragenter":
            case "dragleave":
                ot = null;
                break;
            case "mouseover":
            case "mouseout":
                ut = null;
                break;
            case "pointerover":
            case "pointerout":
                Dn.delete(t.pointerId);
                break;
            case "gotpointercapture":
            case "lostpointercapture":
                Fn.delete(t.pointerId);
        }
    }
    function pn(e, t, n, r, l, o) {
        return e === null || e.nativeEvent !== o ? (e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: r,
            nativeEvent: o,
            targetContainers: [
                l
            ]
        }, t !== null && (t = bn(t), t !== null && nu(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
    }
    function pf(e, t, n, r, l) {
        switch(t){
            case "focusin":
                return lt = pn(lt, e, t, n, r, l), !0;
            case "dragenter":
                return ot = pn(ot, e, t, n, r, l), !0;
            case "mouseover":
                return ut = pn(ut, e, t, n, r, l), !0;
            case "pointerover":
                var o = l.pointerId;
                return Dn.set(o, pn(Dn.get(o) || null, e, t, n, r, l)), !0;
            case "gotpointercapture":
                return o = l.pointerId, Fn.set(o, pn(Fn.get(o) || null, e, t, n, r, l)), !0;
        }
        return !1;
    }
    function Hs(e) {
        var t = kt(e.target);
        if (t !== null) {
            var n = jt(t);
            if (n !== null) {
                if (t = n.tag, t === 13) {
                    if (t = js(n), t !== null) {
                        e.blockedOn = t, $s(e.priority, function() {
                            Vs(n);
                        });
                        return;
                    }
                } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
                    e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
                    return;
                }
            }
        }
        e.blockedOn = null;
    }
    function Cr(e) {
        if (e.blockedOn !== null) return !1;
        for(var t = e.targetContainers; 0 < t.length;){
            var n = mo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
            if (n === null) {
                n = e.nativeEvent;
                var r = new n.constructor(n.type, n);
                so = r, n.target.dispatchEvent(r), so = null;
            } else return t = bn(n), t !== null && nu(t), e.blockedOn = n, !1;
            t.shift();
        }
        return !0;
    }
    function bu(e, t, n) {
        Cr(e) && n.delete(t);
    }
    function hf() {
        ho = !1, lt !== null && Cr(lt) && (lt = null), ot !== null && Cr(ot) && (ot = null), ut !== null && Cr(ut) && (ut = null), Dn.forEach(bu), Fn.forEach(bu);
    }
    function hn(e, t) {
        e.blockedOn === t && (e.blockedOn = null, ho || (ho = !0, Se.unstable_scheduleCallback(Se.unstable_NormalPriority, hf)));
    }
    function An(e) {
        function t(l) {
            return hn(l, e);
        }
        if (0 < cr.length) {
            hn(cr[0], e);
            for(var n = 1; n < cr.length; n++){
                var r = cr[n];
                r.blockedOn === e && (r.blockedOn = null);
            }
        }
        for(lt !== null && hn(lt, e), ot !== null && hn(ot, e), ut !== null && hn(ut, e), Dn.forEach(t), Fn.forEach(t), n = 0; n < et.length; n++)r = et[n], r.blockedOn === e && (r.blockedOn = null);
        for(; 0 < et.length && (n = et[0], n.blockedOn === null);)Hs(n), n.blockedOn === null && et.shift();
    }
    var Gt = Ze.ReactCurrentBatchConfig, Ar = !0;
    function mf(e, t, n, r) {
        var l = D, o = Gt.transition;
        Gt.transition = null;
        try {
            D = 1, ru(e, t, n, r);
        } finally{
            D = l, Gt.transition = o;
        }
    }
    function vf(e, t, n, r) {
        var l = D, o = Gt.transition;
        Gt.transition = null;
        try {
            D = 4, ru(e, t, n, r);
        } finally{
            D = l, Gt.transition = o;
        }
    }
    function ru(e, t, n, r) {
        if (Ar) {
            var l = mo(e, t, n, r);
            if (l === null) Al(e, t, r, Ur, n), qu(e, r);
            else if (pf(l, e, t, n, r)) r.stopPropagation();
            else if (qu(e, r), t & 4 && -1 < df.indexOf(e)) {
                for(; l !== null;){
                    var o = bn(l);
                    if (o !== null && Ws(o), o = mo(e, t, n, r), o === null && Al(e, t, r, Ur, n), o === l) break;
                    l = o;
                }
                l !== null && r.stopPropagation();
            } else Al(e, t, r, null, n);
        }
    }
    var Ur = null;
    function mo(e, t, n, r) {
        if (Ur = null, e = bo(r), e = kt(e), e !== null) if (t = jt(e), t === null) e = null;
        else if (n = t.tag, n === 13) {
            if (e = js(t), e !== null) return e;
            e = null;
        } else if (n === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
        } else t !== e && (e = null);
        return Ur = e, null;
    }
    function Qs(e) {
        switch(e){
            case "cancel":
            case "click":
            case "close":
            case "contextmenu":
            case "copy":
            case "cut":
            case "auxclick":
            case "dblclick":
            case "dragend":
            case "dragstart":
            case "drop":
            case "focusin":
            case "focusout":
            case "input":
            case "invalid":
            case "keydown":
            case "keypress":
            case "keyup":
            case "mousedown":
            case "mouseup":
            case "paste":
            case "pause":
            case "play":
            case "pointercancel":
            case "pointerdown":
            case "pointerup":
            case "ratechange":
            case "reset":
            case "resize":
            case "seeked":
            case "submit":
            case "touchcancel":
            case "touchend":
            case "touchstart":
            case "volumechange":
            case "change":
            case "selectionchange":
            case "textInput":
            case "compositionstart":
            case "compositionend":
            case "compositionupdate":
            case "beforeblur":
            case "afterblur":
            case "beforeinput":
            case "blur":
            case "fullscreenchange":
            case "focus":
            case "hashchange":
            case "popstate":
            case "select":
            case "selectstart":
                return 1;
            case "drag":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "mousemove":
            case "mouseout":
            case "mouseover":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "scroll":
            case "toggle":
            case "touchmove":
            case "wheel":
            case "mouseenter":
            case "mouseleave":
            case "pointerenter":
            case "pointerleave":
                return 4;
            case "message":
                switch(nf()){
                    case eu:
                        return 1;
                    case Ds:
                        return 4;
                    case Dr:
                    case rf:
                        return 16;
                    case Fs:
                        return 536870912;
                    default:
                        return 16;
                }
            default:
                return 16;
        }
    }
    var nt = null, lu = null, _r = null;
    function Ys() {
        if (_r) return _r;
        var e, t = lu, n = t.length, r, l = "value" in nt ? nt.value : nt.textContent, o = l.length;
        for(e = 0; e < n && t[e] === l[e]; e++);
        var u = n - e;
        for(r = 1; r <= u && t[n - r] === l[o - r]; r++);
        return _r = l.slice(e, 1 < r ? 1 - r : void 0);
    }
    function Pr(e) {
        var t = e.keyCode;
        return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function fr() {
        return !0;
    }
    function ei() {
        return !1;
    }
    function Ee(e) {
        function t(n, r, l, o, u) {
            this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = u, this.currentTarget = null;
            for(var i in e)e.hasOwnProperty(i) && (n = e[i], this[i] = n ? n(o) : o[i]);
            return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? fr : ei, this.isPropagationStopped = ei, this;
        }
        return $(t.prototype, {
            preventDefault: function() {
                this.defaultPrevented = !0;
                var n = this.nativeEvent;
                n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = fr);
            },
            stopPropagation: function() {
                var n = this.nativeEvent;
                n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = fr);
            },
            persist: function() {},
            isPersistent: fr
        }), t;
    }
    var un = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(e) {
            return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0
    }, ou = Ee(un), qn = $({}, un, {
        view: 0,
        detail: 0
    }), yf = Ee(qn), zl, Rl, mn, ul = $({}, qn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: uu,
        button: 0,
        buttons: 0,
        relatedTarget: function(e) {
            return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
        },
        movementX: function(e) {
            return "movementX" in e ? e.movementX : (e !== mn && (mn && e.type === "mousemove" ? (zl = e.screenX - mn.screenX, Rl = e.screenY - mn.screenY) : Rl = zl = 0, mn = e), zl);
        },
        movementY: function(e) {
            return "movementY" in e ? e.movementY : Rl;
        }
    }), ti = Ee(ul), gf = $({}, ul, {
        dataTransfer: 0
    }), wf = Ee(gf), Sf = $({}, qn, {
        relatedTarget: 0
    }), Ll = Ee(Sf), kf = $({}, un, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), Ef = Ee(kf), Cf = $({}, un, {
        clipboardData: function(e) {
            return "clipboardData" in e ? e.clipboardData : window.clipboardData;
        }
    }), _f = Ee(Cf), Pf = $({}, un, {
        data: 0
    }), ni = Ee(Pf), Tf = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, Nf = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, xf = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    function zf(e) {
        var t = this.nativeEvent;
        return t.getModifierState ? t.getModifierState(e) : (e = xf[e]) ? !!t[e] : !1;
    }
    function uu() {
        return zf;
    }
    var Rf = $({}, qn, {
        key: function(e) {
            if (e.key) {
                var t = Tf[e.key] || e.key;
                if (t !== "Unidentified") return t;
            }
            return e.type === "keypress" ? (e = Pr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Nf[e.keyCode] || "Unidentified" : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: uu,
        charCode: function(e) {
            return e.type === "keypress" ? Pr(e) : 0;
        },
        keyCode: function(e) {
            return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
        },
        which: function(e) {
            return e.type === "keypress" ? Pr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
        }
    }), Lf = Ee(Rf), jf = $({}, ul, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    }), ri = Ee(jf), Mf = $({}, qn, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: uu
    }), If = Ee(Mf), Of = $({}, un, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), Df = Ee(Of), Ff = $({}, ul, {
        deltaX: function(e) {
            return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
        },
        deltaY: function(e) {
            return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
        },
        deltaZ: 0,
        deltaMode: 0
    }), Af = Ee(Ff), Uf = [
        9,
        13,
        27,
        32
    ], iu = Ye && "CompositionEvent" in window, Tn = null;
    Ye && "documentMode" in document && (Tn = document.documentMode);
    var Wf = Ye && "TextEvent" in window && !Tn, Ks = Ye && (!iu || Tn && 8 < Tn && 11 >= Tn), li = " ", oi = !1;
    function Xs(e, t) {
        switch(e){
            case "keyup":
                return Uf.indexOf(t.keyCode) !== -1;
            case "keydown":
                return t.keyCode !== 229;
            case "keypress":
            case "mousedown":
            case "focusout":
                return !0;
            default:
                return !1;
        }
    }
    function Gs(e) {
        return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var Dt = !1;
    function Vf(e, t) {
        switch(e){
            case "compositionend":
                return Gs(t);
            case "keypress":
                return t.which !== 32 ? null : (oi = !0, li);
            case "textInput":
                return e = t.data, e === li && oi ? null : e;
            default:
                return null;
        }
    }
    function Bf(e, t) {
        if (Dt) return e === "compositionend" || !iu && Xs(e, t) ? (e = Ys(), _r = lu = nt = null, Dt = !1, e) : null;
        switch(e){
            case "paste":
                return null;
            case "keypress":
                if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
                    if (t.char && 1 < t.char.length) return t.char;
                    if (t.which) return String.fromCharCode(t.which);
                }
                return null;
            case "compositionend":
                return Ks && t.locale !== "ko" ? null : t.data;
            default:
                return null;
        }
    }
    var $f = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    };
    function ui(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return t === "input" ? !!$f[e.type] : t === "textarea";
    }
    function Zs(e, t, n, r) {
        Ns(r), t = Wr(t, "onChange"), 0 < t.length && (n = new ou("onChange", "change", null, n, r), e.push({
            event: n,
            listeners: t
        }));
    }
    var Nn = null, Un = null;
    function Hf(e) {
        ia(e, 0);
    }
    function il(e) {
        var t = Ut(e);
        if (Ss(t)) return e;
    }
    function Qf(e, t) {
        if (e === "change") return t;
    }
    var Js = !1;
    if (Ye) {
        var jl;
        if (Ye) {
            var Ml = "oninput" in document;
            if (!Ml) {
                var ii = document.createElement("div");
                ii.setAttribute("oninput", "return;"), Ml = typeof ii.oninput == "function";
            }
            jl = Ml;
        } else jl = !1;
        Js = jl && (!document.documentMode || 9 < document.documentMode);
    }
    function si() {
        Nn && (Nn.detachEvent("onpropertychange", qs), Un = Nn = null);
    }
    function qs(e) {
        if (e.propertyName === "value" && il(Un)) {
            var t = [];
            Zs(t, Un, e, bo(e)), Ls(Hf, t);
        }
    }
    function Yf(e, t, n) {
        e === "focusin" ? (si(), Nn = t, Un = n, Nn.attachEvent("onpropertychange", qs)) : e === "focusout" && si();
    }
    function Kf(e) {
        if (e === "selectionchange" || e === "keyup" || e === "keydown") return il(Un);
    }
    function Xf(e, t) {
        if (e === "click") return il(t);
    }
    function Gf(e, t) {
        if (e === "input" || e === "change") return il(t);
    }
    function Zf(e, t) {
        return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Oe = typeof Object.is == "function" ? Object.is : Zf;
    function Wn(e, t) {
        if (Oe(e, t)) return !0;
        if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
        var n = Object.keys(e), r = Object.keys(t);
        if (n.length !== r.length) return !1;
        for(r = 0; r < n.length; r++){
            var l = n[r];
            if (!Zl.call(t, l) || !Oe(e[l], t[l])) return !1;
        }
        return !0;
    }
    function ai(e) {
        for(; e && e.firstChild;)e = e.firstChild;
        return e;
    }
    function ci(e, t) {
        var n = ai(e);
        e = 0;
        for(var r; n;){
            if (n.nodeType === 3) {
                if (r = e + n.textContent.length, e <= t && r >= t) return {
                    node: n,
                    offset: t - e
                };
                e = r;
            }
            e: {
                for(; n;){
                    if (n.nextSibling) {
                        n = n.nextSibling;
                        break e;
                    }
                    n = n.parentNode;
                }
                n = void 0;
            }
            n = ai(n);
        }
    }
    function bs(e, t) {
        return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? bs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
    }
    function ea() {
        for(var e = window, t = Mr(); t instanceof e.HTMLIFrameElement;){
            try {
                var n = typeof t.contentWindow.location.href == "string";
            } catch  {
                n = !1;
            }
            if (n) e = t.contentWindow;
            else break;
            t = Mr(e.document);
        }
        return t;
    }
    function su(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function Jf(e) {
        var t = ea(), n = e.focusedElem, r = e.selectionRange;
        if (t !== n && n && n.ownerDocument && bs(n.ownerDocument.documentElement, n)) {
            if (r !== null && su(n)) {
                if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
                else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
                    e = e.getSelection();
                    var l = n.textContent.length, o = Math.min(r.start, l);
                    r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = ci(n, o);
                    var u = ci(n, r);
                    l && u && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== u.node || e.focusOffset !== u.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > r ? (e.addRange(t), e.extend(u.node, u.offset)) : (t.setEnd(u.node, u.offset), e.addRange(t)));
                }
            }
            for(t = [], e = n; e = e.parentNode;)e.nodeType === 1 && t.push({
                element: e,
                left: e.scrollLeft,
                top: e.scrollTop
            });
            for(typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
        }
    }
    var qf = Ye && "documentMode" in document && 11 >= document.documentMode, Ft = null, vo = null, xn = null, yo = !1;
    function fi(e, t, n) {
        var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
        yo || Ft == null || Ft !== Mr(r) || (r = Ft, "selectionStart" in r && su(r) ? r = {
            start: r.selectionStart,
            end: r.selectionEnd
        } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
            anchorNode: r.anchorNode,
            anchorOffset: r.anchorOffset,
            focusNode: r.focusNode,
            focusOffset: r.focusOffset
        }), xn && Wn(xn, r) || (xn = r, r = Wr(vo, "onSelect"), 0 < r.length && (t = new ou("onSelect", "select", null, t, n), e.push({
            event: t,
            listeners: r
        }), t.target = Ft)));
    }
    function dr(e, t) {
        var n = {};
        return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
    }
    var At = {
        animationend: dr("Animation", "AnimationEnd"),
        animationiteration: dr("Animation", "AnimationIteration"),
        animationstart: dr("Animation", "AnimationStart"),
        transitionend: dr("Transition", "TransitionEnd")
    }, Il = {}, ta = {};
    Ye && (ta = document.createElement("div").style, "AnimationEvent" in window || (delete At.animationend.animation, delete At.animationiteration.animation, delete At.animationstart.animation), "TransitionEvent" in window || delete At.transitionend.transition);
    function sl(e) {
        if (Il[e]) return Il[e];
        if (!At[e]) return e;
        var t = At[e], n;
        for(n in t)if (t.hasOwnProperty(n) && n in ta) return Il[e] = t[n];
        return e;
    }
    var na = sl("animationend"), ra = sl("animationiteration"), la = sl("animationstart"), oa = sl("transitionend"), ua = new Map, di = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    function ht(e, t) {
        ua.set(e, t), Lt(t, [
            e
        ]);
    }
    for(var Ol = 0; Ol < di.length; Ol++){
        var Dl = di[Ol], bf = Dl.toLowerCase(), ed = Dl[0].toUpperCase() + Dl.slice(1);
        ht(bf, "on" + ed);
    }
    ht(na, "onAnimationEnd");
    ht(ra, "onAnimationIteration");
    ht(la, "onAnimationStart");
    ht("dblclick", "onDoubleClick");
    ht("focusin", "onFocus");
    ht("focusout", "onBlur");
    ht(oa, "onTransitionEnd");
    qt("onMouseEnter", [
        "mouseout",
        "mouseover"
    ]);
    qt("onMouseLeave", [
        "mouseout",
        "mouseover"
    ]);
    qt("onPointerEnter", [
        "pointerout",
        "pointerover"
    ]);
    qt("onPointerLeave", [
        "pointerout",
        "pointerover"
    ]);
    Lt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    Lt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
    Lt("onBeforeInput", [
        "compositionend",
        "keypress",
        "textInput",
        "paste"
    ]);
    Lt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    Lt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
    Lt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var En = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), td = new Set("cancel close invalid load scroll toggle".split(" ").concat(En));
    function pi(e, t, n) {
        var r = e.type || "unknown-event";
        e.currentTarget = n, qc(r, t, void 0, e), e.currentTarget = null;
    }
    function ia(e, t) {
        t = (t & 4) !== 0;
        for(var n = 0; n < e.length; n++){
            var r = e[n], l = r.event;
            r = r.listeners;
            e: {
                var o = void 0;
                if (t) for(var u = r.length - 1; 0 <= u; u--){
                    var i = r[u], s = i.instance, a = i.currentTarget;
                    if (i = i.listener, s !== o && l.isPropagationStopped()) break e;
                    pi(l, i, a), o = s;
                }
                else for(u = 0; u < r.length; u++){
                    if (i = r[u], s = i.instance, a = i.currentTarget, i = i.listener, s !== o && l.isPropagationStopped()) break e;
                    pi(l, i, a), o = s;
                }
            }
        }
        if (Or) throw e = fo, Or = !1, fo = null, e;
    }
    function A(e, t) {
        var n = t[Eo];
        n === void 0 && (n = t[Eo] = new Set);
        var r = e + "__bubble";
        n.has(r) || (sa(t, e, 2, !1), n.add(r));
    }
    function Fl(e, t, n) {
        var r = 0;
        t && (r |= 4), sa(n, e, r, t);
    }
    var pr = "_reactListening" + Math.random().toString(36).slice(2);
    function Vn(e) {
        if (!e[pr]) {
            e[pr] = !0, ms.forEach(function(n) {
                n !== "selectionchange" && (td.has(n) || Fl(n, !1, e), Fl(n, !0, e));
            });
            var t = e.nodeType === 9 ? e : e.ownerDocument;
            t === null || t[pr] || (t[pr] = !0, Fl("selectionchange", !1, t));
        }
    }
    function sa(e, t, n, r) {
        switch(Qs(t)){
            case 1:
                var l = mf;
                break;
            case 4:
                l = vf;
                break;
            default:
                l = ru;
        }
        n = l.bind(null, t, n, e), l = void 0, !co || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, {
            capture: !0,
            passive: l
        }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, {
            passive: l
        }) : e.addEventListener(t, n, !1);
    }
    function Al(e, t, n, r, l) {
        var o = r;
        if (!(t & 1) && !(t & 2) && r !== null) e: for(;;){
            if (r === null) return;
            var u = r.tag;
            if (u === 3 || u === 4) {
                var i = r.stateNode.containerInfo;
                if (i === l || i.nodeType === 8 && i.parentNode === l) break;
                if (u === 4) for(u = r.return; u !== null;){
                    var s = u.tag;
                    if ((s === 3 || s === 4) && (s = u.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l)) return;
                    u = u.return;
                }
                for(; i !== null;){
                    if (u = kt(i), u === null) return;
                    if (s = u.tag, s === 5 || s === 6) {
                        r = o = u;
                        continue e;
                    }
                    i = i.parentNode;
                }
            }
            r = r.return;
        }
        Ls(function() {
            var a = o, h = bo(n), p = [];
            e: {
                var m = ua.get(e);
                if (m !== void 0) {
                    var v = ou, g = e;
                    switch(e){
                        case "keypress":
                            if (Pr(n) === 0) break e;
                        case "keydown":
                        case "keyup":
                            v = Lf;
                            break;
                        case "focusin":
                            g = "focus", v = Ll;
                            break;
                        case "focusout":
                            g = "blur", v = Ll;
                            break;
                        case "beforeblur":
                        case "afterblur":
                            v = Ll;
                            break;
                        case "click":
                            if (n.button === 2) break e;
                        case "auxclick":
                        case "dblclick":
                        case "mousedown":
                        case "mousemove":
                        case "mouseup":
                        case "mouseout":
                        case "mouseover":
                        case "contextmenu":
                            v = ti;
                            break;
                        case "drag":
                        case "dragend":
                        case "dragenter":
                        case "dragexit":
                        case "dragleave":
                        case "dragover":
                        case "dragstart":
                        case "drop":
                            v = wf;
                            break;
                        case "touchcancel":
                        case "touchend":
                        case "touchmove":
                        case "touchstart":
                            v = If;
                            break;
                        case na:
                        case ra:
                        case la:
                            v = Ef;
                            break;
                        case oa:
                            v = Df;
                            break;
                        case "scroll":
                            v = yf;
                            break;
                        case "wheel":
                            v = Af;
                            break;
                        case "copy":
                        case "cut":
                        case "paste":
                            v = _f;
                            break;
                        case "gotpointercapture":
                        case "lostpointercapture":
                        case "pointercancel":
                        case "pointerdown":
                        case "pointermove":
                        case "pointerout":
                        case "pointerover":
                        case "pointerup":
                            v = ri;
                    }
                    var S = (t & 4) !== 0, N = !S && e === "scroll", f = S ? m !== null ? m + "Capture" : null : m;
                    S = [];
                    for(var c = a, d; c !== null;){
                        d = c;
                        var y = d.stateNode;
                        if (d.tag === 5 && y !== null && (d = y, f !== null && (y = On(c, f), y != null && S.push(Bn(c, y, d)))), N) break;
                        c = c.return;
                    }
                    0 < S.length && (m = new v(m, g, null, n, h), p.push({
                        event: m,
                        listeners: S
                    }));
                }
            }
            if (!(t & 7)) {
                e: {
                    if (m = e === "mouseover" || e === "pointerover", v = e === "mouseout" || e === "pointerout", m && n !== so && (g = n.relatedTarget || n.fromElement) && (kt(g) || g[Ke])) break e;
                    if ((v || m) && (m = h.window === h ? h : (m = h.ownerDocument) ? m.defaultView || m.parentWindow : window, v ? (g = n.relatedTarget || n.toElement, v = a, g = g ? kt(g) : null, g !== null && (N = jt(g), g !== N || g.tag !== 5 && g.tag !== 6) && (g = null)) : (v = null, g = a), v !== g)) {
                        if (S = ti, y = "onMouseLeave", f = "onMouseEnter", c = "mouse", (e === "pointerout" || e === "pointerover") && (S = ri, y = "onPointerLeave", f = "onPointerEnter", c = "pointer"), N = v == null ? m : Ut(v), d = g == null ? m : Ut(g), m = new S(y, c + "leave", v, n, h), m.target = N, m.relatedTarget = d, y = null, kt(h) === a && (S = new S(f, c + "enter", g, n, h), S.target = d, S.relatedTarget = N, y = S), N = y, v && g) t: {
                            for(S = v, f = g, c = 0, d = S; d; d = Mt(d))c++;
                            for(d = 0, y = f; y; y = Mt(y))d++;
                            for(; 0 < c - d;)S = Mt(S), c--;
                            for(; 0 < d - c;)f = Mt(f), d--;
                            for(; c--;){
                                if (S === f || f !== null && S === f.alternate) break t;
                                S = Mt(S), f = Mt(f);
                            }
                            S = null;
                        }
                        else S = null;
                        v !== null && hi(p, m, v, S, !1), g !== null && N !== null && hi(p, N, g, S, !0);
                    }
                }
                e: {
                    if (m = a ? Ut(a) : window, v = m.nodeName && m.nodeName.toLowerCase(), v === "select" || v === "input" && m.type === "file") var k = Qf;
                    else if (ui(m)) if (Js) k = Gf;
                    else {
                        k = Kf;
                        var T = Yf;
                    }
                    else (v = m.nodeName) && v.toLowerCase() === "input" && (m.type === "checkbox" || m.type === "radio") && (k = Xf);
                    if (k && (k = k(e, a))) {
                        Zs(p, k, n, h);
                        break e;
                    }
                    T && T(e, m, a), e === "focusout" && (T = m._wrapperState) && T.controlled && m.type === "number" && ro(m, "number", m.value);
                }
                switch(T = a ? Ut(a) : window, e){
                    case "focusin":
                        (ui(T) || T.contentEditable === "true") && (Ft = T, vo = a, xn = null);
                        break;
                    case "focusout":
                        xn = vo = Ft = null;
                        break;
                    case "mousedown":
                        yo = !0;
                        break;
                    case "contextmenu":
                    case "mouseup":
                    case "dragend":
                        yo = !1, fi(p, n, h);
                        break;
                    case "selectionchange":
                        if (qf) break;
                    case "keydown":
                    case "keyup":
                        fi(p, n, h);
                }
                var _;
                if (iu) e: {
                    switch(e){
                        case "compositionstart":
                            var x = "onCompositionStart";
                            break e;
                        case "compositionend":
                            x = "onCompositionEnd";
                            break e;
                        case "compositionupdate":
                            x = "onCompositionUpdate";
                            break e;
                    }
                    x = void 0;
                }
                else Dt ? Xs(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
                x && (Ks && n.locale !== "ko" && (Dt || x !== "onCompositionStart" ? x === "onCompositionEnd" && Dt && (_ = Ys()) : (nt = h, lu = "value" in nt ? nt.value : nt.textContent, Dt = !0)), T = Wr(a, x), 0 < T.length && (x = new ni(x, e, null, n, h), p.push({
                    event: x,
                    listeners: T
                }), _ ? x.data = _ : (_ = Gs(n), _ !== null && (x.data = _)))), (_ = Wf ? Vf(e, n) : Bf(e, n)) && (a = Wr(a, "onBeforeInput"), 0 < a.length && (h = new ni("onBeforeInput", "beforeinput", null, n, h), p.push({
                    event: h,
                    listeners: a
                }), h.data = _));
            }
            ia(p, t);
        });
    }
    function Bn(e, t, n) {
        return {
            instance: e,
            listener: t,
            currentTarget: n
        };
    }
    function Wr(e, t) {
        for(var n = t + "Capture", r = []; e !== null;){
            var l = e, o = l.stateNode;
            l.tag === 5 && o !== null && (l = o, o = On(e, n), o != null && r.unshift(Bn(e, o, l)), o = On(e, t), o != null && r.push(Bn(e, o, l))), e = e.return;
        }
        return r;
    }
    function Mt(e) {
        if (e === null) return null;
        do e = e.return;
        while (e && e.tag !== 5);
        return e || null;
    }
    function hi(e, t, n, r, l) {
        for(var o = t._reactName, u = []; n !== null && n !== r;){
            var i = n, s = i.alternate, a = i.stateNode;
            if (s !== null && s === r) break;
            i.tag === 5 && a !== null && (i = a, l ? (s = On(n, o), s != null && u.unshift(Bn(n, s, i))) : l || (s = On(n, o), s != null && u.push(Bn(n, s, i)))), n = n.return;
        }
        u.length !== 0 && e.push({
            event: t,
            listeners: u
        });
    }
    var nd = /\r\n?/g, rd = /\u0000|\uFFFD/g;
    function mi(e) {
        return (typeof e == "string" ? e : "" + e).replace(nd, `
`).replace(rd, "");
    }
    function hr(e, t, n) {
        if (t = mi(t), mi(e) !== t && n) throw Error(w(425));
    }
    function Vr() {}
    var go = null, wo = null;
    function So(e, t) {
        return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    var ko = typeof setTimeout == "function" ? setTimeout : void 0, ld = typeof clearTimeout == "function" ? clearTimeout : void 0, vi = typeof Promise == "function" ? Promise : void 0, od = typeof queueMicrotask == "function" ? queueMicrotask : typeof vi < "u" ? function(e) {
        return vi.resolve(null).then(e).catch(ud);
    } : ko;
    function ud(e) {
        setTimeout(function() {
            throw e;
        });
    }
    function Ul(e, t) {
        var n = t, r = 0;
        do {
            var l = n.nextSibling;
            if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
                if (r === 0) {
                    e.removeChild(l), An(t);
                    return;
                }
                r--;
            } else n !== "$" && n !== "$?" && n !== "$!" || r++;
            n = l;
        }while (n);
        An(t);
    }
    function it(e) {
        for(; e != null; e = e.nextSibling){
            var t = e.nodeType;
            if (t === 1 || t === 3) break;
            if (t === 8) {
                if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
                if (t === "/$") return null;
            }
        }
        return e;
    }
    function yi(e) {
        e = e.previousSibling;
        for(var t = 0; e;){
            if (e.nodeType === 8) {
                var n = e.data;
                if (n === "$" || n === "$!" || n === "$?") {
                    if (t === 0) return e;
                    t--;
                } else n === "/$" && t++;
            }
            e = e.previousSibling;
        }
        return null;
    }
    var sn = Math.random().toString(36).slice(2), Ae = "__reactFiber$" + sn, $n = "__reactProps$" + sn, Ke = "__reactContainer$" + sn, Eo = "__reactEvents$" + sn, id = "__reactListeners$" + sn, sd = "__reactHandles$" + sn;
    function kt(e) {
        var t = e[Ae];
        if (t) return t;
        for(var n = e.parentNode; n;){
            if (t = n[Ke] || n[Ae]) {
                if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for(e = yi(e); e !== null;){
                    if (n = e[Ae]) return n;
                    e = yi(e);
                }
                return t;
            }
            e = n, n = e.parentNode;
        }
        return null;
    }
    function bn(e) {
        return e = e[Ae] || e[Ke], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
    }
    function Ut(e) {
        if (e.tag === 5 || e.tag === 6) return e.stateNode;
        throw Error(w(33));
    }
    function al(e) {
        return e[$n] || null;
    }
    var Co = [], Wt = -1;
    function mt(e) {
        return {
            current: e
        };
    }
    function U(e) {
        0 > Wt || (e.current = Co[Wt], Co[Wt] = null, Wt--);
    }
    function F(e, t) {
        Wt++, Co[Wt] = e.current, e.current = t;
    }
    var pt = {}, ue = mt(pt), he = mt(!1), Tt = pt;
    function bt(e, t) {
        var n = e.type.contextTypes;
        if (!n) return pt;
        var r = e.stateNode;
        if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
        var l = {}, o;
        for(o in n)l[o] = t[o];
        return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
    }
    function me(e) {
        return e = e.childContextTypes, e != null;
    }
    function Br() {
        U(he), U(ue);
    }
    function gi(e, t, n) {
        if (ue.current !== pt) throw Error(w(168));
        F(ue, t), F(he, n);
    }
    function aa(e, t, n) {
        var r = e.stateNode;
        if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
        r = r.getChildContext();
        for(var l in r)if (!(l in t)) throw Error(w(108, Qc(e) || "Unknown", l));
        return $({}, n, r);
    }
    function $r(e) {
        return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || pt, Tt = ue.current, F(ue, e), F(he, he.current), !0;
    }
    function wi(e, t, n) {
        var r = e.stateNode;
        if (!r) throw Error(w(169));
        n ? (e = aa(e, t, Tt), r.__reactInternalMemoizedMergedChildContext = e, U(he), U(ue), F(ue, e)) : U(he), F(he, n);
    }
    var Be = null, cl = !1, Wl = !1;
    function ca(e) {
        Be === null ? Be = [
            e
        ] : Be.push(e);
    }
    function ad(e) {
        cl = !0, ca(e);
    }
    function vt() {
        if (!Wl && Be !== null) {
            Wl = !0;
            var e = 0, t = D;
            try {
                var n = Be;
                for(D = 1; e < n.length; e++){
                    var r = n[e];
                    do r = r(!0);
                    while (r !== null);
                }
                Be = null, cl = !1;
            } catch (l) {
                throw Be !== null && (Be = Be.slice(e + 1)), Os(eu, vt), l;
            } finally{
                D = t, Wl = !1;
            }
        }
        return null;
    }
    var Vt = [], Bt = 0, Hr = null, Qr = 0, Ce = [], _e = 0, Nt = null, $e = 1, He = "";
    function wt(e, t) {
        Vt[Bt++] = Qr, Vt[Bt++] = Hr, Hr = e, Qr = t;
    }
    function fa(e, t, n) {
        Ce[_e++] = $e, Ce[_e++] = He, Ce[_e++] = Nt, Nt = e;
        var r = $e;
        e = He;
        var l = 32 - Me(r) - 1;
        r &= ~(1 << l), n += 1;
        var o = 32 - Me(t) + l;
        if (30 < o) {
            var u = l - l % 5;
            o = (r & (1 << u) - 1).toString(32), r >>= u, l -= u, $e = 1 << 32 - Me(t) + l | n << l | r, He = o + e;
        } else $e = 1 << o | n << l | r, He = e;
    }
    function au(e) {
        e.return !== null && (wt(e, 1), fa(e, 1, 0));
    }
    function cu(e) {
        for(; e === Hr;)Hr = Vt[--Bt], Vt[Bt] = null, Qr = Vt[--Bt], Vt[Bt] = null;
        for(; e === Nt;)Nt = Ce[--_e], Ce[_e] = null, He = Ce[--_e], Ce[_e] = null, $e = Ce[--_e], Ce[_e] = null;
    }
    var we = null, ge = null, W = !1, je = null;
    function da(e, t) {
        var n = Pe(5, null, null, 0);
        n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [
            n
        ], e.flags |= 16) : t.push(n);
    }
    function Si(e, t) {
        switch(e.tag){
            case 5:
                var n = e.type;
                return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, we = e, ge = it(t.firstChild), !0) : !1;
            case 6:
                return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, we = e, ge = null, !0) : !1;
            case 13:
                return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Nt !== null ? {
                    id: $e,
                    overflow: He
                } : null, e.memoizedState = {
                    dehydrated: t,
                    treeContext: n,
                    retryLane: 1073741824
                }, n = Pe(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, we = e, ge = null, !0) : !1;
            default:
                return !1;
        }
    }
    function _o(e) {
        return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
    }
    function Po(e) {
        if (W) {
            var t = ge;
            if (t) {
                var n = t;
                if (!Si(e, t)) {
                    if (_o(e)) throw Error(w(418));
                    t = it(n.nextSibling);
                    var r = we;
                    t && Si(e, t) ? da(r, n) : (e.flags = e.flags & -4097 | 2, W = !1, we = e);
                }
            } else {
                if (_o(e)) throw Error(w(418));
                e.flags = e.flags & -4097 | 2, W = !1, we = e;
            }
        }
    }
    function ki(e) {
        for(e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;)e = e.return;
        we = e;
    }
    function mr(e) {
        if (e !== we) return !1;
        if (!W) return ki(e), W = !0, !1;
        var t;
        if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !So(e.type, e.memoizedProps)), t && (t = ge)) {
            if (_o(e)) throw pa(), Error(w(418));
            for(; t;)da(e, t), t = it(t.nextSibling);
        }
        if (ki(e), e.tag === 13) {
            if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(w(317));
            e: {
                for(e = e.nextSibling, t = 0; e;){
                    if (e.nodeType === 8) {
                        var n = e.data;
                        if (n === "/$") {
                            if (t === 0) {
                                ge = it(e.nextSibling);
                                break e;
                            }
                            t--;
                        } else n !== "$" && n !== "$!" && n !== "$?" || t++;
                    }
                    e = e.nextSibling;
                }
                ge = null;
            }
        } else ge = we ? it(e.stateNode.nextSibling) : null;
        return !0;
    }
    function pa() {
        for(var e = ge; e;)e = it(e.nextSibling);
    }
    function en() {
        ge = we = null, W = !1;
    }
    function fu(e) {
        je === null ? je = [
            e
        ] : je.push(e);
    }
    var cd = Ze.ReactCurrentBatchConfig;
    function vn(e, t, n) {
        if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
            if (n._owner) {
                if (n = n._owner, n) {
                    if (n.tag !== 1) throw Error(w(309));
                    var r = n.stateNode;
                }
                if (!r) throw Error(w(147, e));
                var l = r, o = "" + e;
                return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(u) {
                    var i = l.refs;
                    u === null ? delete i[o] : i[o] = u;
                }, t._stringRef = o, t);
            }
            if (typeof e != "string") throw Error(w(284));
            if (!n._owner) throw Error(w(290, e));
        }
        return e;
    }
    function vr(e, t) {
        throw e = Object.prototype.toString.call(t), Error(w(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
    }
    function Ei(e) {
        var t = e._init;
        return t(e._payload);
    }
    function ha(e) {
        function t(f, c) {
            if (e) {
                var d = f.deletions;
                d === null ? (f.deletions = [
                    c
                ], f.flags |= 16) : d.push(c);
            }
        }
        function n(f, c) {
            if (!e) return null;
            for(; c !== null;)t(f, c), c = c.sibling;
            return null;
        }
        function r(f, c) {
            for(f = new Map; c !== null;)c.key !== null ? f.set(c.key, c) : f.set(c.index, c), c = c.sibling;
            return f;
        }
        function l(f, c) {
            return f = ft(f, c), f.index = 0, f.sibling = null, f;
        }
        function o(f, c, d) {
            return f.index = d, e ? (d = f.alternate, d !== null ? (d = d.index, d < c ? (f.flags |= 2, c) : d) : (f.flags |= 2, c)) : (f.flags |= 1048576, c);
        }
        function u(f) {
            return e && f.alternate === null && (f.flags |= 2), f;
        }
        function i(f, c, d, y) {
            return c === null || c.tag !== 6 ? (c = Kl(d, f.mode, y), c.return = f, c) : (c = l(c, d), c.return = f, c);
        }
        function s(f, c, d, y) {
            var k = d.type;
            return k === Ot ? h(f, c, d.props.children, y, d.key) : c !== null && (c.elementType === k || typeof k == "object" && k !== null && k.$$typeof === qe && Ei(k) === c.type) ? (y = l(c, d.props), y.ref = vn(f, c, d), y.return = f, y) : (y = jr(d.type, d.key, d.props, null, f.mode, y), y.ref = vn(f, c, d), y.return = f, y);
        }
        function a(f, c, d, y) {
            return c === null || c.tag !== 4 || c.stateNode.containerInfo !== d.containerInfo || c.stateNode.implementation !== d.implementation ? (c = Xl(d, f.mode, y), c.return = f, c) : (c = l(c, d.children || []), c.return = f, c);
        }
        function h(f, c, d, y, k) {
            return c === null || c.tag !== 7 ? (c = Pt(d, f.mode, y, k), c.return = f, c) : (c = l(c, d), c.return = f, c);
        }
        function p(f, c, d) {
            if (typeof c == "string" && c !== "" || typeof c == "number") return c = Kl("" + c, f.mode, d), c.return = f, c;
            if (typeof c == "object" && c !== null) {
                switch(c.$$typeof){
                    case or:
                        return d = jr(c.type, c.key, c.props, null, f.mode, d), d.ref = vn(f, null, c), d.return = f, d;
                    case It:
                        return c = Xl(c, f.mode, d), c.return = f, c;
                    case qe:
                        var y = c._init;
                        return p(f, y(c._payload), d);
                }
                if (Sn(c) || fn(c)) return c = Pt(c, f.mode, d, null), c.return = f, c;
                vr(f, c);
            }
            return null;
        }
        function m(f, c, d, y) {
            var k = c !== null ? c.key : null;
            if (typeof d == "string" && d !== "" || typeof d == "number") return k !== null ? null : i(f, c, "" + d, y);
            if (typeof d == "object" && d !== null) {
                switch(d.$$typeof){
                    case or:
                        return d.key === k ? s(f, c, d, y) : null;
                    case It:
                        return d.key === k ? a(f, c, d, y) : null;
                    case qe:
                        return k = d._init, m(f, c, k(d._payload), y);
                }
                if (Sn(d) || fn(d)) return k !== null ? null : h(f, c, d, y, null);
                vr(f, d);
            }
            return null;
        }
        function v(f, c, d, y, k) {
            if (typeof y == "string" && y !== "" || typeof y == "number") return f = f.get(d) || null, i(c, f, "" + y, k);
            if (typeof y == "object" && y !== null) {
                switch(y.$$typeof){
                    case or:
                        return f = f.get(y.key === null ? d : y.key) || null, s(c, f, y, k);
                    case It:
                        return f = f.get(y.key === null ? d : y.key) || null, a(c, f, y, k);
                    case qe:
                        var T = y._init;
                        return v(f, c, d, T(y._payload), k);
                }
                if (Sn(y) || fn(y)) return f = f.get(d) || null, h(c, f, y, k, null);
                vr(c, y);
            }
            return null;
        }
        function g(f, c, d, y) {
            for(var k = null, T = null, _ = c, x = c = 0, M = null; _ !== null && x < d.length; x++){
                _.index > x ? (M = _, _ = null) : M = _.sibling;
                var R = m(f, _, d[x], y);
                if (R === null) {
                    _ === null && (_ = M);
                    break;
                }
                e && _ && R.alternate === null && t(f, _), c = o(R, c, x), T === null ? k = R : T.sibling = R, T = R, _ = M;
            }
            if (x === d.length) return n(f, _), W && wt(f, x), k;
            if (_ === null) {
                for(; x < d.length; x++)_ = p(f, d[x], y), _ !== null && (c = o(_, c, x), T === null ? k = _ : T.sibling = _, T = _);
                return W && wt(f, x), k;
            }
            for(_ = r(f, _); x < d.length; x++)M = v(_, f, x, d[x], y), M !== null && (e && M.alternate !== null && _.delete(M.key === null ? x : M.key), c = o(M, c, x), T === null ? k = M : T.sibling = M, T = M);
            return e && _.forEach(function(ie) {
                return t(f, ie);
            }), W && wt(f, x), k;
        }
        function S(f, c, d, y) {
            var k = fn(d);
            if (typeof k != "function") throw Error(w(150));
            if (d = k.call(d), d == null) throw Error(w(151));
            for(var T = k = null, _ = c, x = c = 0, M = null, R = d.next(); _ !== null && !R.done; x++, R = d.next()){
                _.index > x ? (M = _, _ = null) : M = _.sibling;
                var ie = m(f, _, R.value, y);
                if (ie === null) {
                    _ === null && (_ = M);
                    break;
                }
                e && _ && ie.alternate === null && t(f, _), c = o(ie, c, x), T === null ? k = ie : T.sibling = ie, T = ie, _ = M;
            }
            if (R.done) return n(f, _), W && wt(f, x), k;
            if (_ === null) {
                for(; !R.done; x++, R = d.next())R = p(f, R.value, y), R !== null && (c = o(R, c, x), T === null ? k = R : T.sibling = R, T = R);
                return W && wt(f, x), k;
            }
            for(_ = r(f, _); !R.done; x++, R = d.next())R = v(_, f, x, R.value, y), R !== null && (e && R.alternate !== null && _.delete(R.key === null ? x : R.key), c = o(R, c, x), T === null ? k = R : T.sibling = R, T = R);
            return e && _.forEach(function(an) {
                return t(f, an);
            }), W && wt(f, x), k;
        }
        function N(f, c, d, y) {
            if (typeof d == "object" && d !== null && d.type === Ot && d.key === null && (d = d.props.children), typeof d == "object" && d !== null) {
                switch(d.$$typeof){
                    case or:
                        e: {
                            for(var k = d.key, T = c; T !== null;){
                                if (T.key === k) {
                                    if (k = d.type, k === Ot) {
                                        if (T.tag === 7) {
                                            n(f, T.sibling), c = l(T, d.props.children), c.return = f, f = c;
                                            break e;
                                        }
                                    } else if (T.elementType === k || typeof k == "object" && k !== null && k.$$typeof === qe && Ei(k) === T.type) {
                                        n(f, T.sibling), c = l(T, d.props), c.ref = vn(f, T, d), c.return = f, f = c;
                                        break e;
                                    }
                                    n(f, T);
                                    break;
                                } else t(f, T);
                                T = T.sibling;
                            }
                            d.type === Ot ? (c = Pt(d.props.children, f.mode, y, d.key), c.return = f, f = c) : (y = jr(d.type, d.key, d.props, null, f.mode, y), y.ref = vn(f, c, d), y.return = f, f = y);
                        }
                        return u(f);
                    case It:
                        e: {
                            for(T = d.key; c !== null;){
                                if (c.key === T) if (c.tag === 4 && c.stateNode.containerInfo === d.containerInfo && c.stateNode.implementation === d.implementation) {
                                    n(f, c.sibling), c = l(c, d.children || []), c.return = f, f = c;
                                    break e;
                                } else {
                                    n(f, c);
                                    break;
                                }
                                else t(f, c);
                                c = c.sibling;
                            }
                            c = Xl(d, f.mode, y), c.return = f, f = c;
                        }
                        return u(f);
                    case qe:
                        return T = d._init, N(f, c, T(d._payload), y);
                }
                if (Sn(d)) return g(f, c, d, y);
                if (fn(d)) return S(f, c, d, y);
                vr(f, d);
            }
            return typeof d == "string" && d !== "" || typeof d == "number" ? (d = "" + d, c !== null && c.tag === 6 ? (n(f, c.sibling), c = l(c, d), c.return = f, f = c) : (n(f, c), c = Kl(d, f.mode, y), c.return = f, f = c), u(f)) : n(f, c);
        }
        return N;
    }
    var tn = ha(!0), ma = ha(!1), Yr = mt(null), Kr = null, $t = null, du = null;
    function pu() {
        du = $t = Kr = null;
    }
    function hu(e) {
        var t = Yr.current;
        U(Yr), e._currentValue = t;
    }
    function To(e, t, n) {
        for(; e !== null;){
            var r = e.alternate;
            if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
            e = e.return;
        }
    }
    function Zt(e, t) {
        Kr = e, du = $t = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (pe = !0), e.firstContext = null);
    }
    function Ne(e) {
        var t = e._currentValue;
        if (du !== e) if (e = {
            context: e,
            memoizedValue: t,
            next: null
        }, $t === null) {
            if (Kr === null) throw Error(w(308));
            $t = e, Kr.dependencies = {
                lanes: 0,
                firstContext: e
            };
        } else $t = $t.next = e;
        return t;
    }
    var Et = null;
    function mu(e) {
        Et === null ? Et = [
            e
        ] : Et.push(e);
    }
    function va(e, t, n, r) {
        var l = t.interleaved;
        return l === null ? (n.next = n, mu(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Xe(e, r);
    }
    function Xe(e, t) {
        e.lanes |= t;
        var n = e.alternate;
        for(n !== null && (n.lanes |= t), n = e, e = e.return; e !== null;)e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
        return n.tag === 3 ? n.stateNode : null;
    }
    var be = !1;
    function vu(e) {
        e.updateQueue = {
            baseState: e.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: {
                pending: null,
                interleaved: null,
                lanes: 0
            },
            effects: null
        };
    }
    function ya(e, t) {
        e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            effects: e.effects
        });
    }
    function Qe(e, t) {
        return {
            eventTime: e,
            lane: t,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        };
    }
    function st(e, t, n) {
        var r = e.updateQueue;
        if (r === null) return null;
        if (r = r.shared, O & 2) {
            var l = r.pending;
            return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Xe(e, n);
        }
        return l = r.interleaved, l === null ? (t.next = t, mu(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Xe(e, n);
    }
    function Tr(e, t, n) {
        if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
            var r = t.lanes;
            r &= e.pendingLanes, n |= r, t.lanes = n, tu(e, n);
        }
    }
    function Ci(e, t) {
        var n = e.updateQueue, r = e.alternate;
        if (r !== null && (r = r.updateQueue, n === r)) {
            var l = null, o = null;
            if (n = n.firstBaseUpdate, n !== null) {
                do {
                    var u = {
                        eventTime: n.eventTime,
                        lane: n.lane,
                        tag: n.tag,
                        payload: n.payload,
                        callback: n.callback,
                        next: null
                    };
                    o === null ? l = o = u : o = o.next = u, n = n.next;
                }while (n !== null);
                o === null ? l = o = t : o = o.next = t;
            } else l = o = t;
            n = {
                baseState: r.baseState,
                firstBaseUpdate: l,
                lastBaseUpdate: o,
                shared: r.shared,
                effects: r.effects
            }, e.updateQueue = n;
            return;
        }
        e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
    }
    function Xr(e, t, n, r) {
        var l = e.updateQueue;
        be = !1;
        var o = l.firstBaseUpdate, u = l.lastBaseUpdate, i = l.shared.pending;
        if (i !== null) {
            l.shared.pending = null;
            var s = i, a = s.next;
            s.next = null, u === null ? o = a : u.next = a, u = s;
            var h = e.alternate;
            h !== null && (h = h.updateQueue, i = h.lastBaseUpdate, i !== u && (i === null ? h.firstBaseUpdate = a : i.next = a, h.lastBaseUpdate = s));
        }
        if (o !== null) {
            var p = l.baseState;
            u = 0, h = a = s = null, i = o;
            do {
                var m = i.lane, v = i.eventTime;
                if ((r & m) === m) {
                    h !== null && (h = h.next = {
                        eventTime: v,
                        lane: 0,
                        tag: i.tag,
                        payload: i.payload,
                        callback: i.callback,
                        next: null
                    });
                    e: {
                        var g = e, S = i;
                        switch(m = t, v = n, S.tag){
                            case 1:
                                if (g = S.payload, typeof g == "function") {
                                    p = g.call(v, p, m);
                                    break e;
                                }
                                p = g;
                                break e;
                            case 3:
                                g.flags = g.flags & -65537 | 128;
                            case 0:
                                if (g = S.payload, m = typeof g == "function" ? g.call(v, p, m) : g, m == null) break e;
                                p = $({}, p, m);
                                break e;
                            case 2:
                                be = !0;
                        }
                    }
                    i.callback !== null && i.lane !== 0 && (e.flags |= 64, m = l.effects, m === null ? l.effects = [
                        i
                    ] : m.push(i));
                } else v = {
                    eventTime: v,
                    lane: m,
                    tag: i.tag,
                    payload: i.payload,
                    callback: i.callback,
                    next: null
                }, h === null ? (a = h = v, s = p) : h = h.next = v, u |= m;
                if (i = i.next, i === null) {
                    if (i = l.shared.pending, i === null) break;
                    m = i, i = m.next, m.next = null, l.lastBaseUpdate = m, l.shared.pending = null;
                }
            }while (!0);
            if (h === null && (s = p), l.baseState = s, l.firstBaseUpdate = a, l.lastBaseUpdate = h, t = l.shared.interleaved, t !== null) {
                l = t;
                do u |= l.lane, l = l.next;
                while (l !== t);
            } else o === null && (l.shared.lanes = 0);
            zt |= u, e.lanes = u, e.memoizedState = p;
        }
    }
    function _i(e, t, n) {
        if (e = t.effects, t.effects = null, e !== null) for(t = 0; t < e.length; t++){
            var r = e[t], l = r.callback;
            if (l !== null) {
                if (r.callback = null, r = n, typeof l != "function") throw Error(w(191, l));
                l.call(r);
            }
        }
    }
    var er = {}, We = mt(er), Hn = mt(er), Qn = mt(er);
    function Ct(e) {
        if (e === er) throw Error(w(174));
        return e;
    }
    function yu(e, t) {
        switch(F(Qn, t), F(Hn, e), F(We, er), e = t.nodeType, e){
            case 9:
            case 11:
                t = (t = t.documentElement) ? t.namespaceURI : oo(null, "");
                break;
            default:
                e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = oo(t, e);
        }
        U(We), F(We, t);
    }
    function nn() {
        U(We), U(Hn), U(Qn);
    }
    function ga(e) {
        Ct(Qn.current);
        var t = Ct(We.current), n = oo(t, e.type);
        t !== n && (F(Hn, e), F(We, n));
    }
    function gu(e) {
        Hn.current === e && (U(We), U(Hn));
    }
    var V = mt(0);
    function Gr(e) {
        for(var t = e; t !== null;){
            if (t.tag === 13) {
                var n = t.memoizedState;
                if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
            } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
                if (t.flags & 128) return t;
            } else if (t.child !== null) {
                t.child.return = t, t = t.child;
                continue;
            }
            if (t === e) break;
            for(; t.sibling === null;){
                if (t.return === null || t.return === e) return null;
                t = t.return;
            }
            t.sibling.return = t.return, t = t.sibling;
        }
        return null;
    }
    var Vl = [];
    function wu() {
        for(var e = 0; e < Vl.length; e++)Vl[e]._workInProgressVersionPrimary = null;
        Vl.length = 0;
    }
    var Nr = Ze.ReactCurrentDispatcher, Bl = Ze.ReactCurrentBatchConfig, xt = 0, B = null, X = null, J = null, Zr = !1, zn = !1, Yn = 0, fd = 0;
    function ne() {
        throw Error(w(321));
    }
    function Su(e, t) {
        if (t === null) return !1;
        for(var n = 0; n < t.length && n < e.length; n++)if (!Oe(e[n], t[n])) return !1;
        return !0;
    }
    function ku(e, t, n, r, l, o) {
        if (xt = o, B = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Nr.current = e === null || e.memoizedState === null ? md : vd, e = n(r, l), zn) {
            o = 0;
            do {
                if (zn = !1, Yn = 0, 25 <= o) throw Error(w(301));
                o += 1, J = X = null, t.updateQueue = null, Nr.current = yd, e = n(r, l);
            }while (zn);
        }
        if (Nr.current = Jr, t = X !== null && X.next !== null, xt = 0, J = X = B = null, Zr = !1, t) throw Error(w(300));
        return e;
    }
    function Eu() {
        var e = Yn !== 0;
        return Yn = 0, e;
    }
    function Fe() {
        var e = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return J === null ? B.memoizedState = J = e : J = J.next = e, J;
    }
    function xe() {
        if (X === null) {
            var e = B.alternate;
            e = e !== null ? e.memoizedState : null;
        } else e = X.next;
        var t = J === null ? B.memoizedState : J.next;
        if (t !== null) J = t, X = e;
        else {
            if (e === null) throw Error(w(310));
            X = e, e = {
                memoizedState: X.memoizedState,
                baseState: X.baseState,
                baseQueue: X.baseQueue,
                queue: X.queue,
                next: null
            }, J === null ? B.memoizedState = J = e : J = J.next = e;
        }
        return J;
    }
    function Kn(e, t) {
        return typeof t == "function" ? t(e) : t;
    }
    function $l(e) {
        var t = xe(), n = t.queue;
        if (n === null) throw Error(w(311));
        n.lastRenderedReducer = e;
        var r = X, l = r.baseQueue, o = n.pending;
        if (o !== null) {
            if (l !== null) {
                var u = l.next;
                l.next = o.next, o.next = u;
            }
            r.baseQueue = l = o, n.pending = null;
        }
        if (l !== null) {
            o = l.next, r = r.baseState;
            var i = u = null, s = null, a = o;
            do {
                var h = a.lane;
                if ((xt & h) === h) s !== null && (s = s.next = {
                    lane: 0,
                    action: a.action,
                    hasEagerState: a.hasEagerState,
                    eagerState: a.eagerState,
                    next: null
                }), r = a.hasEagerState ? a.eagerState : e(r, a.action);
                else {
                    var p = {
                        lane: h,
                        action: a.action,
                        hasEagerState: a.hasEagerState,
                        eagerState: a.eagerState,
                        next: null
                    };
                    s === null ? (i = s = p, u = r) : s = s.next = p, B.lanes |= h, zt |= h;
                }
                a = a.next;
            }while (a !== null && a !== o);
            s === null ? u = r : s.next = i, Oe(r, t.memoizedState) || (pe = !0), t.memoizedState = r, t.baseState = u, t.baseQueue = s, n.lastRenderedState = r;
        }
        if (e = n.interleaved, e !== null) {
            l = e;
            do o = l.lane, B.lanes |= o, zt |= o, l = l.next;
            while (l !== e);
        } else l === null && (n.lanes = 0);
        return [
            t.memoizedState,
            n.dispatch
        ];
    }
    function Hl(e) {
        var t = xe(), n = t.queue;
        if (n === null) throw Error(w(311));
        n.lastRenderedReducer = e;
        var r = n.dispatch, l = n.pending, o = t.memoizedState;
        if (l !== null) {
            n.pending = null;
            var u = l = l.next;
            do o = e(o, u.action), u = u.next;
            while (u !== l);
            Oe(o, t.memoizedState) || (pe = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
        }
        return [
            o,
            r
        ];
    }
    function wa() {}
    function Sa(e, t) {
        var n = B, r = xe(), l = t(), o = !Oe(r.memoizedState, l);
        if (o && (r.memoizedState = l, pe = !0), r = r.queue, Cu(Ca.bind(null, n, r, e), [
            e
        ]), r.getSnapshot !== t || o || J !== null && J.memoizedState.tag & 1) {
            if (n.flags |= 2048, Xn(9, Ea.bind(null, n, r, l, t), void 0, null), q === null) throw Error(w(349));
            xt & 30 || ka(n, t, l);
        }
        return l;
    }
    function ka(e, t, n) {
        e.flags |= 16384, e = {
            getSnapshot: t,
            value: n
        }, t = B.updateQueue, t === null ? (t = {
            lastEffect: null,
            stores: null
        }, B.updateQueue = t, t.stores = [
            e
        ]) : (n = t.stores, n === null ? t.stores = [
            e
        ] : n.push(e));
    }
    function Ea(e, t, n, r) {
        t.value = n, t.getSnapshot = r, _a(t) && Pa(e);
    }
    function Ca(e, t, n) {
        return n(function() {
            _a(t) && Pa(e);
        });
    }
    function _a(e) {
        var t = e.getSnapshot;
        e = e.value;
        try {
            var n = t();
            return !Oe(e, n);
        } catch  {
            return !0;
        }
    }
    function Pa(e) {
        var t = Xe(e, 1);
        t !== null && Ie(t, e, 1, -1);
    }
    function Pi(e) {
        var t = Fe();
        return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Kn,
            lastRenderedState: e
        }, t.queue = e, e = e.dispatch = hd.bind(null, B, e), [
            t.memoizedState,
            e
        ];
    }
    function Xn(e, t, n, r) {
        return e = {
            tag: e,
            create: t,
            destroy: n,
            deps: r,
            next: null
        }, t = B.updateQueue, t === null ? (t = {
            lastEffect: null,
            stores: null
        }, B.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
    }
    function Ta() {
        return xe().memoizedState;
    }
    function xr(e, t, n, r) {
        var l = Fe();
        B.flags |= e, l.memoizedState = Xn(1 | t, n, void 0, r === void 0 ? null : r);
    }
    function fl(e, t, n, r) {
        var l = xe();
        r = r === void 0 ? null : r;
        var o = void 0;
        if (X !== null) {
            var u = X.memoizedState;
            if (o = u.destroy, r !== null && Su(r, u.deps)) {
                l.memoizedState = Xn(t, n, o, r);
                return;
            }
        }
        B.flags |= e, l.memoizedState = Xn(1 | t, n, o, r);
    }
    function Ti(e, t) {
        return xr(8390656, 8, e, t);
    }
    function Cu(e, t) {
        return fl(2048, 8, e, t);
    }
    function Na(e, t) {
        return fl(4, 2, e, t);
    }
    function xa(e, t) {
        return fl(4, 4, e, t);
    }
    function za(e, t) {
        if (typeof t == "function") return e = e(), t(e), function() {
            t(null);
        };
        if (t != null) return e = e(), t.current = e, function() {
            t.current = null;
        };
    }
    function Ra(e, t, n) {
        return n = n != null ? n.concat([
            e
        ]) : null, fl(4, 4, za.bind(null, t, e), n);
    }
    function _u() {}
    function La(e, t) {
        var n = xe();
        t = t === void 0 ? null : t;
        var r = n.memoizedState;
        return r !== null && t !== null && Su(t, r[1]) ? r[0] : (n.memoizedState = [
            e,
            t
        ], e);
    }
    function ja(e, t) {
        var n = xe();
        t = t === void 0 ? null : t;
        var r = n.memoizedState;
        return r !== null && t !== null && Su(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [
            e,
            t
        ], e);
    }
    function Ma(e, t, n) {
        return xt & 21 ? (Oe(n, t) || (n = As(), B.lanes |= n, zt |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, pe = !0), e.memoizedState = n);
    }
    function dd(e, t) {
        var n = D;
        D = n !== 0 && 4 > n ? n : 4, e(!0);
        var r = Bl.transition;
        Bl.transition = {};
        try {
            e(!1), t();
        } finally{
            D = n, Bl.transition = r;
        }
    }
    function Ia() {
        return xe().memoizedState;
    }
    function pd(e, t, n) {
        var r = ct(e);
        if (n = {
            lane: r,
            action: n,
            hasEagerState: !1,
            eagerState: null,
            next: null
        }, Oa(e)) Da(t, n);
        else if (n = va(e, t, n, r), n !== null) {
            var l = ae();
            Ie(n, e, r, l), Fa(n, t, r);
        }
    }
    function hd(e, t, n) {
        var r = ct(e), l = {
            lane: r,
            action: n,
            hasEagerState: !1,
            eagerState: null,
            next: null
        };
        if (Oa(e)) Da(t, l);
        else {
            var o = e.alternate;
            if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
                var u = t.lastRenderedState, i = o(u, n);
                if (l.hasEagerState = !0, l.eagerState = i, Oe(i, u)) {
                    var s = t.interleaved;
                    s === null ? (l.next = l, mu(t)) : (l.next = s.next, s.next = l), t.interleaved = l;
                    return;
                }
            } catch  {} finally{}
            n = va(e, t, l, r), n !== null && (l = ae(), Ie(n, e, r, l), Fa(n, t, r));
        }
    }
    function Oa(e) {
        var t = e.alternate;
        return e === B || t !== null && t === B;
    }
    function Da(e, t) {
        zn = Zr = !0;
        var n = e.pending;
        n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
    }
    function Fa(e, t, n) {
        if (n & 4194240) {
            var r = t.lanes;
            r &= e.pendingLanes, n |= r, t.lanes = n, tu(e, n);
        }
    }
    var Jr = {
        readContext: Ne,
        useCallback: ne,
        useContext: ne,
        useEffect: ne,
        useImperativeHandle: ne,
        useInsertionEffect: ne,
        useLayoutEffect: ne,
        useMemo: ne,
        useReducer: ne,
        useRef: ne,
        useState: ne,
        useDebugValue: ne,
        useDeferredValue: ne,
        useTransition: ne,
        useMutableSource: ne,
        useSyncExternalStore: ne,
        useId: ne,
        unstable_isNewReconciler: !1
    }, md = {
        readContext: Ne,
        useCallback: function(e, t) {
            return Fe().memoizedState = [
                e,
                t === void 0 ? null : t
            ], e;
        },
        useContext: Ne,
        useEffect: Ti,
        useImperativeHandle: function(e, t, n) {
            return n = n != null ? n.concat([
                e
            ]) : null, xr(4194308, 4, za.bind(null, t, e), n);
        },
        useLayoutEffect: function(e, t) {
            return xr(4194308, 4, e, t);
        },
        useInsertionEffect: function(e, t) {
            return xr(4, 2, e, t);
        },
        useMemo: function(e, t) {
            var n = Fe();
            return t = t === void 0 ? null : t, e = e(), n.memoizedState = [
                e,
                t
            ], e;
        },
        useReducer: function(e, t, n) {
            var r = Fe();
            return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = {
                pending: null,
                interleaved: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: e,
                lastRenderedState: t
            }, r.queue = e, e = e.dispatch = pd.bind(null, B, e), [
                r.memoizedState,
                e
            ];
        },
        useRef: function(e) {
            var t = Fe();
            return e = {
                current: e
            }, t.memoizedState = e;
        },
        useState: Pi,
        useDebugValue: _u,
        useDeferredValue: function(e) {
            return Fe().memoizedState = e;
        },
        useTransition: function() {
            var e = Pi(!1), t = e[0];
            return e = dd.bind(null, e[1]), Fe().memoizedState = e, [
                t,
                e
            ];
        },
        useMutableSource: function() {},
        useSyncExternalStore: function(e, t, n) {
            var r = B, l = Fe();
            if (W) {
                if (n === void 0) throw Error(w(407));
                n = n();
            } else {
                if (n = t(), q === null) throw Error(w(349));
                xt & 30 || ka(r, t, n);
            }
            l.memoizedState = n;
            var o = {
                value: n,
                getSnapshot: t
            };
            return l.queue = o, Ti(Ca.bind(null, r, o, e), [
                e
            ]), r.flags |= 2048, Xn(9, Ea.bind(null, r, o, n, t), void 0, null), n;
        },
        useId: function() {
            var e = Fe(), t = q.identifierPrefix;
            if (W) {
                var n = He, r = $e;
                n = (r & ~(1 << 32 - Me(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Yn++, 0 < n && (t += "H" + n.toString(32)), t += ":";
            } else n = fd++, t = ":" + t + "r" + n.toString(32) + ":";
            return e.memoizedState = t;
        },
        unstable_isNewReconciler: !1
    }, vd = {
        readContext: Ne,
        useCallback: La,
        useContext: Ne,
        useEffect: Cu,
        useImperativeHandle: Ra,
        useInsertionEffect: Na,
        useLayoutEffect: xa,
        useMemo: ja,
        useReducer: $l,
        useRef: Ta,
        useState: function() {
            return $l(Kn);
        },
        useDebugValue: _u,
        useDeferredValue: function(e) {
            var t = xe();
            return Ma(t, X.memoizedState, e);
        },
        useTransition: function() {
            var e = $l(Kn)[0], t = xe().memoizedState;
            return [
                e,
                t
            ];
        },
        useMutableSource: wa,
        useSyncExternalStore: Sa,
        useId: Ia,
        unstable_isNewReconciler: !1
    }, yd = {
        readContext: Ne,
        useCallback: La,
        useContext: Ne,
        useEffect: Cu,
        useImperativeHandle: Ra,
        useInsertionEffect: Na,
        useLayoutEffect: xa,
        useMemo: ja,
        useReducer: Hl,
        useRef: Ta,
        useState: function() {
            return Hl(Kn);
        },
        useDebugValue: _u,
        useDeferredValue: function(e) {
            var t = xe();
            return X === null ? t.memoizedState = e : Ma(t, X.memoizedState, e);
        },
        useTransition: function() {
            var e = Hl(Kn)[0], t = xe().memoizedState;
            return [
                e,
                t
            ];
        },
        useMutableSource: wa,
        useSyncExternalStore: Sa,
        useId: Ia,
        unstable_isNewReconciler: !1
    };
    function Re(e, t) {
        if (e && e.defaultProps) {
            t = $({}, t), e = e.defaultProps;
            for(var n in e)t[n] === void 0 && (t[n] = e[n]);
            return t;
        }
        return t;
    }
    function No(e, t, n, r) {
        t = e.memoizedState, n = n(r, t), n = n == null ? t : $({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
    }
    var dl = {
        isMounted: function(e) {
            return (e = e._reactInternals) ? jt(e) === e : !1;
        },
        enqueueSetState: function(e, t, n) {
            e = e._reactInternals;
            var r = ae(), l = ct(e), o = Qe(r, l);
            o.payload = t, n != null && (o.callback = n), t = st(e, o, l), t !== null && (Ie(t, e, l, r), Tr(t, e, l));
        },
        enqueueReplaceState: function(e, t, n) {
            e = e._reactInternals;
            var r = ae(), l = ct(e), o = Qe(r, l);
            o.tag = 1, o.payload = t, n != null && (o.callback = n), t = st(e, o, l), t !== null && (Ie(t, e, l, r), Tr(t, e, l));
        },
        enqueueForceUpdate: function(e, t) {
            e = e._reactInternals;
            var n = ae(), r = ct(e), l = Qe(n, r);
            l.tag = 2, t != null && (l.callback = t), t = st(e, l, r), t !== null && (Ie(t, e, r, n), Tr(t, e, r));
        }
    };
    function Ni(e, t, n, r, l, o, u) {
        return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, u) : t.prototype && t.prototype.isPureReactComponent ? !Wn(n, r) || !Wn(l, o) : !0;
    }
    function Aa(e, t, n) {
        var r = !1, l = pt, o = t.contextType;
        return typeof o == "object" && o !== null ? o = Ne(o) : (l = me(t) ? Tt : ue.current, r = t.contextTypes, o = (r = r != null) ? bt(e, l) : pt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = dl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
    }
    function xi(e, t, n, r) {
        e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && dl.enqueueReplaceState(t, t.state, null);
    }
    function xo(e, t, n, r) {
        var l = e.stateNode;
        l.props = n, l.state = e.memoizedState, l.refs = {}, vu(e);
        var o = t.contextType;
        typeof o == "object" && o !== null ? l.context = Ne(o) : (o = me(t) ? Tt : ue.current, l.context = bt(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (No(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && dl.enqueueReplaceState(l, l.state, null), Xr(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
    }
    function rn(e, t) {
        try {
            var n = "", r = t;
            do n += Hc(r), r = r.return;
            while (r);
            var l = n;
        } catch (o) {
            l = `
Error generating stack: ` + o.message + `
` + o.stack;
        }
        return {
            value: e,
            source: t,
            stack: l,
            digest: null
        };
    }
    function Ql(e, t, n) {
        return {
            value: e,
            source: null,
            stack: n ?? null,
            digest: t ?? null
        };
    }
    function zo(e, t) {
        try {
            console.error(t.value);
        } catch (n) {
            setTimeout(function() {
                throw n;
            });
        }
    }
    var gd = typeof WeakMap == "function" ? WeakMap : Map;
    function Ua(e, t, n) {
        n = Qe(-1, n), n.tag = 3, n.payload = {
            element: null
        };
        var r = t.value;
        return n.callback = function() {
            br || (br = !0, Uo = r), zo(e, t);
        }, n;
    }
    function Wa(e, t, n) {
        n = Qe(-1, n), n.tag = 3;
        var r = e.type.getDerivedStateFromError;
        if (typeof r == "function") {
            var l = t.value;
            n.payload = function() {
                return r(l);
            }, n.callback = function() {
                zo(e, t);
            };
        }
        var o = e.stateNode;
        return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
            zo(e, t), typeof r != "function" && (at === null ? at = new Set([
                this
            ]) : at.add(this));
            var u = t.stack;
            this.componentDidCatch(t.value, {
                componentStack: u !== null ? u : ""
            });
        }), n;
    }
    function zi(e, t, n) {
        var r = e.pingCache;
        if (r === null) {
            r = e.pingCache = new gd;
            var l = new Set;
            r.set(t, l);
        } else l = r.get(t), l === void 0 && (l = new Set, r.set(t, l));
        l.has(n) || (l.add(n), e = jd.bind(null, e, t, n), t.then(e, e));
    }
    function Ri(e) {
        do {
            var t;
            if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
            e = e.return;
        }while (e !== null);
        return null;
    }
    function Li(e, t, n, r, l) {
        return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Qe(-1, 1), t.tag = 2, st(n, t, 1))), n.lanes |= 1), e);
    }
    var wd = Ze.ReactCurrentOwner, pe = !1;
    function se(e, t, n, r) {
        t.child = e === null ? ma(t, null, n, r) : tn(t, e.child, n, r);
    }
    function ji(e, t, n, r, l) {
        n = n.render;
        var o = t.ref;
        return Zt(t, l), r = ku(e, t, n, r, o, l), n = Eu(), e !== null && !pe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Ge(e, t, l)) : (W && n && au(t), t.flags |= 1, se(e, t, r, l), t.child);
    }
    function Mi(e, t, n, r, l) {
        if (e === null) {
            var o = n.type;
            return typeof o == "function" && !ju(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, Va(e, t, o, r, l)) : (e = jr(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
        }
        if (o = e.child, !(e.lanes & l)) {
            var u = o.memoizedProps;
            if (n = n.compare, n = n !== null ? n : Wn, n(u, r) && e.ref === t.ref) return Ge(e, t, l);
        }
        return t.flags |= 1, e = ft(o, r), e.ref = t.ref, e.return = t, t.child = e;
    }
    function Va(e, t, n, r, l) {
        if (e !== null) {
            var o = e.memoizedProps;
            if (Wn(o, r) && e.ref === t.ref) if (pe = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) e.flags & 131072 && (pe = !0);
            else return t.lanes = e.lanes, Ge(e, t, l);
        }
        return Ro(e, t, n, r, l);
    }
    function Ba(e, t, n) {
        var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
        if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = {
            baseLanes: 0,
            cachePool: null,
            transitions: null
        }, F(Qt, ye), ye |= n;
        else {
            if (!(n & 1073741824)) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = {
                baseLanes: e,
                cachePool: null,
                transitions: null
            }, t.updateQueue = null, F(Qt, ye), ye |= e, null;
            t.memoizedState = {
                baseLanes: 0,
                cachePool: null,
                transitions: null
            }, r = o !== null ? o.baseLanes : n, F(Qt, ye), ye |= r;
        }
        else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, F(Qt, ye), ye |= r;
        return se(e, t, l, n), t.child;
    }
    function $a(e, t) {
        var n = t.ref;
        (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
    }
    function Ro(e, t, n, r, l) {
        var o = me(n) ? Tt : ue.current;
        return o = bt(t, o), Zt(t, l), n = ku(e, t, n, r, o, l), r = Eu(), e !== null && !pe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Ge(e, t, l)) : (W && r && au(t), t.flags |= 1, se(e, t, n, l), t.child);
    }
    function Ii(e, t, n, r, l) {
        if (me(n)) {
            var o = !0;
            $r(t);
        } else o = !1;
        if (Zt(t, l), t.stateNode === null) zr(e, t), Aa(t, n, r), xo(t, n, r, l), r = !0;
        else if (e === null) {
            var u = t.stateNode, i = t.memoizedProps;
            u.props = i;
            var s = u.context, a = n.contextType;
            typeof a == "object" && a !== null ? a = Ne(a) : (a = me(n) ? Tt : ue.current, a = bt(t, a));
            var h = n.getDerivedStateFromProps, p = typeof h == "function" || typeof u.getSnapshotBeforeUpdate == "function";
            p || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== r || s !== a) && xi(t, u, r, a), be = !1;
            var m = t.memoizedState;
            u.state = m, Xr(t, r, u, l), s = t.memoizedState, i !== r || m !== s || he.current || be ? (typeof h == "function" && (No(t, n, h, r), s = t.memoizedState), (i = be || Ni(t, n, i, r, m, s, a)) ? (p || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = s), u.props = r, u.state = s, u.context = a, r = i) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
        } else {
            u = t.stateNode, ya(e, t), i = t.memoizedProps, a = t.type === t.elementType ? i : Re(t.type, i), u.props = a, p = t.pendingProps, m = u.context, s = n.contextType, typeof s == "object" && s !== null ? s = Ne(s) : (s = me(n) ? Tt : ue.current, s = bt(t, s));
            var v = n.getDerivedStateFromProps;
            (h = typeof v == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== p || m !== s) && xi(t, u, r, s), be = !1, m = t.memoizedState, u.state = m, Xr(t, r, u, l);
            var g = t.memoizedState;
            i !== p || m !== g || he.current || be ? (typeof v == "function" && (No(t, n, v, r), g = t.memoizedState), (a = be || Ni(t, n, a, r, m, g, s) || !1) ? (h || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(r, g, s), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(r, g, s)), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = g), u.props = r, u.state = g, u.context = s, r = a) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && m === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024), r = !1);
        }
        return Lo(e, t, n, r, o, l);
    }
    function Lo(e, t, n, r, l, o) {
        $a(e, t);
        var u = (t.flags & 128) !== 0;
        if (!r && !u) return l && wi(t, n, !1), Ge(e, t, o);
        r = t.stateNode, wd.current = t;
        var i = u && typeof n.getDerivedStateFromError != "function" ? null : r.render();
        return t.flags |= 1, e !== null && u ? (t.child = tn(t, e.child, null, o), t.child = tn(t, null, i, o)) : se(e, t, i, o), t.memoizedState = r.state, l && wi(t, n, !0), t.child;
    }
    function Ha(e) {
        var t = e.stateNode;
        t.pendingContext ? gi(e, t.pendingContext, t.pendingContext !== t.context) : t.context && gi(e, t.context, !1), yu(e, t.containerInfo);
    }
    function Oi(e, t, n, r, l) {
        return en(), fu(l), t.flags |= 256, se(e, t, n, r), t.child;
    }
    var jo = {
        dehydrated: null,
        treeContext: null,
        retryLane: 0
    };
    function Mo(e) {
        return {
            baseLanes: e,
            cachePool: null,
            transitions: null
        };
    }
    function Qa(e, t, n) {
        var r = t.pendingProps, l = V.current, o = !1, u = (t.flags & 128) !== 0, i;
        if ((i = u) || (i = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), i ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), F(V, l & 1), e === null) return Po(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (u = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, u = {
            mode: "hidden",
            children: u
        }, !(r & 1) && o !== null ? (o.childLanes = 0, o.pendingProps = u) : o = ml(u, r, 0, null), e = Pt(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = Mo(n), t.memoizedState = jo, e) : Pu(t, u));
        if (l = e.memoizedState, l !== null && (i = l.dehydrated, i !== null)) return Sd(e, t, u, r, i, l, n);
        if (o) {
            o = r.fallback, u = t.mode, l = e.child, i = l.sibling;
            var s = {
                mode: "hidden",
                children: r.children
            };
            return !(u & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = s, t.deletions = null) : (r = ft(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), i !== null ? o = ft(i, o) : (o = Pt(o, u, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, u = e.child.memoizedState, u = u === null ? Mo(n) : {
                baseLanes: u.baseLanes | n,
                cachePool: null,
                transitions: u.transitions
            }, o.memoizedState = u, o.childLanes = e.childLanes & ~n, t.memoizedState = jo, r;
        }
        return o = e.child, e = o.sibling, r = ft(o, {
            mode: "visible",
            children: r.children
        }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [
            e
        ], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
    }
    function Pu(e, t) {
        return t = ml({
            mode: "visible",
            children: t
        }, e.mode, 0, null), t.return = e, e.child = t;
    }
    function yr(e, t, n, r) {
        return r !== null && fu(r), tn(t, e.child, null, n), e = Pu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
    }
    function Sd(e, t, n, r, l, o, u) {
        if (n) return t.flags & 256 ? (t.flags &= -257, r = Ql(Error(w(422))), yr(e, t, u, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = ml({
            mode: "visible",
            children: r.children
        }, l, 0, null), o = Pt(o, l, u, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, t.mode & 1 && tn(t, e.child, null, u), t.child.memoizedState = Mo(u), t.memoizedState = jo, o);
        if (!(t.mode & 1)) return yr(e, t, u, null);
        if (l.data === "$!") {
            if (r = l.nextSibling && l.nextSibling.dataset, r) var i = r.dgst;
            return r = i, o = Error(w(419)), r = Ql(o, r, void 0), yr(e, t, u, r);
        }
        if (i = (u & e.childLanes) !== 0, pe || i) {
            if (r = q, r !== null) {
                switch(u & -u){
                    case 4:
                        l = 2;
                        break;
                    case 16:
                        l = 8;
                        break;
                    case 64:
                    case 128:
                    case 256:
                    case 512:
                    case 1024:
                    case 2048:
                    case 4096:
                    case 8192:
                    case 16384:
                    case 32768:
                    case 65536:
                    case 131072:
                    case 262144:
                    case 524288:
                    case 1048576:
                    case 2097152:
                    case 4194304:
                    case 8388608:
                    case 16777216:
                    case 33554432:
                    case 67108864:
                        l = 32;
                        break;
                    case 536870912:
                        l = 268435456;
                        break;
                    default:
                        l = 0;
                }
                l = l & (r.suspendedLanes | u) ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Xe(e, l), Ie(r, e, l, -1));
            }
            return Lu(), r = Ql(Error(w(421))), yr(e, t, u, r);
        }
        return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Md.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, ge = it(l.nextSibling), we = t, W = !0, je = null, e !== null && (Ce[_e++] = $e, Ce[_e++] = He, Ce[_e++] = Nt, $e = e.id, He = e.overflow, Nt = t), t = Pu(t, r.children), t.flags |= 4096, t);
    }
    function Di(e, t, n) {
        e.lanes |= t;
        var r = e.alternate;
        r !== null && (r.lanes |= t), To(e.return, t, n);
    }
    function Yl(e, t, n, r, l) {
        var o = e.memoizedState;
        o === null ? e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailMode: l
        } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
    }
    function Ya(e, t, n) {
        var r = t.pendingProps, l = r.revealOrder, o = r.tail;
        if (se(e, t, r.children, n), r = V.current, r & 2) r = r & 1 | 2, t.flags |= 128;
        else {
            if (e !== null && e.flags & 128) e: for(e = t.child; e !== null;){
                if (e.tag === 13) e.memoizedState !== null && Di(e, n, t);
                else if (e.tag === 19) Di(e, n, t);
                else if (e.child !== null) {
                    e.child.return = e, e = e.child;
                    continue;
                }
                if (e === t) break e;
                for(; e.sibling === null;){
                    if (e.return === null || e.return === t) break e;
                    e = e.return;
                }
                e.sibling.return = e.return, e = e.sibling;
            }
            r &= 1;
        }
        if (F(V, r), !(t.mode & 1)) t.memoizedState = null;
        else switch(l){
            case "forwards":
                for(n = t.child, l = null; n !== null;)e = n.alternate, e !== null && Gr(e) === null && (l = n), n = n.sibling;
                n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Yl(t, !1, l, n, o);
                break;
            case "backwards":
                for(n = null, l = t.child, t.child = null; l !== null;){
                    if (e = l.alternate, e !== null && Gr(e) === null) {
                        t.child = l;
                        break;
                    }
                    e = l.sibling, l.sibling = n, n = l, l = e;
                }
                Yl(t, !0, n, null, o);
                break;
            case "together":
                Yl(t, !1, null, null, void 0);
                break;
            default:
                t.memoizedState = null;
        }
        return t.child;
    }
    function zr(e, t) {
        !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
    }
    function Ge(e, t, n) {
        if (e !== null && (t.dependencies = e.dependencies), zt |= t.lanes, !(n & t.childLanes)) return null;
        if (e !== null && t.child !== e.child) throw Error(w(153));
        if (t.child !== null) {
            for(e = t.child, n = ft(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;)e = e.sibling, n = n.sibling = ft(e, e.pendingProps), n.return = t;
            n.sibling = null;
        }
        return t.child;
    }
    function kd(e, t, n) {
        switch(t.tag){
            case 3:
                Ha(t), en();
                break;
            case 5:
                ga(t);
                break;
            case 1:
                me(t.type) && $r(t);
                break;
            case 4:
                yu(t, t.stateNode.containerInfo);
                break;
            case 10:
                var r = t.type._context, l = t.memoizedProps.value;
                F(Yr, r._currentValue), r._currentValue = l;
                break;
            case 13:
                if (r = t.memoizedState, r !== null) return r.dehydrated !== null ? (F(V, V.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Qa(e, t, n) : (F(V, V.current & 1), e = Ge(e, t, n), e !== null ? e.sibling : null);
                F(V, V.current & 1);
                break;
            case 19:
                if (r = (n & t.childLanes) !== 0, e.flags & 128) {
                    if (r) return Ya(e, t, n);
                    t.flags |= 128;
                }
                if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), F(V, V.current), r) break;
                return null;
            case 22:
            case 23:
                return t.lanes = 0, Ba(e, t, n);
        }
        return Ge(e, t, n);
    }
    var Ka, Io, Xa, Ga;
    Ka = function(e, t) {
        for(var n = t.child; n !== null;){
            if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
            else if (n.tag !== 4 && n.child !== null) {
                n.child.return = n, n = n.child;
                continue;
            }
            if (n === t) break;
            for(; n.sibling === null;){
                if (n.return === null || n.return === t) return;
                n = n.return;
            }
            n.sibling.return = n.return, n = n.sibling;
        }
    };
    Io = function() {};
    Xa = function(e, t, n, r) {
        var l = e.memoizedProps;
        if (l !== r) {
            e = t.stateNode, Ct(We.current);
            var o = null;
            switch(n){
                case "input":
                    l = to(e, l), r = to(e, r), o = [];
                    break;
                case "select":
                    l = $({}, l, {
                        value: void 0
                    }), r = $({}, r, {
                        value: void 0
                    }), o = [];
                    break;
                case "textarea":
                    l = lo(e, l), r = lo(e, r), o = [];
                    break;
                default:
                    typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Vr);
            }
            uo(n, r);
            var u;
            n = null;
            for(a in l)if (!r.hasOwnProperty(a) && l.hasOwnProperty(a) && l[a] != null) if (a === "style") {
                var i = l[a];
                for(u in i)i.hasOwnProperty(u) && (n || (n = {}), n[u] = "");
            } else a !== "dangerouslySetInnerHTML" && a !== "children" && a !== "suppressContentEditableWarning" && a !== "suppressHydrationWarning" && a !== "autoFocus" && (Mn.hasOwnProperty(a) ? o || (o = []) : (o = o || []).push(a, null));
            for(a in r){
                var s = r[a];
                if (i = l?.[a], r.hasOwnProperty(a) && s !== i && (s != null || i != null)) if (a === "style") if (i) {
                    for(u in i)!i.hasOwnProperty(u) || s && s.hasOwnProperty(u) || (n || (n = {}), n[u] = "");
                    for(u in s)s.hasOwnProperty(u) && i[u] !== s[u] && (n || (n = {}), n[u] = s[u]);
                } else n || (o || (o = []), o.push(a, n)), n = s;
                else a === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, i = i ? i.__html : void 0, s != null && i !== s && (o = o || []).push(a, s)) : a === "children" ? typeof s != "string" && typeof s != "number" || (o = o || []).push(a, "" + s) : a !== "suppressContentEditableWarning" && a !== "suppressHydrationWarning" && (Mn.hasOwnProperty(a) ? (s != null && a === "onScroll" && A("scroll", e), o || i === s || (o = [])) : (o = o || []).push(a, s));
            }
            n && (o = o || []).push("style", n);
            var a = o;
            (t.updateQueue = a) && (t.flags |= 4);
        }
    };
    Ga = function(e, t, n, r) {
        n !== r && (t.flags |= 4);
    };
    function yn(e, t) {
        if (!W) switch(e.tailMode){
            case "hidden":
                t = e.tail;
                for(var n = null; t !== null;)t.alternate !== null && (n = t), t = t.sibling;
                n === null ? e.tail = null : n.sibling = null;
                break;
            case "collapsed":
                n = e.tail;
                for(var r = null; n !== null;)n.alternate !== null && (r = n), n = n.sibling;
                r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
        }
    }
    function re(e) {
        var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
        if (t) for(var l = e.child; l !== null;)n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
        else for(l = e.child; l !== null;)n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
        return e.subtreeFlags |= r, e.childLanes = n, t;
    }
    function Ed(e, t, n) {
        var r = t.pendingProps;
        switch(cu(t), t.tag){
            case 2:
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14:
                return re(t), null;
            case 1:
                return me(t.type) && Br(), re(t), null;
            case 3:
                return r = t.stateNode, nn(), U(he), U(ue), wu(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (mr(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, je !== null && (Bo(je), je = null))), Io(e, t), re(t), null;
            case 5:
                gu(t);
                var l = Ct(Qn.current);
                if (n = t.type, e !== null && t.stateNode != null) Xa(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
                else {
                    if (!r) {
                        if (t.stateNode === null) throw Error(w(166));
                        return re(t), null;
                    }
                    if (e = Ct(We.current), mr(t)) {
                        r = t.stateNode, n = t.type;
                        var o = t.memoizedProps;
                        switch(r[Ae] = t, r[$n] = o, e = (t.mode & 1) !== 0, n){
                            case "dialog":
                                A("cancel", r), A("close", r);
                                break;
                            case "iframe":
                            case "object":
                            case "embed":
                                A("load", r);
                                break;
                            case "video":
                            case "audio":
                                for(l = 0; l < En.length; l++)A(En[l], r);
                                break;
                            case "source":
                                A("error", r);
                                break;
                            case "img":
                            case "image":
                            case "link":
                                A("error", r), A("load", r);
                                break;
                            case "details":
                                A("toggle", r);
                                break;
                            case "input":
                                Qu(r, o), A("invalid", r);
                                break;
                            case "select":
                                r._wrapperState = {
                                    wasMultiple: !!o.multiple
                                }, A("invalid", r);
                                break;
                            case "textarea":
                                Ku(r, o), A("invalid", r);
                        }
                        uo(n, o), l = null;
                        for(var u in o)if (o.hasOwnProperty(u)) {
                            var i = o[u];
                            u === "children" ? typeof i == "string" ? r.textContent !== i && (o.suppressHydrationWarning !== !0 && hr(r.textContent, i, e), l = [
                                "children",
                                i
                            ]) : typeof i == "number" && r.textContent !== "" + i && (o.suppressHydrationWarning !== !0 && hr(r.textContent, i, e), l = [
                                "children",
                                "" + i
                            ]) : Mn.hasOwnProperty(u) && i != null && u === "onScroll" && A("scroll", r);
                        }
                        switch(n){
                            case "input":
                                ur(r), Yu(r, o, !0);
                                break;
                            case "textarea":
                                ur(r), Xu(r);
                                break;
                            case "select":
                            case "option":
                                break;
                            default:
                                typeof o.onClick == "function" && (r.onclick = Vr);
                        }
                        r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
                    } else {
                        u = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Cs(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = u.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = u.createElement(n, {
                            is: r.is
                        }) : (e = u.createElement(n), n === "select" && (u = e, r.multiple ? u.multiple = !0 : r.size && (u.size = r.size))) : e = u.createElementNS(e, n), e[Ae] = t, e[$n] = r, Ka(e, t, !1, !1), t.stateNode = e;
                        e: {
                            switch(u = io(n, r), n){
                                case "dialog":
                                    A("cancel", e), A("close", e), l = r;
                                    break;
                                case "iframe":
                                case "object":
                                case "embed":
                                    A("load", e), l = r;
                                    break;
                                case "video":
                                case "audio":
                                    for(l = 0; l < En.length; l++)A(En[l], e);
                                    l = r;
                                    break;
                                case "source":
                                    A("error", e), l = r;
                                    break;
                                case "img":
                                case "image":
                                case "link":
                                    A("error", e), A("load", e), l = r;
                                    break;
                                case "details":
                                    A("toggle", e), l = r;
                                    break;
                                case "input":
                                    Qu(e, r), l = to(e, r), A("invalid", e);
                                    break;
                                case "option":
                                    l = r;
                                    break;
                                case "select":
                                    e._wrapperState = {
                                        wasMultiple: !!r.multiple
                                    }, l = $({}, r, {
                                        value: void 0
                                    }), A("invalid", e);
                                    break;
                                case "textarea":
                                    Ku(e, r), l = lo(e, r), A("invalid", e);
                                    break;
                                default:
                                    l = r;
                            }
                            uo(n, l), i = l;
                            for(o in i)if (i.hasOwnProperty(o)) {
                                var s = i[o];
                                o === "style" ? Ts(e, s) : o === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && _s(e, s)) : o === "children" ? typeof s == "string" ? (n !== "textarea" || s !== "") && In(e, s) : typeof s == "number" && In(e, "" + s) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (Mn.hasOwnProperty(o) ? s != null && o === "onScroll" && A("scroll", e) : s != null && Go(e, o, s, u));
                            }
                            switch(n){
                                case "input":
                                    ur(e), Yu(e, r, !1);
                                    break;
                                case "textarea":
                                    ur(e), Xu(e);
                                    break;
                                case "option":
                                    r.value != null && e.setAttribute("value", "" + dt(r.value));
                                    break;
                                case "select":
                                    e.multiple = !!r.multiple, o = r.value, o != null ? Yt(e, !!r.multiple, o, !1) : r.defaultValue != null && Yt(e, !!r.multiple, r.defaultValue, !0);
                                    break;
                                default:
                                    typeof l.onClick == "function" && (e.onclick = Vr);
                            }
                            switch(n){
                                case "button":
                                case "input":
                                case "select":
                                case "textarea":
                                    r = !!r.autoFocus;
                                    break e;
                                case "img":
                                    r = !0;
                                    break e;
                                default:
                                    r = !1;
                            }
                        }
                        r && (t.flags |= 4);
                    }
                    t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
                }
                return re(t), null;
            case 6:
                if (e && t.stateNode != null) Ga(e, t, e.memoizedProps, r);
                else {
                    if (typeof r != "string" && t.stateNode === null) throw Error(w(166));
                    if (n = Ct(Qn.current), Ct(We.current), mr(t)) {
                        if (r = t.stateNode, n = t.memoizedProps, r[Ae] = t, (o = r.nodeValue !== n) && (e = we, e !== null)) switch(e.tag){
                            case 3:
                                hr(r.nodeValue, n, (e.mode & 1) !== 0);
                                break;
                            case 5:
                                e.memoizedProps.suppressHydrationWarning !== !0 && hr(r.nodeValue, n, (e.mode & 1) !== 0);
                        }
                        o && (t.flags |= 4);
                    } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Ae] = t, t.stateNode = r;
                }
                return re(t), null;
            case 13:
                if (U(V), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
                    if (W && ge !== null && t.mode & 1 && !(t.flags & 128)) pa(), en(), t.flags |= 98560, o = !1;
                    else if (o = mr(t), r !== null && r.dehydrated !== null) {
                        if (e === null) {
                            if (!o) throw Error(w(318));
                            if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(w(317));
                            o[Ae] = t;
                        } else en(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
                        re(t), o = !1;
                    } else je !== null && (Bo(je), je = null), o = !0;
                    if (!o) return t.flags & 65536 ? t : null;
                }
                return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || V.current & 1 ? G === 0 && (G = 3) : Lu())), t.updateQueue !== null && (t.flags |= 4), re(t), null);
            case 4:
                return nn(), Io(e, t), e === null && Vn(t.stateNode.containerInfo), re(t), null;
            case 10:
                return hu(t.type._context), re(t), null;
            case 17:
                return me(t.type) && Br(), re(t), null;
            case 19:
                if (U(V), o = t.memoizedState, o === null) return re(t), null;
                if (r = (t.flags & 128) !== 0, u = o.rendering, u === null) if (r) yn(o, !1);
                else {
                    if (G !== 0 || e !== null && e.flags & 128) for(e = t.child; e !== null;){
                        if (u = Gr(e), u !== null) {
                            for(t.flags |= 128, yn(o, !1), r = u.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null;)o = n, e = r, o.flags &= 14680066, u = o.alternate, u === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = u.childLanes, o.lanes = u.lanes, o.child = u.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = u.memoizedProps, o.memoizedState = u.memoizedState, o.updateQueue = u.updateQueue, o.type = u.type, e = u.dependencies, o.dependencies = e === null ? null : {
                                lanes: e.lanes,
                                firstContext: e.firstContext
                            }), n = n.sibling;
                            return F(V, V.current & 1 | 2), t.child;
                        }
                        e = e.sibling;
                    }
                    o.tail !== null && Y() > ln && (t.flags |= 128, r = !0, yn(o, !1), t.lanes = 4194304);
                }
                else {
                    if (!r) if (e = Gr(u), e !== null) {
                        if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), yn(o, !0), o.tail === null && o.tailMode === "hidden" && !u.alternate && !W) return re(t), null;
                    } else 2 * Y() - o.renderingStartTime > ln && n !== 1073741824 && (t.flags |= 128, r = !0, yn(o, !1), t.lanes = 4194304);
                    o.isBackwards ? (u.sibling = t.child, t.child = u) : (n = o.last, n !== null ? n.sibling = u : t.child = u, o.last = u);
                }
                return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Y(), t.sibling = null, n = V.current, F(V, r ? n & 1 | 2 : n & 1), t) : (re(t), null);
            case 22:
            case 23:
                return Ru(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? ye & 1073741824 && (re(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : re(t), null;
            case 24:
                return null;
            case 25:
                return null;
        }
        throw Error(w(156, t.tag));
    }
    function Cd(e, t) {
        switch(cu(t), t.tag){
            case 1:
                return me(t.type) && Br(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
            case 3:
                return nn(), U(he), U(ue), wu(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
            case 5:
                return gu(t), null;
            case 13:
                if (U(V), e = t.memoizedState, e !== null && e.dehydrated !== null) {
                    if (t.alternate === null) throw Error(w(340));
                    en();
                }
                return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
            case 19:
                return U(V), null;
            case 4:
                return nn(), null;
            case 10:
                return hu(t.type._context), null;
            case 22:
            case 23:
                return Ru(), null;
            case 24:
                return null;
            default:
                return null;
        }
    }
    var gr = !1, le = !1, _d = typeof WeakSet == "function" ? WeakSet : Set, E = null;
    function Ht(e, t) {
        var n = e.ref;
        if (n !== null) if (typeof n == "function") try {
            n(null);
        } catch (r) {
            H(e, t, r);
        }
        else n.current = null;
    }
    function Oo(e, t, n) {
        try {
            n();
        } catch (r) {
            H(e, t, r);
        }
    }
    var Fi = !1;
    function Pd(e, t) {
        if (go = Ar, e = ea(), su(e)) {
            if ("selectionStart" in e) var n = {
                start: e.selectionStart,
                end: e.selectionEnd
            };
            else e: {
                n = (n = e.ownerDocument) && n.defaultView || window;
                var r = n.getSelection && n.getSelection();
                if (r && r.rangeCount !== 0) {
                    n = r.anchorNode;
                    var l = r.anchorOffset, o = r.focusNode;
                    r = r.focusOffset;
                    try {
                        n.nodeType, o.nodeType;
                    } catch  {
                        n = null;
                        break e;
                    }
                    var u = 0, i = -1, s = -1, a = 0, h = 0, p = e, m = null;
                    t: for(;;){
                        for(var v; p !== n || l !== 0 && p.nodeType !== 3 || (i = u + l), p !== o || r !== 0 && p.nodeType !== 3 || (s = u + r), p.nodeType === 3 && (u += p.nodeValue.length), (v = p.firstChild) !== null;)m = p, p = v;
                        for(;;){
                            if (p === e) break t;
                            if (m === n && ++a === l && (i = u), m === o && ++h === r && (s = u), (v = p.nextSibling) !== null) break;
                            p = m, m = p.parentNode;
                        }
                        p = v;
                    }
                    n = i === -1 || s === -1 ? null : {
                        start: i,
                        end: s
                    };
                } else n = null;
            }
            n = n || {
                start: 0,
                end: 0
            };
        } else n = null;
        for(wo = {
            focusedElem: e,
            selectionRange: n
        }, Ar = !1, E = t; E !== null;)if (t = E, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, E = e;
        else for(; E !== null;){
            t = E;
            try {
                var g = t.alternate;
                if (t.flags & 1024) switch(t.tag){
                    case 0:
                    case 11:
                    case 15:
                        break;
                    case 1:
                        if (g !== null) {
                            var S = g.memoizedProps, N = g.memoizedState, f = t.stateNode, c = f.getSnapshotBeforeUpdate(t.elementType === t.type ? S : Re(t.type, S), N);
                            f.__reactInternalSnapshotBeforeUpdate = c;
                        }
                        break;
                    case 3:
                        var d = t.stateNode.containerInfo;
                        d.nodeType === 1 ? d.textContent = "" : d.nodeType === 9 && d.documentElement && d.removeChild(d.documentElement);
                        break;
                    case 5:
                    case 6:
                    case 4:
                    case 17:
                        break;
                    default:
                        throw Error(w(163));
                }
            } catch (y) {
                H(t, t.return, y);
            }
            if (e = t.sibling, e !== null) {
                e.return = t.return, E = e;
                break;
            }
            E = t.return;
        }
        return g = Fi, Fi = !1, g;
    }
    function Rn(e, t, n) {
        var r = t.updateQueue;
        if (r = r !== null ? r.lastEffect : null, r !== null) {
            var l = r = r.next;
            do {
                if ((l.tag & e) === e) {
                    var o = l.destroy;
                    l.destroy = void 0, o !== void 0 && Oo(t, n, o);
                }
                l = l.next;
            }while (l !== r);
        }
    }
    function pl(e, t) {
        if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
            var n = t = t.next;
            do {
                if ((n.tag & e) === e) {
                    var r = n.create;
                    n.destroy = r();
                }
                n = n.next;
            }while (n !== t);
        }
    }
    function Do(e) {
        var t = e.ref;
        if (t !== null) {
            var n = e.stateNode;
            switch(e.tag){
                case 5:
                    e = n;
                    break;
                default:
                    e = n;
            }
            typeof t == "function" ? t(e) : t.current = e;
        }
    }
    function Za(e) {
        var t = e.alternate;
        t !== null && (e.alternate = null, Za(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Ae], delete t[$n], delete t[Eo], delete t[id], delete t[sd])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    function Ja(e) {
        return e.tag === 5 || e.tag === 3 || e.tag === 4;
    }
    function Ai(e) {
        e: for(;;){
            for(; e.sibling === null;){
                if (e.return === null || Ja(e.return)) return null;
                e = e.return;
            }
            for(e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;){
                if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
                e.child.return = e, e = e.child;
            }
            if (!(e.flags & 2)) return e.stateNode;
        }
    }
    function Fo(e, t, n) {
        var r = e.tag;
        if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Vr));
        else if (r !== 4 && (e = e.child, e !== null)) for(Fo(e, t, n), e = e.sibling; e !== null;)Fo(e, t, n), e = e.sibling;
    }
    function Ao(e, t, n) {
        var r = e.tag;
        if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
        else if (r !== 4 && (e = e.child, e !== null)) for(Ao(e, t, n), e = e.sibling; e !== null;)Ao(e, t, n), e = e.sibling;
    }
    var b = null, Le = !1;
    function Je(e, t, n) {
        for(n = n.child; n !== null;)qa(e, t, n), n = n.sibling;
    }
    function qa(e, t, n) {
        if (Ue && typeof Ue.onCommitFiberUnmount == "function") try {
            Ue.onCommitFiberUnmount(ol, n);
        } catch  {}
        switch(n.tag){
            case 5:
                le || Ht(n, t);
            case 6:
                var r = b, l = Le;
                b = null, Je(e, t, n), b = r, Le = l, b !== null && (Le ? (e = b, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : b.removeChild(n.stateNode));
                break;
            case 18:
                b !== null && (Le ? (e = b, n = n.stateNode, e.nodeType === 8 ? Ul(e.parentNode, n) : e.nodeType === 1 && Ul(e, n), An(e)) : Ul(b, n.stateNode));
                break;
            case 4:
                r = b, l = Le, b = n.stateNode.containerInfo, Le = !0, Je(e, t, n), b = r, Le = l;
                break;
            case 0:
            case 11:
            case 14:
            case 15:
                if (!le && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
                    l = r = r.next;
                    do {
                        var o = l, u = o.destroy;
                        o = o.tag, u !== void 0 && (o & 2 || o & 4) && Oo(n, t, u), l = l.next;
                    }while (l !== r);
                }
                Je(e, t, n);
                break;
            case 1:
                if (!le && (Ht(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
                    r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
                } catch (i) {
                    H(n, t, i);
                }
                Je(e, t, n);
                break;
            case 21:
                Je(e, t, n);
                break;
            case 22:
                n.mode & 1 ? (le = (r = le) || n.memoizedState !== null, Je(e, t, n), le = r) : Je(e, t, n);
                break;
            default:
                Je(e, t, n);
        }
    }
    function Ui(e) {
        var t = e.updateQueue;
        if (t !== null) {
            e.updateQueue = null;
            var n = e.stateNode;
            n === null && (n = e.stateNode = new _d), t.forEach(function(r) {
                var l = Id.bind(null, e, r);
                n.has(r) || (n.add(r), r.then(l, l));
            });
        }
    }
    function ze(e, t) {
        var n = t.deletions;
        if (n !== null) for(var r = 0; r < n.length; r++){
            var l = n[r];
            try {
                var o = e, u = t, i = u;
                e: for(; i !== null;){
                    switch(i.tag){
                        case 5:
                            b = i.stateNode, Le = !1;
                            break e;
                        case 3:
                            b = i.stateNode.containerInfo, Le = !0;
                            break e;
                        case 4:
                            b = i.stateNode.containerInfo, Le = !0;
                            break e;
                    }
                    i = i.return;
                }
                if (b === null) throw Error(w(160));
                qa(o, u, l), b = null, Le = !1;
                var s = l.alternate;
                s !== null && (s.return = null), l.return = null;
            } catch (a) {
                H(l, t, a);
            }
        }
        if (t.subtreeFlags & 12854) for(t = t.child; t !== null;)ba(t, e), t = t.sibling;
    }
    function ba(e, t) {
        var n = e.alternate, r = e.flags;
        switch(e.tag){
            case 0:
            case 11:
            case 14:
            case 15:
                if (ze(t, e), De(e), r & 4) {
                    try {
                        Rn(3, e, e.return), pl(3, e);
                    } catch (S) {
                        H(e, e.return, S);
                    }
                    try {
                        Rn(5, e, e.return);
                    } catch (S) {
                        H(e, e.return, S);
                    }
                }
                break;
            case 1:
                ze(t, e), De(e), r & 512 && n !== null && Ht(n, n.return);
                break;
            case 5:
                if (ze(t, e), De(e), r & 512 && n !== null && Ht(n, n.return), e.flags & 32) {
                    var l = e.stateNode;
                    try {
                        In(l, "");
                    } catch (S) {
                        H(e, e.return, S);
                    }
                }
                if (r & 4 && (l = e.stateNode, l != null)) {
                    var o = e.memoizedProps, u = n !== null ? n.memoizedProps : o, i = e.type, s = e.updateQueue;
                    if (e.updateQueue = null, s !== null) try {
                        i === "input" && o.type === "radio" && o.name != null && ks(l, o), io(i, u);
                        var a = io(i, o);
                        for(u = 0; u < s.length; u += 2){
                            var h = s[u], p = s[u + 1];
                            h === "style" ? Ts(l, p) : h === "dangerouslySetInnerHTML" ? _s(l, p) : h === "children" ? In(l, p) : Go(l, h, p, a);
                        }
                        switch(i){
                            case "input":
                                no(l, o);
                                break;
                            case "textarea":
                                Es(l, o);
                                break;
                            case "select":
                                var m = l._wrapperState.wasMultiple;
                                l._wrapperState.wasMultiple = !!o.multiple;
                                var v = o.value;
                                v != null ? Yt(l, !!o.multiple, v, !1) : m !== !!o.multiple && (o.defaultValue != null ? Yt(l, !!o.multiple, o.defaultValue, !0) : Yt(l, !!o.multiple, o.multiple ? [] : "", !1));
                        }
                        l[$n] = o;
                    } catch (S) {
                        H(e, e.return, S);
                    }
                }
                break;
            case 6:
                if (ze(t, e), De(e), r & 4) {
                    if (e.stateNode === null) throw Error(w(162));
                    l = e.stateNode, o = e.memoizedProps;
                    try {
                        l.nodeValue = o;
                    } catch (S) {
                        H(e, e.return, S);
                    }
                }
                break;
            case 3:
                if (ze(t, e), De(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
                    An(t.containerInfo);
                } catch (S) {
                    H(e, e.return, S);
                }
                break;
            case 4:
                ze(t, e), De(e);
                break;
            case 13:
                ze(t, e), De(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (xu = Y())), r & 4 && Ui(e);
                break;
            case 22:
                if (h = n !== null && n.memoizedState !== null, e.mode & 1 ? (le = (a = le) || h, ze(t, e), le = a) : ze(t, e), De(e), r & 8192) {
                    if (a = e.memoizedState !== null, (e.stateNode.isHidden = a) && !h && e.mode & 1) for(E = e, h = e.child; h !== null;){
                        for(p = E = h; E !== null;){
                            switch(m = E, v = m.child, m.tag){
                                case 0:
                                case 11:
                                case 14:
                                case 15:
                                    Rn(4, m, m.return);
                                    break;
                                case 1:
                                    Ht(m, m.return);
                                    var g = m.stateNode;
                                    if (typeof g.componentWillUnmount == "function") {
                                        r = m, n = m.return;
                                        try {
                                            t = r, g.props = t.memoizedProps, g.state = t.memoizedState, g.componentWillUnmount();
                                        } catch (S) {
                                            H(r, n, S);
                                        }
                                    }
                                    break;
                                case 5:
                                    Ht(m, m.return);
                                    break;
                                case 22:
                                    if (m.memoizedState !== null) {
                                        Vi(p);
                                        continue;
                                    }
                            }
                            v !== null ? (v.return = m, E = v) : Vi(p);
                        }
                        h = h.sibling;
                    }
                    e: for(h = null, p = e;;){
                        if (p.tag === 5) {
                            if (h === null) {
                                h = p;
                                try {
                                    l = p.stateNode, a ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (i = p.stateNode, s = p.memoizedProps.style, u = s != null && s.hasOwnProperty("display") ? s.display : null, i.style.display = Ps("display", u));
                                } catch (S) {
                                    H(e, e.return, S);
                                }
                            }
                        } else if (p.tag === 6) {
                            if (h === null) try {
                                p.stateNode.nodeValue = a ? "" : p.memoizedProps;
                            } catch (S) {
                                H(e, e.return, S);
                            }
                        } else if ((p.tag !== 22 && p.tag !== 23 || p.memoizedState === null || p === e) && p.child !== null) {
                            p.child.return = p, p = p.child;
                            continue;
                        }
                        if (p === e) break e;
                        for(; p.sibling === null;){
                            if (p.return === null || p.return === e) break e;
                            h === p && (h = null), p = p.return;
                        }
                        h === p && (h = null), p.sibling.return = p.return, p = p.sibling;
                    }
                }
                break;
            case 19:
                ze(t, e), De(e), r & 4 && Ui(e);
                break;
            case 21:
                break;
            default:
                ze(t, e), De(e);
        }
    }
    function De(e) {
        var t = e.flags;
        if (t & 2) {
            try {
                e: {
                    for(var n = e.return; n !== null;){
                        if (Ja(n)) {
                            var r = n;
                            break e;
                        }
                        n = n.return;
                    }
                    throw Error(w(160));
                }
                switch(r.tag){
                    case 5:
                        var l = r.stateNode;
                        r.flags & 32 && (In(l, ""), r.flags &= -33);
                        var o = Ai(e);
                        Ao(e, o, l);
                        break;
                    case 3:
                    case 4:
                        var u = r.stateNode.containerInfo, i = Ai(e);
                        Fo(e, i, u);
                        break;
                    default:
                        throw Error(w(161));
                }
            } catch (s) {
                H(e, e.return, s);
            }
            e.flags &= -3;
        }
        t & 4096 && (e.flags &= -4097);
    }
    function Td(e, t, n) {
        E = e, ec(e);
    }
    function ec(e, t, n) {
        for(var r = (e.mode & 1) !== 0; E !== null;){
            var l = E, o = l.child;
            if (l.tag === 22 && r) {
                var u = l.memoizedState !== null || gr;
                if (!u) {
                    var i = l.alternate, s = i !== null && i.memoizedState !== null || le;
                    i = gr;
                    var a = le;
                    if (gr = u, (le = s) && !a) for(E = l; E !== null;)u = E, s = u.child, u.tag === 22 && u.memoizedState !== null ? Bi(l) : s !== null ? (s.return = u, E = s) : Bi(l);
                    for(; o !== null;)E = o, ec(o), o = o.sibling;
                    E = l, gr = i, le = a;
                }
                Wi(e);
            } else l.subtreeFlags & 8772 && o !== null ? (o.return = l, E = o) : Wi(e);
        }
    }
    function Wi(e) {
        for(; E !== null;){
            var t = E;
            if (t.flags & 8772) {
                var n = t.alternate;
                try {
                    if (t.flags & 8772) switch(t.tag){
                        case 0:
                        case 11:
                        case 15:
                            le || pl(5, t);
                            break;
                        case 1:
                            var r = t.stateNode;
                            if (t.flags & 4 && !le) if (n === null) r.componentDidMount();
                            else {
                                var l = t.elementType === t.type ? n.memoizedProps : Re(t.type, n.memoizedProps);
                                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                            }
                            var o = t.updateQueue;
                            o !== null && _i(t, o, r);
                            break;
                        case 3:
                            var u = t.updateQueue;
                            if (u !== null) {
                                if (n = null, t.child !== null) switch(t.child.tag){
                                    case 5:
                                        n = t.child.stateNode;
                                        break;
                                    case 1:
                                        n = t.child.stateNode;
                                }
                                _i(t, u, n);
                            }
                            break;
                        case 5:
                            var i = t.stateNode;
                            if (n === null && t.flags & 4) {
                                n = i;
                                var s = t.memoizedProps;
                                switch(t.type){
                                    case "button":
                                    case "input":
                                    case "select":
                                    case "textarea":
                                        s.autoFocus && n.focus();
                                        break;
                                    case "img":
                                        s.src && (n.src = s.src);
                                }
                            }
                            break;
                        case 6:
                            break;
                        case 4:
                            break;
                        case 12:
                            break;
                        case 13:
                            if (t.memoizedState === null) {
                                var a = t.alternate;
                                if (a !== null) {
                                    var h = a.memoizedState;
                                    if (h !== null) {
                                        var p = h.dehydrated;
                                        p !== null && An(p);
                                    }
                                }
                            }
                            break;
                        case 19:
                        case 17:
                        case 21:
                        case 22:
                        case 23:
                        case 25:
                            break;
                        default:
                            throw Error(w(163));
                    }
                    le || t.flags & 512 && Do(t);
                } catch (m) {
                    H(t, t.return, m);
                }
            }
            if (t === e) {
                E = null;
                break;
            }
            if (n = t.sibling, n !== null) {
                n.return = t.return, E = n;
                break;
            }
            E = t.return;
        }
    }
    function Vi(e) {
        for(; E !== null;){
            var t = E;
            if (t === e) {
                E = null;
                break;
            }
            var n = t.sibling;
            if (n !== null) {
                n.return = t.return, E = n;
                break;
            }
            E = t.return;
        }
    }
    function Bi(e) {
        for(; E !== null;){
            var t = E;
            try {
                switch(t.tag){
                    case 0:
                    case 11:
                    case 15:
                        var n = t.return;
                        try {
                            pl(4, t);
                        } catch (s) {
                            H(t, n, s);
                        }
                        break;
                    case 1:
                        var r = t.stateNode;
                        if (typeof r.componentDidMount == "function") {
                            var l = t.return;
                            try {
                                r.componentDidMount();
                            } catch (s) {
                                H(t, l, s);
                            }
                        }
                        var o = t.return;
                        try {
                            Do(t);
                        } catch (s) {
                            H(t, o, s);
                        }
                        break;
                    case 5:
                        var u = t.return;
                        try {
                            Do(t);
                        } catch (s) {
                            H(t, u, s);
                        }
                }
            } catch (s) {
                H(t, t.return, s);
            }
            if (t === e) {
                E = null;
                break;
            }
            var i = t.sibling;
            if (i !== null) {
                i.return = t.return, E = i;
                break;
            }
            E = t.return;
        }
    }
    var Nd = Math.ceil, qr = Ze.ReactCurrentDispatcher, Tu = Ze.ReactCurrentOwner, Te = Ze.ReactCurrentBatchConfig, O = 0, q = null, K = null, ee = 0, ye = 0, Qt = mt(0), G = 0, Gn = null, zt = 0, hl = 0, Nu = 0, Ln = null, de = null, xu = 0, ln = 1 / 0, Ve = null, br = !1, Uo = null, at = null, wr = !1, rt = null, el = 0, jn = 0, Wo = null, Rr = -1, Lr = 0;
    function ae() {
        return O & 6 ? Y() : Rr !== -1 ? Rr : Rr = Y();
    }
    function ct(e) {
        return e.mode & 1 ? O & 2 && ee !== 0 ? ee & -ee : cd.transition !== null ? (Lr === 0 && (Lr = As()), Lr) : (e = D, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Qs(e.type)), e) : 1;
    }
    function Ie(e, t, n, r) {
        if (50 < jn) throw jn = 0, Wo = null, Error(w(185));
        Jn(e, n, r), (!(O & 2) || e !== q) && (e === q && (!(O & 2) && (hl |= n), G === 4 && tt(e, ee)), ve(e, r), n === 1 && O === 0 && !(t.mode & 1) && (ln = Y() + 500, cl && vt()));
    }
    function ve(e, t) {
        var n = e.callbackNode;
        cf(e, t);
        var r = Fr(e, e === q ? ee : 0);
        if (r === 0) n !== null && Ju(n), e.callbackNode = null, e.callbackPriority = 0;
        else if (t = r & -r, e.callbackPriority !== t) {
            if (n != null && Ju(n), t === 1) e.tag === 0 ? ad($i.bind(null, e)) : ca($i.bind(null, e)), od(function() {
                !(O & 6) && vt();
            }), n = null;
            else {
                switch(Us(r)){
                    case 1:
                        n = eu;
                        break;
                    case 4:
                        n = Ds;
                        break;
                    case 16:
                        n = Dr;
                        break;
                    case 536870912:
                        n = Fs;
                        break;
                    default:
                        n = Dr;
                }
                n = sc(n, tc.bind(null, e));
            }
            e.callbackPriority = t, e.callbackNode = n;
        }
    }
    function tc(e, t) {
        if (Rr = -1, Lr = 0, O & 6) throw Error(w(327));
        var n = e.callbackNode;
        if (Jt() && e.callbackNode !== n) return null;
        var r = Fr(e, e === q ? ee : 0);
        if (r === 0) return null;
        if (r & 30 || r & e.expiredLanes || t) t = tl(e, r);
        else {
            t = r;
            var l = O;
            O |= 2;
            var o = rc();
            (q !== e || ee !== t) && (Ve = null, ln = Y() + 500, _t(e, t));
            do try {
                Rd();
                break;
            } catch (i) {
                nc(e, i);
            }
            while (!0);
            pu(), qr.current = o, O = l, K !== null ? t = 0 : (q = null, ee = 0, t = G);
        }
        if (t !== 0) {
            if (t === 2 && (l = po(e), l !== 0 && (r = l, t = Vo(e, l))), t === 1) throw n = Gn, _t(e, 0), tt(e, r), ve(e, Y()), n;
            if (t === 6) tt(e, r);
            else {
                if (l = e.current.alternate, !(r & 30) && !xd(l) && (t = tl(e, r), t === 2 && (o = po(e), o !== 0 && (r = o, t = Vo(e, o))), t === 1)) throw n = Gn, _t(e, 0), tt(e, r), ve(e, Y()), n;
                switch(e.finishedWork = l, e.finishedLanes = r, t){
                    case 0:
                    case 1:
                        throw Error(w(345));
                    case 2:
                        St(e, de, Ve);
                        break;
                    case 3:
                        if (tt(e, r), (r & 130023424) === r && (t = xu + 500 - Y(), 10 < t)) {
                            if (Fr(e, 0) !== 0) break;
                            if (l = e.suspendedLanes, (l & r) !== r) {
                                ae(), e.pingedLanes |= e.suspendedLanes & l;
                                break;
                            }
                            e.timeoutHandle = ko(St.bind(null, e, de, Ve), t);
                            break;
                        }
                        St(e, de, Ve);
                        break;
                    case 4:
                        if (tt(e, r), (r & 4194240) === r) break;
                        for(t = e.eventTimes, l = -1; 0 < r;){
                            var u = 31 - Me(r);
                            o = 1 << u, u = t[u], u > l && (l = u), r &= ~o;
                        }
                        if (r = l, r = Y() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Nd(r / 1960)) - r, 10 < r) {
                            e.timeoutHandle = ko(St.bind(null, e, de, Ve), r);
                            break;
                        }
                        St(e, de, Ve);
                        break;
                    case 5:
                        St(e, de, Ve);
                        break;
                    default:
                        throw Error(w(329));
                }
            }
        }
        return ve(e, Y()), e.callbackNode === n ? tc.bind(null, e) : null;
    }
    function Vo(e, t) {
        var n = Ln;
        return e.current.memoizedState.isDehydrated && (_t(e, t).flags |= 256), e = tl(e, t), e !== 2 && (t = de, de = n, t !== null && Bo(t)), e;
    }
    function Bo(e) {
        de === null ? de = e : de.push.apply(de, e);
    }
    function xd(e) {
        for(var t = e;;){
            if (t.flags & 16384) {
                var n = t.updateQueue;
                if (n !== null && (n = n.stores, n !== null)) for(var r = 0; r < n.length; r++){
                    var l = n[r], o = l.getSnapshot;
                    l = l.value;
                    try {
                        if (!Oe(o(), l)) return !1;
                    } catch  {
                        return !1;
                    }
                }
            }
            if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
            else {
                if (t === e) break;
                for(; t.sibling === null;){
                    if (t.return === null || t.return === e) return !0;
                    t = t.return;
                }
                t.sibling.return = t.return, t = t.sibling;
            }
        }
        return !0;
    }
    function tt(e, t) {
        for(t &= ~Nu, t &= ~hl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t;){
            var n = 31 - Me(t), r = 1 << n;
            e[n] = -1, t &= ~r;
        }
    }
    function $i(e) {
        if (O & 6) throw Error(w(327));
        Jt();
        var t = Fr(e, 0);
        if (!(t & 1)) return ve(e, Y()), null;
        var n = tl(e, t);
        if (e.tag !== 0 && n === 2) {
            var r = po(e);
            r !== 0 && (t = r, n = Vo(e, r));
        }
        if (n === 1) throw n = Gn, _t(e, 0), tt(e, t), ve(e, Y()), n;
        if (n === 6) throw Error(w(345));
        return e.finishedWork = e.current.alternate, e.finishedLanes = t, St(e, de, Ve), ve(e, Y()), null;
    }
    function zu(e, t) {
        var n = O;
        O |= 1;
        try {
            return e(t);
        } finally{
            O = n, O === 0 && (ln = Y() + 500, cl && vt());
        }
    }
    function Rt(e) {
        rt !== null && rt.tag === 0 && !(O & 6) && Jt();
        var t = O;
        O |= 1;
        var n = Te.transition, r = D;
        try {
            if (Te.transition = null, D = 1, e) return e();
        } finally{
            D = r, Te.transition = n, O = t, !(O & 6) && vt();
        }
    }
    function Ru() {
        ye = Qt.current, U(Qt);
    }
    function _t(e, t) {
        e.finishedWork = null, e.finishedLanes = 0;
        var n = e.timeoutHandle;
        if (n !== -1 && (e.timeoutHandle = -1, ld(n)), K !== null) for(n = K.return; n !== null;){
            var r = n;
            switch(cu(r), r.tag){
                case 1:
                    r = r.type.childContextTypes, r != null && Br();
                    break;
                case 3:
                    nn(), U(he), U(ue), wu();
                    break;
                case 5:
                    gu(r);
                    break;
                case 4:
                    nn();
                    break;
                case 13:
                    U(V);
                    break;
                case 19:
                    U(V);
                    break;
                case 10:
                    hu(r.type._context);
                    break;
                case 22:
                case 23:
                    Ru();
            }
            n = n.return;
        }
        if (q = e, K = e = ft(e.current, null), ee = ye = t, G = 0, Gn = null, Nu = hl = zt = 0, de = Ln = null, Et !== null) {
            for(t = 0; t < Et.length; t++)if (n = Et[t], r = n.interleaved, r !== null) {
                n.interleaved = null;
                var l = r.next, o = n.pending;
                if (o !== null) {
                    var u = o.next;
                    o.next = l, r.next = u;
                }
                n.pending = r;
            }
            Et = null;
        }
        return e;
    }
    function nc(e, t) {
        do {
            var n = K;
            try {
                if (pu(), Nr.current = Jr, Zr) {
                    for(var r = B.memoizedState; r !== null;){
                        var l = r.queue;
                        l !== null && (l.pending = null), r = r.next;
                    }
                    Zr = !1;
                }
                if (xt = 0, J = X = B = null, zn = !1, Yn = 0, Tu.current = null, n === null || n.return === null) {
                    G = 1, Gn = t, K = null;
                    break;
                }
                e: {
                    var o = e, u = n.return, i = n, s = t;
                    if (t = ee, i.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
                        var a = s, h = i, p = h.tag;
                        if (!(h.mode & 1) && (p === 0 || p === 11 || p === 15)) {
                            var m = h.alternate;
                            m ? (h.updateQueue = m.updateQueue, h.memoizedState = m.memoizedState, h.lanes = m.lanes) : (h.updateQueue = null, h.memoizedState = null);
                        }
                        var v = Ri(u);
                        if (v !== null) {
                            v.flags &= -257, Li(v, u, i, o, t), v.mode & 1 && zi(o, a, t), t = v, s = a;
                            var g = t.updateQueue;
                            if (g === null) {
                                var S = new Set;
                                S.add(s), t.updateQueue = S;
                            } else g.add(s);
                            break e;
                        } else {
                            if (!(t & 1)) {
                                zi(o, a, t), Lu();
                                break e;
                            }
                            s = Error(w(426));
                        }
                    } else if (W && i.mode & 1) {
                        var N = Ri(u);
                        if (N !== null) {
                            !(N.flags & 65536) && (N.flags |= 256), Li(N, u, i, o, t), fu(rn(s, i));
                            break e;
                        }
                    }
                    o = s = rn(s, i), G !== 4 && (G = 2), Ln === null ? Ln = [
                        o
                    ] : Ln.push(o), o = u;
                    do {
                        switch(o.tag){
                            case 3:
                                o.flags |= 65536, t &= -t, o.lanes |= t;
                                var f = Ua(o, s, t);
                                Ci(o, f);
                                break e;
                            case 1:
                                i = s;
                                var c = o.type, d = o.stateNode;
                                if (!(o.flags & 128) && (typeof c.getDerivedStateFromError == "function" || d !== null && typeof d.componentDidCatch == "function" && (at === null || !at.has(d)))) {
                                    o.flags |= 65536, t &= -t, o.lanes |= t;
                                    var y = Wa(o, i, t);
                                    Ci(o, y);
                                    break e;
                                }
                        }
                        o = o.return;
                    }while (o !== null);
                }
                oc(n);
            } catch (k) {
                t = k, K === n && n !== null && (K = n = n.return);
                continue;
            }
            break;
        }while (!0);
    }
    function rc() {
        var e = qr.current;
        return qr.current = Jr, e === null ? Jr : e;
    }
    function Lu() {
        (G === 0 || G === 3 || G === 2) && (G = 4), q === null || !(zt & 268435455) && !(hl & 268435455) || tt(q, ee);
    }
    function tl(e, t) {
        var n = O;
        O |= 2;
        var r = rc();
        (q !== e || ee !== t) && (Ve = null, _t(e, t));
        do try {
            zd();
            break;
        } catch (l) {
            nc(e, l);
        }
        while (!0);
        if (pu(), O = n, qr.current = r, K !== null) throw Error(w(261));
        return q = null, ee = 0, G;
    }
    function zd() {
        for(; K !== null;)lc(K);
    }
    function Rd() {
        for(; K !== null && !ef();)lc(K);
    }
    function lc(e) {
        var t = ic(e.alternate, e, ye);
        e.memoizedProps = e.pendingProps, t === null ? oc(e) : K = t, Tu.current = null;
    }
    function oc(e) {
        var t = e;
        do {
            var n = t.alternate;
            if (e = t.return, t.flags & 32768) {
                if (n = Cd(n, t), n !== null) {
                    n.flags &= 32767, K = n;
                    return;
                }
                if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
                else {
                    G = 6, K = null;
                    return;
                }
            } else if (n = Ed(n, t, ye), n !== null) {
                K = n;
                return;
            }
            if (t = t.sibling, t !== null) {
                K = t;
                return;
            }
            K = t = e;
        }while (t !== null);
        G === 0 && (G = 5);
    }
    function St(e, t, n) {
        var r = D, l = Te.transition;
        try {
            Te.transition = null, D = 1, Ld(e, t, n, r);
        } finally{
            Te.transition = l, D = r;
        }
        return null;
    }
    function Ld(e, t, n, r) {
        do Jt();
        while (rt !== null);
        if (O & 6) throw Error(w(327));
        n = e.finishedWork;
        var l = e.finishedLanes;
        if (n === null) return null;
        if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(w(177));
        e.callbackNode = null, e.callbackPriority = 0;
        var o = n.lanes | n.childLanes;
        if (ff(e, o), e === q && (K = q = null, ee = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || wr || (wr = !0, sc(Dr, function() {
            return Jt(), null;
        })), o = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || o) {
            o = Te.transition, Te.transition = null;
            var u = D;
            D = 1;
            var i = O;
            O |= 4, Tu.current = null, Pd(e, n), ba(n, e), Jf(wo), Ar = !!go, wo = go = null, e.current = n, Td(n), tf(), O = i, D = u, Te.transition = o;
        } else e.current = n;
        if (wr && (wr = !1, rt = e, el = l), o = e.pendingLanes, o === 0 && (at = null), lf(n.stateNode), ve(e, Y()), t !== null) for(r = e.onRecoverableError, n = 0; n < t.length; n++)l = t[n], r(l.value, {
            componentStack: l.stack,
            digest: l.digest
        });
        if (br) throw br = !1, e = Uo, Uo = null, e;
        return el & 1 && e.tag !== 0 && Jt(), o = e.pendingLanes, o & 1 ? e === Wo ? jn++ : (jn = 0, Wo = e) : jn = 0, vt(), null;
    }
    function Jt() {
        if (rt !== null) {
            var e = Us(el), t = Te.transition, n = D;
            try {
                if (Te.transition = null, D = 16 > e ? 16 : e, rt === null) var r = !1;
                else {
                    if (e = rt, rt = null, el = 0, O & 6) throw Error(w(331));
                    var l = O;
                    for(O |= 4, E = e.current; E !== null;){
                        var o = E, u = o.child;
                        if (E.flags & 16) {
                            var i = o.deletions;
                            if (i !== null) {
                                for(var s = 0; s < i.length; s++){
                                    var a = i[s];
                                    for(E = a; E !== null;){
                                        var h = E;
                                        switch(h.tag){
                                            case 0:
                                            case 11:
                                            case 15:
                                                Rn(8, h, o);
                                        }
                                        var p = h.child;
                                        if (p !== null) p.return = h, E = p;
                                        else for(; E !== null;){
                                            h = E;
                                            var m = h.sibling, v = h.return;
                                            if (Za(h), h === a) {
                                                E = null;
                                                break;
                                            }
                                            if (m !== null) {
                                                m.return = v, E = m;
                                                break;
                                            }
                                            E = v;
                                        }
                                    }
                                }
                                var g = o.alternate;
                                if (g !== null) {
                                    var S = g.child;
                                    if (S !== null) {
                                        g.child = null;
                                        do {
                                            var N = S.sibling;
                                            S.sibling = null, S = N;
                                        }while (S !== null);
                                    }
                                }
                                E = o;
                            }
                        }
                        if (o.subtreeFlags & 2064 && u !== null) u.return = o, E = u;
                        else e: for(; E !== null;){
                            if (o = E, o.flags & 2048) switch(o.tag){
                                case 0:
                                case 11:
                                case 15:
                                    Rn(9, o, o.return);
                            }
                            var f = o.sibling;
                            if (f !== null) {
                                f.return = o.return, E = f;
                                break e;
                            }
                            E = o.return;
                        }
                    }
                    var c = e.current;
                    for(E = c; E !== null;){
                        u = E;
                        var d = u.child;
                        if (u.subtreeFlags & 2064 && d !== null) d.return = u, E = d;
                        else e: for(u = c; E !== null;){
                            if (i = E, i.flags & 2048) try {
                                switch(i.tag){
                                    case 0:
                                    case 11:
                                    case 15:
                                        pl(9, i);
                                }
                            } catch (k) {
                                H(i, i.return, k);
                            }
                            if (i === u) {
                                E = null;
                                break e;
                            }
                            var y = i.sibling;
                            if (y !== null) {
                                y.return = i.return, E = y;
                                break e;
                            }
                            E = i.return;
                        }
                    }
                    if (O = l, vt(), Ue && typeof Ue.onPostCommitFiberRoot == "function") try {
                        Ue.onPostCommitFiberRoot(ol, e);
                    } catch  {}
                    r = !0;
                }
                return r;
            } finally{
                D = n, Te.transition = t;
            }
        }
        return !1;
    }
    function Hi(e, t, n) {
        t = rn(n, t), t = Ua(e, t, 1), e = st(e, t, 1), t = ae(), e !== null && (Jn(e, 1, t), ve(e, t));
    }
    function H(e, t, n) {
        if (e.tag === 3) Hi(e, e, n);
        else for(; t !== null;){
            if (t.tag === 3) {
                Hi(t, e, n);
                break;
            } else if (t.tag === 1) {
                var r = t.stateNode;
                if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (at === null || !at.has(r))) {
                    e = rn(n, e), e = Wa(t, e, 1), t = st(t, e, 1), e = ae(), t !== null && (Jn(t, 1, e), ve(t, e));
                    break;
                }
            }
            t = t.return;
        }
    }
    function jd(e, t, n) {
        var r = e.pingCache;
        r !== null && r.delete(t), t = ae(), e.pingedLanes |= e.suspendedLanes & n, q === e && (ee & n) === n && (G === 4 || G === 3 && (ee & 130023424) === ee && 500 > Y() - xu ? _t(e, 0) : Nu |= n), ve(e, t);
    }
    function uc(e, t) {
        t === 0 && (e.mode & 1 ? (t = ar, ar <<= 1, !(ar & 130023424) && (ar = 4194304)) : t = 1);
        var n = ae();
        e = Xe(e, t), e !== null && (Jn(e, t, n), ve(e, n));
    }
    function Md(e) {
        var t = e.memoizedState, n = 0;
        t !== null && (n = t.retryLane), uc(e, n);
    }
    function Id(e, t) {
        var n = 0;
        switch(e.tag){
            case 13:
                var r = e.stateNode, l = e.memoizedState;
                l !== null && (n = l.retryLane);
                break;
            case 19:
                r = e.stateNode;
                break;
            default:
                throw Error(w(314));
        }
        r !== null && r.delete(t), uc(e, n);
    }
    var ic;
    ic = function(e, t, n) {
        if (e !== null) if (e.memoizedProps !== t.pendingProps || he.current) pe = !0;
        else {
            if (!(e.lanes & n) && !(t.flags & 128)) return pe = !1, kd(e, t, n);
            pe = !!(e.flags & 131072);
        }
        else pe = !1, W && t.flags & 1048576 && fa(t, Qr, t.index);
        switch(t.lanes = 0, t.tag){
            case 2:
                var r = t.type;
                zr(e, t), e = t.pendingProps;
                var l = bt(t, ue.current);
                Zt(t, n), l = ku(null, t, r, e, l, n);
                var o = Eu();
                return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, me(r) ? (o = !0, $r(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, vu(t), l.updater = dl, t.stateNode = l, l._reactInternals = t, xo(t, r, e, n), t = Lo(null, t, r, !0, o, n)) : (t.tag = 0, W && o && au(t), se(null, t, l, n), t = t.child), t;
            case 16:
                r = t.elementType;
                e: {
                    switch(zr(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Dd(r), e = Re(r, e), l){
                        case 0:
                            t = Ro(null, t, r, e, n);
                            break e;
                        case 1:
                            t = Ii(null, t, r, e, n);
                            break e;
                        case 11:
                            t = ji(null, t, r, e, n);
                            break e;
                        case 14:
                            t = Mi(null, t, r, Re(r.type, e), n);
                            break e;
                    }
                    throw Error(w(306, r, ""));
                }
                return t;
            case 0:
                return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Re(r, l), Ro(e, t, r, l, n);
            case 1:
                return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Re(r, l), Ii(e, t, r, l, n);
            case 3:
                e: {
                    if (Ha(t), e === null) throw Error(w(387));
                    r = t.pendingProps, o = t.memoizedState, l = o.element, ya(e, t), Xr(t, r, null, n);
                    var u = t.memoizedState;
                    if (r = u.element, o.isDehydrated) if (o = {
                        element: r,
                        isDehydrated: !1,
                        cache: u.cache,
                        pendingSuspenseBoundaries: u.pendingSuspenseBoundaries,
                        transitions: u.transitions
                    }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
                        l = rn(Error(w(423)), t), t = Oi(e, t, r, n, l);
                        break e;
                    } else if (r !== l) {
                        l = rn(Error(w(424)), t), t = Oi(e, t, r, n, l);
                        break e;
                    } else for(ge = it(t.stateNode.containerInfo.firstChild), we = t, W = !0, je = null, n = ma(t, null, r, n), t.child = n; n;)n.flags = n.flags & -3 | 4096, n = n.sibling;
                    else {
                        if (en(), r === l) {
                            t = Ge(e, t, n);
                            break e;
                        }
                        se(e, t, r, n);
                    }
                    t = t.child;
                }
                return t;
            case 5:
                return ga(t), e === null && Po(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, u = l.children, So(r, l) ? u = null : o !== null && So(r, o) && (t.flags |= 32), $a(e, t), se(e, t, u, n), t.child;
            case 6:
                return e === null && Po(t), null;
            case 13:
                return Qa(e, t, n);
            case 4:
                return yu(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = tn(t, null, r, n) : se(e, t, r, n), t.child;
            case 11:
                return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Re(r, l), ji(e, t, r, l, n);
            case 7:
                return se(e, t, t.pendingProps, n), t.child;
            case 8:
                return se(e, t, t.pendingProps.children, n), t.child;
            case 12:
                return se(e, t, t.pendingProps.children, n), t.child;
            case 10:
                e: {
                    if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, u = l.value, F(Yr, r._currentValue), r._currentValue = u, o !== null) if (Oe(o.value, u)) {
                        if (o.children === l.children && !he.current) {
                            t = Ge(e, t, n);
                            break e;
                        }
                    } else for(o = t.child, o !== null && (o.return = t); o !== null;){
                        var i = o.dependencies;
                        if (i !== null) {
                            u = o.child;
                            for(var s = i.firstContext; s !== null;){
                                if (s.context === r) {
                                    if (o.tag === 1) {
                                        s = Qe(-1, n & -n), s.tag = 2;
                                        var a = o.updateQueue;
                                        if (a !== null) {
                                            a = a.shared;
                                            var h = a.pending;
                                            h === null ? s.next = s : (s.next = h.next, h.next = s), a.pending = s;
                                        }
                                    }
                                    o.lanes |= n, s = o.alternate, s !== null && (s.lanes |= n), To(o.return, n, t), i.lanes |= n;
                                    break;
                                }
                                s = s.next;
                            }
                        } else if (o.tag === 10) u = o.type === t.type ? null : o.child;
                        else if (o.tag === 18) {
                            if (u = o.return, u === null) throw Error(w(341));
                            u.lanes |= n, i = u.alternate, i !== null && (i.lanes |= n), To(u, n, t), u = o.sibling;
                        } else u = o.child;
                        if (u !== null) u.return = o;
                        else for(u = o; u !== null;){
                            if (u === t) {
                                u = null;
                                break;
                            }
                            if (o = u.sibling, o !== null) {
                                o.return = u.return, u = o;
                                break;
                            }
                            u = u.return;
                        }
                        o = u;
                    }
                    se(e, t, l.children, n), t = t.child;
                }
                return t;
            case 9:
                return l = t.type, r = t.pendingProps.children, Zt(t, n), l = Ne(l), r = r(l), t.flags |= 1, se(e, t, r, n), t.child;
            case 14:
                return r = t.type, l = Re(r, t.pendingProps), l = Re(r.type, l), Mi(e, t, r, l, n);
            case 15:
                return Va(e, t, t.type, t.pendingProps, n);
            case 17:
                return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Re(r, l), zr(e, t), t.tag = 1, me(r) ? (e = !0, $r(t)) : e = !1, Zt(t, n), Aa(t, r, l), xo(t, r, l, n), Lo(null, t, r, !0, e, n);
            case 19:
                return Ya(e, t, n);
            case 22:
                return Ba(e, t, n);
        }
        throw Error(w(156, t.tag));
    };
    function sc(e, t) {
        return Os(e, t);
    }
    function Od(e, t, n, r) {
        this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function Pe(e, t, n, r) {
        return new Od(e, t, n, r);
    }
    function ju(e) {
        return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function Dd(e) {
        if (typeof e == "function") return ju(e) ? 1 : 0;
        if (e != null) {
            if (e = e.$$typeof, e === Jo) return 11;
            if (e === qo) return 14;
        }
        return 2;
    }
    function ft(e, t) {
        var n = e.alternate;
        return n === null ? (n = Pe(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
            lanes: t.lanes,
            firstContext: t.firstContext
        }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
    }
    function jr(e, t, n, r, l, o) {
        var u = 2;
        if (r = e, typeof e == "function") ju(e) && (u = 1);
        else if (typeof e == "string") u = 5;
        else e: switch(e){
            case Ot:
                return Pt(n.children, l, o, t);
            case Zo:
                u = 8, l |= 8;
                break;
            case Jl:
                return e = Pe(12, n, t, l | 2), e.elementType = Jl, e.lanes = o, e;
            case ql:
                return e = Pe(13, n, t, l), e.elementType = ql, e.lanes = o, e;
            case bl:
                return e = Pe(19, n, t, l), e.elementType = bl, e.lanes = o, e;
            case gs:
                return ml(n, l, o, t);
            default:
                if (typeof e == "object" && e !== null) switch(e.$$typeof){
                    case vs:
                        u = 10;
                        break e;
                    case ys:
                        u = 9;
                        break e;
                    case Jo:
                        u = 11;
                        break e;
                    case qo:
                        u = 14;
                        break e;
                    case qe:
                        u = 16, r = null;
                        break e;
                }
                throw Error(w(130, e == null ? e : typeof e, ""));
        }
        return t = Pe(u, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
    }
    function Pt(e, t, n, r) {
        return e = Pe(7, e, r, t), e.lanes = n, e;
    }
    function ml(e, t, n, r) {
        return e = Pe(22, e, r, t), e.elementType = gs, e.lanes = n, e.stateNode = {
            isHidden: !1
        }, e;
    }
    function Kl(e, t, n) {
        return e = Pe(6, e, null, t), e.lanes = n, e;
    }
    function Xl(e, t, n) {
        return t = Pe(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = {
            containerInfo: e.containerInfo,
            pendingChildren: null,
            implementation: e.implementation
        }, t;
    }
    function Fd(e, t, n, r, l) {
        this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = xl(0), this.expirationTimes = xl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = xl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
    }
    function Mu(e, t, n, r, l, o, u, i, s) {
        return e = new Fd(e, t, n, i, s), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = Pe(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = {
            element: r,
            isDehydrated: n,
            cache: null,
            transitions: null,
            pendingSuspenseBoundaries: null
        }, vu(o), e;
    }
    function Ad(e, t, n) {
        var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
        return {
            $$typeof: It,
            key: r == null ? null : "" + r,
            children: e,
            containerInfo: t,
            implementation: n
        };
    }
    function ac(e) {
        if (!e) return pt;
        e = e._reactInternals;
        e: {
            if (jt(e) !== e || e.tag !== 1) throw Error(w(170));
            var t = e;
            do {
                switch(t.tag){
                    case 3:
                        t = t.stateNode.context;
                        break e;
                    case 1:
                        if (me(t.type)) {
                            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                            break e;
                        }
                }
                t = t.return;
            }while (t !== null);
            throw Error(w(171));
        }
        if (e.tag === 1) {
            var n = e.type;
            if (me(n)) return aa(e, n, t);
        }
        return t;
    }
    function cc(e, t, n, r, l, o, u, i, s) {
        return e = Mu(n, r, !0, e, l, o, u, i, s), e.context = ac(null), n = e.current, r = ae(), l = ct(n), o = Qe(r, l), o.callback = t ?? null, st(n, o, l), e.current.lanes = l, Jn(e, l, r), ve(e, r), e;
    }
    function vl(e, t, n, r) {
        var l = t.current, o = ae(), u = ct(l);
        return n = ac(n), t.context === null ? t.context = n : t.pendingContext = n, t = Qe(o, u), t.payload = {
            element: e
        }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = st(l, t, u), e !== null && (Ie(e, l, u, o), Tr(e, l, u)), u;
    }
    function nl(e) {
        if (e = e.current, !e.child) return null;
        switch(e.child.tag){
            case 5:
                return e.child.stateNode;
            default:
                return e.child.stateNode;
        }
    }
    function Qi(e, t) {
        if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
            var n = e.retryLane;
            e.retryLane = n !== 0 && n < t ? n : t;
        }
    }
    function Iu(e, t) {
        Qi(e, t), (e = e.alternate) && Qi(e, t);
    }
    function Ud() {
        return null;
    }
    var fc = typeof reportError == "function" ? reportError : function(e) {
        console.error(e);
    };
    function Ou(e) {
        this._internalRoot = e;
    }
    yl.prototype.render = Ou.prototype.render = function(e) {
        var t = this._internalRoot;
        if (t === null) throw Error(w(409));
        vl(e, t, null, null);
    };
    yl.prototype.unmount = Ou.prototype.unmount = function() {
        var e = this._internalRoot;
        if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            Rt(function() {
                vl(null, e, null, null);
            }), t[Ke] = null;
        }
    };
    function yl(e) {
        this._internalRoot = e;
    }
    yl.prototype.unstable_scheduleHydration = function(e) {
        if (e) {
            var t = Bs();
            e = {
                blockedOn: null,
                target: e,
                priority: t
            };
            for(var n = 0; n < et.length && t !== 0 && t < et[n].priority; n++);
            et.splice(n, 0, e), n === 0 && Hs(e);
        }
    };
    function Du(e) {
        return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
    }
    function gl(e) {
        return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
    }
    function Yi() {}
    function Wd(e, t, n, r, l) {
        if (l) {
            if (typeof r == "function") {
                var o = r;
                r = function() {
                    var a = nl(u);
                    o.call(a);
                };
            }
            var u = cc(t, r, e, 0, null, !1, !1, "", Yi);
            return e._reactRootContainer = u, e[Ke] = u.current, Vn(e.nodeType === 8 ? e.parentNode : e), Rt(), u;
        }
        for(; l = e.lastChild;)e.removeChild(l);
        if (typeof r == "function") {
            var i = r;
            r = function() {
                var a = nl(s);
                i.call(a);
            };
        }
        var s = Mu(e, 0, !1, null, null, !1, !1, "", Yi);
        return e._reactRootContainer = s, e[Ke] = s.current, Vn(e.nodeType === 8 ? e.parentNode : e), Rt(function() {
            vl(t, s, n, r);
        }), s;
    }
    function wl(e, t, n, r, l) {
        var o = n._reactRootContainer;
        if (o) {
            var u = o;
            if (typeof l == "function") {
                var i = l;
                l = function() {
                    var s = nl(u);
                    i.call(s);
                };
            }
            vl(t, u, e, l);
        } else u = Wd(n, t, e, l, r);
        return nl(u);
    }
    Ws = function(e) {
        switch(e.tag){
            case 3:
                var t = e.stateNode;
                if (t.current.memoizedState.isDehydrated) {
                    var n = kn(t.pendingLanes);
                    n !== 0 && (tu(t, n | 1), ve(t, Y()), !(O & 6) && (ln = Y() + 500, vt()));
                }
                break;
            case 13:
                Rt(function() {
                    var r = Xe(e, 1);
                    if (r !== null) {
                        var l = ae();
                        Ie(r, e, 1, l);
                    }
                }), Iu(e, 1);
        }
    };
    nu = function(e) {
        if (e.tag === 13) {
            var t = Xe(e, 134217728);
            if (t !== null) {
                var n = ae();
                Ie(t, e, 134217728, n);
            }
            Iu(e, 134217728);
        }
    };
    Vs = function(e) {
        if (e.tag === 13) {
            var t = ct(e), n = Xe(e, t);
            if (n !== null) {
                var r = ae();
                Ie(n, e, t, r);
            }
            Iu(e, t);
        }
    };
    Bs = function() {
        return D;
    };
    $s = function(e, t) {
        var n = D;
        try {
            return D = e, t();
        } finally{
            D = n;
        }
    };
    ao = function(e, t, n) {
        switch(t){
            case "input":
                if (no(e, n), t = n.name, n.type === "radio" && t != null) {
                    for(n = e; n.parentNode;)n = n.parentNode;
                    for(n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++){
                        var r = n[t];
                        if (r !== e && r.form === e.form) {
                            var l = al(r);
                            if (!l) throw Error(w(90));
                            Ss(r), no(r, l);
                        }
                    }
                }
                break;
            case "textarea":
                Es(e, n);
                break;
            case "select":
                t = n.value, t != null && Yt(e, !!n.multiple, t, !1);
        }
    };
    zs = zu;
    Rs = Rt;
    var Vd = {
        usingClientEntryPoint: !1,
        Events: [
            bn,
            Ut,
            al,
            Ns,
            xs,
            zu
        ]
    }, gn = {
        findFiberByHostInstance: kt,
        bundleType: 0,
        version: "18.3.1",
        rendererPackageName: "react-dom"
    }, Bd = {
        bundleType: gn.bundleType,
        version: gn.version,
        rendererPackageName: gn.rendererPackageName,
        rendererConfig: gn.rendererConfig,
        overrideHookState: null,
        overrideHookStateDeletePath: null,
        overrideHookStateRenamePath: null,
        overrideProps: null,
        overridePropsDeletePath: null,
        overridePropsRenamePath: null,
        setErrorHandler: null,
        setSuspenseHandler: null,
        scheduleUpdate: null,
        currentDispatcherRef: Ze.ReactCurrentDispatcher,
        findHostInstanceByFiber: function(e) {
            return e = Ms(e), e === null ? null : e.stateNode;
        },
        findFiberByHostInstance: gn.findFiberByHostInstance || Ud,
        findHostInstancesForRefresh: null,
        scheduleRefresh: null,
        scheduleRoot: null,
        setRefreshHandler: null,
        getCurrentFiber: null,
        reconcilerVersion: "18.3.1-next-f1338f8080-20240426"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
        var Sr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!Sr.isDisabled && Sr.supportsFiber) try {
            ol = Sr.inject(Bd), Ue = Sr;
        } catch  {}
    }
    ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Vd;
    ke.createPortal = function(e, t) {
        var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!Du(t)) throw Error(w(200));
        return Ad(e, t, null, n);
    };
    ke.createRoot = function(e, t) {
        if (!Du(e)) throw Error(w(299));
        var n = !1, r = "", l = fc;
        return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Mu(e, 1, !1, null, null, n, !1, r, l), e[Ke] = t.current, Vn(e.nodeType === 8 ? e.parentNode : e), new Ou(t);
    };
    ke.findDOMNode = function(e) {
        if (e == null) return null;
        if (e.nodeType === 1) return e;
        var t = e._reactInternals;
        if (t === void 0) throw typeof e.render == "function" ? Error(w(188)) : (e = Object.keys(e).join(","), Error(w(268, e)));
        return e = Ms(t), e = e === null ? null : e.stateNode, e;
    };
    ke.flushSync = function(e) {
        return Rt(e);
    };
    ke.hydrate = function(e, t, n) {
        if (!gl(t)) throw Error(w(200));
        return wl(null, e, t, !0, n);
    };
    ke.hydrateRoot = function(e, t, n) {
        if (!Du(e)) throw Error(w(405));
        var r = n != null && n.hydratedSources || null, l = !1, o = "", u = fc;
        if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (u = n.onRecoverableError)), t = cc(t, null, e, 1, n ?? null, l, !1, o, u), e[Ke] = t.current, Vn(e), r) for(e = 0; e < r.length; e++)n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [
            n,
            l
        ] : t.mutableSourceEagerHydrationData.push(n, l);
        return new yl(t);
    };
    ke.render = function(e, t, n) {
        if (!gl(t)) throw Error(w(200));
        return wl(null, e, t, !1, n);
    };
    ke.unmountComponentAtNode = function(e) {
        if (!gl(e)) throw Error(w(40));
        return e._reactRootContainer ? (Rt(function() {
            wl(null, null, e, !1, function() {
                e._reactRootContainer = null, e[Ke] = null;
            });
        }), !0) : !1;
    };
    ke.unstable_batchedUpdates = zu;
    ke.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
        if (!gl(n)) throw Error(w(200));
        if (e == null || e._reactInternals === void 0) throw Error(w(38));
        return wl(e, t, n, !1, r);
    };
    ke.version = "18.3.1-next-f1338f8080-20240426";
    function dc() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(dc);
        } catch (e) {
            console.error(e);
        }
    }
    dc(), ds.exports = ke;
    var $d = ds.exports, Ki = $d;
    Gl.createRoot = Ki.createRoot, Gl.hydrateRoot = Ki.hydrateRoot;
    const oe = {
        tongue: "#CC6666",
        palateStroke: "#B89860",
        pharyngealWall: "#A07060",
        mandibleStroke: "#A89060",
        teeth: "#F8FFF2",
        teethStroke: "#C0B888",
        upperLip: "#D48878",
        lowerLip: "#D48878",
        lipStroke: "#A05050",
        velum: "#DDB898",
        velumStroke: "#A07050",
        ipaText: "#2563EB"
    };
    function Hd(e, t, n, r, l) {
        const o = l * l, u = o * l, i = .5 * (2 * t[0] + (-e[0] + n[0]) * l + (2 * e[0] - 5 * t[0] + 4 * n[0] - r[0]) * o + (-e[0] + 3 * t[0] - 3 * n[0] + r[0]) * u), s = .5 * (2 * t[1] + (-e[1] + n[1]) * l + (2 * e[1] - 5 * t[1] + 4 * n[1] - r[1]) * o + (-e[1] + 3 * t[1] - 3 * n[1] + r[1]) * u);
        return [
            i,
            s
        ];
    }
    function Xi(e, t = 6) {
        if (e.length < 2 || e.length === 2) return e;
        const n = [], r = [
            [
                2 * e[0][0] - e[1][0],
                2 * e[0][1] - e[1][1]
            ],
            ...e,
            [
                2 * e[e.length - 1][0] - e[e.length - 2][0],
                2 * e[e.length - 1][1] - e[e.length - 2][1]
            ]
        ];
        for(let l = 1; l < r.length - 2; l++)for(let o = 0; o < t; o++){
            const u = o / t;
            n.push(Hd(r[l - 1], r[l], r[l + 1], r[l + 2], u));
        }
        return n.push(e[e.length - 1]), n;
    }
    function Qd(e, t, n, r, l) {
        const o = 1 - l, u = o * o * o, i = 3 * o * o * l, s = 3 * o * l * l, a = l * l * l;
        return [
            u * e[0] + i * t[0] + s * n[0] + a * r[0],
            u * e[1] + i * t[1] + s * n[1] + a * r[1]
        ];
    }
    function Yd(e, t, n, r, l = 30) {
        const o = [];
        for(let u = 0; u <= l; u++)o.push(Qd(e, t, n, r, u / l));
        return o;
    }
    const pc = -22, Kd = 185, Gi = Kd - pc, Xd = -25, Zi = 140;
    function tr(e, t) {
        const n = e / Gi, r = t / Zi, l = Math.min(n, r), o = (e - Gi * l) / 2, u = (t - Zi * l) / 2;
        return {
            scale: l,
            toCanvas: (i, s)=>[
                    o + (i - pc) * l,
                    t - u - (s - Xd) * l
                ]
        };
    }
    function Ji(e, t, n) {
        const { toCanvas: r, scale: l } = tr(t, n);
        e.save(), e.lineCap = "round", e.lineJoin = "round", ep(e, r, l), tp(e, r, l), np(e, r, l), lp(e, r, l), rp(e, r, l), op(e, r, l), up(e, r, l), qd(e, r, l), e.restore();
    }
    function qi(e, t, n, r) {
        const { toCanvas: l, scale: o } = tr(n, r);
        e.save(), e.lineCap = "round", e.lineJoin = "round", ip(e, t, l, o), e.restore();
    }
    function Gd(e, t, n, r) {
        const { toCanvas: l, scale: o } = tr(n, r);
        e.save(), e.lineCap = "round", e.lineJoin = "round", sp(e, t.jaw_angle, l, o), ap(e, t.velum_angle, t.velum_tip, l, o), cp(e, t, l, o), e.restore();
    }
    function Zd(e, t, n, r) {
        const { toCanvas: l, scale: o } = tr(n, r), u = t.glottal_aperture, i = t.voicing > .15, [s, a] = l(15, 3), h = 2.5 * o, p = u * 3.5 * o;
        e.save(), e.lineCap = "round", e.lineWidth = 1.8 * o, e.strokeStyle = i ? "#C87010" : "rgba(110, 85, 65, 0.55)", e.beginPath(), e.moveTo(s - h, a), e.lineTo(s, a - p), e.stroke(), e.beginPath(), e.moveTo(s, a - p), e.lineTo(s + h, a), e.stroke(), e.restore();
    }
    function Jd(e, t, n, r) {
        if (!t) return;
        e.save();
        const l = Math.max(14, Math.min(22, n * .035));
        e.font = `${l}px system-ui, sans-serif`, e.fillStyle = oe.ipaText, e.textAlign = "right", e.textBaseline = "bottom", e.fillText(`/${t}/`, n - 12, r - 10), e.restore();
    }
    function qd(e, t, n) {
        const r = (i, s)=>t(i, s), l = "rgba(110, 78, 54, 0.55)";
        e.save(), e.lineCap = "round", e.lineJoin = "round", e.beginPath(), e.moveTo(...r(162, 79)), e.quadraticCurveTo(...r(163, 74), ...r(164, 70)), e.quadraticCurveTo(...r(171, 62), ...r(175, 56)), e.quadraticCurveTo(...r(177, 52), ...r(176, 49)), e.quadraticCurveTo(...r(175, 45), ...r(171, 43)), e.quadraticCurveTo(...r(169, 38), ...r(172, 33)), e.quadraticCurveTo(...r(173, 29), ...r(171, 25)), e.quadraticCurveTo(...r(170, 22), ...r(170, 19)), e.quadraticCurveTo(...r(168, 14), ...r(167, 9)), e.quadraticCurveTo(...r(166, 4), ...r(164, 0)), e.quadraticCurveTo(...r(161, -5), ...r(155, -10)), e.strokeStyle = l, e.lineWidth = 2.5 * n, e.stroke(), e.beginPath(), e.moveTo(...r(176, 49)), e.bezierCurveTo(...r(178, 47), ...r(175, 43), ...r(171, 43)), e.strokeStyle = "rgba(110, 78, 54, 0.40)", e.lineWidth = 1.8 * n, e.stroke();
        const [o, u] = r(174, 46);
        e.beginPath(), e.ellipse(o, u, 3.2 * n, 2 * n, Math.PI * .18, 0, Math.PI * 2), e.fillStyle = "rgba(90, 55, 35, 0.40)", e.fill(), bd(e, t, n), e.restore();
    }
    function bd(e, t, n) {
        const [r, l] = t(160, 70), o = 12 * n, u = 7.5 * n, s = performance.now() % 4200 < 150;
        if (e.save(), e.beginPath(), e.ellipse(r, l, o + 1.5 * n, u + 1 * n, 0, 0, Math.PI * 2), e.fillStyle = "rgba(140, 100, 75, 0.25)", e.fill(), e.beginPath(), e.ellipse(r, l, o, s ? .8 * n : u, 0, 0, Math.PI * 2), e.fillStyle = "rgba(245, 242, 235, 0.95)", e.fill(), e.strokeStyle = "rgba(90, 60, 40, 0.55)", e.lineWidth = 1 * n, e.stroke(), !s) {
            const a = 3.8 * n;
            e.beginPath(), e.arc(r, l, a, 0, Math.PI * 2), e.fillStyle = "rgba(85, 115, 75, 0.9)", e.fill(), e.beginPath(), e.arc(r, l, 2 * n, 0, Math.PI * 2), e.fillStyle = "rgba(15, 10, 8, 0.95)", e.fill(), e.beginPath(), e.arc(r - 1.2 * n, l - 1.2 * n, .7 * n, 0, Math.PI * 2), e.fillStyle = "rgba(255, 255, 255, 0.85)", e.fill();
        }
        e.restore();
    }
    function ep(e, t, n) {
        const r = (l, o)=>t(l, o);
        e.save(), e.lineCap = "round", e.lineJoin = "round", e.strokeStyle = "rgba(110, 78, 54, 0.52)", e.lineWidth = 2.5 * n, e.beginPath(), e.moveTo(...r(-5, -18)), e.bezierCurveTo(...r(-22, 42), ...r(15, 101), ...r(75, 110)), e.bezierCurveTo(...r(107, 115), ...r(140, 103), ...r(162, 79)), e.stroke(), e.restore();
    }
    function tp(e, t, n) {
        const r = [
            [
                14,
                -5
            ],
            [
                14,
                12
            ],
            [
                13,
                28
            ],
            [
                12,
                42
            ],
            [
                14,
                55
            ],
            [
                18,
                62
            ]
        ];
        e.beginPath();
        const [l, o] = t(r[0][0], r[0][1]);
        e.moveTo(l, o);
        for(let u = 1; u < r.length; u++){
            const [i, s] = t(r[u][0], r[u][1]);
            e.lineTo(i, s);
        }
        e.strokeStyle = oe.pharyngealWall, e.lineWidth = 2.5 * n, e.stroke();
    }
    function np(e, t, n) {
        const [r, l] = t(12, 2), [o, u] = t(18, 2), [, i] = t(12, -22);
        e.beginPath(), e.moveTo(r, l), e.lineTo(r, i), e.moveTo(o, u), e.lineTo(o, i), e.strokeStyle = "rgba(140, 110, 90, 0.45)", e.lineWidth = 1.5 * n, e.stroke();
    }
    function rp(e, t, n) {
        e.save(), e.lineCap = "round", e.lineJoin = "round", e.beginPath(), e.moveTo(...t(20, 22)), e.bezierCurveTo(...t(22, 28), ...t(26, 32), ...t(28, 30)), e.bezierCurveTo(...t(28, 26), ...t(24, 22), ...t(22, 20)), e.strokeStyle = "rgba(165, 120, 90, 0.75)", e.lineWidth = 2 * n, e.stroke(), e.fillStyle = "rgba(200, 155, 120, 0.35)", e.fill(), e.restore();
    }
    function lp(e, t, n) {
        const i = Yd([
            60,
            50
        ], [
            90,
            52
        ], [
            120,
            50
        ], [
            148,
            42
        ], 40);
        e.beginPath();
        const [s, a] = t(i[0][0], i[0][1]);
        e.moveTo(s, a);
        for(let h = 1; h < i.length; h++){
            const [p, m] = t(i[h][0], i[h][1]);
            e.lineTo(p, m);
        }
        e.strokeStyle = oe.palateStroke, e.lineWidth = 2.5 * n, e.stroke();
    }
    function op(e, t, n) {
        const r = [
            [
                145,
                42
            ],
            [
                148,
                44
            ],
            [
                152,
                43
            ],
            [
                155,
                40
            ],
            [
                157,
                37
            ]
        ];
        e.beginPath();
        const [l, o] = t(r[0][0], r[0][1]);
        e.moveTo(l, o);
        for(let u = 1; u < r.length; u++){
            const [i, s] = t(r[u][0], r[u][1]);
            e.lineTo(i, s);
        }
        e.strokeStyle = oe.palateStroke, e.lineWidth = 2 * n, e.stroke();
    }
    function up(e, t, n) {
        const r = [
            {
                x1: 149,
                x2: 155,
                top: 42,
                bot: 27
            },
            {
                x1: 155,
                x2: 160,
                top: 40,
                bot: 28
            }
        ];
        for (const l of r){
            const [o, u] = t(l.x1, l.top), [i, s] = t(l.x2, l.top), [, a] = t(l.x1, l.bot), h = i - o, p = a - u, m = Math.min(Math.abs(h), Math.abs(p)) * .25;
            e.beginPath(), e.moveTo(o, u), e.lineTo(i, u), e.lineTo(i, a - m), e.quadraticCurveTo(i, a, i - m, a), e.lineTo(o + m, a), e.quadraticCurveTo(o, a, o, a - m), e.lineTo(o, u), e.closePath(), e.fillStyle = oe.teeth, e.fill(), e.strokeStyle = oe.teethStroke, e.lineWidth = .8 * n, e.stroke();
        }
    }
    function ip(e, t, n, r) {
        const u = t * Math.PI / 180, a = [
            [
                145,
                33
            ],
            [
                132,
                12
            ],
            [
                100,
                -7
            ],
            [
                65,
                -4
            ],
            [
                48,
                20
            ],
            [
                44,
                52
            ]
        ].map(([h, p])=>Cn(h, p, 52, 65, -u)).map(([h, p])=>n(h, p));
        e.beginPath(), e.moveTo(a[0][0], a[0][1]);
        for(let h = 0; h < a.length - 1; h++){
            const p = a[Math.max(0, h - 1)], m = a[h], v = a[h + 1], g = a[Math.min(a.length - 1, h + 2)], S = m[0] + (v[0] - p[0]) / 6, N = m[1] + (v[1] - p[1]) / 6, f = v[0] - (g[0] - m[0]) / 6, c = v[1] - (g[1] - m[1]) / 6;
            e.bezierCurveTo(S, N, f, c, v[0], v[1]);
        }
        e.strokeStyle = oe.mandibleStroke, e.lineWidth = 2.5 * r, e.stroke();
    }
    function sp(e, t, n, r) {
        const u = t * Math.PI / 180, i = [
            {
                x1: 149,
                x2: 155,
                top: 33,
                bot: 20
            },
            {
                x1: 155,
                x2: 160,
                top: 31,
                bot: 21
            }
        ];
        for (const s of i){
            const a = Cn(s.x1, s.top, 52, 65, -u);
            Cn(s.x2, s.top, 52, 65, -u);
            const h = Cn(s.x1, s.bot, 52, 65, -u), p = Cn(s.x2, s.bot, 52, 65, -u), [m, v] = n(h[0], h[1]), [g, S] = n(p[0], p[1]), [, N] = n(a[0], a[1]), f = g - m, c = Math.abs(N - S), d = Math.min(Math.abs(f), c) * .25;
            e.beginPath(), e.moveTo(m, S), e.lineTo(g, S), e.lineTo(g, N + d), e.quadraticCurveTo(g, N, g - d, N), e.lineTo(m + d, N), e.quadraticCurveTo(m, N, m, N + d), e.lineTo(m, S), e.closePath(), e.fillStyle = oe.teeth, e.fill(), e.strokeStyle = oe.teethStroke, e.lineWidth = .8 * r, e.stroke();
        }
    }
    function ap(e, t, n, r, l) {
        const [i, s] = r(52, 50), [a, h] = r(n[0], n[1]);
        e.beginPath(), e.moveTo(i, s), e.lineTo(a, h), e.strokeStyle = oe.velum, e.lineWidth = 5 * l, e.stroke(), e.strokeStyle = oe.velumStroke, e.lineWidth = 1 * l, e.stroke();
    }
    function cp(e, t, n, r) {
        if (e.save(), e.lineCap = "round", e.lineJoin = "round", t.upper_lip.length >= 2) {
            const l = t.upper_lip;
            e.beginPath();
            const [o, u] = n(l[0][0], l[0][1]);
            e.moveTo(o, u);
            for(let i = 1; i < l.length; i++){
                const [s, a] = n(l[i][0], l[i][1]);
                e.lineTo(s, a);
            }
            e.strokeStyle = oe.lipStroke, e.lineWidth = 8 * r, e.stroke(), e.strokeStyle = oe.upperLip, e.lineWidth = 6 * r, e.stroke();
        }
        if (t.lower_lip.length >= 2) {
            const l = t.lower_lip;
            e.beginPath();
            const [o, u] = n(l[0][0], l[0][1]);
            e.moveTo(o, u);
            for(let i = 1; i < l.length; i++){
                const [s, a] = n(l[i][0], l[i][1]);
                e.lineTo(s, a);
            }
            e.strokeStyle = oe.lipStroke, e.lineWidth = 8 * r, e.stroke(), e.strokeStyle = oe.lowerLip, e.lineWidth = 6 * r, e.stroke();
        }
        e.restore();
    }
    function Cn(e, t, n, r, l) {
        const o = Math.cos(l), u = Math.sin(l), i = e - n, s = t - r;
        return [
            n + i * o - s * u,
            r + i * u + s * o
        ];
    }
    function fp(e, t, n, r) {
        const { toCanvas: l, scale: o } = tr(n, r);
        if (t.tongue_dorsal.length < 2 || t.tongue_ventral.length < 2) return;
        const u = t.tongue_dorsal.map(([p, m])=>l(p, m)), i = t.tongue_ventral.map(([p, m])=>l(p, m)), s = Xi(u, 6), a = Xi(i, 6), h = [
            ...s,
            ...a.slice().reverse()
        ];
        if (e.save(), e.beginPath(), h.length > 0) {
            e.moveTo(h[0][0], h[0][1]);
            for(let p = 1; p < h.length; p++)e.lineTo(h[p][0], h[p][1]);
            e.closePath();
        }
        if (e.fillStyle = oe.tongue, e.fill(), e.beginPath(), s.length > 0) {
            e.moveTo(s[0][0], s[0][1]);
            for(let p = 1; p < s.length; p++)e.lineTo(s[p][0], s[p][1]);
        }
        if (e.strokeStyle = "rgba(80, 30, 30, 0.75)", e.lineWidth = 1.5 * o, e.stroke(), e.beginPath(), a.length > 0) {
            e.moveTo(a[0][0], a[0][1]);
            for(let p = 1; p < a.length; p++)e.lineTo(a[p][0], a[p][1]);
        }
        e.strokeStyle = "rgba(120, 55, 55, 0.4)", e.lineWidth = o, e.stroke(), e.restore();
    }
    function dp({ canvasRef: e, getRenderState: t, getCurrentSimTimeMs: n, isActive: r, settings: l }) {
        const o = z.useRef(0), u = z.useRef(r), i = z.useRef(null);
        z.useEffect(()=>{
            u.current = r;
        }, [
            r
        ]), z.useEffect(()=>{
            const s = (a)=>{
                const h = e.current;
                if (!h) {
                    o.current = requestAnimationFrame(s);
                    return;
                }
                const p = h.getContext("2d");
                if (!p) {
                    o.current = requestAnimationFrame(s);
                    return;
                }
                let m = null;
                if (u.current) {
                    const v = n(a);
                    m = t(v), m && (i.current = m);
                } else m = i.current;
                p.clearRect(0, 0, h.width, h.height), m ? (Ji(p, h.width, h.height), qi(p, m.jaw_angle, h.width, h.height), fp(p, m, h.width, h.height), Gd(p, m, h.width, h.height), Zd(p, m, h.width, h.height), l.showLabels && m.current_phoneme_ipa && Jd(p, m.current_phoneme_ipa, h.width, h.height)) : (Ji(p, h.width, h.height), qi(p, 0, h.width, h.height)), o.current = requestAnimationFrame(s);
            };
            return o.current = requestAnimationFrame(s), ()=>cancelAnimationFrame(o.current);
        }, [
            e,
            t,
            n,
            l
        ]);
    }
    function pp({ getRenderState: e, getCurrentSimTimeMs: t, isActive: n, settings: r }) {
        const l = z.useRef(null);
        return z.useEffect(()=>{
            const o = l.current;
            if (!o) return;
            const u = new ResizeObserver(()=>{
                const s = o.parentElement;
                if (!s) return;
                const a = s.clientWidth, h = Math.round(a * (3 / 4));
                (o.width !== a || o.height !== h) && (o.width = a, o.height = h);
            }), i = o.parentElement;
            return i && u.observe(i), ()=>u.disconnect();
        }, []), dp({
            canvasRef: l,
            getRenderState: e,
            getCurrentSimTimeMs: t,
            isActive: n,
            settings: r
        }), P.jsx("canvas", {
            ref: l,
            className: "w-full block rounded bg-[#FAFAFA]",
            style: {
                aspectRatio: "4/3"
            }
        });
    }
    const hp = [
        "The quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore.",
        "How much wood would a woodchuck chuck?",
        "Hello world, this is the tongue simulator."
    ];
    function mp({ onSpeak: e, isLoading: t, isSpeaking: n }) {
        const [r, l] = z.useState("Hello world, this is the tongue simulator."), o = z.useRef(null), u = ()=>{
            r.trim() && !t && e(r.trim());
        }, i = (s)=>{
            s.key === "Enter" && !s.shiftKey && (s.preventDefault(), u());
        };
        return P.jsxs("div", {
            className: "flex gap-2 items-end",
            children: [
                P.jsx("textarea", {
                    ref: o,
                    value: r,
                    onChange: (s)=>l(s.target.value),
                    onKeyDown: i,
                    rows: 2,
                    className: `flex-1 resize-none border border-gray-200 rounded px-3 py-2 text-sm
                   focus:outline-none focus:border-blue-400 bg-white
                   text-gray-900 placeholder-gray-400`,
                    placeholder: hp[0],
                    disabled: t || n
                }),
                P.jsx("button", {
                    onClick: u,
                    disabled: t || n || !r.trim(),
                    className: `flex-shrink-0 px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors h-[52px]`,
                    children: t ? P.jsxs("span", {
                        className: "flex items-center gap-1",
                        children: [
                            P.jsxs("svg", {
                                className: "animate-spin w-4 h-4",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                children: [
                                    P.jsx("circle", {
                                        className: "opacity-25",
                                        cx: "12",
                                        cy: "12",
                                        r: "10",
                                        stroke: "currentColor",
                                        strokeWidth: "4"
                                    }),
                                    P.jsx("path", {
                                        className: "opacity-75",
                                        fill: "currentColor",
                                        d: "M4 12a8 8 0 018-8v8z"
                                    })
                                ]
                            }),
                            "Loading"
                        ]
                    }) : n ? "Speaking" : "Speak ▶"
                })
            ]
        });
    }
    function vp({ text: e, wordSyncMap: t, currentWordIndex: n, isSpeaking: r, currentPhoneme: l }) {
        return !e || t.length === 0 ? null : (t.map((o, u)=>({
                word: o.word,
                active: r && u === n
            })), P.jsxs("div", {
            className: "text-sm text-gray-700 min-h-[1.5rem]",
            children: [
                P.jsx("span", {
                    className: "font-mono",
                    children: t.map((o, u)=>P.jsxs("span", {
                            children: [
                                P.jsx("span", {
                                    className: r && u === n ? "text-blue-600 underline underline-offset-2 font-medium" : "",
                                    children: o.word
                                }),
                                u < t.length - 1 ? " " : ""
                            ]
                        }, u))
                }),
                l && r && P.jsxs("span", {
                    className: "ml-3 text-xs text-gray-400 font-mono",
                    children: [
                        "[",
                        l,
                        "]"
                    ]
                })
            ]
        }));
    }
    function yp({ isSpeaking: e, isPaused: t, rate: n, onPause: r, onResume: l, onCancel: o, onRateChange: u }) {
        return P.jsxs("div", {
            className: "flex items-center gap-4 text-sm text-gray-600",
            children: [
                P.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [
                        P.jsx("button", {
                            onClick: o,
                            disabled: !e,
                            className: `w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100
                     disabled:opacity-30 disabled:cursor-default transition-colors`,
                            title: "Stop",
                            children: "■"
                        }),
                        P.jsx("button", {
                            onClick: t ? l : r,
                            disabled: !e,
                            className: `w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100
                     disabled:opacity-30 disabled:cursor-default transition-colors`,
                            title: t ? "Resume" : "Pause",
                            children: t ? "▶" : "❚❚"
                        })
                    ]
                }),
                P.jsxs("div", {
                    className: "flex items-center gap-2 flex-1",
                    children: [
                        P.jsxs("span", {
                            className: "text-xs text-gray-400 w-6 text-right",
                            children: [
                                n.toFixed(1),
                                "×"
                            ]
                        }),
                        P.jsx("input", {
                            type: "range",
                            min: .25,
                            max: 1.5,
                            step: .05,
                            value: n,
                            onChange: (i)=>u(parseFloat(i.target.value)),
                            className: "flex-1 accent-blue-600",
                            title: "Speaking rate"
                        }),
                        P.jsx("span", {
                            className: "text-xs text-gray-400 w-6",
                            children: "spd"
                        })
                    ]
                })
            ]
        });
    }
    function gp({ voices: e, selected: t, onChange: n }) {
        return e.length === 0 ? P.jsx("span", {
            className: "text-xs text-gray-400",
            children: "No English voices found"
        }) : P.jsx("select", {
            value: t?.name ?? "",
            onChange: (r)=>{
                const l = e.find((o)=>o.name === r.target.value);
                l && n(l);
            },
            className: `text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-800
                 focus:outline-none focus:border-blue-400 w-full`,
            children: e.map((r)=>P.jsxs("option", {
                    value: r.name,
                    children: [
                        r.name,
                        " (",
                        r.lang,
                        ")"
                    ]
                }, r.name))
        });
    }
    function wp({ settings: e, voices: t, onChange: n, onClose: r }) {
        return P.jsx("div", {
            className: "fixed inset-0 z-50 flex items-start justify-end",
            onClick: (l)=>{
                l.target === l.currentTarget && r();
            },
            children: P.jsxs("div", {
                className: "mt-10 mr-4 w-72 bg-white border border-gray-200 rounded shadow-lg p-4 text-sm",
                children: [
                    P.jsxs("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            P.jsx("span", {
                                className: "font-medium text-gray-800",
                                children: "Settings"
                            }),
                            P.jsx("button", {
                                onClick: r,
                                className: "text-gray-400 hover:text-gray-600 text-lg leading-none",
                                children: "×"
                            })
                        ]
                    }),
                    P.jsxs("div", {
                        className: "space-y-4",
                        children: [
                            P.jsxs("div", {
                                children: [
                                    P.jsx("label", {
                                        className: "block text-xs text-gray-500 mb-1",
                                        children: "Voice"
                                    }),
                                    P.jsx(gp, {
                                        voices: t,
                                        selected: e.voice,
                                        onChange: (l)=>n({
                                                voice: l
                                            })
                                    })
                                ]
                            }),
                            P.jsxs("div", {
                                children: [
                                    P.jsxs("label", {
                                        className: "block text-xs text-gray-500 mb-1",
                                        children: [
                                            "Pitch — ",
                                            e.pitch.toFixed(1)
                                        ]
                                    }),
                                    P.jsx("input", {
                                        type: "range",
                                        min: .5,
                                        max: 2,
                                        step: .05,
                                        value: e.pitch,
                                        onChange: (l)=>n({
                                                pitch: parseFloat(l.target.value)
                                            }),
                                        className: "w-full accent-blue-600"
                                    })
                                ]
                            }),
                            P.jsx(Sp, {
                                label: "Show IPA labels",
                                value: e.showLabels,
                                onChange: (l)=>n({
                                        showLabels: l
                                    })
                            })
                        ]
                    })
                ]
            })
        });
    }
    function Sp({ label: e, value: t, onChange: n }) {
        return P.jsxs("div", {
            className: "flex items-center justify-between",
            children: [
                P.jsx("span", {
                    className: "text-gray-700",
                    children: e
                }),
                P.jsx("button", {
                    onClick: ()=>n(!t),
                    className: `relative w-10 h-5 rounded-full transition-colors ${t ? "bg-blue-600" : "bg-gray-200"}`,
                    children: P.jsx("span", {
                        className: `absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                       transition-transform ${t ? "translate-x-5" : ""}`
                    })
                })
            ]
        });
    }
    const kp = "modulepreload", Ep = function(e) {
        return "/tongue-simulator/" + e;
    }, bi = {}, Cp = function(t, n, r) {
        let l = Promise.resolve();
        if (n && n.length > 0) {
            document.getElementsByTagName("link");
            const u = document.querySelector("meta[property=csp-nonce]"), i = u?.nonce || u?.getAttribute("nonce");
            l = Promise.allSettled(n.map((s)=>{
                if (s = Ep(s), s in bi) return;
                bi[s] = !0;
                const a = s.endsWith(".css"), h = a ? '[rel="stylesheet"]' : "";
                if (document.querySelector(`link[href="${s}"]${h}`)) return;
                const p = document.createElement("link");
                if (p.rel = a ? "stylesheet" : kp, a || (p.as = "script"), p.crossOrigin = "", p.href = s, i && p.setAttribute("nonce", i), document.head.appendChild(p), a) return new Promise((m, v)=>{
                    p.addEventListener("load", m), p.addEventListener("error", ()=>v(new Error(`Unable to preload CSS for ${s}`)));
                });
            }));
        }
        function o(u) {
            const i = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (i.payload = u, window.dispatchEvent(i), !i.defaultPrevented) throw u;
        }
        return l.then((u)=>{
            for (const i of u || [])i.status === "rejected" && o(i.reason);
            return t().catch(o);
        });
    };
    let rl = null;
    async function es() {
        if (rl) return;
        const e = await Cp(()=>import("./tongue_sim-BR6QG6eR.js"), []);
        await e.default(), rl = e;
    }
    class Fu {
        inner;
        constructor(t){
            this.inner = t;
        }
        static create(t, n) {
            if (!rl) throw new Error("WASM not initialized");
            const r = new rl.SimulationSession(t, n);
            return new Fu(r);
        }
        precompute() {
            return this.inner.precompute();
        }
        getRenderState(t) {
            return this.inner.get_render_state(t);
        }
        getPhonemeTimeline() {
            return this.inner.get_phoneme_timeline();
        }
        getWordSyncMap() {
            return this.inner.get_word_sync_map();
        }
        setRate(t) {
            this.inner.set_speaking_rate(t);
        }
        durationMs() {
            return this.inner.duration_ms();
        }
        free() {
            this.inner && typeof this.inner.free == "function" && this.inner.free();
        }
    }
    function _p(e, t) {
        const [n, r] = z.useState({
            session: null,
            isReady: !1,
            isPrecomputing: !1,
            error: null,
            timeline: null,
            wordSyncMap: [],
            durationMs: 0
        }), l = z.useRef(null);
        z.useEffect(()=>{
            es().catch((i)=>{
                r((s)=>({
                        ...s,
                        error: String(i)
                    }));
            });
        }, []);
        const o = z.useCallback(async (i, s)=>{
            if (i.trim()) {
                r((a)=>({
                        ...a,
                        isPrecomputing: !0,
                        isReady: !1,
                        error: null
                    }));
                try {
                    await es(), l.current && (l.current.free(), l.current = null);
                    const a = Fu.create(i, s);
                    await new Promise((v)=>{
                        setTimeout(()=>{
                            a.precompute(), v();
                        }, 0);
                    });
                    const h = a.getPhonemeTimeline(), p = a.getWordSyncMap(), m = a.durationMs();
                    l.current = a, r({
                        session: a,
                        isReady: !0,
                        isPrecomputing: !1,
                        error: null,
                        timeline: h,
                        wordSyncMap: p,
                        durationMs: m
                    });
                } catch (a) {
                    r((h)=>({
                            ...h,
                            isPrecomputing: !1,
                            error: String(a)
                        }));
                }
            }
        }, []), u = z.useCallback((i)=>{
            if (!l.current) return null;
            try {
                return l.current.getRenderState(i);
            } catch  {
                return null;
            }
        }, []);
        return z.useEffect(()=>()=>{
                l.current && (l.current.free(), l.current = null);
            }, []), {
            ...n,
            createSession: o,
            getRenderState: u
        };
    }
    function Pp() {
        const [e, t] = z.useState({
            isSpeaking: !1,
            isPaused: !1,
            currentCharIndex: 0,
            elapsedTime: 0,
            availableVoices: [],
            error: null
        }), n = z.useRef(null), r = z.useRef(null), l = z.useRef(null), o = z.useRef(null);
        z.useEffect(()=>{
            const v = ()=>{
                const g = speechSynthesis.getVoices().filter((S)=>S.lang.startsWith("en"));
                g.length > 0 && t((S)=>({
                        ...S,
                        availableVoices: g
                    }));
            };
            return v(), speechSynthesis.addEventListener("voiceschanged", v), ()=>speechSynthesis.removeEventListener("voiceschanged", v);
        }, []);
        const u = z.useCallback((v, g, S = 1, N = 1)=>{
            speechSynthesis.cancel();
            const f = new SpeechSynthesisUtterance(v);
            g && (f.voice = g), f.rate = S, f.pitch = N, f.lang = "en-US", f.onstart = ()=>{
                t((c)=>({
                        ...c,
                        isSpeaking: !0,
                        isPaused: !1,
                        elapsedTime: 0
                    })), l.current?.();
            }, f.onboundary = (c)=>{
                const d = c.charIndex, y = c.elapsedTime / 1e3;
                t((k)=>({
                        ...k,
                        currentCharIndex: d,
                        elapsedTime: y
                    })), r.current?.(d, y, c.name);
            }, f.onend = ()=>{
                t((c)=>({
                        ...c,
                        isSpeaking: !1,
                        isPaused: !1
                    })), o.current?.();
            }, f.onerror = (c)=>{
                const d = c.error;
                d === "interrupted" || d === "canceled" || (t((y)=>({
                        ...y,
                        isSpeaking: !1,
                        error: d
                    })), o.current?.());
            }, n.current = f, speechSynthesis.speak(f);
        }, []), i = z.useCallback(()=>{
            speechSynthesis.pause(), t((v)=>({
                    ...v,
                    isPaused: !0
                }));
        }, []), s = z.useCallback(()=>{
            speechSynthesis.resume(), t((v)=>({
                    ...v,
                    isPaused: !1
                }));
        }, []), a = z.useCallback(()=>{
            speechSynthesis.cancel(), t((v)=>({
                    ...v,
                    isSpeaking: !1,
                    isPaused: !1
                })), o.current?.();
        }, []), h = z.useCallback((v)=>{
            r.current = v;
        }, []), p = z.useCallback((v)=>{
            l.current = v;
        }, []), m = z.useCallback((v)=>{
            o.current = v;
        }, []);
        return {
            ...e,
            speak: u,
            pause: i,
            resume: s,
            cancel: a,
            onBoundary: h,
            onStart: p,
            onEnd: m
        };
    }
    function Tp(e, t) {
        let n = 0;
        for(let r = 0; r < t.length; r++)t[r].char_index <= e && (n = r);
        return n;
    }
    function Np(e) {
        const [t, n] = z.useState({
            isActive: !1,
            currentSimTimeMs: 0,
            currentWordIndex: 0,
            currentWord: ""
        }), r = z.useRef(0), l = z.useRef(0), o = z.useRef(1.6), u = z.useRef(null), i = z.useCallback((p)=>{
            const m = performance.now();
            r.current = m, l.current = 0, o.current = 1.6, u.current = null, n({
                isActive: !0,
                currentSimTimeMs: 0,
                currentWordIndex: 0,
                currentWord: e[0]?.word ?? ""
            });
        }, [
            e
        ]), s = z.useCallback((p, m, v)=>{
            const g = performance.now(), S = Tp(p, e), N = e[S];
            if (!N) return;
            const f = N.estimated_time_ms;
            if (u.current) {
                const c = g - u.current.wallMs, d = f - u.current.simMs;
                d > 20 && c > 20 && (o.current = c / d);
            }
            r.current = g, l.current = f, u.current = {
                wallMs: g,
                simMs: f
            }, n((c)=>({
                    ...c,
                    currentWordIndex: S,
                    currentWord: N.word
                }));
        }, [
            e
        ]), a = z.useCallback(()=>{
            n((p)=>({
                    ...p,
                    isActive: !1
                }));
        }, []), h = z.useCallback((p)=>{
            if (!t.isActive && l.current === 0) return 0;
            const m = p - r.current;
            return l.current + m / Math.max(o.current, .1);
        }, [
            t.isActive
        ]);
        return {
            ...t,
            onStart: i,
            onBoundary: s,
            onEnd: a,
            getCurrentSimTimeMs: h
        };
    }
    const xp = {
        showLabels: !0,
        pitch: 1,
        voice: null,
        rate: .5
    };
    function zp() {
        const [e, t] = z.useState(""), [n, r] = z.useState(""), [l, o] = z.useState(xp), [u, i] = z.useState(!1), s = z.useRef(l);
        s.current = l;
        const { isReady: a, isPrecomputing: h, error: p, wordSyncMap: m, durationMs: v, createSession: g, getRenderState: S } = _p(e, l.rate), N = Pp(), f = z.useRef(N);
        f.current = N;
        const c = Np(m), d = z.useRef(c);
        d.current = c, N.onStart(()=>{
            d.current.onStart(v);
        }), N.onBoundary((M, R, ie)=>{
            d.current.onBoundary(M, R, ie);
        }), N.onEnd(()=>{
            d.current.onEnd();
        });
        const y = z.useRef(!1);
        z.useEffect(()=>{
            if (a && !y.current && n) {
                y.current = !0;
                const { voice: M, rate: R, pitch: ie } = s.current;
                setTimeout(()=>{
                    f.current.speak(n, M ?? void 0, R, ie);
                }, 50);
            }
            a || (y.current = !1);
        }, [
            a,
            n
        ]);
        const k = z.useCallback(async (M)=>{
            f.current.cancel(), t(M), r(M), await g(M, s.current.rate);
        }, [
            g
        ]), T = z.useCallback((M)=>c.getCurrentSimTimeMs(M), [
            c
        ]), _ = z.useCallback((M)=>{
            o((R)=>({
                    ...R,
                    ...M
                }));
        }, []), x = c.isActive || N.isSpeaking;
        return P.jsxs("div", {
            className: "min-h-screen bg-white",
            children: [
                P.jsxs("div", {
                    className: "max-w-2xl mx-auto px-4 py-4",
                    children: [
                        P.jsxs("div", {
                            className: "flex items-center justify-between mb-3",
                            children: [
                                P.jsx("h1", {
                                    className: "text-base font-medium text-gray-900",
                                    children: "Tongue Simulator"
                                }),
                                P.jsx("button", {
                                    onClick: ()=>i((M)=>!M),
                                    className: "text-gray-400 hover:text-gray-600 transition-colors p-1 rounded",
                                    title: "Settings",
                                    children: P.jsxs("svg", {
                                        width: "18",
                                        height: "18",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            P.jsx("circle", {
                                                cx: "12",
                                                cy: "12",
                                                r: "3"
                                            }),
                                            P.jsx("path", {
                                                d: `M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
                a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
                A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06
                A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
                A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06
                A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
                a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06
                A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
                a1.65 1.65 0 0 0-1.51 1z`
                                            })
                                        ]
                                    })
                                })
                            ]
                        }),
                        P.jsx("div", {
                            className: "border border-gray-100 rounded overflow-hidden bg-[#FAFAFA] mb-3",
                            children: P.jsx(pp, {
                                getRenderState: S,
                                getCurrentSimTimeMs: T,
                                isActive: x,
                                settings: l
                            })
                        }),
                        n && m.length > 0 && P.jsx("div", {
                            className: "mb-3 px-1",
                            children: P.jsx(vp, {
                                text: n,
                                wordSyncMap: m,
                                currentWordIndex: c.currentWordIndex,
                                isSpeaking: N.isSpeaking,
                                currentPhoneme: ""
                            })
                        }),
                        P.jsx("div", {
                            className: "mb-3",
                            children: P.jsx(mp, {
                                onSpeak: k,
                                isLoading: h,
                                isSpeaking: N.isSpeaking
                            })
                        }),
                        P.jsx(yp, {
                            isSpeaking: N.isSpeaking,
                            isPaused: N.isPaused,
                            rate: l.rate,
                            onPause: N.pause,
                            onResume: N.resume,
                            onCancel: N.cancel,
                            onRateChange: (M)=>_({
                                    rate: M
                                })
                        }),
                        p && P.jsx("div", {
                            className: "mt-3 text-xs text-red-500 bg-red-50 rounded px-3 py-2",
                            children: p
                        })
                    ]
                }),
                u && P.jsx(wp, {
                    settings: l,
                    voices: N.availableVoices,
                    onChange: _,
                    onClose: ()=>i(!1)
                })
            ]
        });
    }
    Gl.createRoot(document.getElementById("root")).render(P.jsx(Lc.StrictMode, {
        children: P.jsx(zp, {})
    }));
})();
