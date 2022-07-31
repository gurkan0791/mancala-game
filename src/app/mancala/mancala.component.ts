import { Component, OnInit } from '@angular/core';
import { User, Hole, Position } from '../core';

@Component({
  selector: 'app-mancala',
  templateUrl: './mancala.component.html',
  styleUrls: ['./mancala.component.scss']
})
export class MancalaComponent implements OnInit {

  title = 'Mancala Game';
    user1!: User;
    user2!: User;

    /**
     * Keeps order to play.
     * @type {string}
     */
    turn!:string;

    isGameOver = false;
    
    /**
     * Lifecyle method
     */
    ngOnInit(): void {
        this.startNewGame();
    }

    /**
     * Starts the game  with initial states
     */
    startNewGame() {
        this.user1 = {
            id: "user1",
            name: "user1",
            position: "down",
            store: 0,
            holes: [{piece: 4}, {piece: 4}, {piece: 4}, {piece: 4}, {piece: 4}, {piece: 4}]
        };
        this.user2 = {
            id: "user2",
            name: "user2",
            position: "up",
            store: 0,
            holes: [{piece: 4}, {piece: 4}, {piece: 4}, {piece: 4}, {piece: 4}, {piece: 4}]
        };
        this.turn = this.user1.id;
        this.isGameOver = false;
    }

    /**
     * Manages game logic by increasing or decreasing the index,
     * keeping the counterclockwise motion, distributing the pieces into the holes,
     * storing pieces into the Mancala
     * @param hole player's holes
     * @param user player
     * @param indx index of clicked hole
     * @param opponent opponent player 
     * @returns true if the game has advanced one hand otherwise undefined
     */
    moveIt(hole: Hole, user: User, indx: number, opponent: User): true | undefined {

        // check whether game is over
        if (this.isGameOver) return;

        // check user if turn
        if (this.turn != user.id) return;

        //if no markers then no-op
        if (hole.piece == 0) return;

        let position = user.position;

        let tmpPieces = hole.piece;

        let hasFreeTurn = false;

        //collect all markers
        hole.piece = 0;

        //if one stone in hole
        if (tmpPieces == 1) {

            //if stone in last hole then increase related store
            if (this.isLast(indx, user.position)) {
                user.store += 1;
                //gain free turn
                hasFreeTurn = true;
            } else {

                //if not last then put stone into counter-clockwise neighbor 
                if(user.position == 'down') {
                    indx = indx + 1
                    user.holes[indx].piece += 1;
                }
                if(user.position == 'up') {
                    indx = indx - 1
                    user.holes[indx].piece += 1;
                }

                //If the last piece you drop is in your own store
                if (this.isOwnHole(user.position,position)) {

                    //if last piece drop own empty hole and opponent's opposite's hole greather than zero
                    //collect all side pieces and put your own store
                    if (user.holes[indx].piece == 1 && opponent.holes[indx].piece > 0) {
                        const capturedPieces = user.holes[indx].piece + opponent.holes[indx].piece;
                        console.log("karşıyı topla");
                        user.store += capturedPieces;
                        user.holes[indx].piece = 0;
                        opponent.holes[indx].piece = 0;
                    }

                }

            }
        } else {

            while (tmpPieces > 0) {

                //increase stores according to position up, down
                if (this.isOwnHole(user.position,position)) {
                    if (indx < user.holes.length) {
                        user.holes[indx].piece += 1;
                    }
                } else {
                    if (indx < opponent.holes.length) {
                        opponent.holes[indx].piece += 1;
                    }
                }

                //pieces one
                tmpPieces = tmpPieces - 1;

                //3.If the last piece you drop is in an empty hole on your side,
                //you capture that piece and any pieces in the hole directly opposite.
                //4.Always place all captured pieces in your store.
                if (tmpPieces == 0  && this.isOwnHole(user.position,position)) {
                    if (user.holes[indx].piece == 1 && opponent.holes[indx].piece > 0) {
                        const capturedPieces = user.holes[indx].piece + opponent.holes[indx].piece;
                       
                        user.store += capturedPieces;
                        user.holes[indx].piece = 0;
                        opponent.holes[indx].piece = 0;

                    }
                } else if(tmpPieces == 0 && !this.isOwnHole(user.position,position)) {
                  
                   //If the last piece you drop is in hole on opposite side
                   //and it makes it an even number, capture those pieces
                    if (opponent.holes[indx].piece % 2 == 0) {
                        const capturedPieces = opponent.holes[indx].piece;
                        user.store += capturedPieces;
                        opponent.holes[indx].piece = 0;
                    }
                    
                }

                //1.If you run into your own store, piece one piece in it.
                //If you run into your opponent's store, skip it.
                if (tmpPieces > 0 && this.isLast(indx, user.position) && this.isOwnHole(user.position,position)) {
                 
                    user.store += 1;
                    tmpPieces = tmpPieces - 1;

                    //2.If the last piece you drop is in your own store, you get a free turn.
                    if (tmpPieces == 0) {
                        hasFreeTurn = true;
                    }

                }

                //position and indx ensure counterclockwise movement
                if (position == 'down') {

                    if (this.isLast(indx, 'down')) {
                        position = 'up';
                        indx = 5;
                    } else {
                        indx = indx + 1;
                    }
                } else if (position == 'up') {

                    if (this.isLast(indx, 'up')) {
                        position = 'down';
                        indx = 0;
                    } else {
                        indx = indx - 1;
                    }
                }
                //console.log(user.position," ", position)
                
            }

        }

        //give turn to opposing opponent if player not get a free it
        if (!hasFreeTurn) {
            this.turn = user.id == this.user1.id ? this.user2.id : this.user1.id;
        }

        const isGameOver = this.checkGameOver(user,opponent);
        if (isGameOver) {
            this.calculateResults(user,opponent);
            this.isGameOver = isGameOver;
        }
        return true;
    }

