import { UnionFindFactory, WeightedQuickUnionPathHalvingUF } from '../lib/graphs';

test('UnionFindFactory returns a prototype of WeightedQuickUnionPathHalvingUF', () => {
    const uf = UnionFindFactory(50);
    expect(uf.count()).toBe(50);
    expect(WeightedQuickUnionPathHalvingUF.isPrototypeOf(uf)).toBe(true);
});

test('WeightedQuickUnionPathHalvingUF properly creates unions with path compression', () => {
    const uf = UnionFindFactory(10);
    expect(uf.count()).toBe(10);
    uf.union(1,2);
    uf.union(1,4);
    uf.union(3,1);
    uf.union(8,3);
    expect(uf.id).toEqual([0,1,1,1,1,5,6,7,1,9]);
    expect(uf.size).toEqual([1,5,1,1,1,1,1,1,1,1]);
    expect(uf.connected(9,1)).toBe(false);
    expect(uf.connected(1,2)).toBe(true);
    expect(uf.connected(8,1)).toBe(true);
    expect(uf.connected(8,4)).toBe(true);
});

test('WeightedQuickUnionPathHalvingUF adds smaller trees to larger trees', () => {
    const uf = UnionFindFactory(10);
    expect(uf.count()).toBe(10);
    uf.union(1,2);
    uf.union(1,4);
    uf.union(3,1); // now that 1 is bigger 3 should go below 1
    uf.union(8,9);
    uf.union(7,8); // now that 8 is bigger 7 should go below 8
    expect(uf.id).toEqual([0,1,1,1,1,5,6,8,8,8]);
    expect(uf.size).toEqual([1,4,1,1,1,1,1,1,3,1]);
    uf.union(8,1); // since 1 is bigger 8 should go below 1
    expect(uf.size).toEqual([1,7,1,1,1,1,1,1,3,1]);
    expect(uf.id).toEqual([0,1,1,1,1,5,6,8,1,8]);
    expect(uf.root(7)).toEqual(1); // checking root should lead to path compression
    expect(uf.id).toEqual([0,1,1,1,1,5,6,1,1,8]);
    expect(uf.count()).toBe(4);
    uf.union(5,6);
    uf.union(6,0);
    uf.union(5,9);
    expect(uf.id).toEqual([5,1,1,1,1,1,5,1,1,1]);
    expect(uf.size).toEqual([1,10,1,1,1,3,1,1,3,1]);
    uf.union(9,8);
    expect(uf.count()).toBe(1);
});