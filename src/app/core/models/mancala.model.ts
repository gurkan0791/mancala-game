export interface Hole {
    piece: number;
}

/**
  * @name Position
  * @type {"up" | "down"}
  */
export type Position = 'up' | 'down';

export interface User {
    /**
     * id: player id,
     */
    id: string;
    name: string;
    position: Position;
    /**
     * store: Mancala
     */
    store: number;
    /**
     * holes: player's holes
     */
    holes: Hole[];
}