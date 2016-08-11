"use strict";
var R = require('ramda');
var prop = R.prop;
var path = R.path;
var curry = R.curry;
var user = {
    email: 'james@example.com',
    accountDetails: {
        address: {
            street: '123 Fake St',
            city: 'Exampleville',
            province: 'NS',
            postcode: '1234'
        }
    },
    preferences: {}
};
var banners = {
    'AB': '/assets/banners/alberta.jpg',
    'BC': '/assets/banners/british-columbia.jpg',
    'MB': '/assets/banners/manitoba.jpg',
    'NL': '/assets/banners/newfoundland-labrador.jpg',
    'NS': '/assets/banners/nova-scotia.jpg',
    'NT': '/assets/banners/northwest-territories.jpg',
    'ON': '/assets/banners/ontario.jpg',
    'PE': '/assets/banners/prince-edward.jpg',
    'QC': '/assets/banners/quebec.jpg',
    'SK': '/assets/banners/saskatchewan.jpg',
    'YT': '/assets/banners/yukon.jpg'
};
var Maybe = (function () {
    function Maybe(value) {
        this.__value = value;
    }
    Maybe.of = function (value) {
        return new Maybe(value);
    };
    Maybe.prototype.isNothing = function () {
        return (this.__value === null || this.__value === undefined);
    };
    Maybe.prototype.map = function (f) {
        if (this.isNothing()) {
            return Maybe.of(null);
        }
        return Maybe.of(f(this.__value));
    };
    Maybe.prototype.join = function () {
        return this.__value;
    };
    Maybe.prototype.chain = function (f) {
        return this.map(f).join();
    };
    Maybe.prototype.orElse = function (something) {
        if (this.isNothing()) {
            return Maybe.of(something);
        }
        return this;
    };
    Maybe.prototype.ap = function (maybe) {
        return maybe.map(this.__value);
    };
    return Maybe;
}());
exports.Maybe = Maybe;
var liftA2 = curry(function (fn, m1, m2) {
    return m1.map(fn).ap(m2);
});
function getProvinceBanner(province) {
    return Maybe.of(banners[province]);
}
function getUserBanner(user) {
    return Maybe.of(user)
        .map(path([
        'accountDetails',
        'address',
        'province'
    ]))
        .chain(getProvinceBanner);
}
var bannerSrc = getUserBanner(user).orElse('something else');
console.log('bannerSrc:', bannerSrc);
var applyBanner = curry(function (el, banner) {
    el.src = banner;
    return el;
});
var applyBannerMaybe = liftA2(applyBanner);
var mutatedBanner = applyBannerMaybe(Maybe.of({ src: null }), bannerSrc);
console.log(mutatedBanner);
