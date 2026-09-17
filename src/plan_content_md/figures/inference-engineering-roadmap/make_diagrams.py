# /// script
# requires-python = ">=3.10"
# dependencies = ["matplotlib>=3.8"]
# ///
"""Sinh 4 sơ đồ cho bài `inference-engineering-roadmap`.

Chạy:  uv run src/plan_content_md/figures/inference-engineering-roadmap/make_diagrams.py

Bản dựng bằng code để bài chạy được ngay. Muốn thay bằng bản vẽ tay
(Excalidraw) thì chỉ cần ghi đè đúng 4 file PNG cùng tên.

Token màu dùng chung với make_charts.py (skill dataviz, đã qua validator).
Bề rộng chữ phải vừa khung: ở 150 dpi, 1 đơn vị toạ độ ≈ 1% bề ngang ảnh,
và 1 ký tự ≈ font_size × 1.17 px — dùng để chọn width cho từng hộp.
"""

from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

SURFACE = "#fcfcfb"
INK = "#0b0b0b"
INK_2 = "#52514e"
INK_3 = "#8a8983"
BLUE = "#2a78d6"
RUST = "#b8461c"
VIOLET = "#4a3aa7"

# ramp blue tuần tự (palette.md); bậc nhạt nhất là 250 — đúng sàn 2:1 cho
# ramp ordinal trên nền sáng.
RAMP = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"]
# Ramp cho nền TỐI (cover): palette.md quy định bậc đậm nhất trên nền tối
# không được quá 600 (#184f95, 2.15:1) — bậc 650 của RAMP sẽ chìm mất.
RAMP_DARK = ["#86b6ef", "#6da7ec", "#3987e5", "#256abf", "#184f95"]

TINT_BLUE, EDGE_BLUE = "#f2f7fe", "#dce8f8"
TINT_ORANGE, EDGE_ORANGE = "#fef4f0", "#f7dccf"
TINT_VIOLET, EDGE_VIOLET = "#f4f3fb", "#dcd9f0"
EDGE = "#e2e1dd"
LINE = "#cbcac5"

OUT = (
    Path(__file__).resolve().parents[4]
    / "public/assets/img/inference/inference-engineering-roadmap"
)

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "figure.facecolor": SURFACE,
    "savefig.facecolor": SURFACE,
})


def canvas(w, h):
    fig, ax = plt.subplots(figsize=(w, h))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")
    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
    return fig, ax


def box(ax, x, y, w, h, *, fc, ec=EDGE, r=1.3, lw=1.2, z=2):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h, boxstyle=f"round,pad=0,rounding_size={r}",
        facecolor=fc, edgecolor=ec, linewidth=lw, zorder=z,
        mutation_aspect=0.55))


def arrow(ax, p0, p1, *, color=INK_3, lw=1.6, style="-|>", rad=0.0, z=1,
          ls="-"):
    ax.add_patch(FancyArrowPatch(
        p0, p1, arrowstyle=style, color=color, linewidth=lw, linestyle=ls,
        connectionstyle=f"arc3,rad={rad}", mutation_scale=13, zorder=z,
        shrinkA=0, shrinkB=0))


def line(ax, xs, ys, *, color=LINE, lw=1.3, z=1):
    ax.plot(xs, ys, color=color, linewidth=lw, zorder=z,
            solid_capstyle="round")


