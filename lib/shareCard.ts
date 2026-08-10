import { Movie } from "@/types";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Wraps text to a max width, returns the lines drawn and the y position
// after the last line.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  let cursorY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      const isLastAllowedLine = lines === maxLines - 1;
      ctx.fillText(isLastAllowedLine ? `${line.trim()}…` : line, x, cursorY);
      line = words[i];
      cursorY += lineHeight;
      lines++;
      if (lines >= maxLines) return cursorY;
    } else {
      line = testLine;
    }
  }
  if (line && lines < maxLines) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

// Builds the branded share card as a PNG Blob. Returns null if canvas isn't
// available (SSR) or the poster image fails to load in a way that taints
// the canvas — callers should fall back to a text-only share in that case.
export async function generateShareCard(movie: Movie): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background: black -> deep red -> black vertical gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  bgGradient.addColorStop(0, "#000000");
  bgGradient.addColorStop(0.45, "#2a0509");
  bgGradient.addColorStop(1, "#000000");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Soft ambient glow behind where the poster will sit
  const glow = ctx.createRadialGradient(
    CARD_WIDTH / 2,
    430,
    50,
    CARD_WIDTH / 2,
    430,
    420
  );
  glow.addColorStop(0, "rgba(224,32,47,0.35)");
  glow.addColorStop(1, "rgba(224,32,47,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Brand header
  ctx.textAlign = "center";
  ctx.font = "bold 44px Arial, sans-serif";
  ctx.fillStyle = "#f5f5f6";
  ctx.fillText("Cine", CARD_WIDTH / 2 - 55, 90);
  ctx.fillStyle = "#e0202f";
  ctx.fillText("Finder", CARD_WIDTH / 2 + 55, 90);

  ctx.font = "italic bold 22px Arial, sans-serif";
  ctx.fillStyle = "#e0a83c";
  ctx.fillText("✦  Witness the Cinema  ✦", CARD_WIDTH / 2, 128);

  // Poster
  const posterW = 620;
  const posterH = 930;
  const posterX = (CARD_WIDTH - posterW) / 2;
  const posterY = 180;

  if (movie.posterUrl) {
    try {
      const img = await loadImage(movie.posterUrl);
      ctx.save();
      drawRoundedRect(ctx, posterX, posterY, posterW, posterH, 24);
      ctx.clip();
      ctx.drawImage(img, posterX, posterY, posterW, posterH);
      ctx.restore();

      // Thin border for polish
      ctx.save();
      drawRoundedRect(ctx, posterX, posterY, posterW, posterH, 24);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    } catch {
      // Poster failed to load (network/CORS) — draw a placeholder instead
      // of letting the whole card generation fail.
      drawPosterPlaceholder(ctx, posterX, posterY, posterW, posterH);
    }
  } else {
    drawPosterPlaceholder(ctx, posterX, posterY, posterW, posterH);
  }

  let cursorY = posterY + posterH + 80;

  // Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#f5f5f6";
  ctx.font = "bold 52px Arial, sans-serif";
  cursorY = wrapText(ctx, movie.title, CARD_WIDTH / 2, cursorY, 900, 58, 2);

  // Year / genre
  ctx.font = "30px Arial, sans-serif";
  ctx.fillStyle = "#9a9aa0";
  ctx.fillText(`${movie.year} · ${movie.genre}`, CARD_WIDTH / 2, cursorY + 12);
  cursorY += 60;

  // Rating pill
  const ratingText = `★ ${movie.rating}`;
  ctx.font = "bold 28px Arial, sans-serif";
  const ratingWidth = ctx.measureText(ratingText).width + 48;
  const pillX = (CARD_WIDTH - ratingWidth) / 2;
  ctx.fillStyle = "rgba(224,32,47,0.25)";
  drawRoundedRect(ctx, pillX, cursorY, ratingWidth, 56, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(224,32,47,0.5)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, pillX, cursorY, ratingWidth, 56, 28);
  ctx.stroke();
  ctx.fillStyle = "#e0202f";
  ctx.fillText(ratingText, CARD_WIDTH / 2, cursorY + 38);
  cursorY += 100;

  // Premise / reason
  ctx.font = "28px Arial, sans-serif";
  ctx.fillStyle = "#c8c8cc";
  wrapText(ctx, movie.reason, CARD_WIDTH / 2, cursorY, 880, 40, 3);

  // Bottom CTA
  ctx.font = "bold 26px Arial, sans-serif";
  ctx.fillStyle = "#e0202f";
  ctx.fillText("🎬 Find your perfect watch on CineFinder", CARD_WIDTH / 2, CARD_HEIGHT - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}

function drawPosterPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "#131214";
  drawRoundedRect(ctx, x, y, w, h, 24);
  ctx.fill();
  ctx.font = "80px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#4d4d52";
  ctx.fillText("🎬", x + w / 2, y + h / 2 + 30);
}
