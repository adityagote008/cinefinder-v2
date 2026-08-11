import { Comment, Movie } from "@/types";

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

function drawPosterPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "#131214";
  drawRoundedRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.font = "44px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#4d4d52";
  ctx.fillText("🎬", x + w / 2, y + h / 2 + 16);
}

// Shared header used by both card types: dark branded background, poster +
// title/year/genre row, and the CineFinder wordmark up top.
async function drawCardHeader(ctx: CanvasRenderingContext2D, movie: Movie): Promise<number> {
  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  bgGradient.addColorStop(0, "#0c0c0d");
  bgGradient.addColorStop(0.5, "#1a0508");
  bgGradient.addColorStop(1, "#0c0c0d");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const pad = 60;

  // Brand wordmark
  ctx.textAlign = "left";
  ctx.font = "bold 34px Arial, sans-serif";
  ctx.fillStyle = "#f5f5f6";
  ctx.fillText("Cine", pad, 90);
  const cineWidth = ctx.measureText("Cine").width;
  ctx.fillStyle = "#e0202f";
  ctx.fillText("Finder", pad + cineWidth, 90);

  // Poster + title row
  const posterW = 220;
  const posterH = 330;
  const posterX = pad;
  const posterY = 140;

  if (movie.posterUrl) {
    try {
      const img = await loadImage(movie.posterUrl);
      ctx.save();
      drawRoundedRect(ctx, posterX, posterY, posterW, posterH, 16);
      ctx.clip();
      ctx.drawImage(img, posterX, posterY, posterW, posterH);
      ctx.restore();
    } catch {
      drawPosterPlaceholder(ctx, posterX, posterY, posterW, posterH);
    }
  } else {
    drawPosterPlaceholder(ctx, posterX, posterY, posterW, posterH);
  }

  const textX = posterX + posterW + 40;
  const textMaxWidth = CARD_WIDTH - textX - pad;

  ctx.textAlign = "left";
  ctx.fillStyle = "#f5f5f6";
  ctx.font = "bold 44px Arial, sans-serif";
  wrapText(ctx, movie.title, textX, posterY + 60, textMaxWidth, 50, 2);

  ctx.font = "26px Arial, sans-serif";
  ctx.fillStyle = "#9a9aa0";
  ctx.fillText(`${movie.year} · ${movie.genre}`, textX, posterY + 175);

  // Rating pill
  const ratingText = `★ ${movie.rating}`;
  ctx.font = "bold 24px Arial, sans-serif";
  const ratingWidth = ctx.measureText(ratingText).width + 36;
  ctx.fillStyle = "rgba(224,32,47,0.22)";
  drawRoundedRect(ctx, textX, posterY + 210, ratingWidth, 48, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(224,32,47,0.5)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, textX, posterY + 210, ratingWidth, 48, 24);
  ctx.stroke();
  ctx.fillStyle = "#e0202f";
  ctx.fillText(ratingText, textX + 18, posterY + 242);

  return posterY + posterH + 60; // y-cursor for content below the header
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.textAlign = "center";

  ctx.font = "bold 22px Arial, sans-serif";
  ctx.fillStyle = "#e0202f";
  ctx.fillText("Find YOUR perfect watch, free →", CARD_WIDTH / 2, CARD_HEIGHT - 92);

  ctx.font = "italic bold 22px Arial, sans-serif";
  ctx.fillStyle = "#e0a83c";
  ctx.fillText("✦  Witness the Cinema  ✦", CARD_WIDTH / 2, CARD_HEIGHT - 55);
}

// Card 1: the AI-picked premise plus a spoiler-free synopsis — what makes
// this a good watch, and enough of the actual story to build real interest.
export async function generateMovieCard(movie: Movie, synopsis?: string): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let cursorY = await drawCardHeader(ctx, movie);
  const pad = 60;
  const footerY = CARD_HEIGHT - 130; // leave room for the two-line footer

  ctx.textAlign = "left";
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.fillStyle = "#e0202f";
  ctx.fillText("WHY IT'S WORTH WATCHING", pad, cursorY);

  ctx.font = "30px Arial, sans-serif";
  ctx.fillStyle = "#c8c8cc";
  cursorY = wrapText(ctx, movie.reason, pad, cursorY + 55, CARD_WIDTH - pad * 2, 42, 3);

  if (synopsis) {
    cursorY += 40;
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.fillStyle = "#e0a83c";
    ctx.fillText("THE STORY", pad, cursorY);

    // Whatever vertical room is left before the footer, minus a safety
    // margin — converted to a line count so long synopses truncate
    // gracefully instead of ever overlapping the footer.
    const remainingHeight = footerY - (cursorY + 50);
    const maxLines = Math.max(2, Math.floor(remainingHeight / 40));

    ctx.font = "28px Arial, sans-serif";
    ctx.fillStyle = "#9a9aa0";
    wrapText(ctx, synopsis, pad, cursorY + 50, CARD_WIDTH - pad * 2, 40, maxLines);
  }

  drawFooter(ctx);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png", 0.95));
}

// Card 2: the viewer's own review — their name, rating, and words.
export async function generateReviewCard(movie: Movie, review: Comment): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let cursorY = await drawCardHeader(ctx, movie);
  const pad = 60;

  // Reviewer row: avatar + name + stars
  const avatarR = 32;
  ctx.beginPath();
  ctx.arc(pad + avatarR, cursorY + avatarR - 10, avatarR, 0, Math.PI * 2);
  const avatarGradient = ctx.createLinearGradient(pad, cursorY, pad + avatarR * 2, cursorY + avatarR * 2);
  avatarGradient.addColorStop(0, "#e0202f");
  avatarGradient.addColorStop(1, "#4a0b12");
  ctx.fillStyle = avatarGradient;
  ctx.fill();

  ctx.textAlign = "center";
  ctx.font = "bold 30px Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(review.name.charAt(0).toUpperCase(), pad + avatarR, cursorY + avatarR - 1);

  ctx.textAlign = "left";
  ctx.font = "bold 30px Arial, sans-serif";
  ctx.fillStyle = "#f5f5f6";
  ctx.fillText(review.name, pad + avatarR * 2 + 20, cursorY + avatarR - 20);

  if (review.rating > 0) {
    ctx.font = "26px Arial, sans-serif";
    ctx.fillStyle = "#e0202f";
    const filled = "★".repeat(review.rating);
    const empty = "★".repeat(5 - review.rating);
    ctx.fillText(filled, pad + avatarR * 2 + 20, cursorY + avatarR + 18);
    const filledWidth = ctx.measureText(filled).width;
    ctx.fillStyle = "#4d4d52";
    ctx.fillText(empty, pad + avatarR * 2 + 20 + filledWidth, cursorY + avatarR + 18);
  }

  cursorY += avatarR * 2 + 50;

  ctx.font = "bold 24px Arial, sans-serif";
  ctx.fillStyle = "#e0202f";
  ctx.fillText("MY REVIEW", pad, cursorY);

  ctx.font = "30px Arial, sans-serif";
  ctx.fillStyle = "#c8c8cc";
  wrapText(ctx, review.text, pad, cursorY + 55, CARD_WIDTH - pad * 2, 42, 6);

  drawFooter(ctx);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png", 0.95));
}
