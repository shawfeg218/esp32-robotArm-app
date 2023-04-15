import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { AppContextProvider } from '@/contexts/AppContext';
import nc from 'next-connect';
import cors from 'cors';

function App({ Component, pageProps }) {
  const handler = nc().use(cors());

  return (
    <AppContextProvider>
      <Layout>
        <Component {...pageProps} handler={handler} />
      </Layout>
    </AppContextProvider>
  );
}

export default App;
