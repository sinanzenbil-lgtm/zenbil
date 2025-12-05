'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150;

export default function OyunPage() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // High score'u localStorage'dan yükle
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Rastgele yem oluştur
  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  // Yeni oyun başlat
  const startNewGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
  }, [generateFood]);

  // Oyun döngüsü
  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      // Yönüne göre kafayı hareket ettir
      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Duvar çarpışması kontrolü
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Kendine çarpma kontrolü
      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Yem yeme kontrolü
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake-high-score', newScore.toString());
          }
          return newScore;
        });
        return newSnake;
      }

      // Kuyruğu kısalt
      return newSnake.slice(0, -1);
    });
  }, [food, gameOver, isPaused, generateFood, highScore]);

  // Oyun döngüsünü başlat/durdur
  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameOver, isPaused]);

  // Klavye kontrolleri
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key;
      const currentDir = directionRef.current;

      // Zıt yönlere gitmeyi engelle
      if (key === 'ArrowUp' && currentDir !== 'DOWN') {
        directionRef.current = 'UP';
        setDirection('UP');
      } else if (key === 'ArrowDown' && currentDir !== 'UP') {
        directionRef.current = 'DOWN';
        setDirection('DOWN');
      } else if (key === 'ArrowLeft' && currentDir !== 'RIGHT') {
        directionRef.current = 'LEFT';
        setDirection('LEFT');
      } else if (key === 'ArrowRight' && currentDir !== 'LEFT') {
        directionRef.current = 'RIGHT';
        setDirection('RIGHT');
      } else if (key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              🐍 Snake Oyunu
            </h1>
            <p className="text-lg text-gray-600">
              Ok tuşları ile yılanı hareket ettirin, yemleri toplayın!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Skor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{score}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  En Yüksek Skor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{highScore}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kontroller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>⬆️⬇️⬅️➡️ Ok tuşları</div>
                  <div>⏸️ Boşluk: Duraklat</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div
                  className="relative bg-gray-900 rounded-lg p-4 shadow-2xl"
                  style={{
                    width: GRID_SIZE * CELL_SIZE + 8,
                    height: GRID_SIZE * CELL_SIZE + 8,
                  }}
                >
                  {/* Oyun alanı */}
                  <div className="relative w-full h-full">
                    {/* Yılan */}
                    {snake.map((segment, index) => (
                      <div
                        key={index}
                        className={`absolute rounded ${
                          index === 0
                            ? 'bg-green-400 border-2 border-green-300'
                            : 'bg-green-500'
                        }`}
                        style={{
                          left: segment.x * CELL_SIZE,
                          top: segment.y * CELL_SIZE,
                          width: CELL_SIZE - 2,
                          height: CELL_SIZE - 2,
                        }}
                      />
                    ))}

                    {/* Yem */}
                    <div
                      className="absolute bg-red-500 rounded-full animate-pulse"
                      style={{
                        left: food.x * CELL_SIZE,
                        top: food.y * CELL_SIZE,
                        width: CELL_SIZE - 2,
                        height: CELL_SIZE - 2,
                      }}
                    />

                    {/* Oyun Bitti Overlay */}
                    {gameOver && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                        <div className="text-center text-white">
                          <div className="text-4xl font-bold mb-4">Oyun Bitti!</div>
                          <div className="text-2xl mb-4">Skorunuz: {score}</div>
                          <Button onClick={startNewGame} size="lg">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Tekrar Oyna
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Duraklatıldı Overlay */}
                    {isPaused && !gameOver && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <div className="text-center text-white">
                          <div className="text-3xl font-bold">Duraklatıldı</div>
                          <div className="text-sm mt-2">Devam etmek için boşluk tuşuna basın</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setIsPaused((prev) => !prev)}
              disabled={gameOver}
              variant="outline"
              size="lg"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Devam Et
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Duraklat
                </>
              )}
            </Button>
            <Button onClick={startNewGame} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Yeni Oyun
            </Button>
          </div>

          {gameOver && (
            <div className="mt-6 text-center">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <p className="text-yellow-800">
                    💡 İpucu: Yılanın kuyruğuna ve duvarlara çarpmamaya dikkat edin!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

