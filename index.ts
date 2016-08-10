const R = require('ramda');
const prop = R.prop;

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
}

function getUserBanner(banners, user) {
  return Maybe.of(user)
  .map(prop('accountDetails'))
  .map(prop('address'))
  .map(prop('province'))
  .map(prop(R.__, banners));
}

console.log(getUserBanner(banners, user));