# ===================================================== 1. stack 5 tầng
def stack_5_tang():
    fig, ax = canvas(10.6, 6.0)

    ax.text(2.5, 95, "Stack inference: năm tầng", fontsize=17,
            fontweight="bold", color=INK, va="top")
    ax.text(2.5, 88.5,
            "Quyết định ở tầng trên luôn bị chặn bởi giới hạn của tầng dưới.",
            fontsize=10.5, color=INK_2, va="top")

    layers = [  # từ trên xuống
        ("5", "Gateway", "routing · SLO · autoscaling · multi-tenant", "C7"),
        ("4", "Cluster", "TP / PP / EP · P/D disaggregation · LMCache · llm-d", "C7"),
        ("3", "Engine", "vLLM · SGLang · TensorRT-LLM · llama.cpp", "C3 · C4"),
        ("2", "Kernel", "Triton · FlashAttention · CUDA Graph · fusion", "C5 · C6"),
        ("1", "Hardware", "SM · HBM · Tensor Core · NVLink", "C1"),
    ]

    x0, w = 15.0, 70.0
    top, bh, gap = 78.0, 12.6, 2.6

    for i, (num, name, examples, series) in enumerate(layers):
        y = top - i * (bh + gap) - bh
        box(ax, x0, y, w, bh, fc=TINT_BLUE, ec=EDGE_BLUE)
        box(ax, x0 + 1.1, y + 1.5, 1.5, bh - 3.0, fc=RAMP[i], ec="none", r=0.7)

        cy = y + bh / 2
        ax.text(x0 + 4.6, cy + 2.0, f"Tầng {num}", fontsize=8.5,
                color=INK_3, va="center")
        ax.text(x0 + 4.6, cy - 2.5, name, fontsize=13, fontweight="bold",
                color=INK, va="center")
        ax.text(x0 + 22.5, cy, examples, fontsize=10, color=INK_2, va="center")

        box(ax, x0 + w - 9.5, cy - 3.0, 7.6, 6.0, fc="#ffffff",
            ec=EDGE_BLUE, r=0.9)
        ax.text(x0 + w - 5.7, cy, series, fontsize=9.5, fontweight="bold",
                color=BLUE, ha="center", va="center")

    bot = top - 4 * (bh + gap) - bh

    # C2 cắt ngang cả năm tầng — gộp luôn chú thích vào nhãn xoay để không
    # phải đặt text dưới đáy (bản trước bị cắt mất).
    box(ax, 2.5, bot, 10.0, top - bot, fc=TINT_ORANGE, ec=EDGE_ORANGE)
    ax.text(7.5, (bot + top) / 2,
            "C2 · Giải phẫu LLM Inference — cắt ngang mọi tầng",
            fontsize=10, fontweight="bold", color=RUST,
            ha="center", va="center", rotation=90)

    arrow(ax, (92.5, bot + 1.5), (92.5, top - 1.5), color=INK_3, lw=1.5,
          style="<|-|>")
    ax.text(94.8, (bot + top) / 2, "bị chặn bởi tầng dưới", fontsize=9,
            color=INK_3, ha="center", va="center", rotation=90)

    fig.savefig(OUT / "stack-5-tang.png", dpi=150)
    plt.close(fig)


