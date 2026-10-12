export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).send('13a97e7a-77a0-496f-9a26-807583466e80');
}
