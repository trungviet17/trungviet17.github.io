# /// script
# requires-python = ">=3.10"
# dependencies = ["matplotlib>=3.8"]
# ///
"""Sinh 2 biểu đồ cho bài `inference-engineering-roadmap`.

Chạy:  uv run src/plan_content_md/figures/inference-engineering-roadmap/make_charts.py

Xuất thẳng PNG vào public/assets/img/inference/inference-engineering-roadmap/.
Mọi số liệu hard-code bên dưới đều kèm nguồn ngay tại chỗ.

Bảng màu lấy từ skill `dataviz` (slot 1 blue / slot 2 orange) và đã chạy qua
validate_palette.js ở chế độ light: PASS cả 6 check (CVD dE 24.7, normal dE 33.6).
"""

from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

# ---------------------------------------------------------------- design tokens
SURFACE = "#fcfcfb"
INK = "#0b0b0b"
INK_2 = "#52514e"
GRID = "#e6e5e1"
BLUE = "#2a78d6"   # categorical slot 1
ORANGE = "#eb6834"  # categorical slot 2

OUT = (
    Path(__file__).resolve().parents[4]
    / "public/assets/img/inference/inference-engineering-roadmap"
)

plt.rcParams.update({
    "font.family": "DejaVu Sans",  # phủ đủ dấu tiếng Việt
    "font.size": 11,
    "figure.facecolor": SURFACE,
    "axes.facecolor": SURFACE,
    "axes.edgecolor": GRID,
    "axes.labelcolor": INK_2,
    "text.color": INK,
    "xtick.color": INK_2,
    "ytick.color": INK_2,
    "axes.titlecolor": INK,
    "savefig.facecolor": SURFACE,
})


def strip(ax, *, yleft=False):
    """Trục recessive: bỏ khung, chỉ giữ lưới ngang mờ phía sau."""
    for side in ("top", "right", "left" if not yleft else ""):
        if side:
            ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color(GRID)
    ax.tick_params(length=0)
    ax.set_axisbelow(True)
    ax.yaxis.grid(True, color=GRID, linewidth=1)
    ax.xaxis.grid(False)


# ============================================================ H3 — nghịch lý
def nghich_ly():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.8))

    # -- trái: đơn giá rơi tự do ------------------------------------------
    # Nguồn: a16z "LLMflation" (a16z.com/llmflation-llm-inference-cost/).
    # Hai mốc công bố cho cùng mức chất lượng MMLU >= 42:
    #   11/2021 GPT-3            : $60 / 1M token
    #   11/2024 Llama 3.2 3B     : $0.06 / 1M token
    # => đúng 1.000x trong 3 năm = 10x mỗi năm. Chỉ vẽ trong khoảng đã công
    # bố, KHÔNG ngoại suy tiếp (a16z lưu ý tốc độ này sẽ chậm lại).
    years = [2021.9, 2022.9, 2023.9, 2024.9]
    price = [60, 6, 0.6, 0.06]

    ax1.plot(years, price, color=BLUE, linewidth=2, marker="o",
             markersize=8, markerfacecolor=BLUE, markeredgecolor=SURFACE,
             markeredgewidth=2, zorder=3)
    ax1.set_yscale("log")
    ax1.set_ylim(0.02, 200)
    ax1.set_xlim(2021.45, 2025.4)
    ax1.set_xticks([2022, 2023, 2024])
    ax1.set_xticklabels(["2022", "2023", "2024"])
    # dấu thập phân kiểu Việt Nam (phẩy), nhất quán với phần chú thích
    ax1.yaxis.set_major_formatter(FuncFormatter(
        lambda v, _: ("$" + f"{v:.2f}".rstrip("0").rstrip(".").replace(".", ","))
        if v < 1 else f"${v:,.0f}"
    ))
    ax1.minorticks_off()
    strip(ax1)

    ax1.annotate("$60\nGPT-3, 11/2021", xy=(2021.9, 60), xytext=(2022.05, 105),
                 color=INK, fontsize=10, linespacing=1.4)
    ax1.annotate("$0,06\nLlama 3.2 3B, 11/2024", xy=(2024.9, 0.06),
                 xytext=(2023.75, 0.028), color=INK, fontsize=10, linespacing=1.4)
    ax1.text(2021.5, 0.9, "10× rẻ hơn mỗi năm\n→ 1.000× sau 3 năm",
             color=BLUE, fontsize=11, fontweight="bold", linespacing=1.5)

    ax1.set_title("Đơn giá cho cùng một mức chất lượng", fontsize=12,
                  fontweight="bold", pad=14, loc="left")
    ax1.set_ylabel("USD / 1 triệu token (thang log)", fontsize=10)
    ax1.text(0, -0.19, "Nguồn: a16z — LLMflation, mốc chất lượng MMLU ≥ 42",
             transform=ax1.transAxes, fontsize=9, color=INK_2)

    # -- phải: lượng token phình ra ---------------------------------------
    # Bậc độ lớn MINH HOẠ cho một tác vụ điển hình, không phải số đo.
    # Neo định lượng duy nhất: Gartner 17/08/2026 — chi phí inference mỗi
    # agentic workflow tăng >5x tới 2028.
    labels = ["Chat\nmột lượt", "Chat\n+ RAG", "Agent\nnhiều bước"]
    tokens = [500, 5_000, 200_000]

    bars = ax2.bar(labels, tokens, color=ORANGE, width=0.52, zorder=3)
    ax2.set_yscale("log")
    ax2.set_ylim(100, 700_000)
    ax2.minorticks_off()
    strip(ax2)
    ax2.yaxis.set_major_formatter(FuncFormatter(
        lambda v, _: f"{int(v):,}".replace(",", ".")
    ))

    for bar, val in zip(bars, tokens):
        ax2.text(bar.get_x() + bar.get_width() / 2, val * 1.35,
                 f"~{val:,}".replace(",", "."), ha="center", color=INK,
                 fontsize=11, fontweight="bold")

    ax2.set_title("Token tiêu thụ cho một tác vụ", fontsize=12,
                  fontweight="bold", pad=14, loc="left")
    ax2.set_ylabel("Token mỗi tác vụ (thang log)", fontsize=10)
    ax2.text(0, -0.19,
             "Bậc độ lớn minh hoạ. Gartner dự báo chi phí mỗi agentic workflow tăng >5× tới 2028.",
             transform=ax2.transAxes, fontsize=9, color=INK_2)

    fig.tight_layout(rect=(0, 0.04, 1, 1))
    fig.savefig(OUT / "nghich-ly-inference.png", dpi=160)
    plt.close(fig)


