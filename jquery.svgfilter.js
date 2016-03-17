/*! modernizr 3.0.0-alpha.3 (Custom Build) | MIT *
 * http://v3.modernizr.com/download/#-cssfilters-inlinesvg-svgfilters !*/
;!function (e,n,t) {
function s(e,n) {
return typeof e === n
}function o() {
var e,n,t,o,i,l,f;for (var u in a) {
if (e = [],n = a[u],n.name && (e.push(n.name.toLowerCase()),n.options && n.options.aliases && n.options.aliases.length))for (t = 0; t < n.options.aliases.length; t++)e.push(n.options.aliases[t].toLowerCase());for (o = s(n.fn, "function") ? n.fn() : n.fn,i = 0; i < e.length; i++)l = e[i],f = l.split("."),1 === f.length ? Modernizr[f[0]] = o : (!Modernizr[f[0]] || Modernizr[f[0]]instanceof Boolean || (Modernizr[f[0]] = new Boolean(Modernizr[f[0]])),Modernizr[f[0]][f[1]] = o),r.push((o ? "" : "no-") + f.join("-"))
}
}function i(e) {
var n = f.className,t = Modernizr._config.classPrefix || "";if (Modernizr._config.enableJSClass) {
var s = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");n = n.replace(s, "$1" + t + "js$2")
}Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t),f.className = n)
}var r = [],a = [],l = {_version: "3.0.0-alpha.3",_config: {classPrefix: "",enableClasses: !0,enableJSClass: !0,usePrefixes: !0},_q: [],on: function (e,n) {
var t = this;setTimeout(function () {
n(t[e])
}, 0)
},addTest: function (e,n,t) {
a.push({name: e,fn: n,options: t})
},addAsyncTest: function (e) {
a.push({name: null,fn: e})
}},Modernizr = function () {};Modernizr.prototype = l,Modernizr = new Modernizr,Modernizr.addTest("svgfilters", function () {
var n = !1;try {
n = "SVGFEColorMatrixElement"in e && 2 == SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE
}catch (t) {}return n
});var f = n.documentElement,u = function () {
return "function" != typeof n.createElement ? n.createElement(arguments[0]) : n.createElement.apply(n, arguments)
};Modernizr.addTest("inlinesvg", function () {
var e = u("div");return e.innerHTML = "<svg/>","http://www.w3.org/2000/svg" == (e.firstChild && e.firstChild.namespaceURI)
});var c = l._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];l._prefixes = c;var p = "CSS"in e && "supports"in e.CSS,d = "supportsCSS"in e;Modernizr.addTest("supports", p || d),Modernizr.addTest("cssfilters", function () {
var s = u("div");if (s.style.cssText = c.join("filter:blur(2px); "),Modernizr.supports) {
var o = "CSS"in e ? e.CSS.supports("filter", "url()") : e.supportsCSS("filter", "url()");return o
}return !!s.style.length && (n.documentMode === t || n.documentMode > 9)
}),o(),i(r),delete l.addTest,delete l.addAsyncTest;for (var m = 0; m < Modernizr._q.length; m++)Modernizr._q[m]();e.Modernizr = Modernizr
}(window, document);
;(function ($, window, document, undefined) {
    var pluginName = 'svgfilter',
      defaults = {
          propertyName: 'value'
      };

    function Plugin(element, options) {
        this.element = element;

        options.filterName = options.filterName || '';
        options.filterParams = options.filterParams || {};

        this.options = $.extend({}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var $el;

            if (!Modernizr.cssfilters && Modernizr.inlinesvg && Modernizr.svgfilters) {
                $el = $(this.element);

                if (this.cssFilterDeprecated($el)) {
                    this.modernize($el, this.options);
                }
            }
        },

        cssFilterDeprecated: function ($el) {
            return $el.css('filter') === 'none';
        },

        getTemplate: function (filterName, params) {
            return $(
              '<div class="' + pluginName + '">' +
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + params.svg.width + ' ' + params.svg.height + '" width="' + params.svg.width + '" height="' + params.svg.height + '" style="' + params.svg.offset + '">' +
                  '<image filter="url(&quot;#' + filterName + '&quot;)" x="0" y="0" width="' + params.svg.width + '" height="' + params.svg.height + '" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + params.svg.url + '" />' +
                '</svg>' +
              '</div>');
        },

        getElementType: function ($el) {
            var type = '';

            if ($el.prop('tagName').toUpperCase() === 'IMG') {
                type = 'Img';
            }

            return type;
        },

        getComputedStyle: function (el) {
            var computedStyle = {},
                styles = {};

            computedStyle = window.getComputedStyle(el, null);

            for (var i = 0, length = computedStyle.length; i < length; i++) {
                var prop = computedStyle[i],
                    val = computedStyle.getPropertyValue(prop);
                styles[prop] = val;
            }

            return styles;
        },

        getParams: function ($el) {
            var type = this.getElementType($el);
            return this['get' + type + 'Params']($el);
        },

        getImgParams: function ($el) {
            var params = {};

            params.styles = this.getComputedStyle($el[0]);

            params.svg = {
                url: $el[0].src,
                width: params.styles.width.replace('px', ''),
                height: params.styles.height.replace('px', ''),
                offset: ''
            };

            return params;
        },

        setStyles: function (styles, url, width, height) {
            styles.display = 'inline-block';
            styles.overflow = styles['overflow-x'] = styles['overflow-y'] = 'hidden';
            delete styles.filter;
            delete styles['-webkit-filter'];

            return styles;
        },

        addSVGFiltersDefOnce: function (filterName, filterParams) {
            var $body,
                dataName,
                filter;

            $body = $('body');

            dataName = 'plugin_' + pluginName + '_has_filter_' + filterName;

            if (!$body.data(dataName)) {
                filter = $.fn[pluginName][filterName](filterParams);

                $body.data(dataName, 'true').append(
                  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute">' +
                    '<defs>' + filter + '</defs>' +
                  '</svg>');
            }
        },

        modernize: function ($el, options) {
            var params,
                template,
                filterName,
                filterParams,
                styles;

            params = this.getParams($el);

            filterName = options.filterName;
            filterParams = options.filterParams;

            template = this.getTemplate(filterName, params);

            params.styles = this.setStyles(params.styles, params.svg.url, params.svg.width, params.svg.height);

            template.css(params.styles);

            this.addSVGFiltersDefOnce(filterName, filterParams);
            $el.replaceWith(template);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
        });
    };

    $.fn[pluginName].grayscale = function () {
        var grayscale =
          '<filter id="grayscale">' +
            '<feColorMatrix type="saturate" values="0"/>' +
          '</filter>';

        return grayscale;
    };

    $.fn[pluginName].solid = function (params) {
        var solid =
          '<filter id="solid">' +
            '<feColorMatrix in="SourceGraphic" type="matrix" values="' + params.matrix.join(' ') + '" />' +
          '</filter>';

        return solid;
    };

})(jQuery, window, document);
