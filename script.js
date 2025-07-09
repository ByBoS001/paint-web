const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tools = document.querySelectorAll(".tool");
const colors = document.querySelectorAll(".color");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");

let currentTool = "brush";
let drawing = false;
let color = "#000000";
let startX, startY;

tools.forEach(btn => {
  btn.addEventListener("click", () => {
    tools.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTool = btn.dataset.tool;
    updateCursor();
  });
});

colors.forEach(c => {
  c.addEventListener("click", () => {
    color = c.dataset.color;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  });
});


canvas.addEventListener("mousedown", e => {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  if (currentTool === "brush" || currentTool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }
});

canvas.addEventListener("mousemove", e => {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  if (currentTool === "brush") {
    ctx.lineWidth = 2;
    ctx.lineTo(x, y);
    ctx.stroke();
  } else if (currentTool === "eraser") {
    ctx.clearRect(x - 5, y - 5, 10, 10);
  }
});

canvas.addEventListener("mouseup", e => {
  if (!drawing) return;
  drawing = false;
  const x = e.offsetX;
  const y = e.offsetY;

  ctx.lineWidth = 2;
  if (currentTool === "line") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  } else if (currentTool === "rectangle") {
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  } else if (currentTool === "circle") {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "dibujo.png";
  link.href = canvas.toDataURL();
  link.click();
});

function updateCursor() {
  const cursorMap = {
    brush: "crosshair",
    line: "crosshair",
    rectangle: "crosshair",
    circle: "crosshair",
    eraser: "not-allowed"
  };
  canvas.style.cursor = cursorMap[currentTool] || "crosshair";
}

// Asignar el color de fondo a cada cuadro de color visualmente
colors.forEach(c => {
  const colorCode = c.dataset.color;
  c.style.backgroundColor = colorCode;
});
