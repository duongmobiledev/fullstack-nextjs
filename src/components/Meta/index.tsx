import Head from 'next/head';

interface IMetaProps {
  title: string;
}

const Meta: React.FC<IMetaProps> = (props) => {
  const { title } = props;
  return (
    <Head>
      <title>{`${title} | ASV Passport`}</title>
      <meta property="og:title" content="My page title" key="title" />
    </Head>
  );
};

export default Meta;
