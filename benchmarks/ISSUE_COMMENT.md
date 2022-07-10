# Benchmarks

- **Machine:** darwin arm64 | 8 vCPUs | 32.0GB Mem
- **Node:** `v16.13.1`
- **Run:** Sat Jun 25 2022 17:06:46 GMT+0200 (Central European Summer Time)
- **Method:** `autocannon -c 100 -d 40 -p 10 localhost:3000` (two rounds; one to warm-up, one to measure)

|                          | Version | Router | Requests/s | Latency | Throughput/Mb |
| :----------------------- | ------: | -----: | :--------: | ------: | ------------: |
| tsed-no-context          | 6.115.0 |      ✓ |  18338.4   |   59.82 |          3.06 |
| express                  |  4.18.1 |      ✓ |  17173.6   |   63.32 |          3.06 |
| tsed-no-events           | 6.115.0 |      ✓ |  15212.0   |   73.77 |          2.54 |
| tsed-express-crypto-uuid | 6.115.0 |      ✓ |  10152.0   |  110.56 |          2.20 |
| tsed-express             | 6.115.0 |      ✓ |  10022.0   |  111.67 |          1.84 |
| tsed-express-uuid        | 6.115.0 |      ✓ |   8144.8   |  121.29 |          1.73 |
