# Mockingbird

```
touch .env (refer to .env.sample)
npm i
npm run dev
```

### Introduction

Mockingbird mocks your API endpoints. Use it while developing your application's frontend. No more fuss creating mock data or mock servers!

<center><image src="/README.assets/demo.gif" width="600" /></center>

### How To Use

```
Authentication is not yet implemented.
```

#### 1. Base URL

<center><img src="/README.assets/baseurl.jpg" width="500px" /></center>
A base URL with a subdomain of your ID or a random unique identifier will be given.
Click on the copy icon to copy your base URL.

#### 2. Register Endpoint

- Endpoint Name: Just a descriptive name to identify your endpoints.
- HTTP Method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` supported.
- URL Path: Path to append to your base URL. e.g. `/api/users/1`
- HTTP Status: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `405`, `500`, `502`, `503`, `504` supported.
- Response Content Type: `application/json` or `application/x-www-form-urlencoded`.
- Charset: `UTF-8`.
- HTTP Headers: Optional.
- HTTP Response Body: If parsing the content into JSON is possible, response body will be returned as a JSON object. Otherwise response body will be returned as plain string.
- Timeout: Time for response to be returned. Optional.
- Save: After registering, your new mock endpoint will appear on the left sidebar.

#### 3. Call API

Call your API at `${Base URL}/${HTTP Path}`. e.g. `https://69eed50e-93cf-4389-90f0-1719f254949b.mockingbird.dev/api/users/1`
