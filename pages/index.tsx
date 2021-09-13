import { NextPage } from 'next';
import Head from 'next/head';

const IndexPage: NextPage<{}> = ({}) => {
  return (
    <div>
      <Head>
        <title>NextJS Typescript Starter</title>
      </Head>
      <h1>Opinionated NextJS Typescript starter</h1>
      <p>
        This is my preferred starter template for building NextJS apps in
        Typescript.
      </p>
    </div>
  );
};

export default IndexPage;
