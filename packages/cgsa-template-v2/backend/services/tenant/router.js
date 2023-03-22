module.exports = () => [
  {
    "server_name": "api"
  },
  {
    "path": "/backend/tenant/(.*)",
    "proxy": {
      "instance": "tenant:3500",
      "path": "/v1.0/invoke/tenant/method/$1"
    }
  }
];