# ===================================================== 2. ba câu hỏi
def ba_cau_hoi():
    fig, ax = canvas(10.6, 4.8)

    ax.text(3, 95, "Ba câu hỏi, một vòng lặp", fontsize=17,
            fontweight="bold", color=INK, va="top")

    steps = ["1 · Đo", "2 · Định vị bound", "3 · Sửa", "4 · Đo lại"]
    qs = [
        ("Tốn bộ nhớ ở đâu?", "weight + KV + activation", RUST,
         TINT_ORANGE),
        ("Nghẽn ở đâu?", "roofline · nsys · ncu", BLUE, TINT_BLUE),
        ("Đánh đổi gì?", "TTFT ↔ TPOT · chất lượng ↔ bộ nhớ", VIOLET,
         TINT_VIOLET),
        (None, None, None, None),
    ]

    bw, bh, gapx = 19.0, 12.0, 5.0
    x0, ry = 5.0, 33.0

    for i, (label, (q, sub, col, tint)) in enumerate(zip(steps, qs)):
        x = x0 + i * (bw + gapx)
        box(ax, x, ry, bw, bh, fc="#ffffff", ec="#d8d7d2", lw=1.4, z=3)
        ax.text(x + bw / 2, ry + bh / 2, label, fontsize=12,
                fontweight="bold", color=INK, ha="center", va="center",
                zorder=4)
        if i < 3:
            arrow(ax, (x + bw + 0.8, ry + bh / 2),
                  (x + bw + gapx - 0.8, ry + bh / 2), color=INK_3, lw=1.8, z=3)
        if q:
            cx = x + bw / 2
            box(ax, x - 1.0, 62.0, bw + 2.0, 18.0, fc=tint, ec="none")
            ax.text(cx, 74.0, q, fontsize=11.5, fontweight="bold",
                    color=col, ha="center", va="center")
            ax.text(cx, 67.0, sub, fontsize=8.5, color=INK_2, ha="center",
                    va="center")
            arrow(ax, (cx, 61.0), (cx, ry + bh + 1.2), color=INK_3, lw=1.2)

    # vòng quay lại — phải cong XUỐNG DƯỚI các hộp (rad âm), bản trước cong
    # ngược lên và cắt ngang cả hàng.
    xl, xr = x0 + bw / 2, x0 + 3 * (bw + gapx) + bw / 2
    arrow(ax, (xr, ry - 1.0), (xl, ry - 1.0), color=INK_3, lw=1.6, rad=-0.22)
    ax.text((xl + xr) / 2, 6.5, "lặp cho tới khi hết đáng để tối ưu",
            fontsize=9.5, color=INK_3, ha="center", va="center")

    fig.savefig(OUT / "ba-cau-hoi.png", dpi=150)
    plt.close(fig)


# ===================================================== 3. bản đồ 8 chuỗi
def ban_do_8_chuoi():
    fig, ax = canvas(10.6, 6.4)

    ax.text(3, 96, "Bản đồ tám chuỗi con", fontsize=17, fontweight="bold",
            color=INK, va="top")

    def node(x, y, w, h, code, name, n, tint, edge, accent, fs=10):
        box(ax, x, y, w, h, fc=tint, ec=edge, lw=1.3)
        cx = x + w / 2
        ax.text(cx, y + h - 3.2, code, fontsize=8.5, fontweight="bold",
                color=accent, ha="center", va="center")
        ax.text(cx, y + h / 2 - 0.6, name, fontsize=fs, fontweight="bold",
                color=INK, ha="center", va="center")
        ax.text(cx, y + 3.0, n, fontsize=8.5, color=INK_3, ha="center",
                va="center")

    B = (TINT_BLUE, EDGE_BLUE, BLUE)
    O = (TINT_ORANGE, EDGE_ORANGE, RUST)

    # ---- bài 0 ----
    box(ax, 35, 82, 30, 10, fc="#ffffff", ec=BLUE, lw=1.8)
    ax.text(50, 87, "Bài 0 · Roadmap  (ghim)", fontsize=11,
            fontweight="bold", color=BLUE, ha="center", va="center")

    # ---- nền tảng ----
    node(19, 64, 27, 13, "C1", "GPU cho AI Engineer", "8 bài", *B)
    node(54, 64, 27, 13, "C2", "Giải phẫu LLM Inference", "9 bài", *B)
    line(ax, [50, 50], [82, 79.5])
    line(ax, [32.5, 67.5], [79.5, 79.5])
    line(ax, [32.5, 32.5], [79.5, 77])
    line(ax, [67.5, 67.5], [79.5, 77])

    # ---- hệ thống · kỹ thuật ----
    row3 = [(3.5, "C3", "Mổ xẻ vLLM", "9 bài", B),
            (27.5, "C4", "Hệ sinh thái Engine", "7 bài", B),
            (51.5, "C5", "Kernel Engineering", "7 bài", O),
            (75.5, "C6", "Nén mô hình & Decode", "8 bài", O)]
    for x, code, name, n, pal in row3:
        node(x, 43, 21, 13, code, name, n, *pal, fs=9.5)

    centers3 = [x + 10.5 for x, *_ in row3]
    line(ax, [32.5, 32.5], [64, 60.5])
    line(ax, [67.5, 67.5], [64, 60.5])
    line(ax, [centers3[0], centers3[-1]], [60.5, 60.5])
    for c in centers3:
        line(ax, [c, c], [60.5, 56])

    # ---- quy mô + paper ----
    node(30, 21, 27, 13, "C7", "Serving quy mô cụm", "7 bài", *B)
    node(63, 21, 30, 13, "C8", "Papers Explained",
         "9 bài · rải song song toàn tuyến", *(TINT_VIOLET, EDGE_VIOLET,
                                               VIOLET))
    for c in centers3:
        line(ax, [c, c], [43, 38.5])
    line(ax, [centers3[0], centers3[-1]], [38.5, 38.5])
    line(ax, [43.5, 43.5], [38.5, 34])
    arrow(ax, (78, 38.5), (78, 34.5), color=LINE, lw=1.3, ls=(0, (3, 3)))

    # ---- khép chuỗi ----
    box(ax, 28, 6, 31, 8.5, fc="#ffffff", ec="#d8d7d2", lw=1.3)
    ax.text(43.5, 10.2, "Bài 66–67 · Capstone + Checklist", fontsize=9.5,
            fontweight="bold", color=INK_2, ha="center", va="center")
    line(ax, [43.5, 43.5], [21, 14.5])

    # ---- chú giải ----
    for i, (c, e, lab) in enumerate([
            (TINT_BLUE, EDGE_BLUE, "nền tảng & hệ thống"),
            (TINT_ORANGE, EDGE_ORANGE, "kỹ thuật tầng thấp"),
            (TINT_VIOLET, EDGE_VIOLET, "đọc paper")]):
        x = 63 + i * 0
        box(ax, 3 + i * 21, 1.0, 3.0, 3.0, fc=c, ec=e, r=0.5, lw=1.1)
        ax.text(7.5 + i * 21, 2.5, lab, fontsize=8.5, color=INK_3,
                va="center")

    fig.savefig(OUT / "ban-do-8-chuoi.png", dpi=150)
    plt.close(fig)