    /**
     * Checks the game is over or not
     * @param user player model
     * @param opponent player opponent model
     * @returns true if one side of the Mancala board are empty
     */
     checkGameOver(user: User, opponent: User): boolean {

        const userMarkerCount = this.userMarkersLeftInHoles(user.holes);
        const opponentMarkerCount = this.userMarkersLeftInHoles(opponent.holes);
       
        //The game ends when all six spaces on one side of the Mancala board are empty.
        if(userMarkerCount > 0 && opponentMarkerCount > 0) {
           return false;
        }
        return true;
    }

    /**
     * Calculates the results when the game is over
     * @param user player model
     * @param opponent player opponent model
     * @returns string indicating who won 
     */
    calculateResults(user: User, opponent: User):string {

        const userMarkerCount = this.userMarkersLeftInHoles(user.holes);
        const opponentMarkerCount = this.userMarkersLeftInHoles(opponent.holes);

        //The player who still has pieces on his side of the board 
        //when the game ends captures all of those pieces.
        user.store += userMarkerCount;
        opponent.store += opponentMarkerCount;
     
        user.holes.forEach(hole=>hole.piece = 0);
        opponent.holes.forEach(hole=>hole.piece = 0);

        if(user.store > opponent.store) {
            return `${user.id} won`;
        } else if(user.store < opponent.store) {
            return `${opponent.id} won`;
        } else if(user.store == opponent.store) {
            return `draw`;
        } else {
            return "something is wrong";
        }
    
    }

    /**
     * Gets player's holes and accumulate pieces of these
     * @param holes all the holes of the player along with the pieces.
     * @returns number accumulated pieces
     */
    userMarkersLeftInHoles(holes: Hole[]):number {
        const total = holes.reduce((n, {piece}) => n + piece, 0);
        return total;
    }

    /**
     * Checks the index whether the last index or not. 
     * @param indx index of the hole clicked by player
     * @param position position of the player whose turn it is to play
     * @returns returns true if index is the last index according to the player position
     */
    // @ts-ignore
    isLast(indx: number, position: Position): boolean {
        if (position == "down") return indx == 5;
        if (position == "up") return indx == 0;
    }

    /**
     * checks if the hole is the hole of the current playing player.
     * @param position // current playing player's position
     * @param position2 // the position where the last piece will be placed
     * @returns returns true which is the player's own hole if the positions are equal
     */
    isOwnHole(position: Position, position2: Position) : boolean {
        return position === position2;
    }

}
