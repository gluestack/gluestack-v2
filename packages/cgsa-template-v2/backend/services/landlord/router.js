module.exports = () => [
  {
    "server_name": "api"
  },
  {
    "path": "/backend/landlord/(.*)",
    "proxy": {
      "instance": "landlord:3500",
      "path": "/v1.0/invoke/landlord/method/$1"
    }
  }
];
