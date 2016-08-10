"use strict";
const R = require('ramda');
const prop = R.prop;
const user = {
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
const banners = {
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
    'YT': '/assets/banners/yukon.jpg',
};
class Maybe {
    constructor(value) {
        this.__value = value;
    }
    static of(value) {
        return new Maybe(value);
    }
    isNothing() {
        return (this.__value === null || this.__value === undefined);
    }
    map(f) {
        if (this.isNothing()) {
            return Maybe.of(null);
        }
        return Maybe.of(f(this.__value));
    }
}
exports.Maybe = Maybe;
function getUserBanner(banners, user) {
    return Maybe.of(user)
        .map(prop('accountDetails'))
        .map(prop('address'))
        .map(prop('province'))
        .map(prop(R.__, banners));
}
console.log(getUserBanner(banners, user));
//# sourceMappingURL=index.js.map