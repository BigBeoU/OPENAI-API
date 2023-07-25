# Chau GPT

## Usage :

-  App use node version v16.20.0 and react version ^18.2.0
-  You must create `file .env` at `first time` FOR BOTH APP backend and fronend in the root of folder.
-  By default, the application will run as port `5000` for backend and `3000` for frondend. If you wanna run in a different port, you only need to `change the port` in `.env file` which is in environment properties with the name `PORT`

```env
PORT=3000
OPENAI_API_KEY=your/openai/api/key
```

| Environment    | Is_Required | Description       |
| -------------- | ----------- | ----------------- |
| PORT           | `true`      | Project's port    |
| OPENAI_API_KEY | `true`      | Project's api key |

-  Command to run the project run the project:

   ### For development :

   ```bash
   npm i
   npm run install-all
   npm start
   ```
