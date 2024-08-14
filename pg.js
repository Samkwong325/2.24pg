import React, { useState, useRef } from 'react';

const PuzzleGame = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [gameBoard, setGameBoard] = useState([]);
  const imageInputRef = useRef(null);

  const handleChooseFile = () => {
    imageInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          createPuzzlePieces(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const createPuzzlePieces = (image) => {
    const pieceWidth = image.width / 2;
    const pieceHeight = image.height / 2;
    const pieces = [];

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        pieces.push({
          x,
          y,
          style: {
            width: `${pieceWidth}px`,
            height: `${pieceHeight}px`,
            backgroundImage: `url(${image.src})`,
            backgroundPosition: `-${x * pieceWidth}px -${y * pieceHeight}px`,
          },
        });
      }
    }

    setGameBoard(pieces);
  };

  const startDragging = (event, piece) => {
    setIsDragging(true);
    setCurrentPiece(piece);
    setCurrentPosition({
      x: event.clientX - piece.style.left.replace('px', ''),
      y: event.clientY - piece.style.top.replace('px', ''),
    });
    event.target.classList.add('dragging');
  };

  const stopDragging = (event) => {
    setIsDragging(false);
    event.target.classList.remove('dragging');
    setCurrentPiece(null);
  };

  const dragPiece = (event) => {
    if (isDragging) {
      currentPiece.style.left = `${event.clientX - currentPosition.x}px`;
      currentPiece.style.top = `${event.clientY - currentPosition.y}px`;
    }
  };

  return (
    <div className="container">
      <button id="chooseFileBtn" onClick={handleChooseFile}>
        Choose File
      </button>
      <input
        type="file"
        id="image-input"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <div id="game-board">
        {gameBoard.map((piece, index) => (
          <div
            key={index}
            className="puzzle-piece"
            style={piece.style}
            onMouseDown={(event) => startDragging(event, piece)}
            onMouseUp={stopDragging}
            onMouseMove={dragPiece}
          />
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;
