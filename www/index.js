import {Chess, Chessman, Color} from "wasm-chess";
import { memory } from "wasm-chess/chess_bg.wasm";

const NUMBER_OF_TILES = 8;
const TILE_SIZE = 100;
const BOARD_SIZE = NUMBER_OF_TILES * TILE_SIZE;

const loadImage = (src) => {
    const image = new Image();
    image.src = src;

    return new Promise((resolve) => {
        image.onload = () => resolve(image)
    })
}

const loadAssets = async () => {

    const getChessmanAsset = (name) =>
        loadImage(`https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${name}.png`)

    const [
        blackBishop,
        blackKing,
        blackQueen,
        blackPawn,
        blackRook,
        blackKnight,
        whiteBishop,
        whiteKing,
        whiteQueen,
        whitePawn,
        whiteRook,
        whiteKnight
    ] = await Promise.all([
        "bb",
        "bk",
        "bq",
        "bp",
        "br",
        "bn",
        "wb",
        "wk",
        "wq",
        "wp",
        "wr",
        "wn"
    ].map(getChessmanAsset))

    return {
        [Color.Black]: {
            [Chessman.Bishop]: blackBishop,
            [Chessman.King]: blackKing,
            [Chessman.Queen]: blackQueen,
            [Chessman.Pawn]: blackPawn,
            [Chessman.Rook]: blackRook,
            [Chessman.Knight]: blackKnight,
        },
        [Color.White]: {
            [Chessman.Bishop]: whiteBishop,
            [Chessman.King]: whiteKing,
            [Chessman.Queen]: whiteQueen,
            [Chessman.Pawn]: whitePawn,
            [Chessman.Rook]: whiteRook,
            [Chessman.Knight]: whiteKnight,
        }
    }
}

(async () => {
    const canvas = document.querySelector("#board");
    const ctx = canvas.getContext("2d")
    canvas.width = BOARD_SIZE;
    canvas.height = BOARD_SIZE;

    const chess = Chess.new();
    const boardRaw = new Uint8Array(memory.buffer, chess.board_state(), NUMBER_OF_TILES * NUMBER_OF_TILES * 2);

    const assets = await loadAssets()

    ctx.beginPath();

    const getIndex = (row, column) => 2 * NUMBER_OF_TILES * row + column;

    for (let row = 0; row < NUMBER_OF_TILES; row++) {
        for (let col = 0; col < NUMBER_OF_TILES; col++) {

            ctx.fillStyle = (row + col) % 2 === 0 ? "#759656" : "#EDEED2";

            ctx.fillRect(
                col * TILE_SIZE,
                row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );

            const index = getIndex(row, col * 2);

            const chessman = boardRaw[index];
            const color = boardRaw[index + 1];

            const asset = assets[color]?.[chessman]

            if (!asset) continue;

            ctx.drawImage(asset, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
    }

    ctx.stroke();

    canvas.addEventListener("click", (e) => {
        const clickedX = Math.floor(e.offsetX / (e.target.clientWidth / 8));
        const clickedY = Math.floor(e.offsetY / (e.target.clientHeight / 8));

    });
})()



