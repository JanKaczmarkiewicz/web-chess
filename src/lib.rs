use wasm_bindgen::prelude::*;

mod utils;

extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Chessman {
    Pawn = 1,
    Queen = 2,
    King = 3,
    Bishop = 4,
    Knight = 5,
    Rook = 6,
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Color {
    Black = 1,
    White = 2,
}

pub const BOARD_SIZE: usize = 8;

#[wasm_bindgen]
pub struct Chess {
    current_player: Color,
    selected_chessman: Option<usize>,
    board: [Option<(Chessman, Color)>; BOARD_SIZE * BOARD_SIZE],
}

#[wasm_bindgen]
impl Chess {
    fn get_index(row: usize, column: usize) -> usize {
        BOARD_SIZE * row + column
    }

    pub fn new() -> Self {
        Self {
            current_player: Color::White,
            selected_chessman: None,
            board: [
                Some((Chessman::Rook, Color::White)), Some((Chessman::Knight, Color::White)), Some((Chessman::Bishop, Color::White)), Some((Chessman::King, Color::White)), Some((Chessman::Queen, Color::White)), Some((Chessman::Bishop, Color::White)), Some((Chessman::Knight, Color::White)), Some((Chessman::Rook, Color::White)),
                Some((Chessman::Pawn, Color::White)), Some((Chessman::Pawn, Color::White)), Some((Chessman::Pawn, Color::White)), Some((Chessman::Pawn, Color::White)), Some((Chessman::Pawn, Color::White)), Some((Chessman::Pawn, Color::White)), Some((Chessman::Pawn, Color::White)), Some((Chessman::Pawn, Color::White)),
                None, None, None, None, None, None, None, None,
                None, None, None, None, None, None, None, None,
                None, None, None, None, None, None, None, None,
                None, None, None, None, None, None, None, None,
                Some((Chessman::Pawn, Color::Black)), Some((Chessman::Pawn, Color::Black)), Some((Chessman::Pawn, Color::Black)), Some((Chessman::Pawn, Color::Black)), Some((Chessman::Pawn, Color::Black)), Some((Chessman::Pawn, Color::Black)), Some((Chessman::Pawn, Color::Black)), Some((Chessman::Pawn, Color::Black)),
                Some((Chessman::Rook, Color::Black)), Some((Chessman::Knight, Color::Black)), Some((Chessman::Bishop, Color::Black)), Some((Chessman::King, Color::Black)), Some((Chessman::Queen, Color::Black)), Some((Chessman::Bishop, Color::Black)), Some((Chessman::Knight, Color::Black)), Some((Chessman::Rook, Color::Black)),
            ],
        }
    }

    pub fn board_state(&self) -> *const Option<(Chessman, Color)> {
        self.board.as_ptr()
    }

    pub fn get_selected_tile(&self) -> Option<usize> {
        self.selected_chessman
    }

    pub fn click(&mut self, x: usize, y: usize) {
        let clicked_index = Self::get_index(y, x);
        match self.selected_chessman {
            None => {
                log!("Clicked onx {}", self.board[clicked_index].is_none());

                if self.board[clicked_index].is_none() {
                    return;
                }

                self.selected_chessman = Some(clicked_index);
            }
            Some(selected_chessman) => {
                log!("Clicked on {}", clicked_index);
                self.board[clicked_index] = self.board[selected_chessman];
                self.board[selected_chessman] = None;
                self.selected_chessman = None;
            }
        }
    }
}

