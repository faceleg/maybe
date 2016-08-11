const R = require('ramda');
const prop = R.prop;
const path = R.path;
const curry = R.curry;

const user = {
  email: 'james@example.com',
  accountDetails: {
    address: {
      street:   '123 Fake St',
      city:     'Exampleville',
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

export class Maybe<A> {
  private __value: A;

  constructor(value: A) {
    this.__value = value;
  }

  static of<C>(value: C): Maybe<C> {
    return new Maybe<C>(value);
  }

  isNothing(): boolean {
    return (this.__value === null || this.__value === undefined);
  }

  map<B>(f: (a: A) => B): Maybe<B> {
    if (this.isNothing()) {
      return Maybe.of(null);
    }
    return Maybe.of(f(this.__value));
  }

  join<A>() {
    return this.__value;
  }

  chain<B>(f: (a: A) => B): B {
    return this.map(f).join();
  }

  orElse<B>(something: B): Maybe<A | B> {
    if (this.isNothing()) {
      return Maybe.of(something);
    }

    return this;
  }

  ap(maybe) {
    return maybe.map(this.__value);
  }
}

const liftA2 = curry(function(fn: (a: any) => any, m1: Maybe<any>, m2: Maybe<any>) {
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

const bannerSrc = getUserBanner(user).orElse('something else');
console.log('bannerSrc:', bannerSrc);

const applyBanner = curry(function(el, banner) {
  el.src = banner;
  return el;
});

const applyBannerMaybe = liftA2(applyBanner);

const mutatedBanner = applyBannerMaybe(Maybe.of({ src: null }), bannerSrc);

console.log(mutatedBanner);
