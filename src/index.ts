export interface ICellMapUnit_I {
    id: number;
    hash: number;
    pos: { x: number, y: number };
}

/**
 * ICellMap - Spatial Hash Grid that extends Map & incrementally assigns IDs
 */
export default class ICellMap<V extends ICellMapUnit_I> extends Map<number, V>  {
    #cells: Map<number, V[]> = new Map<number, V[]>();
    #data = { cs: 1, cx: 1, cy: 1 };
    #id = 0;
    /**
     * @param w width of grid
     * @param h height of grid
     * @param cs size of cell
     */
    constructor(w: number, h: number, cs: number) {
        super();
        this.#data.cs = cs;
        this.#data.cx = Math.floor(w / cs) + 1;
        this.#data.cy = Math.floor(h / cs) + 1;
        this.clear();
    }
    /**
     * Adds a unit
     * @param v 
     * @returns the id of the addedunit
     */
    add(v: V) {
        v.id = this.#id++;
        this.set(v.id, v);
        return v.id;
    }
    set(id: number, v: V) {
        const [cx, cy] = this.#getCellPos(v.pos.x, v.pos.y);
        const hash = this.#getHashForCellPos(cx, cy);
        this.#setInner(v, hash);
        return super.set(id, v);
    }
    #setInner(v: V, hash: number) {
        this.#cells.get(hash)?.push(v);
        v.hash = hash;
    }
    deleteAndGet(id: number): V | undefined {
        const v = this.get(id);
        this.delete(id);
        return v;
    }
    delete(id: number) {
        const v = this.get(id);
        if (!v)
            return false;
        this.#deleteInner(v);
        return super.delete(id);
    }
    #deleteInner(v: V) {
        const cell = this.#cells.get(v.hash);
        if (cell)
            cell.splice(cell.findIndex(e => e.id == v.id) ?? 0, 1);
    }
    clear() {
        for (let i = 0; i < this.#data.cy * this.#data.cx; i++) {
            this.#cells.set(i, []);
        }
        return super.clear();
    }
    /**
     * Updates an unit, recalculating its hash and cell
     * @param v 
     */
    update(v: V) {
        const [cx, cy] = this.#getCellPos(v.pos.x, v.pos.y);
        const hash = this.#getHashForCellPos(cx, cy);
        if (hash == v.hash)
            return;
        this.#deleteInner(v);
        this.#setInner(v, hash);
    }
    /**
     * @param x 
     * @param y 
     * @param range 
     * @returns list of cells with units in range
     */
    query(pos: { x: number, y: number }, range: number) {
        const [sx, sy] = this.#getCellPos(pos.x - range, pos.y - range);
        const [ex, ey] = this.#getCellPos(pos.x + range, pos.y + range);

        const cells: V[][] = [];
        for (let cy = sy; cy <= ey; cy++) {
            for (let cx = sx; cx <= ex; cx++) {
                const cell = this.getUnitsInCell(this.#getHashForCellPos(cx, cy));
                if (cell)
                    cells.push(cell);
            }
        }
        return cells;
    }
    queryPos(pos: { x: number, y: number }) {
        return this.getUnitsInCell(this.#getHashForCellPos(pos.x, pos.y));
    }
    /**
     * @param x 
     * @param y 
     * @param range 
     * @returns list of cellHashes in range
     */
    queryCellHashes(pos: { x: number, y: number }, range: number) {
        const [sx, sy] = this.#getCellPos(pos.x - range, pos.y - range);
        const [ex, ey] = this.#getCellPos(pos.x + range, pos.y + range);

        const hashes: number[] = [];
        for (let cy = sy; cy <= ey; cy++) {
            for (let cx = sx; cx <= ex; cx++) {
                hashes.push(this.#getHashForCellPos(cx, cy));
            }
        }
        return hashes;
    }
    /**
     * @param hash hash for cell 
     * @returns List with all units in cell
     */
    getUnitsInCell(hash: number) {
        return this.#cells.get(hash);
    }
    #getHashForCellPos(cx: number, cy: number) {
        return cy * this.#data.cx + cx;
    }
    #getCellPos(x: number, y: number) {
        const cx = this.#clamp(Math.floor(x / this.#data.cs), 0, this.#data.cx - 1);
        const cy = this.#clamp(Math.floor(y / this.#data.cs), 0, this.#data.cy - 1);
        return [cx, cy];
    }
    #clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(n, max)) }
}
