# Development Auth Server
# dev-auth-proxy

A research catch server for use with the research catch web app and the research catch postgress database.

### Getting Started
- ```yarn install``` from the home folder
- Open the template config file located at:`server/config/authProxyConfig.sample.json`. We will use this when creating our actual config file.
- Create an actual config file named: `server/config/authProxyConfig.json`. Here you can set the username and password to login, but do not duplicate any actual credentials.
```
{
  "devUsers": [
    {
      "username": "test (change to couch db username)",
      "password": "test (change to couch db pw)",
      "applicationName": "BOATNET_OBSERVER",
      "userData": {
        "roles": ["observer", "debriefer"],
        "couchDBInfo": {
          "urlRoot": "https://nwcdevfram2.nwfsc2.noaa.gov:6984",
          "lookupsDB": "lookups-dev",
          "masterDB": "master-dev"
        }
      }
    }
  ]
}
```
Note that you can create multiple users since devUsers is an array. In order to talk to CouchDB, you will want to replace "test" with a real CouchDB user (e.g. seabass-test)


- Launch the auth server by navigating to app home directory and run `yarn serve`. This will start an HTTPS (self-signed) research server running on port 9200.

## Generating Your Own Self-Signed Certificates (Optional)
Note that bn-temp-cert.pem and temp-\*-key.pem are just temporary certificates/keys and are NOT intended for any production use!

If you want to generate your own temporary keys for dev use,

```
openssl genrsa -out temp-priv-key.pem 2048
openssl rsa -in temp-priv-key.pem -pubout > temp-pub-key.pem
openssl req -new -x509 -key temp-priv-key.pem -out temp-cert.pem -days 3650 -subj //CN=localhost
```

## OpenAPI Spec

* Served under https://localhost:9200/api-docs/

## Basic RESTful Testing

SECTION NOT UPDATED

POST the following raw JSON to: https://localhost:9200/api/login using a utility such as Postman.

"applicationName" is optional, defaults to "BOATNET_OBSERVER" (determines which Roles are returned in JWT)
```
{
  "username": "test",
  "password": "test",
  "applicationName": "BOATNET_OBSERVER"

}
```
or base64 encoded password:

```
{
  "username": "test",
  "passwordEnc": "dGVzdA=="
}
```

- This will return a JWT response with roles.
- If you want to verify this manually, paste the encoded token into https://jwt.io along with the public cert. You should see Signature Verified.
