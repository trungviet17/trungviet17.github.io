# Kế hoạch chuỗi bài viết: Inference Engineering

## Context

Blog hiện có 13 bài, trong đó mảng LLM mới dừng ở kiến trúc và huấn luyện (Llama, LoRA/QLoRA, RLHF, Dolma). **Không có bất kỳ bài nào về GPU, systems hay inference** — đây là khoảng trống lớn nhất và cũng là mảng đang thiếu tài liệu tiếng Việt có chiều sâu.

Mục tiêu: xây một chuỗi bài dài hạn về **inference engineering** — từ nền tảng phần cứng GPU, qua cơ chế hoạt động của LLM khi suy luận, tới mổ xẻ source code các engine (vLLM, SGLang), viết kernel, nén mô hình, và serving ở quy mô cụm. Chuỗi được thiết kế phân tầng: người mới đọc từ đầu vẫn theo được, người đã có nền có thể nhảy thẳng vào chuỗi con mình cần.

**Ràng buộc đã chốt với tác giả:**
- Phần cứng: GPU consumer 24–32GB (4090/5090 class). Lab thực nghiệm giới hạn ở single-GPU; phần multi-node/Blackwell viết theo hướng đọc source code + phân tích số liệu công bố.
- Độ sâu: phân tầng, cơ bản → sâu dần.
- Nhịp: **2 bài/tuần** → 67 bài ≈ 34 tuần (~8 tháng), từ 09/2026 đến ~05/2027.
- Deliverable của lần này: **chỉ file plan**. Không tạo file trong `src/content/posts/`.

---

## 1. Taxonomy: cách gắn metadata cho 67 bài

