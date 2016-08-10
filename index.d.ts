export declare class Maybe<A> {
    private __value;
    constructor(value: A);
    static of<C>(value: C): Maybe<C>;
    isNothing(): boolean;
    map<B>(f: (a: A) => B): Maybe<B>;
}
