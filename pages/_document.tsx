import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@mui/styles';

//TODO: implementera flytt från @mui/styles
// se pers commit https://github.com/perenstrom/oscar-night/commit/b1d31f00dc1538879340cd2f825f03940106bec2
// kolla på commiten efter också

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const materialUiSheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          materialUiSheets.collect(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {materialUiSheets.getStyleElement()}
        </>
      )
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