Đây là quyết định quan trọng nhất về mặt kỹ thuật, vì [related.ts](src/lib/related.ts#L17-L21) tính điểm liên quan theo công thức `3 × chung category + 1 × chung tag + 1 nếu cùng series`.

**Nếu cả 67 bài chỉ dùng một category chung** thì mọi cặp bài đều được +3, điểm trở thành hằng số và mục "Bài viết liên quan" thoái hoá thành "3 bài mới nhất" — vô dụng. Vì vậy dùng **2 category mỗi bài**:

```yaml
categories: [Inference Engineering, GPU & Systems]
```

- `Inference Engineering` — category ô dù, có trên **mọi** bài. Tạo ra trang `/categories/inference-engineering/` làm hub liệt kê toàn bộ chuỗi. Vì nó là hằng số nên không ảnh hưởng thứ hạng.
- Category thứ hai — phân cụm theo mảng, chính nó tạo ra sự phân biệt trong ranking.

| Category thứ hai | Chuỗi con dùng | Ghi chú |
|---|---|---|
| `GPU & Systems` | C1, C5 | mới |
| `LLM` | C2 | **tái dùng** category sẵn có → nối chuỗi mới với 3 bài LLM cũ |
| `Inference Engines` | C3, C4 | mới |
| `Model Compression` | C6 | mới |
| `Distributed Serving` | C7 | mới |
| `Papers explained` | C8 | **tái dùng** category sẵn có |

**Series** (`series` + `order`) dùng cho từng chuỗi con — mịn hơn category, hiển thị ở `/series/` và kích hoạt `SeriesNav`:

| # | `series` | Số bài | Category thứ hai |
|---|---|---|---|
| C1 | `GPU cho AI Engineer` | 8 | GPU & Systems |
| C2 | `Giải phẫu LLM Inference` | 9 | LLM |
| C3 | `Mổ xẻ vLLM` | 9 | Inference Engines |
| C4 | `Hệ sinh thái Inference Engine` | 7 | Inference Engines |
| C5 | `Kernel Engineering` | 7 | GPU & Systems |
| C6 | `Nén mô hình & Tăng tốc Decode` | 8 | Model Compression |
| C7 | `Serving quy mô cụm` | 7 | Distributed Serving |
| C8 | `Papers Explained: Inference` | 9 | Papers explained |

> Lưu ý: `Papers Explained: Inference` slugify thành `papers-explained-inference`, **khác** series `Papers Explained` sẵn có → hai trang series riêng, không bị gộp. Nếu muốn gộp chung thì phải đổi tên và đánh `order` tiếp từ 2.

**Bài mở đầu** (bài 0) không thuộc series nào: nó là hub trỏ tới cả 8 chuỗi. Đặt `pinned: true`.

### Từ vựng tag (lowercase-kebab, dùng nhất quán)

`gpu` · `cuda` · `triton` · `kernel` · `roofline` · `memory-bandwidth` · `tensor-core` · `nccl` · `profiling` · `kv-cache` · `attention` · `flash-attention` · `batching` · `scheduling` · `prefix-caching` · `vllm` · `sglang` · `tensorrt-llm` · `llama-cpp` · `quantization` · `fp8` · `fp4` · `awq` · `gptq` · `speculative-decoding` · `moe` · `expert-parallel` · `tensor-parallel` · `pd-disaggregation` · `long-context` · `lora` · `benchmark` · `serving` · `paper` · `llm`

Tag là thứ tạo liên kết **ngang** giữa các chuỗi con (ví dụ `kv-cache` nối bài C2-11, C3-20, C6-49, C7-53). Mỗi bài gắn 3–5 tag, trong đó nên có ít nhất 1 tag "xuyên chuỗi".

### Template frontmatter

```yaml
---
title: "Prefill và Decode: hai bài toán hoàn toàn khác nhau"
date: 2026-10-06
categories: [Inference Engineering, LLM]
tags: [roofline, kv-cache, benchmark, llm]
author: Trung Việt
math: true
description: "Vì sao prefill là compute-bound còn decode là memory-bound, và vì sao sự khác biệt đó quyết định gần như mọi kỹ thuật tối ưu inference sau này."
series: Giải phẫu LLM Inference
order: 2
---
```

### Ràng buộc build phải nhớ (từ [content.config.ts](src/content.config.ts))

1. Tên file `YYYY-MM-DD-<slug>.md`; tiền tố ngày bị cắt → **slug chính là URL vĩnh viễn**, đổi tên là gãy link.
2. `description` **tối đa 300 ký tự** — build fail nếu vượt.
3. `order` chỉ hợp lệ khi đã có `series` — build fail nếu thiếu.
4. `updated` không được sớm hơn `date`.
5. `math: true` cho mọi bài có công thức; block math `$$` phải nằm trên **dòng riêng**.
6. **Không có mermaid** — mọi sơ đồ phải là file ảnh. Quy ước thư mục: `public/assets/img/inference/<slug>/`.
7. Cú pháp ảnh + caption theo [remark-image-figure.mjs](src/plugins/remark-image-figure.mjs): ảnh đứng một mình, dòng ngay sau in nghiêng → thành `<figcaption>`.
8. `/series/` chỉ hiện **5 bài đầu** mỗi series (rồi "Xem cả N bài →"). Với series 9 bài, bài `order: 1` nên là bài tổng quan của chuỗi đó.

---

## 2. Bản đồ chuỗi bài

```
                    Bài 0 — Roadmap (pinned)
                            │
        ┌───────────────────┴───────────────────┐
   NỀN TẢNG                                  (đọc trước)
   C1 GPU cho AI Engineer (8)  ─────┐
   C2 Giải phẫu LLM Inference (9) ──┤
                                    │
        ┌───────────────────────────┴───────────┐
   HỆ THỐNG                                 KỸ THUẬT
   C3 Mổ xẻ vLLM (9)                   C5 Kernel Engineering (7)
   C4 Hệ sinh thái Engine (7)          C6 Nén mô hình & Decode (8)
        └───────────────────┬───────────────────┘
                            │
                   C7 Serving quy mô cụm (7)
                            │
                   C8 Papers Explained (9) ── rải song song toàn tuyến
                            │
                   Bài 66–67 — Capstone + Checklist
```

Ký hiệu cột **Lab**: ✅ chạy được đầy đủ trên 24GB · ⚙️ chạy được một phần · 📄 phân tích paper/source code, không chạy.
Ký hiệu **⭐** = thuộc tập lõi ~42 bài; **○** = mở rộng, có thể hoãn hoặc gộp nếu muốn rút chuỗi về ~45 bài.

---

## 3. Bài 0 — Mở đầu

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 0 ⭐ | **Inference Engineering: bản đồ toàn cảnh**<br>`inference-engineering-roadmap` | Inference engineering là gì và vì sao nó thành nghề riêng (chi phí token, latency là sản phẩm). Toàn cảnh stack 5 tầng: hardware → kernel → engine → cluster → gateway. Ba câu hỏi trung tâm xuyên suốt chuỗi: *nghẽn ở đâu, tốn bộ nhớ ở đâu, đánh đổi gì*. Giới thiệu 8 chuỗi con + gợi ý lộ trình đọc theo từng đối tượng. `pinned: true`, không series. | — |

**Đã viết (bản thảo ở `src/content/posts/2026-09-22-inference-engineering-roadmap.md`).** So với mô tả trên, bài có thêm hai thứ:

1. **Mục `## Nghề này lớn cỡ nào`** (~750 từ) — số liệu thị trường và việc làm, dựng quanh *nghịch lý inference*: đơn giá token giảm 10×/năm (a16z) nhưng chi phí mỗi agentic workflow tăng >5× tới 2028 (Gartner), và 2026 là năm đầu tiên chi tiêu inference ($23,3 tỷ) vượt training ($19 tỷ). Chốt bằng nhận định của tác giả, không phải của hãng phân tích. *Đã quyết bỏ hẳn số liệu thị trường Việt Nam* — nguồn hiện có đều là báo chí dẫn lại phát biểu, không đủ chuẩn đặt cạnh Gartner/a16z.
2. **Ví dụ tính tay** trong mục ba câu hỏi (Llama-3.1-8B BF16 trên 4090: ridge point ≈ 164 FLOP/byte, KV 128 KiB/token, ~40K token tổng) để bài hub vẫn là bài kỹ thuật thật. **Các số này tính từ thông số công bố — phải chạy lại trên máy thật trước khi publish.**

Ảnh: 6 file ở `public/assets/img/inference/inference-engineering-roadmap/`. Hai biểu đồ số liệu đã sinh xong bằng `src/plan_content_md/figures/inference-engineering-roadmap/make_charts.py` (chạy `uv run <path>`); bốn sơ đồ còn lại (`stack-5-tang`, `ba-cau-hoi`, `ban-do-8-chuoi`, `cover`) vẽ tay bằng Excalidraw, spec nằm trong file plan.

**Bản quyền ảnh bên thứ ba** (đã tra cứu, áp dụng cho cả chuỗi): Epoch AI là **CC BY 4.0** — tái dùng thoải mái, chỉ cần ghi nguồn. Stanford AI Index là **CC BY-ND 4.0** — dùng được nguyên trạng, **cấm sửa/crop/dịch**. Gartner, a16z, NVIDIA Developer Blog: **không tái tạo biểu đồ**, chỉ trích số + dẫn link. arXiv: tuỳ từng paper, chỉ dùng khi trang abstract ghi CC BY / CC BY-SA.

---

## 4. C1 — `GPU cho AI Engineer` (8 bài)

Mục tiêu: sau chuỗi này người đọc nhìn một model + một GPU là ước lượng được nó sẽ nghẽn ở đâu.

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 1 ⭐ | **GPU khác CPU ở đâu: SM, warp và mô hình SIMT**<br>`gpu-vs-cpu-simt` | Kiến trúc SM; warp 32 thread; warp scheduler và latency hiding bằng oversubscription thay vì cache lớn; thread/block/grid; vì sao GPU tối ưu cho *throughput* chứ không phải *latency* — và vì sao decode LLM (bản chất là latency-bound) luôn khó chịu trên GPU. | ✅ |
| 2 ⭐ | **Phân cấp bộ nhớ GPU: register → SMEM → L2 → HBM**<br>`gpu-memory-hierarchy` | Dung lượng và băng thông thật từng cấp (số liệu 4090 / H100 / B200); coalesced access; bank conflict; nguyên lý xuyên suốt cả chuỗi: *tối ưu = giảm số byte đi qua HBM*. Microbenchmark đo băng thông HBM thực tế so với spec. | ✅ |
| 3 ⭐ | **Tensor Core và các định dạng số của phần cứng**<br>`tensor-core-number-formats` | MMA → WGMMA (Hopper) → tcgen05 (Blackwell); FP32/TF32/BF16/FP16/FP8 (E4M3, E5M2)/FP6/FP4; GPU thế hệ nào hỗ trợ format nào; "312 TFLOPS trên datasheet" thực ra nghĩa là gì và điều kiện nào mới đạt được. Nền cho toàn bộ C6. | ✅ |
| 4 ⭐ | **Roofline model: công cụ tư duy quan trọng nhất**<br>`roofline-arithmetic-intensity` | Arithmetic intensity (FLOP/byte), ridge point, vùng memory-bound vs compute-bound. Tính tay AI của GEMM (M,N,K) và GEMV; chứng minh vì sao matrix-vector luôn có AI ≈ 1 bất kể kích thước → **decode LLM bị đóng đinh ở vùng memory-bound**. Vẽ roofline cho GPU của mình và chấm các shape thật. | ✅ |
| 5 ⭐ | **Vì sao GPU của bạn "rảnh": occupancy, launch overhead và CUDA Graph**<br>`gpu-utilization-cuda-graphs` | `nvidia-smi` báo 100% không có nghĩa là nhanh. Occupancy và giới hạn register/SMEM. Kernel launch overhead: một bước decode gọi hàng trăm kernel, mỗi kernel vài micro giây → CPU thành nút cổ chai. CUDA Graph capture/replay giải quyết ra sao. Đo decode có/không CUDA Graph (`--enforce-eager`). | ✅ |
| 6 ⭐ | **Nhiều GPU nói chuyện: PCIe, NVLink và NCCL collectives**<br>`multi-gpu-interconnect-nccl` | all-reduce / all-gather / reduce-scatter / all-to-all — mỗi collective sinh ra từ dạng song song nào; thuật toán ring vs tree; băng thông NVLink vs PCIe chênh bao nhiêu lần và vì sao tensor parallel gần như bắt buộc phải nằm trong NVLink domain. Ghi chú: 4090 không có NVLink → đây là giới hạn thật khi self-host. | 📄 |
| 7 ○ | **Đọc datasheet GPU: chọn GPU nào cho inference**<br>`chon-gpu-cho-inference` | So sánh H100 / H200 / B200 / L40S / 4090 / 5090 theo 4 trục thực sự quan trọng: dung lượng HBM, băng thông HBM, FLOPS ở dtype mình dùng, interconnect. Quy tắc chọn theo workload prefill-heavy vs decode-heavy (vì sao decode thích GPU băng thông cao). Ước lượng $/1M token sơ bộ. | 📄 |
| 8 ⭐ | **Bộ đồ nghề đo đạc: nvidia-smi, PyTorch profiler, Nsight Systems/Compute**<br>`gpu-profiling-toolkit` | Tầng nào dùng công cụ nào. Đọc timeline `nsys` (gap giữa kernel = CPU bound). Các metric `ncu` đáng quan tâm: `dram__throughput`, `sm__throughput`, achieved occupancy. Quy trình chuẩn: đo → định vị bound → sửa → đo lại. Profile một forward pass model 1B làm ví dụ. | ✅ |

---

## 5. C2 — `Giải phẫu LLM Inference` (9 bài)

Mục tiêu: hiểu cơ chế inference độc lập với mọi engine. Đây là chuỗi nền tảng nhất, mọi chuỗi sau đều trỏ ngược về đây.

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 9 ⭐ | **Vòng đời một request: tokenize → prefill → decode → detokenize**<br>`vong-doi-mot-request-llm` | Bám theo một request cụ thể qua từng bước. Vòng lặp autoregressive, logits → sampling → token kế tiếp → nối vào input. Streaming và incremental detokenization (vì sao detokenize từng token lại khó với BPE). Sơ đồ tổng thể dùng lại xuyên suốt chuỗi. | ✅ |
| 10 ⭐ | **Prefill và Decode: hai bài toán hoàn toàn khác nhau**<br>`prefill-vs-decode` | Prefill xử lý N token song song → GEMM, compute-bound. Decode xử lý 1 token → GEMV, memory-bound. Áp roofline từ bài 4 vào cả hai. Hệ quả kéo dài cả chuỗi: tăng batch cứu được decode nhưng gần như vô ích với prefill; hai pha cần cấu hình — thậm chí phần cứng — khác nhau. Đo TTFT theo độ dài prompt, TPOT theo batch size. | ✅ |
| 11 ⭐ | **KV cache: tại sao cần, tốn bao nhiêu**<br>`kv-cache-co-ban` | Không có KV cache thì mỗi token phải tính lại toàn bộ tiền tố → O(n²). Công thức bộ nhớ `2 × L × H_kv × d_h × sizeof(dtype) × seq × batch`, tính tay cho Llama-3.1-8B và Qwen3-32B. Nhận xét chốt: ở context dài, KV cache vượt cả trọng số model. | ✅ |
| 12 ⭐ | **Ngân sách bộ nhớ GPU: weight + KV + activation + overhead**<br>`ngan-sach-bo-nho-gpu` | Bảng tính đầy đủ cho GPU 24GB: sau khi trừ weight và CUDA context còn bao nhiêu cho KV → suy ra max batch × max context. Fragmentation. Ý nghĩa thật của `gpu_memory_utilization`. Bài này trả lời câu hỏi thực tế nhất người mới gặp: "vì sao OOM và phải chỉnh gì". | ✅ |
| 13 ⭐ | **Batching: từ static tới continuous batching**<br>`continuous-batching` | Static batching lãng phí gấp đôi: padding + cả batch chờ request dài nhất. Iteration-level scheduling: mỗi bước forward lại tái lập batch, request xong thì rời, request mới chen vào ngay. Đường cong throughput–latency và vì sao nó bão hoà. Benchmark cùng workload với `max_num_seqs` khác nhau. | ✅ |
| 14 ⭐ | **Chunked prefill và bài toán prefill chen ngang decode**<br>`chunked-prefill` | Một prompt 32K token chiếm trọn một bước engine → mọi request đang decode bị khựng (head-of-line blocking, TPOT spike). Chunked prefill cắt nhỏ và ghép chung batch với decode (piggyback). Đánh đổi TTFT ↔ TPOT khi chỉnh `max_num_batched_tokens`. | ✅ |
| 15 ⭐ | **Giảm KV cache từ gốc: MHA → MQA → GQA → MLA**<br>`mha-mqa-gqa-mla` | Bảng so sánh kích thước KV của cùng một model qua 4 biến thể. Đánh đổi chất lượng ↔ bộ nhớ. MLA của DeepSeek: nén KV thành latent vector, giải nén khi tính → đổi bộ nhớ lấy compute, rất hợp với decode memory-bound. Liên kết ngược tới bài *Kiến trúc Llama* đã có (GQA). | ✅ |
| 16 ○ | **Sampling và cái giá của nó**<br>`sampling-va-chi-phi` | Greedy, temperature, top-k, top-p, min-p, repetition/presence penalty — mỗi cái là một phép trên tensor logits `[batch, vocab]` với vocab ~150K. Vì sao top-p cần sort và nó tốn bao nhiêu; batched sampling; tính tất định và seed; ảnh hưởng thực tế lên TPOT. | ✅ |
| 17 ⭐ | **Đo đúng: TTFT, TPOT/ITL, throughput, goodput và SLO**<br>`metrics-ttft-tpot-goodput` | Định nghĩa chặt từng metric và mối quan hệ `E2E ≈ TTFT + TPOT × output_len`. Vì sao phải báo p50/p95/p99 chứ không phải trung bình. Goodput = throughput thoả SLO. Danh sách bẫy benchmark: thiếu warm-up, vô tình hit prefix cache, không kiểm soát độ dài output, tokenizer khác nhau, đo concurrency thay vì QPS. Chạy `vllm bench serve`. | ✅ |
| 18 ○ | **Mô hình chi phí: từ tokens/s tới $/1M token**<br>`chi-phi-serving-llm` | Công thức quy đổi; ảnh hưởng của batch size, context length và quantization lên đơn giá; so sánh self-host vs API theo khối lượng; điểm hoà vốn. Bài "kinh tế" duy nhất của chuỗi, nhưng là lý do tồn tại của mọi bài kỹ thuật còn lại. | ⚙️ |

---

## 6. C3 — `Mổ xẻ vLLM` (9 bài)

Mục tiêu: đọc được source vLLM V1 và tune nó có cơ sở thay vì thử mò.

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 19 ⭐ | **vLLM V1: bản đồ kiến trúc**<br>`vllm-kien-truc-tong-quan` | `AsyncLLM` ↔ `EngineCore` chạy tách process và vì sao (tách CPU overhead của tokenize/detokenize/API khỏi vòng lặp GPU). Các thành phần: Scheduler, KVCacheManager, ModelRunner, Worker. Giải phẫu một `step()`. Bài `order: 1` của chuỗi — cũng là bản đồ để tự điều hướng codebase. | ⚙️ |
| 20 ⭐ | **PagedAttention: từ ý tưởng OS tới block table**<br>`pagedattention-tu-paper-toi-code` | Fragmentation nội/ngoại khi cấp phát KV liên tục và con số lãng phí thực tế. Chia KV thành block 16 token; block table ánh xạ logical → physical; copy-on-write khi nhiều sequence chia sẻ tiền tố. Đọc `BlockManager` / `KVCacheManager`. | ⚙️ |
| 21 ⭐ | **Scheduler của vLLM: hàng đợi, token budget và preemption**<br>`vllm-scheduler` | waiting/running queue; token budget mỗi bước; khi hết block thì preempt bằng recompute hay swap và chọn thế nào; FCFS vs priority; cách chunked prefill được nhét vào cùng vòng lặp. | ⚙️ |
| 22 ⭐ | **Automatic Prefix Caching: hash block và tái dùng KV**<br>`vllm-prefix-caching` | Hash theo nội dung từng block để tra cứu; eviction LRU; đo cache hit rate. Workload nào hưởng lợi lớn: system prompt dài, multi-turn chat, agent loop, few-shot cố định. Bật/tắt APC và đo chênh lệch TTFT trên prompt chung tiền tố. | ✅ |
| 23 ○ | **Attention backend trong vLLM: FlashAttention, FlashInfer và dispatch**<br>`vllm-attention-backend` | Cơ chế chọn backend theo GPU / dtype / head_dim; unified varlen kernel cho batch hỗn hợp prefill+decode; cascade attention khi nhiều request chung tiền tố. Ghi chú thực tế: vì sao Ada (4090) không chạy được FlashAttention-3. | ⚙️ |
| 24 ○ | **torch.compile và CUDA Graph trong vLLM**<br>`vllm-torch-compile-cudagraph` | Piecewise compilation: cắt graph tại các op không capture được (attention), phần còn lại compile + capture. Warmup và capture shape; compile cache; khi nào nên `--enforce-eager`. Đo chi phí khởi động đổi lấy bao nhiêu TPOT. | ✅ |
| 25 ⭐ | **Song song hoá trong vLLM: TP, PP, DP, EP**<br>`vllm-parallelism` | Column-parallel / row-parallel chia weight ra sao, all-reduce rơi vào đâu trong mỗi transformer block; PP và bubble; DP để scale request. Bảng quyết định: model không vừa 1 GPU → TP; vừa nhưng cần throughput → DP. | 📄 |
| 26 ○ | **Từ engine tới server: OpenAI-compatible API, streaming, metrics**<br>`vllm-api-server` | Request đi từ HTTP tới engine và ngược lại; SSE streaming; endpoint `/metrics` Prometheus và những chỉ số đáng cảnh báo (queue time, KV cache usage, preemption count); tool calling và reasoning parser. | ✅ |
| 27 ⭐ | **Tune vLLM thực chiến trên một GPU 24GB**<br>`tune-vllm-tren-1-gpu` | Checklist theo thứ tự ưu tiên: `gpu-memory-utilization`, `max-model-len`, `max-num-batched-tokens`, `max-num-seqs`, `kv-cache-dtype`, `enable-prefix-caching`, `quantization`. Mỗi flag: nó đổi cái gì, hại cái gì. Bảng benchmark trước/sau trên cùng workload. Bài thực dụng nhất chuỗi C3. | ✅ |

---

## 7. C4 — `Hệ sinh thái Inference Engine` (7 bài)

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 28 ⭐ | **SGLang và RadixAttention**<br>`sglang-radixattention` | Cây radix làm prefix cache: chia sẻ tiền tố ở mức cây thay vì mức block hash, eviction LRU trên cây. Vì sao nó thắng đậm ở workload agent / multi-turn / tree-of-thought. So sánh trực diện với APC của vLLM: khác nhau ở đâu, khi nào hơn. | ✅ |
| 29 ○ | **SGLang runtime: overlap scheduling và zero-overhead batch**<br>`sglang-runtime-overlap-scheduler` | Tách phần lập lịch trên CPU ra chạy chồng lấn với forward trên GPU để bước kế tiếp đã sẵn sàng khi GPU rảnh. Đối chiếu với lựa chọn thiết kế tách process của vLLM V1 — hai lời giải cho cùng một vấn đề CPU overhead. | ⚙️ |
| 30 ⭐ | **Structured output: constrained decoding hoạt động thế nào**<br>`structured-output-constrained-decoding` | Mask logits theo trạng thái parser. FSM (Outlines) vs CFG/Earley (XGrammar, llguidance) và vì sao schema đệ quy cần CFG. Hai loại chi phí: compile grammar lần đầu và overhead mỗi token. XGrammar là backend mặc định của vLLM/SGLang/TRT-LLM. Ảnh hưởng tới chất lượng output. Đo overhead thật với một JSON schema. | ✅ |
| 31 ○ | **TensorRT-LLM: triết lý compile-first**<br>`tensorrt-llm-compile-first` | Build engine trước cho từng cấu hình (model, dtype, max batch, max len), plugin, in-flight batching. Ưu: kernel tối ưu sát phần cứng NVIDIA. Nhược: vòng lặp phát triển chậm, kém linh hoạt. Khi nào đánh đổi này đáng. | 📄 |
| 32 ⭐ | **llama.cpp và GGUF: inference trên phần cứng phổ thông**<br>`llamacpp-gguf` | Định dạng GGUF; k-quant và i-quant; offload từng layer giữa CPU và GPU khi model không vừa VRAM; backend CUDA/Metal. So sánh với vLLM ở đúng trận địa của nó: single-user latency và máy cá nhân. Ollama / LM Studio nằm ở đâu trong bức tranh. | ✅ |
| 33 ⭐ | **Chọn engine nào: ma trận quyết định**<br>`chon-inference-engine` | vLLM vs SGLang vs TensorRT-LLM vs llama.cpp theo: quy mô, phần cứng, dạng workload (chat / agent / batch offline / on-device), năng lực vận hành. Kèm nguyên tắc benchmark công bằng để tự kiểm chứng thay vì tin bảng so sánh của vendor. | ⚙️ |
| 34 ○ | **Tầng điều phối: llm-d, production-stack và inference gateway**<br>`llm-d-production-stack` | Vì sao engine thôi là chưa đủ khi lên nhiều pod. Kiến trúc gateway + inference scheduler + engine pods; KV-cache-aware routing; scale-to-zero; HA. Bắc cầu sang chuỗi C7. | 📄 |

---

## 8. C5 — `Kernel Engineering` (7 bài)

Mục tiêu: tự viết được kernel và đọc hiểu kernel của engine. Triton là ngôn ngữ chính (Python, chạy tốt trên 4090).

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 35 ⭐ | **Kernel Triton đầu tiên: vector add tới fused softmax**<br>`triton-kernel-dau-tien` | Mô hình lập trình theo block của Triton (khác CUDA theo thread); `program_id`, load/store có mask. Làm softmax: bản PyTorch eager đọc/ghi HBM nhiều lần, bản fused chỉ một lần — đo và giải thích bằng roofline của bài 4. | ✅ |
| 36 ⭐ | **Matmul trong Triton: tiling và autotune**<br>`triton-matmul-tiling` | Block tiling M/N/K, vòng lặp K với accumulator trong register, `num_warps` / `num_stages` và software pipelining; `@triton.autotune`. So với cuBLAS để biết mình đang ở đâu so với thư viện chuẩn. | ✅ |
| 37 ⭐ | **FlashAttention: online softmax và tư duy IO-aware**<br>`flashattention-online-softmax` | Vì sao attention chuẩn là memory-bound: materialize ma trận `N×N` ra HBM. Tiling Q/K/V + online softmax với rescaling để không bao giờ cần ma trận đầy đủ. FA1 → FA2: chia việc theo chiều sequence, giảm các phép non-matmul. Đây là bài "đinh" của C5. | ✅ |
| 38 ○ | **FlashAttention-3 và 4: đồng thiết kế với phần cứng**<br>`flashattention-3-4` | FA3 trên Hopper: warp specialization, async copy (TMA), WGMMA, chồng lấn softmax với matmul. FA4 (03/2026) trên Blackwell: khi tensor core tăng gấp đôi còn đơn vị khác thì không, bottleneck dịch sang `exp` → tính `exp` bằng đa thức trên FMA thay vì SFU, bỏ bớt rescaling softmax ~10×; viết bằng CuTe-DSL. Con số ~71% utilization trên B200. | 📄 |
| 39 ⭐ | **Kernel cho decode: FlashDecoding, split-K và paged kernel**<br>`decode-attention-kernel` | Decode chỉ có 1 query token → parallelism quá thấp, GPU đói việc; chia theo chiều KV rồi reduce (split-K). Thêm ràng buộc paged: KV nằm rải rác theo block table, phải gather. Vì sao decode buộc phải có kernel riêng chứ không dùng lại kernel prefill. | ✅ |
| 40 ⭐ | **Fusion trong LLM: RMSNorm+residual, RoPE, SwiGLU, quant-dequant**<br>`kernel-fusion-llm` | Đếm số lượt đọc/ghi HBM trước và sau khi fuse cho từng op — biến "fusion nhanh hơn" thành con số. Các custom op thực tế trong vLLM/SGLang. Tự viết fused RMSNorm + residual bằng Triton rồi đo. | ✅ |
| 41 ⭐ | **Profiling một kernel thật: từ nsys tới ncu tới roofline**<br>`profiling-kernel-thuc-te` | Quy trình khép kín trên một model thật: `nsys` tìm kernel nóng → `ncu` lấy metric → chấm lên roofline → kết luận memory-bound hay compute-bound → sửa → đo lại. Khép vòng với bài 8 của C1. | ✅ |

---

## 9. C6 — `Nén mô hình & Tăng tốc Decode` (8 bài)

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 42 ⭐ | **Quantization 101: scale, zero-point, granularity**<br>`quantization-101` | Affine vs symmetric; per-tensor / per-channel / per-group và đánh đổi; calibration; bài toán outlier trong activation LLM; PTQ vs QAT. Cách đánh giá cho tử tế: perplexity một mình không đủ, cần task thật. | ✅ |
| 43 ⭐ | **Weight-only INT4: GPTQ và AWQ**<br>`gptq-va-awq` | GPTQ: lượng tử hoá theo layer, dùng thông tin Hessian để bù sai số. AWQ: phát hiện kênh trọng yếu qua activation rồi rescale để bảo toàn. Dequant on-the-fly trong kernel → **tăng tốc decode (memory-bound) nhưng gần như không tăng tốc prefill (compute-bound)** — hệ quả trực tiếp của bài 10. Quantize một model 8B và đo. | ✅ |
| 44 ⭐ | **FP8 trong serving: weight, activation và KV cache**<br>`fp8-serving` | E4M3 vs E5M2; scale tĩnh vs động; vì sao FP8 gần như lossless trong khi INT4 thì không. `kv-cache-dtype=fp8` cắt đôi KV → tăng batch bao nhiêu. Ada (4090) có tensor core FP8 nên chạy được thật. | ✅ |
| 45 ○ | **FP4 thời Blackwell: NVFP4 và MXFP4**<br>`nvfp4-vs-mxfp4` | E2M1 với dual-level scaling (NVFP4) vs microscaling block-32 dùng chung nhiều nền tảng (MXFP4). Độ nhạy khác nhau theo layer. Điểm mấu chốt: FP4 lượng tử hoá **cả activation** nên ăn thẳng vào tensor core FP4 — khác weight-only INT4 vốn chỉ tiết kiệm băng thông. | 📄 (✅ nếu 5090) |
| 46 ⭐ | **Quantize thực chiến: pipeline và đánh giá**<br>`quantize-thuc-chien` | Quy trình đầy đủ: chọn recipe → chuẩn bị dữ liệu calibration → export → nạp vào vLLM → eval chất lượng → đo tốc độ. Các lỗi thường gặp: calibration lệch domain, quantize nhầm lm_head, kernel không hỗ trợ cấu hình đã chọn nên rơi về đường chậm. | ✅ |
| 47 ⭐ | **Speculative decoding: nguyên lý và khi nào thực sự có lợi**<br>`speculative-decoding-nguyen-ly` | Draft k token → verify một lần → rejection sampling **giữ nguyên phân phối của model gốc** (chứng minh phần này cho tử tế). Speedup là hàm của acceptance rate và chi phí draft. Điểm ít người nói: ở batch lớn GPU đã bão hoà thì lợi ích teo lại — spec decoding là kỹ thuật đổi compute thừa lấy latency. | ✅ |
| 48 ⭐ | **Không cần draft model: Medusa, EAGLE-3 và MTP**<br>`eagle3-medusa-mtp` | Medusa: nhiều head dự đoán song song + tree attention khi verify. EAGLE-3: draft ở không gian feature, dùng đặc trưng đa tầng của target, acceptance cao nhất hiện nay. MTP: head huấn luyện chung từ đầu (DeepSeek V3.x, GLM, một số bản Llama 4) → không cần model thứ hai trong VRAM. Bảng so sánh acceptance / bộ nhớ / công sức triển khai. | ✅ |
| 49 ○ | **Nén KV cache: quantize, eviction và sparse**<br>`nen-kv-cache` | KV int8/fp8; eviction theo attention score (H2O, SnapKV); StreamingLLM và hiện tượng attention sink; sliding window. Cảnh báo trung thực: các phương pháp này đánh đổi bằng khả năng truy hồi thông tin ở context dài — đo bằng task retrieval chứ không phải perplexity. | ✅ |

---

## 10. C7 — `Serving quy mô cụm` (7 bài)

Chuỗi này chủ yếu phân tích kiến trúc + đọc code + số liệu công bố, vì lab 1 GPU không dựng lại được.

| # | Tiêu đề / slug | Nội dung cốt lõi | Lab |
|---|---|---|---|
| 50 ⭐ | **Đặt song song ở đâu: TP, PP, EP, DP và cái giá giao tiếp**<br>`tp-pp-ep-dp-inference` | Với mỗi dạng song song: chia gì, sinh ra collective nào, tốn bao nhiêu byte mỗi layer. Vì sao TP bị chặn bởi NVLink domain; vì sao PP tạo bubble khó chịu hơn hẳn ở decode so với training; DP chỉ nhân bản. Công thức ước lượng để tự quyết định cấu hình. | 📄 |
| 51 ⭐ | **MoE inference: routing, expert parallel và all-to-all**<br>`moe-inference-expert-parallel` | Top-k routing; mất cân bằng expert; dispatch/combine là hai lượt all-to-all và vì sao nó là nút cổ chai; DeepEP; cân bằng tải expert. Luận điểm chính: MoE đổi compute lấy **bộ nhớ + giao tiếp** — rất hợp cho training nhưng làm inference khó hơn nhiều. Kèm số liệu từ deployment DeepSeek quy mô lớn. | 📄 |
| 52 ⭐ | **Prefill/Decode disaggregation: tách hai pha ra hai cụm**<br>`pd-disaggregation` | Ba lý do tách: hết nhiễu lẫn nhau, tune riêng từng pha, thậm chí dùng GPU khác nhau cho mỗi pha. KV transfer qua RDMA/NIXL, chuyển theo từng layer để chồng lấn với compute. Phần quan trọng nhất: **khi nào KHÔNG nên tách** — chi phí mạng và độ phức tạp vận hành chỉ đáng khi quy mô đủ lớn. | 📄 |
| 53 ⭐ | **KV cache phân tầng: LMCache, Mooncake**<br>`kv-cache-tiered-lmcache-mooncake` | Tháp lưu trữ GPU HBM → CPU DRAM → NVMe → pool từ xa; transfer engine trên RDMA. Câu hỏi trung tâm: *nạp KV về có nhanh hơn tính lại không?* — tính điểm hoà vốn theo băng thông và độ dài prefix. Đo và giám sát hit rate. | 📄 |
| 54 ⭐ | **Định tuyến ở tầng cụm: prefix-aware routing**<br>`prefix-aware-routing` | Round-robin và least-loaded phá nát prefix cache như thế nào. KV-cache indexer giữ view toàn cục về vị trí block; định tuyến theo tiền tố. Căng thẳng cốt lõi: locality ↔ cân bằng tải. Autoscaling theo tín hiệu inference thật (queue depth, KV usage) thay vì CPU/GPU utilization. | 📄 |
| 55 ○ | **Multi-LoRA serving: hàng trăm adapter trên một model**<br>`multi-lora-serving` | Batched LoRA kernel (SGMV) để gộp các request khác adapter vào cùng batch; paging adapter từ CPU; định tuyến theo adapter. Nối thẳng với bài *LoRA, QLoRA* đã có trên blog — cùng kỹ thuật, nhìn từ phía serving. Chạy `--enable-lora` với vài adapter. | ✅ |
| 56 ⭐ | **Long-context inference: sparse attention và đường tới 1M token**<br>`long-context-inference` | Hai chi phí tách bạch: prefill O(n²) và KV O(n). DeepSeek Sparse Attention: indexer chọn top-k token nên attention gần như tuyến tính mà vẫn giữ được truy hồi; sparsity học được chứ không heuristic. Context/sequence parallelism, ring attention. Kiến trúc lai attention + state-space. | 📄 |

---

## 11. C8 — `Papers Explained: Inference` (9 bài)

Khác với các chuỗi trên (giải thích cơ chế), chuỗi này đọc paper theo khung cố định: **bối cảnh → vấn đề → ý tưởng cốt lõi → thiết kế thí nghiệm → con số → hạn chế → ảnh hưởng về sau**. Rải song song toàn tuyến, mỗi bài đặt ngay sau bài kỹ thuật tương ứng.

| # | Paper / slug | Vì sao chọn | Đặt sau bài |
|---|---|---|---|
| 57 ⭐ | **Orca (OSDI'22)** — `paper-orca-continuous-batching` | Paper khai sinh iteration-level scheduling. Đọc để thấy một ý tưởng lập lịch đơn giản tạo ra bước nhảy lớn thế nào. | 13 |
| 58 ⭐ | **vLLM / PagedAttention (SOSP'23)** — `paper-vllm-pagedattention` | Paper nền của cả ngành. Phân tích cách họ đo lãng phí bộ nhớ và thiết kế thí nghiệm. | 20 |
| 59 ⭐ | **Sarathi-Serve (OSDI'24)** — `paper-sarathi-serve` | Chunked prefill và khái niệm stall-free batching; đóng khung rõ đánh đổi TTFT ↔ TPOT. | 14 |
| 60 ⭐ | **DistServe (OSDI'24)** — `paper-distserve` | Lập luận định lượng cho việc tách prefill/decode, và khái niệm goodput per cost. | 52 |
| 61 ○ | **Mooncake (FAST'25)** — `paper-mooncake` | Kiến trúc lấy KV cache làm trung tâm ở quy mô production thật (Kimi). Paper hiếm hoi có số liệu vận hành thực. | 53 |
| 62 ⭐ | **SGLang / RadixAttention (NeurIPS'24)** — `paper-sglang-radixattention` | Không chỉ runtime mà cả ngôn ngữ lập trình cho LLM program — góc nhìn co-design ít được nói tới. | 28 |
| 63 ⭐ | **Speculative decoding: Leviathan+ (ICML'23) → EAGLE-3** — `paper-speculative-decoding` | Đọc chứng minh bảo toàn phân phối trong paper gốc, rồi theo dòng cải tiến tới EAGLE-3. | 48 |
| 64 ⭐ | **DeepSeek-V3 / V3.2 technical report** — `paper-deepseek-v3-inference` | Case study đồng thiết kế train–infer hoàn chỉnh nhất hiện có: MLA, MTP, FP8, DSA đều ra đời từ ràng buộc inference. | 56 |
| 65 ○ | **Survey: Roofline insights + Taming the Titans** — `paper-survey-llm-inference` | Bài khép chuỗi paper: cách đọc landscape và tự cập nhật khi chuỗi bài này cũ đi. | 64 |

---

## 12. Hai bài khép chuỗi

| # | Tiêu đề / slug | Nội dung |
|---|---|---|
| 66 ⭐ | **Capstone: dựng serving stack hoàn chỉnh trên một GPU 24GB**<br>`capstone-serving-stack-1-gpu` | Ghép mọi thứ: chọn model → quantize → cấu hình vLLM → bật prefix caching + spec decoding → benchmark → tune → dựng monitoring. Số liệu end-to-end thật, có cả những thứ không hoạt động như kỳ vọng. |
| 67 ⭐ | **Checklist tối ưu inference: cây quyết định**<br>`checklist-toi-uu-inference` | Tra cứu theo triệu chứng: *TTFT cao → xem gì*, *TPOT cao → xem gì*, *OOM → xem gì*, *throughput thấp → xem gì*. Mỗi nhánh trỏ về đúng bài đã viết. Đây là trang người đọc sẽ bookmark. |

---

## 13. Lộ trình xuất bản (2 bài/tuần, bắt đầu 22/09/2026)

| Giai đoạn | Tuần | Bài | Nội dung | Mốc |
|---|---|---|---|---|
| **1 — Nền tảng** | 1–9 | 18 bài: `0` + C1 (1–8) + C2 (9–18) | Sau giai đoạn này người đọc đã có đủ nền để hiểu mọi bài còn lại | ~cuối 11/2026 |
| **2 — Engine** | 10–19 | 19 bài: C3 (19–27) + C4 (28–34) + paper `57`, `58`, `62` | Đọc và tune được vLLM/SGLang | ~cuối 01/2027 |
| **3 — Tầng thấp** | 20–28 | 17 bài: C5 (35–41) + C6 (42–49) + paper `59`, `63` | Viết được kernel, quantize được model | ~cuối 03/2027 |
| **4 — Quy mô & khép** | 29–35 | 13 bài: C7 (50–56) + paper `60`, `61`, `64`, `65` + `66`, `67` | Hiểu được kiến trúc serving production | ~giữa 05/2027 |

**Nguyên tắc xếp lịch trong tuần:** mỗi tuần ghép **1 bài nặng (có lab/benchmark) + 1 bài nhẹ (khái niệm hoặc paper)**. Bài nặng cần thời gian chạy thực nghiệm, bài nhẹ viết được trong lúc benchmark đang chạy — đây là cách duy nhất giữ được nhịp 2 bài/tuần bền vững.

**Việc lặp sau mỗi giai đoạn:** quay lại bài 0 gắn link cho các bài vừa xuất bản và set `updated:`. Bài 0 xuất bản tuần 1 nhưng giới thiệu cả 67 bài, mà `/series/<slug>/` chỉ tồn tại khi chuỗi đó đã có bài đầu tiên — nên lúc đầu tiêu đề để text thuần, chỉ link tới `/categories/inference-engineering/`. Bốn mốc cập nhật trùng với bốn giai đoạn ở bảng trên.

**Nếu muốn rút gọn:** bỏ toàn bộ 25 bài đánh dấu ○ → còn **42 bài lõi**, ≈ 21 tuần. Các bài ○ được thiết kế để có thể bỏ mà không gãy mạch đọc.

---

## 14. Quy ước viết bài

Theo đúng style sẵn có trên blog (xem [2024-10-12-llm-llama-architecture-121024.md](src/content/posts/2024-10-12-llm-llama-architecture-121024.md)):

- **Cấu trúc:** `## Giới thiệu` → các mục nội dung → `## Kết luận` → `## Tham khảo`. Bài thuộc series nên mở đầu bằng 1–2 câu nối với bài trước.
- **Độ dài:** 1.500–2.200 từ cho bài thường (phù hợp nhịp 2 bài/tuần), 2.500–3.000 cho bài trụ (4, 10, 11, 19, 37, 47).
- **Giọng văn:** ngôi thứ nhất "mình", gọi người đọc là "mọi người", giữ nguyên thuật ngữ tiếng Anh (prefill, decode, throughput, kernel) — không dịch nửa vời.
- **Mỗi bài trả lời đúng một câu hỏi.** Nếu outline phình ra hai câu hỏi, tách thành hai bài.
- **Toán:** `math: true`; block math `$$` trên dòng riêng. Ưu tiên công thức *ước lượng được bằng tay* (bộ nhớ KV, arithmetic intensity, chi phí giao tiếp) hơn là dẫn xuất dài dòng.
- **Code:** ```` ```python ````. Đoạn code ngắn, chạy được, kèm output thật. Với bài đọc source code: trích đoạn rút gọn + link tới file trên GitHub theo tag phiên bản (pin version, vì vLLM/SGLang thay đổi rất nhanh).
- **Hình:** `public/assets/img/inference/<slug>/`. Mỗi bài trụ cần tối thiểu 1 sơ đồ. Vì không có mermaid, vẽ bằng Excalidraw/draw.io rồi export PNG. Biểu đồ benchmark export từ matplotlib.
- **Số liệu:** ghi rõ GPU, phiên bản engine, model, độ dài input/output, concurrency — nếu không thì con số vô nghĩa và sẽ bị phản biện ở phần bình luận (giscus đang bật).
- **Liên kết chéo:** mỗi bài trỏ ngược tối thiểu 2 bài trước và 1 bài sau. Đây là thứ biến 67 bài rời rạc thành một cuốn sách.

---

## 15. Kiểm chứng

Trước khi publish mỗi bài:

1. `npm run dev` → xem bài ở `/posts/<slug>/`. Bài `draft: true` hiện trong dev, ẩn khi build PROD.
2. `npm run build` → Zod validate toàn bộ frontmatter. Lỗi hay gặp: `description` > 300 ký tự, `order` mà thiếu `series`.
3. Kiểm mắt sau build:
   - `/series/<series-slug>/` — bài nằm đúng thứ tự `order`, `SeriesNav` hiện prev/next.
   - `/categories/inference-engineering/` — bài có mặt trong hub.
   - Công thức KaTeX render đúng, block math thành block chứ không inline.
   - Ảnh có `<figure>` + `<figcaption>`, lightbox bấm được.
   - Mục "Bài viết liên quan" gợi ý đúng bài cùng chuỗi / cùng tag, không phải 3 bài mới nhất bất kỳ.
4. `npm run build && npm run preview` → kiểm Pagefind tìm được bài bằng từ khoá tiếng Việt lẫn thuật ngữ tiếng Anh (`kv cache`, `continuous batching`).
5. **Kiểm tra một lần sau ~10 bài đầu:** trang chủ phân trang 10 bài/trang — 67 bài mới sẽ đẩy các bài LeetCode/Math4AI cũ xuống trang 3+. Nếu muốn giữ chúng dễ thấy, cân nhắc `pinned` hoặc bổ sung một trang index theo chủ đề.

---

## Phụ lục: nguồn tham khảo chính

- **vLLM** — [Inside vLLM: Anatomy of a High-Throughput LLM Inference System](https://vllm.ai/blog/2025-09-05-anatomy-of-vllm), source `vllm-project/vllm`
- **SGLang** — [RadixAttention blog (LMSYS)](https://www.lmsys.org/blog/2024-01-17-sglang/), [Large-Scale EP trên 96×H100](https://www.lmsys.org/blog/2025-05-05-large-scale-ep/), docs `pd_disaggregation.md`
- **FlashAttention-4** — [Tri Dao blog](https://tridao.me/blog/2026/flash4/), [arXiv 2603.05451](https://arxiv.org/abs/2603.05451)
- **Long context / sparse** — [DeepSeek-V4 trong vLLM](https://vllm.ai/blog/2026-04-24-deepseek-v4), [DeepSeek-V3.2 (arXiv 2512.02556)](https://arxiv.org/abs/2512.02556)
- **Speculative decoding** — [EAGLE-3 trên AMD Instinct (vLLM blog)](https://vllm.ai/blog/2026-07-13-eagle-3-amd-instinct)
- **KV cache phân tầng** — [LMCache docs](https://docs.lmcache.ai/), [tech report](https://lmcache.ai/tech_report.pdf), Mooncake
- **Cluster serving** — [llm-d](https://github.com/llm-d/llm-d), [KServe + llm-d (Red Hat)](https://developers.redhat.com/articles/2026/04/21/kserve-llm-d-optimized-gen-ai-inference)
- **MoE** — [DeepEP](https://github.com/deepseek-ai/DeepEP)
- **Benchmark** — [On Evaluating Performance of LLM Inference Serving Systems (arXiv 2507.09019)](https://arxiv.org/pdf/2507.09019), GenAI-Perf, inference-perf
- **Survey** — [LLM Inference Unveiled: Survey and Roofline Model Insights](https://arxiv.org/html/2402.16363v4), [Taming the Titans (arXiv 2504.19720)](https://arxiv.org/pdf/2504.19720)
