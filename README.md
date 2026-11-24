# Weatherly

## Configure the weather API key

1. Get an API key from [OpenWeather](https://openweathermap.org/api).
2. In the project root, create or update `.env.local`:

   ```dotenv
   VITE_API_KEY=your_openweather_api_key
   ```

3. Restart the Vite dev server (`npm run dev`) after changing the value.

`.env.local` is ignored by Git. Never commit a real key. Because this app calls OpenWeather directly from the browser, Vite embeds `VITE_API_KEY` in the client bundle; it is visible to users and is not suitable as a confidential secret. Restrict the key and its usage in OpenWeather, or move API requests behind a server-side proxy if it must remain private.

---

This project uses React and Vite with HMR and ESLint.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
