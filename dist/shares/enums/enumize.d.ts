export declare function enumize<K extends string>(...args: K[]): {
    [P in K]: P;
};
