import {Chess, Chessman, Color} from "wasm-chess";
import {memory} from "wasm-chess/chess_bg.wasm";

const NUMBER_OF_TILES = 8;
const TILE_SIZE = 100;
const BOARD_SIZE = NUMBER_OF_TILES * TILE_SIZE;

const getChessmanAsset = async (name: string) => {
    const image = new Image();
    image.src = `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${name}.png`;

    await new Promise((resolve) => {
        image.onload = resolve;
    });

    return image;
}

const loadAssets = async () => {

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

const colors = {
    black: "#759656",
    white: "#EDEED2",
    selected: "#BACB41"
};

(async () => {
    const canvas = document.querySelector<HTMLCanvasElement>("#board");
    const ctx = canvas.getContext("2d")

    canvas.width = BOARD_SIZE;
    canvas.height = BOARD_SIZE;

    const chess = Chess.new();
    const boardRaw = new Uint8Array(memory.buffer, chess.board_state(), NUMBER_OF_TILES * NUMBER_OF_TILES * 2);
    const assets = await loadAssets()

    const drawBoard = () => {
        ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

        for (let row = 0; row < NUMBER_OF_TILES; row++) {
            for (let col = 0; col < NUMBER_OF_TILES; col++) {

                const index = NUMBER_OF_TILES * row + col

                let tileColor = (row + col) % 2 === 0 ? colors.black : colors.white
                if (chess.get_selected_tile() === index) {
                    tileColor = colors.selected
                }

                ctx.fillStyle = tileColor

                ctx.fillRect(
                    col * TILE_SIZE,
                    row * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );

                const memoryOffset = 2 * (NUMBER_OF_TILES * row + col);

                const chessman = boardRaw[memoryOffset];
                const color = boardRaw[memoryOffset + 1];

                const asset = assets[color]?.[chessman]

                if (!asset) continue;

                ctx.drawImage(asset, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
            }
        }

    }

    drawBoard();
        
    canvas.addEventListener("click", (e) => {
        // @ts-ignore
        const clickedX = Math.floor(e.offsetX / (e.target.clientWidth / NUMBER_OF_TILES));
        // @ts-ignore
        const clickedY = Math.floor(e.offsetY / (e.target.clientHeight / NUMBER_OF_TILES));
        console.log(clickedX, clickedY);
        chess.click(clickedX, clickedY);
        drawBoard();
    });
})()