# ===================================================== 4. cover (OG 1200x630)
def cover():
    fig, ax = canvas(12.0, 6.3)
    ax.add_patch(FancyBboxPatch((0, 0), 100, 100, boxstyle="square,pad=0",
                                facecolor="#0f1b2d", edgecolor="none",
                                zorder=0))

    ax.text(7, 74, "Inference", fontsize=40, fontweight="bold",
            color="#ffffff", va="center")
    ax.text(7, 58, "Engineering", fontsize=40, fontweight="bold",
            color="#6da7ec", va="center")
    ax.text(7, 44, "bản đồ toàn cảnh", fontsize=19, color="#b7d3f6",
            va="center")
    ax.plot([7, 30], [34, 34], color=BLUE, linewidth=3,
            solid_capstyle="round")
    ax.text(7, 24, "hardware → kernel → engine → cluster → gateway",
            fontsize=12.5, color="#8fa6c4", va="center")
    ax.text(7, 12, "trungviet17.github.io", fontsize=11, color="#5d748c",
            va="center")

    # Gateway trên cùng, Hardware dưới đáy — cùng thứ tự với stack-5-tang.png
    labels = ["Gateway", "Cluster", "Engine", "Kernel", "Hardware"]
    for i, lab in enumerate(labels):
        y = 20 + (len(labels) - 1 - i) * 13.5
        box(ax, 66, y, 28, 10.5, fc="#17263d", ec="#2b3f5e", r=1.0, lw=1.2)
        box(ax, 67.2, y + 1.6, 1.4, 7.3, fc=RAMP_DARK[i], ec="none", r=0.6)
        ax.text(71.5, y + 5.2, lab, fontsize=11.5, color="#dbe6f5",
                va="center")

    fig.savefig(OUT / "cover.png", dpi=100)
    plt.close(fig)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    stack_5_tang()
    ba_cau_hoi()
    ban_do_8_chuoi()
    cover()
    print(f"Đã xuất 4 sơ đồ vào {OUT}")
