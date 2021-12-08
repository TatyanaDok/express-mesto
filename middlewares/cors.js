module.exports.corsConfig = {
  origin: [
    'https://omicron.megatron.student.nomoredomains.rocks',
    'http://omicron.megatron.student.nomoredomains.rocks',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'Referer',
    'Accept',
    'Authorization',
  ],
  credentials: true,
};
