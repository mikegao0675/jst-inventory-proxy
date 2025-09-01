export default async (req, res) => {
  // 只放行导出路径（避免被滥用）
  if (!/^\/api\/export\/inventory\.(json|csv)$/.test(req.url)) {
    return res.status(404).end('Not found');
  }

  const origin = process.env.ORIGIN || 'http://8.153.197.125:4000';
  // 把 /api 前缀去掉并保留原 query（limit 等）
  const target = new URL(origin + req.url.replace(/^\/api/, ''));

  // 在服务端追加 token（外部不可见）
  if (process.env.EXPORT_TOKEN) {
    target.searchParams.set('token', process.env.EXPORT_TOKEN);
  }

  // 回源
  const r = await fetch(target.toString());
  res.status(r.status);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', r.headers.get('content-type') || 'text/plain; charset=utf-8');
  r.body.pipe(res);
};