# ================================================== H2 — inference vs training
def chi_tieu():
    # Nguồn cho cả hai panel: Gartner press release 10/08/2026
    # "Gartner Forecasts Worldwide AI-Optimized IaaS Spending to Grow 96% in 2026"
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.6))

    # -- trái: inference vượt training lần đầu ----------------------------
    bars = ax1.bar(["Inference", "Training"], [23.3, 19.0],
                   color=[BLUE, ORANGE], width=0.38, zorder=3)
    ax1.set_ylim(0, 29)
    strip(ax1)
    for bar, val in zip(bars, [23.3, 19.0]):
        ax1.text(bar.get_x() + bar.get_width() / 2, val + 0.8,
                 f"{val:.1f} tỷ USD".replace(".", ","), ha="center", color=INK,
                 fontsize=12, fontweight="bold")
    ax1.set_title("2026: năm đầu tiên inference vượt training",
                  fontsize=12, fontweight="bold", pad=14, loc="left")
    ax1.set_ylabel("Chi tiêu toàn cầu 2026 (tỷ USD)", fontsize=10)

    # -- phải: quy mô hạ tầng ---------------------------------------------
    bars = ax2.bar(["2025", "2026"], [21.5, 42.0], color=BLUE,
                   width=0.38, zorder=3)
    ax2.set_ylim(0, 52)
    strip(ax2)
    for bar, val in zip(bars, [21.5, 42.0]):
        ax2.text(bar.get_x() + bar.get_width() / 2, val + 1.4,
                 f"{val:.1f} tỷ USD".replace(".", ","), ha="center", color=INK,
                 fontsize=12, fontweight="bold")
    # đặt trong khoảng trống giữa hai cột để không đè lên nhãn giá trị
    ax2.annotate("", xy=(0.5, 34), xytext=(0.5, 20),
                 arrowprops=dict(arrowstyle="->", color=INK_2, linewidth=1.8))
    ax2.text(0.5, 36, "+96%", ha="center", color=INK, fontsize=13,
             fontweight="bold")
    ax2.set_title("Hạ tầng AI-optimized IaaS", fontsize=12,
                  fontweight="bold", pad=14, loc="left")
    ax2.set_ylabel("Chi tiêu (tỷ USD)", fontsize=10)

    fig.text(0.008, 0.035,
             "Nguồn: Gartner, press release 10/08/2026. Inference chiếm 55% chi tiêu AI-optimized IaaS năm 2026, lên 59% năm 2027.",
             fontsize=9, color=INK_2)
    fig.tight_layout(rect=(0, 0.07, 1, 1))
    fig.savefig(OUT / "chi-tieu-inference-vs-training.png", dpi=160)
    plt.close(fig)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    nghich_ly()
    chi_tieu()
    print(f"Đã xuất 2 biểu đồ vào {OUT}")
